---
title: Priority Management
description: Urgent PRs can jump the queue.
sidebar:
  order: 6
---

Not all PRs are equally urgent. Merge queues support priority levels:

```mermaid
flowchart LR
    subgraph Queue
        direction TB
        U[Urgent: Hotfix]
        H[High: Feature deadline]
        N1[Normal: Feature A]
        N2[Normal: Feature B]
        L[Low: Refactor]
    end

    Queue --> M[Merge Order]
```

A critical security fix can jump ahead of routine changes without completely disrupting the queue.

## Priority Levels

Typical priority tiers:

| Priority | Use Case | Example |
|----------|----------|---------|
| **Urgent/Critical** | Production incidents, security fixes | Hotfix for data breach |
| **High** | Time-sensitive features, blockers | Release deadline feature |
| **Normal** | Regular development work | Most PRs |
| **Low** | Non-urgent improvements | Refactoring, tech debt |

## How Priority Affects the Queue

When a high-priority PR enters:

1. It's placed ahead of lower-priority PRs
2. Lower-priority PRs may be re-queued to test behind it
3. The high-priority PR gets tested first

```mermaid
sequenceDiagram
    participant Q as Queue
    participant PR1 as PR #1 (Normal)
    participant PR2 as PR #2 (Urgent)

    Note over Q: PR #1 is testing
    PR2->>Q: Enter queue (Urgent)
    Q->>PR1: Pause/requeue
    Q->>PR2: Start testing immediately
    PR2-->>Q: Tests pass
    Q->>PR2: Merge
    Q->>PR1: Resume testing
```

## Negative Priority

Some systems support **negative priority** to explicitly deprioritize certain PRs:

- Large refactors that should merge during quiet periods
- Dependency updates that can wait
- Non-blocking improvements

These PRs only merge when there's nothing else in the queue.

## Setting Priority

Priority can be set via:
- **Labels** - `priority:urgent`, `priority:low`
- **Commands** - `/priority high`
- **Rules** - Auto-assign based on files changed or PR author
- **API** - Programmatic priority management

## Best Practices

1. **Reserve urgent for true emergencies** - overuse defeats the purpose
2. **Document what qualifies for each level** - avoid priority inflation
3. **Monitor priority distribution** - too many high-priority PRs indicates a problem
4. **Consider priority decay** - PRs waiting too long could auto-promote
