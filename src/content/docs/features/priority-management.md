---
title: Priority Management
description: Urgent PRs can jump the queue.
sidebar:
  order: 6
---

Not all PRs are equally urgent. A critical security fix can jump ahead of routine changes:

```mermaid
flowchart LR
    U["🔴 Hotfix (urgent)"] --> Q["Queue"]
    H["🟠 Feature (high)"] --> Q
    N["🟢 Regular PR (normal)"] --> Q
    Q --> Main["main"]
```

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
    participant PR1 as 🟢 Normal PR
    participant PR2 as 🔴 Urgent PR
    participant Q as Queue

    PR1->>Q: Enter queue
    Note over Q: Testing PR1...
    PR2->>Q: Enter queue
    Q->>PR1: Paused
    Q->>PR2: Testing
    PR2-->>Q: Pass
    Q->>PR2: Merged
    Q->>PR1: Resume testing
```

## Setting Priority

Priority can be set via:
- **Rules** — automatically based on labels, files changed, or PR author
- **Commands** — manually via PR comments

## Best Practices

1. **Reserve urgent for true emergencies** - overuse defeats the purpose
2. **Document what qualifies for each level** - avoid priority inflation
3. **Monitor priority distribution** - too many high-priority PRs indicates a problem
4. **Consider priority decay** - PRs waiting too long could auto-promote
