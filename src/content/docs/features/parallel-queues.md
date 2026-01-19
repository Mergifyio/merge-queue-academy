---
title: Parallel Queues
description: Independent queues for non-conflicting changes.
sidebar:
  order: 4
---

Not all changes conflict with each other. A frontend CSS change and a backend API change can often be tested and merged independently. **Parallel queues** (sometimes called "partitions" or "scopes") allow this:

```mermaid
flowchart TD
    subgraph "Single Queue (Sequential)"
        Q1[Frontend PR] --> Q2[Backend PR] --> Q3[Docs PR] --> Q4[Frontend PR]
    end

    subgraph "Parallel Queues"
        subgraph Frontend
            F1[Frontend PR] --> F2[Frontend PR]
        end
        subgraph Backend
            B1[Backend PR]
        end
        subgraph Docs
            D1[Docs PR]
        end
    end
```

## How It Works

With parallel queues:
- PRs in the **same scope** are tested against each other (strict ordering)
- PRs in **different scopes** can merge independently (parallel)
- You define scopes based on your codebase (by directory, by team, by project)

This dramatically increases throughput for large monorepos where most changes don't interact.

## Defining Scopes

Common approaches to defining parallel queues:

### By Directory

```yaml
scopes:
  frontend:
    paths: ["src/frontend/**", "public/**"]
  backend:
    paths: ["src/api/**", "src/services/**"]
  docs:
    paths: ["docs/**", "*.md"]
```

### By Team

```yaml
scopes:
  team-payments:
    paths: ["src/payments/**"]
  team-auth:
    paths: ["src/auth/**"]
```

### By Build Target

```yaml
scopes:
  ios-app:
    targets: ["//mobile/ios:app"]
  android-app:
    targets: ["//mobile/android:app"]
```

## Handling Cross-Scope Changes

What happens when a PR touches multiple scopes?

| Strategy | Behavior |
|----------|----------|
| **Union** | PR joins all affected queues, must pass all |
| **Primary scope** | PR joins only its primary/largest scope |
| **Global queue** | Cross-scope PRs go to a single global queue |

## Benefits

1. **Higher throughput** - independent changes don't block each other
2. **Faster merges** - smaller queues = shorter wait times
3. **Team autonomy** - teams control their own merge pace
4. **Fault isolation** - one team's failures don't affect others

## Considerations

- Scope definitions need maintenance as codebase evolves
- Cross-cutting changes may still create bottlenecks
- Requires clear code ownership boundaries
