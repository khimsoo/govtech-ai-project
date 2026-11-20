# One Pager

Use case: B · ICA passport applications and renewals

All quotes and metrics are synthetic and labelled as made up.

## Problem and user

**User:** Applicants submitting passport applications online, especially parents renewing for a child.

**Problem:** ICA receives 520,000 applications per year. 65% use online submission with a 17% error rate. Each error causes a 6-day delay. Only 38% read the guidelines before applying. Parents renewing for a child are the most confused group.

## Opportunity and evidence

Most returns could have been avoided before submission. Applicants don't know what a complete application looks like for their situation.

**User quote (synthetic):** "I am a busy parent with children, and no time to review all the guidelines before I apply. I do not know what a complete application looks like and I just try to apply."

## Experience and trust

The AI is native and transparent — users do not trigger it; it runs automatically on events like photo upload. The system validates inputs in real-time and surfaces specific, actionable errors (e.g. "Background not plain white — retake against a white wall").

For edge cases the system cannot handle, an escape hatch ("Request officer review") ensures applicants are never trapped by automation. Officers retain final decision authority on all applications.

## Risks (market, technical, team)

| Risk | Mitigation |
|------|------------|
| **Deadline risk** — Vendor exits in 8 months | MVP in 3 months with 5-month buffer; checkpoint at week 6 |
| **Edge case complexity** — 40+ exception scenarios for child passports | Escape hatch for officer review; AI scoped to simple preventable errors only |
| **Integration dependencies** — Singpass, payment, case management | Start vendor data migration discussions early; parallel workstreams |
| **Over-scoping AI** — Trying to automate judgement calls | AI limited to photo quality; all other validation is rule-based |

## Build plan and handoff

### Release 1: MVP (Month 1-3)

| Component | Timeline |
|-----------|----------|
| Singpass login integration | Month 1 |
| Application form with rule-based validation | Month 1-2 |
| Submission storage and status tracking | Month 2 |
| Email notifications (collection date, rejection) | Month 2 |
| Security testing and UAT | Month 3 |
| **Go-live: Replace vendor channel** | **End of Month 3** |

### Release 2: AI Photo Validation (Month 3-4)

Developed concurrently with MVP; ships after go-live.

- Computer vision model for passport photo requirements
- Checks: face size/position, glasses detection, background colour, lighting/shadows
- Real-time feedback on upload with specific guidance to fix

### Ongoing

- 2-week sprints for bug fixes and feature releases
- Continuous improvement based on error rate data

### Checkpoints

- **Week 6:** Form submitting to storage with Singpass — if not working, escalate
- **Month 2:** MVP feature complete, begin security testing
- **Month 3:** Go-live decision gate

### Fallback

If behind schedule, cut scope in this order: (1) AI photo validation already in R2, (2) email notifications can be manual, (3) status tracking can be simplified. Core channel must ship.

## Agent role and guardrails

### What is automated (Release 1)

| Component | Type | What it does |
|-----------|------|--------------|
| **Triage routing** | Workflow | Asks who/what, shows only relevant fields. Decides alone. |
| **Field validation** | Workflow | Checks NRIC format, age, required fields. Decides alone. |
| **Progress tracking** | Workflow | Counts valid fields, updates progress bar. Decides alone. |
| **Block submission** | Workflow | Disables "Next" until fields valid. Proposes and waits. |

### What stays human

| Decision | Why |
|----------|-----|
| Approve or reject application | Legal requirement — officers have final authority |
| Override a validation rule | Exceptions exist — only officer can judge |
| Change validation rules | Policy decision — product reviews data first |
| Handle "Request officer review" | Applicant chose to escalate — human responds |
| Decide passport type for 17y 6m+ | Affects validity period — officer confirms |
| Contact applicant | All outbound comms require officer action |

### Deferred to Release 2

| Component | Type | Why wait |
|-----------|------|----------|
| Photo quality check | Agent (AI) | Needs trained model, <5% false positive gate |
| Document upload validation | Workflow | Needs file handling backend |
| Email notifications | Workflow | Needs email service integration |

### Guardrails

- Automation does not approve or reject — officers retain final authority
- Automation does not edit applicant data — only validates and flags
- Automation provides specific feedback — not generic errors
- Applicant can always click "Request officer review" to bypass
- Stop line: >10% stuck on one field for >2 min → disable blocking, alert ops

## Roles and operating model

### Roles

| Role | Responsibility |
|------|----------------|
| **Product Owner** | Defines scope, approves rules, owns roadmap, decides go-live |
| **Engineering Lead** | Builds and deploys, owns technical decisions within constraints |
| **Ops Lead** | Monitors telemetry, handles incidents, manages hotline capacity |
| **Frontline Officer** | Reviews flagged applications, handles escalations, final approval authority |
| **Policy Lead** | Owns business rules (age thresholds, document requirements), approves rule changes |
| **Security Lead** | Certifies integrations, approves go-live from security perspective |
| **Vendor** | Provides data migration support, parallel cutover planning |

### Decision rights

| Harness part | Who decides | Who is consulted | Who is told |
|--------------|-------------|------------------|-------------|
| Scope | Product Owner | Engineering, Ops, Policy | Officers, Vendor |
| Permissions | Product Owner | Engineering, Security, Policy | Ops, Officers |
| Go-live | Product Owner | All leads | Officers, Vendor |
| Incident | Ops Lead | Engineering, Product Owner | Officers, Policy |

### Kill switch

| Authority | What they can do |
|-----------|------------------|
| Ops Lead | Disable one rule, or pause all validation |
| Engineering Lead | Roll back to previous version |
| Product Owner | Turn off automation entirely |

Fallback: forms submit without blocking; officers review manually.

## Strategy and roadmap

### Strategy Kernel

**Diagnosis:** Guidance arrives too early and validation arrives too late. Applicants face generic guidelines upfront that don't match their specific situation, so they skip or forget them. The form accepts whatever they submit and only rejects it days later when an officer reviews it. By then, the 6-day delay cost is locked in. The system has no moment where the right guidance meets the applicant while they can still act on it.

**Guiding Policy:** Move validation and guidance to the point of input. Instead of front-loading all rules or back-loading all checks, deliver situation-specific guidance and validation as the applicant fills each field. Make errors impossible to submit rather than expensive to fix.

**Coherent Actions:**

1. Adapt the form to applicant type — Ask situation questions first (adult/child, renewal/first-time), then show only the fields and documents required for that path.
2. Validate at each step — Check inputs against rules before allowing the applicant to proceed. Block submission of incomplete or invalid applications.
3. Show just-in-time guidance — Display the relevant rule next to each field, not in a separate guidelines page.
4. Surface a completion checklist — Before final submission, show a summary of what the officer will check, so the applicant can self-verify.

## Metrics plan and stop line

### Primary Metrics

| Metric | Baseline (synthetic) | Target | Measured |
|--------|---------------------|--------|----------|
| Application error rate | 17% | <8% | Monthly |
| Photo-related rejections | TBD | 50% reduction | Monthly (Release 2) |
| Time to complete application | TBD | <5 minutes | Weekly |
| Applicants stuck >2 min on one field | TBD | <5% | Weekly |

### Stop Line

- **Kill switch:** Applicants getting stuck and unable to proceed
- **Signal:** >10% of applicants stuck on one page for >2 minutes
- **Action:** Revert to simpler validation; add officer chat support

## Evals and gates

### Before Go-Live (Month 3)

- [ ] Security penetration testing passed
- [ ] Singpass integration certified
- [ ] 100 test applications submitted end-to-end
- [ ] Fallback to manual process documented
- [ ] Officer training on new workflow complete

### Before AI Photo Release (Release 2)

- [ ] Model accuracy >90% on test photo set
- [ ] False positive rate <5% (legitimate photos wrongly rejected)
- [ ] A/B test with 10% of traffic for 2 weeks

## Open issues

1. **Data migration from vendor** — format and timeline TBD; start discussions now
2. **Edge case documentation** — need full list of 40+ child passport exceptions from ops team
3. **Photo training data** — need sample of rejected photos to train/test model
4. **Hotline capacity** — confirm ops can handle initial spike in "Request officer review" escalations
5. **Eval dimensions not yet confirmed** — D1, D2, D4, D5 are still Proposed; Business Owner must confirm before go-live
6. **Escaped bug process** — need to define how production complaints become new test cases
7. **Second grader calibration** — only one grader calibrated; need backup before go-live

## Decision: continue, pivot or stop

**Decision:** Continue to go-live

**Why:** Agent passes 18/18 eval cases with 0 deal-breaker failures, D4 average of 4.9, and 100% calibration alignment. The eval plan is ready with clear ownership, schedule, and stop lines. No blockers remain that would delay go-live.
