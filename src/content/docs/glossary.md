---
title: Glossary
description: Key terms and concepts used throughout Merge Queue Academy.
---

Quick reference for merge queue terminology.

## Core Concepts

### Merge Queue
A system that validates and serializes PR merges, testing each PR against its actual merge target before integration. Prevents broken main by ensuring every commit is tested against what main will look like when it lands.

### Test Branch
Temporary branch created by the merge queue representing "what main will look like after this PR merges." PRs are rebased onto this branch and tested there—not against the current main.

### Queue CI
Validation run when a PR enters the queue. Unlike PR CI (which tests against current main), queue CI tests against the test branch. This is the critical difference that prevents integration failures.

### Broken Main
When the main branch fails tests or doesn't build. Blocks all development, deploys, and releases. The primary problem merge queues solve.

---

## Features

### Speculative Checks
Testing multiple PRs in parallel by assuming earlier PRs will pass. If PR #1 is testing, PR #2 starts testing against "main + PR #1" immediately. Reduces latency by 3x or more. See [Speculative Checks](/features/speculative-merging/).

### Speculation Depth
How many PRs ahead the queue will speculatively test. Depth of 3 means PR #4 waits for PR #1 to finish before starting. Balances parallelism against wasted CI when speculations fail.

### Batching
Grouping multiple PRs into a single CI run. Instead of testing PRs individually, test "main + PR #1 + PR #2 + PR #3" together. Reduces CI cost but requires bisection on failure. See [Batching](/features/batching/).

### Bisection
When a batch fails, the process of identifying which PR caused the failure. Often done by testing overlapping subsets: if batch [A,B,C] fails, test [A,B] and [B,C] to isolate the culprit.

### Parallel Queues
Independent queues for non-conflicting changes (by directory, service, or team). Allows simultaneous merges when changes don't overlap. See [Parallel Queues](/features/parallel-queues/).

### Scope
The boundary defining a parallel queue. Can be a directory path, build target, team ownership, or other logical boundary. PRs in different scopes can merge concurrently.

### Priority Management
System allowing urgent PRs to jump ahead in the queue based on priority levels. Ensures hotfixes and critical changes aren't blocked behind routine PRs. See [Priority Management](/features/priority-management/).

### Freshness Policy
Rules controlling how up-to-date a PR must be against main before merging. Strict freshness requires testing against the very latest main; relaxed policies allow some staleness. See [Freshness Policies](/features/freshness-policies/).

### Two-Step CI
Separation of PR CI (fast feedback for developers) and queue CI (comprehensive validation before merge). Allows different test suites for each stage. See [Two-Step CI](/features/two-step-ci/).

---

## Git & CI Terms

### Stale Branch
A PR branch that hasn't been tested against the current state of main. The gap between what was tested and what exists on main creates risk of integration failures.

### Rebase
Replaying commits from one branch onto another. When your PR is "stale," you rebase it onto the latest main. Merge queues automate this—you don't manually rebase.

### Merge Strategies
How code is integrated into main:
- **Merge commit**: Creates a merge commit preserving branch history
- **Squash and merge**: Combines all PR commits into one
- **Rebase and merge**: Replays commits linearly
- **Fast-forward**: Moves main pointer directly (no merge commit)

### Required Checks
CI jobs that must pass before a PR can merge. Configured in GitHub branch protection or similar. The merge queue respects these when deciding if a PR passes.

### Flaky Test
A test that passes and fails intermittently without code changes. Particularly problematic in merge queues where a flaky failure can block the entire queue.

### Post-merge CI
CI that runs after code lands on main (the traditional approach). By the time it fails, the damage is done—main is already broken.

---

## Failure Modes

### Integration Failure
A failure that only surfaces when multiple changes are combined. PR #1 passes alone, PR #2 passes alone, but PR #1 + PR #2 together fail. The core problem merge queues prevent.

### Semantic Conflict
When two PRs are textually compatible (no git conflicts) but logically incompatible. Example: PR #1 adds a required function parameter, PR #2 calls the function without it. Git merges cleanly; tests fail.

### Cascade Failure
When one failed speculation causes multiple PRs to need re-testing. If PR #2 fails, PRs #3, #4, #5 (which were speculating on #2's success) must restart.

### Queue Starvation
When high-priority PRs continuously preempt normal PRs, causing regular work to never merge. Mitigated with priority decay or reserved queue slots.

---

## Metrics

### Time to Merge (TTM)
Time from PR approval to code landing on main. Merge queues typically reduce this by eliminating manual coordination and rebase cycles.

### Queue Depth
Number of PRs currently waiting in the merge queue. High queue depth indicates either high velocity or slow CI.

### Speculation Hit Rate
Percentage of speculative checks that don't need to restart due to earlier failures. Higher is better—indicates stable queue throughput.

### Merge Throughput
Number of PRs successfully merged per unit time. The primary measure of merge queue efficiency.

---

## Related Concepts

### Trunk-Based Development
Development practice where all engineers commit to a single main branch with short-lived feature branches. Merge queues support this by keeping main stable despite high merge frequency.

### Feature Flags
Runtime toggles that enable/disable features without code changes. Often used alongside merge queues to allow partially-complete work to merge safely.

### Monorepo
Single repository containing multiple projects or services. Merge queues are especially valuable for monorepos due to high PR volume and complex interdependencies. See [Monorepos](/use-cases/monorepos/).
