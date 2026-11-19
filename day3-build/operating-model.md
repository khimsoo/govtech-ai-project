# Operating Model

Scope: Passport Application Validator (field validation and triage routing).

All data is synthetic and for testing only.

---

## Roles

| Role | Responsibility |
|------|----------------|
| **Product Owner** | Defines scope, approves rules, owns roadmap, decides go-live |
| **Engineering Lead** | Builds and deploys, owns technical decisions within constraints |
| **Ops Lead** | Monitors telemetry, handles incidents, manages hotline capacity |
| **Frontline Officer** | Reviews flagged applications, handles escalations, final approval authority |
| **Policy Lead** | Owns business rules (age thresholds, document requirements), approves rule changes |
| **Security Lead** | Certifies integrations, approves go-live from security perspective |
| **Vendor** | Provides data migration support, parallel cutover planning |

---

## Decision rights

Who decides, who is consulted, who is told for each part of the harness.

| Harness part | Who decides | Who is consulted | Who is told |
|--------------|-------------|------------------|-------------|
| **Scope** — which workflows are automated | Product Owner | Engineering Lead, Ops Lead, Policy Lead | Frontline Officers, Vendor |
| **Permissions** — what the agent can do (auto/confirm/block) | Product Owner | Engineering Lead, Security Lead, Policy Lead | Ops Lead, Frontline Officers |
| **Vendor and model** — which AI provider and model version | Engineering Lead | Product Owner, Security Lead | Ops Lead |
| **Go-live** — decision to release to production | Product Owner | Engineering Lead, Ops Lead, Security Lead, Policy Lead | Frontline Officers, Vendor |
| **Incident** — response when stop condition triggers | Ops Lead | Engineering Lead, Product Owner | Frontline Officers, Policy Lead |
| **Retire** — decision to turn off automation | Product Owner | Engineering Lead, Ops Lead, Policy Lead | Frontline Officers, Vendor, Security Lead |

---

## How decisions flow

### Scope change

1. Product Owner proposes change (e.g., add photo validation)
2. Consults Engineering Lead on feasibility, Ops Lead on capacity, Policy Lead on rules
3. Decision documented in ai-prd.md
4. Frontline Officers and Vendor told via sprint update

### Permission change

1. Product Owner proposes change (e.g., move action from Confirm to Auto)
2. Consults Engineering Lead on implementation, Security Lead on risk, Policy Lead on compliance
3. Decision documented in ai-prd.md Permissions table
4. Ops Lead and Frontline Officers told before deployment

### Incident response

**Example: 08:00 Monday, agent sent wrong answer to applicant**

| Step | Who acts | What they do |
|------|----------|--------------|
| 1. Detect | Frontline Officer | Sees applicant complaint or wrong validation result |
| 2. Escalate | Frontline Officer → Ops Lead | Calls Ops Lead (on duty 08:00–18:00 weekdays) |
| 3. Assess | Ops Lead | Checks telemetry: one-off or pattern? |
| 4. Decide | Ops Lead | If pattern: disable that rule. If one-off: log and monitor. |
| 5. Switch off | Ops Lead | Toggles feature flag in admin panel (takes effect in 1 min) |
| 6. Tell business | Ops Lead → Product Owner | Calls or messages within 15 minutes of decision |
| 7. Tell officers | Ops Lead → Frontline Officers | "Validation paused, review all applications manually" |
| 8. Root cause | Engineering Lead | Investigates bug, proposes fix |
| 9. Restore | Product Owner | Decides when to turn automation back on |

**General incident flow:**

1. Telemetry triggers stop condition (e.g., >10% stuck on one field)
2. Ops Lead decides: disable blocking, pause validation, or escalate
3. Consults Engineering Lead on root cause, Product Owner on business impact
4. Frontline Officers told to expect manual fallback; Policy Lead told if rule may need change

### Go-live decision

1. Product Owner proposes go-live date
2. Consults all: Engineering Lead (build ready), Ops Lead (capacity), Security Lead (certified), Policy Lead (rules approved)
3. Decision made at Month 3 checkpoint
4. Frontline Officers trained; Vendor coordinates cutover

---

## On-call schedule

| Time | Who is on duty | Backup |
|------|----------------|--------|
| **Weekdays 08:00–18:00** | Ops Lead | Engineering Lead |
| **Weekdays 18:00–08:00** | Frontline Officer (shift supervisor) | Ops Lead (phone) |
| **Weekends and holidays** | Frontline Officer (shift supervisor) | Ops Lead (phone) |

On-call person monitors telemetry dashboard and hotline queue.

---

## Kill switch

| Authority | What they can do | When |
|-----------|------------------|------|
| **Ops Lead** | Disable one validation rule | Field causing >10% stuck |
| **Ops Lead** | Pause all validation (forms still submit, no blocking) | Error rate >50% |
| **Engineering Lead** | Roll back to previous version | Bug confirmed |
| **Product Owner** | Turn off automation entirely | Business decision |

**How to switch off:** Ops Lead toggles feature flag in admin panel. No deployment needed. Takes effect within 1 minute.

**Fallback:** When validation is paused, forms submit without blocking. Officers review all applications manually (pre-automation process).

---

## Escalation paths

| Situation | First contact | Escalates to |
|-----------|---------------|--------------|
| Applicant stuck, clicks "Request officer review" | Frontline Officer | Ops Lead (if pattern emerges) |
| Validation rule flags legitimate application | Frontline Officer | Policy Lead (rule may need update) |
| Stop condition triggers | Ops Lead | Engineering Lead + Product Owner |
| **Agent gave wrong answer** | Frontline Officer (first to see) | Ops Lead (decides response) |
| **Agent blocked valid application** | Frontline Officer | Ops Lead → Engineering Lead (bug?) |
| Security incident (data exposure, breach) | Security Lead | Product Owner + Policy Lead |
| Vendor migration issue | Engineering Lead | Product Owner + Vendor |

---

## Review cadence

| Review | Frequency | Attendees | Purpose |
|--------|-----------|-----------|---------|
| Sprint review | Every 2 weeks | Product Owner, Engineering Lead, Ops Lead | Demo, metrics, backlog |
| Metrics review | Monthly | Product Owner, Ops Lead, Policy Lead | Error rates, stuck applicants, escalations |
| Permission review | Quarterly | Product Owner, Security Lead, Policy Lead | Audit auto/confirm/block settings |
| Model review | Before each release | Engineering Lead, Security Lead | Evaluate model updates, test accuracy |
