---
title: When to Skip It
description: When a merge queue isn't the right choice - small teams, low volume, simple repos.
sidebar:
  order: 3
---

A merge queue solves real problems—but it also adds complexity. If you don't have those problems, the queue is overhead without benefit.

Here's when to skip it.

## Small Teams

**Under 20 engineers on the same repo?** You probably don't need one.

With a small team:
- Merge conflicts are rare
- Informal coordination works ("hey, I'm about to merge")
- Someone notices a broken main quickly
- The cost of fixing main is low (few people affected)

A merge queue adds process and wait time that a small team doesn't need.

:::tip[Exception: Long CI]
Small team + very long CI (45+ minutes)? A merge queue alone won't help much—but [two-step CI](/features/two-step-ci/) can. Run fast checks on PRs, full suite only in the queue.
:::

---

## Low Merge Volume

**Fewer than 5-10 PRs per day?** The math doesn't work.

The probability of two PRs conflicting depends on them landing close together. With only a few merges per day, the window for conflict is small.

If main breaks once a month, the cost of fixing it occasionally is lower than the daily overhead of a queue.

---

## Fast CI

**CI under 5 minutes?** Rebasing is cheap.

The main pain of "PR passed CI, but main broke" is the rebase-and-retest cycle. If your CI is fast:
- Rebasing costs 5 minutes, not 30
- You can afford to test against latest main every time
- The queue's value proposition shrinks

Fast CI + small team = just enforce "rebase before merge" and you're fine.

---

## Main Rarely Breaks

**Main hasn't broken in months?** You've solved the problem another way.

Maybe you have:
- Excellent test coverage
- Strong code review catching integration issues
- Developers who coordinate naturally
- A codebase with few cross-cutting changes

If it's not broken, don't add complexity to fix it.

---

## Monorepo with Independent Projects

**Multiple independent projects, different teams, no shared code?** Consider separate repos instead.

A merge queue helps when changes interact. If your "monorepo" is really just co-located independent projects:
- They don't conflict with each other
- A queue adds cross-team dependencies where none exist
- Separate repos (or separate queues per project) might be simpler

---

## Early-Stage Startup

**Moving fast and breaking things intentionally?** A queue slows you down.

In early stages:
- Speed of iteration matters more than stability
- You're changing everything constantly
- The cost of bugs is low (few users)
- Process overhead hurts more than broken main

Add a merge queue when you have enough users that broken main = real pain.

---

## The Overhead is Real

A merge queue isn't free:

| Overhead | Impact |
|----------|--------|
| Wait time | PRs wait in queue instead of merging immediately |
| Learning curve | Team needs to understand queue behavior |
| Failure handling | Queue failures need investigation |
| Tool maintenance | Another system to configure and monitor |
| Mental model | "Why didn't my PR merge?" becomes a question |

If you don't have merge conflicts, broken main, or very long CI, this overhead buys you nothing.

---

## Revisit When Things Change

Skip the merge queue now, but revisit when:

- Team grows past 20 engineers
- Merge volume exceeds 10 PRs/day
- CI slows down past 15-20 minutes
- Main starts breaking regularly
- Developers start complaining about rebase loops

The signals in [What Happens Without a Merge Queue?](/decision/failure-scenarios/) will tell you when it's time.

---

## Summary

Skip a merge queue if:

- ✓ Small team (under 20 engineers)
- ✓ Low volume (under 5-10 PRs/day)
- ✓ Fast CI (under 5 minutes)
- ✓ Main rarely breaks
- ✓ Early-stage, speed over stability

Consider one if any of these change.
