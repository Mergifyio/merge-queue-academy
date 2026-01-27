---
title: How Merge Queues Work
description: The mechanics and lifecycle of a PR in a merge queue.
sidebar:
  order: 2
---

This page explains the internal mechanics of a merge queue — how PRs flow through it, how test branches are created, and how the queue coordinates with your CI system.

## The PR Lifecycle

A pull request goes through several stages in a merge queue:

```mermaid
stateDiagram-v2
    [*] --> Pending: Add to queue
    Pending --> Testing: Start CI
    Testing --> Passed: CI passes
    Testing --> Failed: CI fails
    Passed --> Merging: Ready to merge
    Merging --> Merged: Success
    Merging --> Failed: Merge conflict
    Failed --> [*]: Removed from queue
    Merged --> [*]: Done
```

### Stage 1: Entering the Queue

When a PR is added to the merge queue, the queue:

1. **Validates eligibility** — Is the PR approved? Are required checks passing?
2. **Assigns position** — Based on priority and arrival time
3. **Records the base** — Captures the current state of the target branch

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant PR as Pull Request
    participant MQ as Merge Queue

    Dev->>MQ: Add PR to queue
    MQ->>MQ: Check eligibility
    MQ->>MQ: Assign position #3
    MQ-->>PR: ✅ Queued at position #3
```

### Stage 2: Creating the Test Branch

The merge queue creates a **temporary branch** that represents "what main will look like after this PR merges." This is the key insight that makes merge queues work.

```mermaid
gitGraph
    commit id: "main"
    commit id: "A"
    branch pr-123
    commit id: "PR changes"
    checkout main
    branch mq/main/pr-123
    merge pr-123 id: "test merge"
```

The test branch (`mq/main/pr-123`) contains:
- All commits from `main`
- All commits from PRs ahead in the queue (if using [speculative merging](/features/speculative-merging/))
- The PR's changes, merged in

### Stage 3: Running CI

The merge queue triggers CI on the test branch. This is often called "queue CI" to distinguish it from the CI that runs on the PR branch itself.

```mermaid
sequenceDiagram
    participant MQ as Merge Queue
    participant Git as Git Server
    participant CI as CI System

    MQ->>Git: Push test branch
    MQ->>CI: Trigger workflow
    CI->>CI: Run tests...
    CI-->>MQ: Report status
```

The queue monitors CI status and waits for all required checks to complete.

### Stage 4: Merging or Failing

**If CI passes:**

```mermaid
sequenceDiagram
    participant MQ as Merge Queue
    participant Main as main branch
    participant PR as Pull Request

    MQ->>Main: Fast-forward or merge commit
    MQ->>PR: Close as merged
    MQ-->>MQ: Remove from queue
    MQ-->>MQ: Notify next PR
```

**If CI fails:**

```mermaid
sequenceDiagram
    participant MQ as Merge Queue
    participant PR as Pull Request
    participant Dev as Developer

    MQ->>PR: Remove from queue
    MQ->>PR: Add failure comment
    MQ-->>Dev: Notify of failure
    MQ-->>MQ: Re-test PRs behind this one
```

## Queue Dynamics

Understanding how the queue manages multiple PRs is crucial.

### Queue State

At any moment, the queue contains PRs in various states:

```
Queue State:
┌─────────────────────────────────────────────┐
│  Position  │  PR    │  Status    │  Base    │
├─────────────────────────────────────────────┤
│     1      │  #101  │  Testing   │  abc123  │
│     2      │  #102  │  Testing   │  +#101   │
│     3      │  #103  │  Pending   │  +#102   │
│     4      │  #104  │  Pending   │  +#103   │
└─────────────────────────────────────────────┘
```

Each PR's "base" includes all PRs ahead of it — this is how the queue ensures PRs are tested against the future state of main.

### What Happens When a PR Fails Mid-Queue

When PR #102 fails, the queue must re-evaluate everything behind it:

```mermaid
flowchart TD
    subgraph "Before Failure"
        A1["#101 Testing (base: main)"]
        A2["#102 Testing (base: +#101)"]
        A3["#103 Pending (base: +#102)"]
    end

    subgraph "After #102 Fails"
        B1["#101 Testing (base: main)"]
        B2["#102 ❌ Removed"]
        B3["#103 Re-testing (base: +#101)"]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
```

PR #103's test is now invalid — it was tested against a world where #102 existed, but #102 is gone. The queue automatically re-tests #103 with a new base.

## Merge Strategies

When a PR passes CI, the merge queue must integrate it into main. There are several strategies:

### Merge Commit

Creates a merge commit, preserving the full branch history.

```mermaid
gitGraph
    commit id: "main"
    commit id: "A"
    branch feature
    commit id: "B"
    commit id: "C"
    checkout main
    merge feature id: "Merge PR #123"
```

**Pros:** Full history, easy to revert
**Cons:** Cluttered history with merge commits

### Squash and Merge

Combines all PR commits into a single commit.

```mermaid
gitGraph
    commit id: "main"
    commit id: "A"
    commit id: "B+C (squashed)" type: HIGHLIGHT
```

**Pros:** Clean linear history
**Cons:** Loses individual commit granularity

### Rebase and Merge

Replays PR commits on top of main.

```mermaid
gitGraph
    commit id: "main"
    commit id: "A"
    commit id: "B (rebased)"
    commit id: "C (rebased)"
```

**Pros:** Linear history, preserves commits
**Cons:** Changes commit hashes

### Fast-Forward

Only possible when the test branch is already based on current main. Moves the main pointer forward.

**Pros:** No extra commits
**Cons:** Not always possible

## Coordination with CI

The merge queue needs tight integration with your CI system.

### Required Checks

You configure which CI checks must pass before a PR can merge:

```yaml
# Example configuration
required_checks:
  - "build"
  - "test"
  - "lint"

optional_checks:
  - "coverage"  # Can fail without blocking
```

### CI Triggers

The queue must be able to:
1. **Trigger CI** on the test branch
2. **Receive status updates** when checks complete
3. **Cancel CI** if a PR is removed from the queue

```mermaid
flowchart LR
    MQ[Merge Queue] -->|Push branch| Git[Git Server]
    Git -->|Webhook| CI[CI System]
    CI -->|Status API| MQ
```

### Handling Flaky Tests

If CI fails due to a flaky test:
- Some queues offer **automatic retry** (1-2 times)
- Some require manual re-queue
- Some track flake rates and adjust behavior

See [Troubleshooting](/best-practices/troubleshooting/) for more on handling flaky tests.

## The Test Branch Lifecycle

Test branches are temporary. Here's their lifecycle:

1. **Created** when PR starts testing
2. **Updated** if base changes (PR ahead merges/fails)
3. **Used for merge** if CI passes
4. **Deleted** after merge or failure

Most merge queues clean up test branches automatically. You'll see branches like:
- `mq/main/pr-123`
- `gh-readonly-queue/main/pr-123-abc1234`
- `mergify/merge-queue/main/pr-123`

## Race Conditions and Edge Cases

### The "ABA" Problem

What if main changes while CI is running?

```
1. PR #1 starts testing against main@A
2. Someone pushes directly to main (now main@B)
3. PR #1's CI passes
4. Should PR #1 merge?
```

Different queues handle this differently:
- **Strict:** Require re-test against new main
- **Optimistic:** Allow merge if no conflicts
- **Configurable:** Based on [freshness policy](/features/freshness-policies/)

### Merge Conflicts

If the test branch has merge conflicts:
- The queue cannot create the test branch
- The PR is removed from the queue
- Developer must resolve conflicts and re-queue

### Force Pushes

If someone force-pushes to a PR while it's in the queue:
- Most queues detect this and re-start testing
- Some queues remove the PR and require re-queue

## Summary

A merge queue works by:

1. **Queuing PRs** in order of priority and arrival
2. **Creating test branches** that represent the future state of main
3. **Running CI** on these test branches
4. **Merging** only if CI passes
5. **Re-testing** downstream PRs when failures occur

This ensures that every commit on main has been tested against the exact state it will merge into — eliminating the "two green PRs make a red main" problem.

Next, explore [whether you need a merge queue](/decision/failure-scenarios/) or dive into specific [features](/features/two-step-ci/).
