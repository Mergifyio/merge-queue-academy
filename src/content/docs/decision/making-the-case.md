---
title: Making the Case
description: How to convince your team, manager, or leadership that you need a merge queue.
sidebar:
  order: 5
---

You know you need a merge queue. Now you need to convince others. This page gives you the talking points, data, and framing for different audiences.

## Know Your Audience

Different stakeholders care about different things.

### For Engineering Managers

**They care about:** Team velocity, predictability, developer happiness

**Lead with:**
- "We're losing X hours per week to broken main incidents"
- "Developers are blocked Y times per month waiting for main to be fixed"
- "We can ship faster with less coordination overhead"

**Frame it as:** Risk reduction + velocity improvement

### For Individual Contributors

**They care about:** Less friction, fewer interruptions, shipping their code

**Lead with:**
- "No more rebasing 3 times to merge one PR"
- "No more 'who broke main?' investigations"
- "Your PR gets tested against what main will actually look like"

**Frame it as:** Quality of life improvement

### For Engineering Leadership / VPs

**They care about:** Reliability, incident reduction, team scalability

**Lead with:**
- "Main breakages are preventable incidents"
- "As we scale, coordination costs grow quadratically without automation"
- "Teams at our scale ([Google, Shopify, Uber](/introduction/companies-using-merge-queues/)) treat this as infrastructure"

**Frame it as:** Scaling investment + incident prevention

### For Product / Business Stakeholders

**They care about:** Ship velocity, reliability, predictability

**Lead with:**
- "We can deploy with confidence more frequently"
- "Fewer rollbacks means more stable releases"
- "Engineering time goes to features, not firefighting"

**Frame it as:** Faster, safer delivery

---

## The ROI Calculation

### Quantify the current cost

Start by measuring what broken main actually costs:

```
Weekly cost = (breaks per week) × (avg fix time) × (devs blocked) × (hourly rate)
```

**Example:**
- 2 breaks per week
- 1.5 hours average to fix
- 8 developers blocked
- $75/hour loaded cost

```
2 × 1.5 × 8 × $75 = $1,800/week = $93,600/year
```

That's just the direct cost. Add:
- CI re-runs from rebasing: +20-30%
- Context switching cost: +20-30%
- Deployment delays: variable but significant

### Compare to merge queue cost

Most merge queue solutions cost:
- **SaaS options:** $50-500/month depending on scale
- **Self-hosted:** Engineering time to set up + maintain
- **Platform-native:** Free, but often limited features

**The math usually works out to 10-50x ROI.**

### Time savings breakdown

| Activity | Without MQ | With MQ | Savings |
|----------|-----------|---------|---------|
| Rebasing before merge | 15 min × 3 PRs/dev/week | 0 | 45 min/dev/week |
| Investigating broken main | 30 min × 2/week shared | 0 | 1 hour/week |
| Waiting for main to be fixed | 1 hour × 2/week × team | 0 | N hours/week |
| CI re-runs | 20 min × 2/PR | 20 min × 1/PR | 50% CI cost |

---

## Common Objections (and Responses)

### "We don't break main that often"

> Track it for two weeks. Most teams underestimate because small incidents don't get reported. Count every time someone says "CI is red" or "wait to merge."

### "We can just require rebasing before merge"

> That doesn't scale. With 10 PRs/day and 20-minute CI:
> - PR merges, main advances
> - 9 PRs must rebase and re-run CI
> - While they're running, another PR merges
> - The cycle never ends
>
> A merge queue tests PRs against *future* main, breaking the cycle.

### "GitHub has branch protection, isn't that enough?"

> Branch protection requires PRs to be up-to-date, but doesn't coordinate merges. Two PRs can both be "up to date," both pass CI, and still conflict when combined.

### "It's another tool to maintain"

> True. But compare:
> - Tool maintenance: a few hours/quarter
> - Broken main incidents: hours/week
>
> The math favors the tool.

### "Our CI is fast, we don't need it"

> Fast CI helps, but doesn't solve the coordination problem. If two PRs merge within seconds of each other, CI speed doesn't matter—they weren't tested together.

### "We're too small"

> This is valid. Under 5 engineers with few daily merges, manual coordination works. Consider setting a threshold: when you exceed N merges per day or experience your first semantic conflict, revisit the decision.

---

## Building Internal Support

### Start with data

Before proposing anything, collect numbers:
- How often does main break? (Check CI history)
- How long to fix? (Check incident timelines or Slack)
- How many PRs merge daily? (Check GitHub)
- How long is CI? (Check average run times)

### Pilot with one team

If you can't get org-wide buy-in, propose a pilot:
- "Let's try this on [low-risk repo] for one month"
- "We'll measure before/after and share results"
- Success makes the next conversation easier.

### Connect to existing pain

Reference recent incidents:
- "Remember when main was broken for 3 hours last Tuesday?"
- "This would have caught that before merge"

### Propose, don't demand

Frame it as an experiment:
- "I'd like to try X for 30 days and measure the impact"
- "If it doesn't help, we turn it off"

---

## Next Steps

1. **Measure current state** — Track broken main incidents for 2 weeks
2. **Calculate the cost** — Use the ROI formula above
3. **Propose a pilot** — Start small, measure results
4. **Share the wins** — Document time saved, incidents prevented

---

Still not sure if you need one? Take the [interactive quiz](/decision/final-quiz/) or review [what happens without a merge queue](/decision/failure-scenarios/).
