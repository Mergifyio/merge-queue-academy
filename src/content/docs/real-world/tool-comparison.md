---
title: Tool Comparison
description: Comparing merge queue tools - GitHub Merge Queue, Mergify, Aviator, Trunk, and more.
sidebar:
  order: 2
---

Several tools offer merge queue functionality, from built-in platform features to specialized SaaS products. Here's how they compare.

## Built-in Platform Features

### GitHub Merge Queue

GitHub's native merge queue, available on public repos and GitHub Enterprise.

| Aspect | Details |
|--------|---------|
| **Setup** | Enable via branch protection rules |
| **Batching** | Yes |
| **Parallel queues** | No |
| **Speculative checks** | Limited |
| **Pricing** | Free (public), Enterprise required for private |

**Best for:** Teams already on GitHub who need basic queue functionality without external dependencies.

**Limitations:** Single queue only, limited customization, no parallel queues for monorepos.

### GitLab Merge Trains

GitLab's built-in merge queue, available in Premium tier (since v12.0, mid-2019).

| Aspect | Details |
|--------|---------|
| **Setup** | Enable in project CI/CD settings |
| **Batching** | Yes (squash commits into one pipeline) |
| **Parallel queues** | No |
| **Speculative checks** | Yes (pipelines for merge results) |
| **Pricing** | GitLab Premium required |

**Best for:** Teams already on GitLab Premium who want integrated CI/CD pipeline management.

## Third-Party SaaS Tools

### Mergify

Flexible automation and merge queue for GitHub.

| Aspect | Details |
|--------|---------|
| **Platform** | GitHub |
| **Parallel queues** | Yes (partitions) |
| **Speculative checks** | Yes |
| **Batching** | Yes |
| **Priority queues** | Yes |
| **Config** | YAML file in repo |

**Best for:** Teams needing flexibility, monorepo support, and advanced queue rules.

**Standout:** Multiple queues/partitions, PR can join multiple queues, extensive automation beyond just merging.

### Aviator

Merge queue focused on large monorepos.

| Aspect | Details |
|--------|---------|
| **Platform** | GitHub |
| **Parallel queues** | Yes |
| **Speculative checks** | Yes |
| **Batching** | Yes (intelligent) |
| **Priority queues** | Yes |

**Best for:** Large monorepos with complex CI needs and high PR volume.

**Standout:** Optimized for monorepo scale, parallel processing.

### Trunk Merge Queue

CI reliability platform with merge queue.

| Aspect | Details |
|--------|---------|
| **Platform** | GitHub |
| **Parallel queues** | Yes (Nx/Bazel integration) |
| **Speculative checks** | Yes |
| **Batching** | Yes |
| **Flaky test handling** | Yes (anti-flake protection) |
| **Pricing** | Free for ≤5 committers |

**Best for:** Teams using Nx or Bazel who want tight build-tool integration.

**Standout:** Built-in flaky test detection, native monorepo tooling support.

### Graphite

Merge queue optimized for stacked PRs.

| Aspect | Details |
|--------|---------|
| **Platform** | GitHub |
| **Parallel queues** | Yes |
| **Speculative checks** | Yes |
| **Stacked PRs** | Native support |
| **Auto-rebase** | Yes |

**Best for:** Teams using stacked PR workflows (PRs that depend on other PRs).

**Standout:** Handles stacked PR dependencies automatically, rebases entire stacks.

## Feature Comparison

| Feature | GitHub | GitLab | Mergify | Aviator | Trunk | Graphite |
|---------|--------|--------|---------|---------|-------|----------|
| Parallel queues | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Speculative checks | Limited | ✅ | ✅ | ✅ | ✅ | ✅ |
| Batching | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Priority lanes | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Stacked PRs | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Self-hosted option | N/A | ✅ | ❌ | ❌ | ❌ | ❌ |
| Free tier | Public only | ❌ | ✅ | ✅ | ✅ | ✅ |

## Self-Hosted vs. SaaS

**Self-hosted** (run your own bot/service):
- Full control over data and infrastructure
- No per-seat costs
- You handle updates, reliability, scaling
- Options: Bors-NG, custom solutions

**SaaS** (Mergify, Aviator, Trunk, Graphite):
- Quick setup (minutes, not days)
- Automatic updates and maintenance
- Usually free for small teams/open source
- Requires granting third-party access to repos

## How to Choose

| If you need... | Consider |
|----------------|----------|
| Simplest setup, basic needs | GitHub/GitLab built-in |
| Monorepo with parallel queues | Mergify, Aviator, Trunk |
| Stacked PR workflow | Graphite |
| Nx/Bazel integration | Trunk |
| Maximum flexibility | Mergify |
| Self-hosted | Bors-NG or custom |

## Further Reading

- [Merge Queue Tools Options](https://graphite.com/guides/merge-queue-tools-options)
- [Comparing GitHub, GitLab, and Graphite Merge Queues](https://graphite.com/guides/merge-queue-comparison-github-gitlab-graphite)
