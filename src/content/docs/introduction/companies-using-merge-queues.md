---
title: Companies Using Merge Queues
description: Real examples of companies using merge queues at scale, with public sources.
sidebar:
  order: 3
---

Merge queues aren't theoretical—they're battle-tested at some of the largest engineering organizations in the world. Here's how real companies use them.

## Uber

Uber built **SubmitQueue**, a custom merge queue for their massive monorepos.

**The problem:** Before SubmitQueue, Uber's mainlines would often break due to developers racing to commit changes. On the worst days, 10% of commits had to be reverted, resulting in hours of lost developer time. Their iOS mainline was green only 52% of the time.

**The solution:** SubmitQueue validates changes before merging using speculative builds. It employs machine learning to predict change success and optimize build scheduling.

**Results:**
- Main branch success rate jumped to **99%**
- **74% improvement** in wait time to land code
- Mainlines have remained green at all times since adoption

Sources: [Uber Engineering: iOS Monorepo](https://www.uber.com/blog/ios-monorepo/), [Bypassing Large Diffs in SubmitQueue](https://www.uber.com/blog/bypassing-large-diffs-in-submitqueue/), [Building Uber's Go Monorepo with Bazel](https://www.uber.com/blog/go-monorepo-bazel/)

## Shopify

Shopify integrated a merge queue into **Shipit**, their open-source deployment tool.

**Scale:** Shopify's core monolith has over 2.8 million lines of Ruby code and 500,000 commits. They merge ~400 commits to master daily across 40+ deployments. Over 1,000 developers contribute to their codebase.

**How it works:** Instead of merging directly to master, developers add PRs to the merge queue with a `/shipit` comment. The queue merges on their behalf after validating against a "predictive branch."

**Results:** Over 90% of pull requests to Shopify's core application use Shipit with the merge queue, making it the largest contributor to their monolith.

Sources: [Introducing the Merge Queue](https://shopify.engineering/introducing-the-merge-queue), [Successfully Merging the Work of 1000+ Developers](https://shopify.engineering/successfully-merging-work-1000-developers)

## GitHub

GitHub uses their own merge queue product internally.

**Background:** In 2020, GitHub engineers set out to improve how they deploy and merge PRs in their largest monorepo. Their old process required special GitHub-only logic and external tools that weren't the same experience as their customers.

**Scale:** Every month, 500+ engineers merge 2,500 pull requests into GitHub's large monorepo. The merge queue has processed over 30,000 PRs with 4.5 million CI executions.

**Results:**
- **33% reduction** in average time to deploy a change
- Engineers called it "one of the most significant quality-of-life enhancements for deploying changes"

Source: [How GitHub uses merge queue to ship hundreds of changes every day](https://github.blog/engineering/engineering-principles/how-github-uses-merge-queue-to-ship-hundreds-of-changes-every-day/)

## Google

Google operates at a scale that required inventing their own approach.

**Scale:** Google's monorepo (Piper) contains billions of lines of code. 95% of engineers contribute to the same codebase, averaging changes per second. They handle **100,000+ commits per day**.

**How it works:** Google uses a "two-pointer" system:
1. One pointer to the latest commit on trunk
2. One pointer to the latest **verified green** commit

Developers can pull from either pointer. Many default to "last green," treating the gap between pointers as an optimistic-but-unverified queue. Changes pass pretests before merging, then a continuous verification system validates the trunk.

Source: [Not Rocket Science: How Bors and Google's TAP inspired modern merge queues](https://graphite.com/blog/bors-google-tap-merge-queue)

## Rust

The Rust project pioneered modern merge queues in open source.

**2013:** Graydon Hoare (Rust's creator) built **Bors** to enforce the "Not Rocket Science Rule": automatically maintain a repository that always passes all tests.

**2014:** Contributor Barosl Lee created **Homu**, a more extensible reimplementation. Instead of merging then testing, Homu tested PRs before they landed by combining them with an up-to-date main branch.

**2015:** Homu launched as a service (homu.io), letting other open-source projects use a hosted merge queue.

**Legacy:** Homu's approach directly inspired GitHub's merge queue, GitLab's merge trains, Mergify, and Bors-NG.

Source: [Rust Forge: Bors](https://forge.rust-lang.org/infra/docs/bors.html)

## Strava

Strava built **Butler**, a CI-integrated merge queue.

**Scale:** In 2016, 36 developers submitted 3,100 pull requests to their Ruby on Rails front-end application—their most active codebase.

**How it works:** Developers submit PRs to the queue via Slack: `/butler merge android feature-a`. Butler squashes commits, runs all tests, merges the PR, and cleans up the branch. Fire-and-forget.

**Results:** For close to a year, their repositories maintained a fast-forward-only master branch guaranteed to be green with only peer-reviewed code.

Source: [Butler Merge Queue — How Strava Merges Code](https://medium.com/strava-engineering/butler-merge-queue-how-strava-merges-code-7095a3310930)

## Back Market

Back Market switched to Mergify after outgrowing their homegrown solution.

**The problem:** With ~300 engineers, their internal merge queue couldn't keep up. CI checks took 25 minutes per PR, creating a hard limit on daily merges. During peak hours, engineers waited **4-5 hours** to merge. Their goal was 150 PRs/day—they were nowhere close.

**The solution:** Mergify's merge queue with speculative checks. No manual merging—developers create PRs and label them, Mergify handles rebasing, testing, and merging automatically.

**Results:** Eliminated the bottleneck. Linear git history with fast-forward merges, fully automated workflow.

Source: [Back Market × Mergify Case Study](https://mergify.com/case-studies/back-market)

## Common Patterns

Looking across these implementations:

| Company | Scale | Key Feature |
|---------|-------|-------------|
| Uber | Thousands of merges/day | ML-powered speculation |
| Shopify | 400 commits/day | Integrated with deployment |
| GitHub | 2,500 PRs/month | Dogfooding their product |
| Google | 100,000+ commits/day | Two-pointer green main |
| Strava | 3,100 PRs/year | Slack-triggered queue |
| Back Market | 150 PRs/day target | Switched from homegrown to Mergify |
| Rust | Open source | Origin of the concept |

**What they share:**
- All operate monorepos or large codebases
- All prioritize keeping main green over individual PR speed
- All invested significant engineering effort before commercial tools existed

## History

From Rust's Bors bot in 2013 to Shopify's Shipit, Uber's SubmitQueue, and eventually native features in GitHub and GitLab—merge queues evolved from side-project scripts into essential infrastructure.

For the full story: [The Origin Story of Merge Queues](https://mergify.com/blog/the-origin-story-of-merge-queues)

## The Takeaway

These companies built merge queues out of necessity. At scale, the cost of a broken main branch—blocked developers, constant reverts, deployment delays—exceeds the cost of implementing proper serialization. The pattern emerged independently at multiple organizations facing the same fundamental problem.
