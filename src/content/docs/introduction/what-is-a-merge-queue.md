---
title: What is a Merge Queue?
description: Understanding merge queues and how they keep your main branch stable while enabling high-velocity development.
sidebar:
  order: 1
---

A merge queue is an automation layer that controls how pull requests get integrated into your main branch. It sits between "PR approved" and "PR merged," ensuring that changes are validated, optimized, and safely landed.

While the simplest merge queues just serialize merges, modern merge queues are sophisticated systems that can **validate changes against future main state**, **batch PRs for efficiency**, **run dedicated CI pipelines**, and **parallelize testing across independent parts of your codebase**.

## The Core Problem

Without a merge queue, the typical flow looks like this:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant PR as Pull Request
    participant CI as CI System
    participant Main as Main Branch

    Dev->>PR: Open PR (based on Main @ commit A)
    PR->>CI: Run tests
    CI-->>PR: ✅ Tests pass
    Dev->>Main: Merge PR
    Note over Main: Main is now at commit B
    Note over PR: But PR was tested against commit A!
```

The PR passed CI, but it was tested against a **stale version of main**. If another PR merged in the meantime, you're shipping untested code. This is how two green PRs create a red main branch.

### The Scale Problem

This isn't theoretical. On active repositories:

- A team merging **5 PRs/day** with 30-minute CI will have PRs go stale regularly
- A team merging **20+ PRs/day** will see main break multiple times per week
- Monorepos with **100+ daily merges** face near-constant instability without automation

Manual solutions ("just rebase before merging") don't scale. They create bottlenecks, frustrate developers, and still fail under concurrent merges.

## What a Merge Queue Does

A merge queue takes control of the merge process:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant PR as Pull Request
    participant MQ as Merge Queue
    participant CI as CI System
    participant Main as Main Branch

    Dev->>PR: PR approved & ready
    Dev->>MQ: Add to queue
    MQ->>MQ: Create test branch (Main + PR)
    MQ->>CI: Run queue CI
    CI-->>MQ: ✅ Tests pass
    MQ->>Main: Merge PR
    Note over Main: PR tested against exact merge state
```

The key insight: **test the PR against what main will look like after the merge, not what it looked like when the PR was created.**

## The Paradigm Shift: CI Before Merge, Not After

Traditional workflows run final CI **after** merging to main:

```mermaid
flowchart TD
    subgraph "Traditional: CI After Merge"
        A[PR CI ✅] --> B["✅ Merge to Main"]
        B --> C{CI on Main}
        C -->|Pass| D["Deploy ✅"]
        C -->|Fail| E["🔥 Main is Broken"]
        E --> F["All devs blocked"]
        E --> G["New PRs inherit breakage"]
        E --> H["Someone must fix it"]
        H --> I["Everyone rebases"]
        I --> J["Might break main again..."]
    end

    style B fill:#A3BE8C,stroke:#8aa67a,color:#2E3440
    style E fill:#BF616A,stroke:#a54e56,color:#ECEFF4
    style F fill:#BF616A,stroke:#a54e56,color:#ECEFF4
    style G fill:#BF616A,stroke:#a54e56,color:#ECEFF4
```

The problem: by the time you discover the failure, **main is already broken**. The damage cascades:

1. **Deployments stop** - you can't ship until main is fixed
2. **All developers are blocked** - no one can merge until the fix lands
3. **New PRs inherit the breakage** - any PR based on broken main will also fail CI
4. **Everyone must rebase** - after the fix, every in-flight PR needs to rebase
5. **The cycle can repeat** - rebasing and re-merging might break main again

A merge queue flips this: final CI runs **before** the merge:

```mermaid
flowchart TD
    subgraph "Merge Queue: CI Before Merge"
        A[PR CI ✅] --> B[Enter Queue]
        B --> C["Queue CI: test PR + main"]
        C -->|Pass| D["✅ Merge to Main"]
        C -->|Fail| F["PR Rejected\n(main untouched)"]
        D --> E["Main is green\nDeploy anytime ✅"]
        F --> G["Only this PR author\nneeds to fix"]
    end

    style D fill:#A3BE8C,stroke:#8aa67a,color:#2E3440
    style E fill:#A3BE8C,stroke:#8aa67a,color:#2E3440
    style F fill:#D08770,stroke:#b87a65,color:#2E3440
    style G fill:#D08770,stroke:#b87a65,color:#2E3440
```

The queue CI tests the PR **as if it were already merged** with current main. If it passes, the merge is guaranteed safe. If it fails, the PR is rejected and **main is never touched**.

This means:
- **Main is always green** - broken code never lands
- **Main is always deployable** - you can deploy with confidence at any time
- **Failures are isolated** - only the PR author is affected, not the whole team

This is the fundamental value of a merge queue: it makes "broken main" impossible by construction.

:::tip[Want to learn more?]
See [What Happens Without a Merge Queue](/decision/failure-scenarios/) for a detailed breakdown of the failure modes and their costs.
:::

## Core Capabilities

Modern merge queues provide several layers of value beyond basic serialization:

- **[Two-Step CI](/features/two-step-ci/)** — Separate PR validation from queue validation
- **[Batching](/features/batching/)** — Test multiple PRs together for efficiency
- **[Speculative Merging](/features/speculative-merging/)** — Parallelize testing by assuming success
- **[Parallel Queues](/features/parallel-queues/)** — Independent queues for non-conflicting changes
- **[Freshness Policies](/features/freshness-policies/)** — Balance safety and throughput
- **[Priority Management](/features/priority-management/)** — Urgent PRs can jump the queue
- **[Automatic Rollback](/features/automatic-rollback/)** — Revert on post-merge failure
- **[Affected Targets](/features/affected-targets/)** — Selective testing with build graphs

Explore each feature in detail in the [Features](/features/two-step-ci/) section.

## Summary

A merge queue is more than "automated merging." It's a system that:

1. **Guarantees main branch stability** by testing PRs against their actual merge target
2. **Shifts CI left** — validation happens before merge, not after
3. **Maximizes throughput** through batching, speculation, and parallelism
4. **Scales to large codebases** with scoped validation and selective testing
5. **Handles real-world complexity** with priority management and rollback

The next section covers [how merge queues work](/introduction/how-merge-queues-work/) in more technical detail.
