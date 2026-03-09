---
title: Long CI Pipelines
description: Optimizing merge queues when CI takes 30+ minutes.
sidebar:
  order: 4
---

When CI takes 30, 60, or 90+ minutes, a naive merge queue becomes a bottleneck. With 60-minute CI, you can only merge 8 PRs in an 8-hour day. That's not sustainable.

## The Problem

Long CI limits queue throughput:

| CI Duration | Max PRs/day (serial) | Reality |
|-------------|----------------------|---------|
| 15 min | 32 | Comfortable |
| 30 min | 16 | Tight |
| 60 min | 8 | Bottleneck |
| 90 min | 5 | Unusable |

Teams with long CI need strategies beyond "make CI faster" (though that helps too).

## Strategy 1: Two-Step CI

[Two-step CI](/features/two-step-ci/) splits validation into fast and thorough phases:

```mermaid
flowchart LR
    PR["PR Created"] --> Fast["Fast CI (5 min)"]
    Fast --> Review["Code Review"]
    Review --> Queue["Enter Queue"]
    Queue --> Full["Full CI (60 min)"]
    Full --> Merge["Merge"]
```

- **PR CI**: Lint, unit tests, build — catches most issues quickly (typically 80-90%)
- **Queue CI**: Integration tests, E2E, full validation — runs only for approved PRs

Engineers get fast feedback. The queue runs thorough checks. Both needs met.

## Strategy 2: Batching

[Batching](/features/batching/) groups PRs into single CI runs:

```
Without batching: 5 PRs × 60 min = 300 min CI time
With batching:    5 PRs × 1 run  = 60 min CI time
```

Batching reduces CI cost dramatically. The tradeoff: if the batch fails, you need to identify which PR caused it.

## When You Can't Speed Up CI

Some CI is genuinely slow:
- Hardware-in-the-loop tests
- Full E2E suites against real services
- Compliance scans
- Performance benchmarks

If you can't make it faster, use queue strategies:

1. **Split required vs. optional** — Only block on critical tests
2. **Run slow tests post-merge** — Validate before deploy, not before merge
3. **Parallelize test suites** — More runners, same wall time
4. **Cache aggressively** — Dependencies, build artifacts, test fixtures

## Configuration Example

For 60-minute CI with ~30 PRs/day:

| Setting | Value | Rationale |
|---------|-------|-----------|
| Batch size | 3-5 | Reduce CI runs, manageable failure isolation |
| PR CI | 5-10 min | Fast feedback for developers |
| Queue CI | 60 min | Full validation |
| Priority lanes | Yes | Hotfixes skip the queue |

## Warning Signs

Your queue strategy isn't working if:

- **Wait times exceed CI time** — PRs waiting longer to enter queue than to run CI
- **Engineers bypass the queue** — "Just this once" direct merges appear
- **Batch failures are common** — Batches fail often, bisection adds delay

Monitor and adjust.

## Strategy 3: Speculative Checks

[Speculative checks](/features/speculative-merging/) test multiple PRs (or batches) in parallel, assuming earlier ones will pass. Combined with batching, this is the most effective way to maximize throughput with slow CI:

```
Without optimization: 5 PRs × 60 min = 300 min
With batching + speculation: 2 batches × 60 min in parallel = 60 min
```

## Key Takeaways

1. **Two-step CI is essential** — Fast PR feedback, thorough queue validation
2. **Batching reduces cost** — Fewer CI runs for same PRs
3. **Speculative checks reduce latency** — Test in parallel instead of waiting
4. **[Priority lanes](/features/priority-management/)** — Ensure hotfixes don't wait behind long-running batches
5. **Monitor queue health** — Wait time is your key metric

See also: [High-Velocity Teams](/use-cases/high-velocity-teams/) for strategies beyond CI optimization.
