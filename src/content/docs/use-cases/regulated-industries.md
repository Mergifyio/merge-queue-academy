---
title: Regulated Industries
description: Audit trails, compliance, and merge queues in regulated environments.
sidebar:
  order: 3
---

In regulated industries—finance, healthcare, government, critical infrastructure—every code change needs accountability. Who approved it? What tests passed? When did it merge? A merge queue provides this by design.

## The Compliance Challenge

Auditors want to know:

- **Who** approved each change
- **What** was tested before deployment
- **When** changes landed in production
- **Why** a change bypassed normal process (if ever)

Manual processes create gaps. Someone merges directly. Approvals happen in Slack. Tests get skipped "just this once." These gaps become audit findings.

## How Merge Queues Help

A merge queue enforces process automatically:

| Requirement | Without Queue | With Queue |
|-------------|---------------|------------|
| All changes reviewed | Hope and policy | Enforced gate |
| CI passes before merge | Usually | Always |
| Audit trail | Scattered across tools | Single source of truth |
| No direct pushes | Honor system | Technically impossible |

The queue becomes your compliance control—not a document someone might ignore.

## Key Compliance Features

### 1. Immutable Audit Trail

Every PR that enters the queue is logged:
- Entry time
- Required approvals (who, when)
- CI results (which checks, pass/fail)
- Merge time
- Final commit SHA

This trail is automatic. No one needs to remember to document.

### 2. Enforced Approval Gates

Configure required approvals:
- Minimum reviewers (e.g., 2 approvals)
- Specific team sign-off (security, compliance)
- No self-approval
- Fresh approval after changes

The queue won't process a PR until gates pass.

### 3. Mandatory CI

Every change runs the same checks:
- No skipping tests for "urgent" fixes
- No merging with failing CI
- Consistent validation across all changes

Auditors love consistency.

### 4. Change Traceability

Link every deployment to:
- The PR that introduced it
- The approvers who signed off
- The test results that validated it
- The ticket/issue it addresses

When an auditor asks "how did this code get to production?", you have the answer.

## Common Frameworks

### SOC 2

SOC 2 requires controls around change management. A merge queue provides:

| SOC 2 Requirement | Queue Feature |
|-------------------|---------------|
| Changes are authorized | Required approvals |
| Changes are tested | Mandatory CI |
| Changes are documented | Audit trail |
| Access is controlled | No direct push to main |

### PCI-DSS

For payment systems, PCI-DSS demands:

- Separation of duties → Different people approve and merge
- Code review → Required reviewers before queue entry
- Testing → CI must pass before merge
- Change records → Complete audit trail

### HIPAA

Healthcare systems need:

- Access controls → Only authorized users can approve
- Audit logs → Full history of who did what
- Integrity controls → CI validates no unauthorized changes

### SOX

Financial reporting systems require:

- Change authorization → Approval gates
- Testing evidence → CI results as proof
- Segregation of duties → Reviewer ≠ author enforcement

## Emergency Changes

Regulations don't disappear for emergencies—but process can adapt.

### Priority with Audit

Use [priority management](/features/priority-management/) for urgent fixes:
- Hotfix jumps the queue
- Still requires approval (maybe fewer reviewers)
- Still runs CI (maybe a faster subset)
- Fully logged as expedited

### Post-Incident Documentation

If something truly bypasses process:
- Log it explicitly
- Document the justification
- Review in post-incident
- Track as an exception

A queue makes exceptions visible rather than hidden.

## Integration Patterns

### Ticketing Systems

Link PRs to tickets (Jira, ServiceNow):
- Require ticket reference in PR
- Auto-update ticket on merge
- Trace deployments to change requests

### Compliance Tools

Export audit data to:
- GRC platforms (ServiceNow GRC, Archer)
- SIEM systems (Splunk, Datadog)
- Custom compliance dashboards

### Approval Workflows

Integrate with existing approval systems:
- Require compliance team sign-off for sensitive paths
- Auto-request security review for specific file changes
- Block merge until external approval completes

## Audit-Ready Reports

Generate reports showing:

- All changes in a time period
- Who approved each change
- CI pass rate
- Policy exceptions and justifications
- Time from approval to production

When auditors visit, you export a report instead of scrambling.

## Key Takeaways

1. **Automation beats documentation** — Enforced controls are stronger than written policies
2. **Consistency matters** — Every change through the same process
3. **Trails are automatic** — No manual logging required
4. **Exceptions are visible** — Priority changes are tracked, not hidden
5. **Auditors love queues** — Single source of truth for change management
