# Evaluation Plan

Operational plan for running the Passport Application Validator evaluation.

All data is synthetic and for testing only.

---

## Who owns what — Proposed

| Responsibility | Role | What they do |
|----------------|------|--------------|
| **Sign the pass bar** | Product Owner | Reviews eval results, confirms pass/fail, decides go/no-go for release |
| **Write test cases** | Engineering Lead | Creates new eval cases when features are added or bugs are found |
| **Refresh test cases** | Engineering Lead | Updates cases when policy rules change (consulted by Policy Lead) |
| **Run the eval** | Engineering Lead | Executes all 18 cases, scores each dimension, records results |
| **Review weekly sample** | Product Owner | Spot-checks 3 random cases from each weekly run to verify scoring consistency |
| **Escalate deal-breaker failures** | Engineering Lead | Notifies Product Owner and Ops Lead immediately if D3 or any deal-breaker fails |
| **Approve dimension changes** | Product Owner | Confirms new dimensions or changes to existing ones (consults Policy Lead for rule-based dimensions) |
| **Calibrate graders** | Engineering Lead | Runs calibration session before each evaluator's first eval |

### Decision rights for eval

| Decision | Who decides | Who is consulted | Who is told |
|----------|-------------|------------------|-------------|
| Pass bar thresholds | Product Owner | Policy Lead, Engineering Lead | Ops Lead |
| New test cases | Engineering Lead | Product Owner | Ops Lead |
| Deal-breaker designation | Product Owner | Policy Lead, Security Lead | Engineering Lead, Ops Lead |
| Release after pass | Product Owner | Engineering Lead, Ops Lead | Frontline Officers |
| Release after fail | Not allowed | — | — |

---

## When it runs — Proposed

| Trigger | What to run | Pass required? | Who runs |
|---------|-------------|----------------|----------|
| **Before go-live** | All 18 cases | Yes — blocks release | Engineering Lead |
| **Before every release** | All 18 cases | Yes — blocks release | Engineering Lead |
| **Every week** | All 18 cases | No — but failures logged | Engineering Lead |
| **After policy change** | Affected cases + all deal-breakers | Yes — blocks release | Engineering Lead |
| **After agent rule change** | Affected cases + all deal-breakers | Yes — blocks release | Engineering Lead |
| **After security incident** | All security cases (13–18) | Yes — blocks release | Engineering Lead |

### Schedule

| Day | Time | Activity |
|-----|------|----------|
| Monday 09:00 | Weekly eval run | Engineering Lead runs all 18 cases |
| Monday 11:00 | Results review | Product Owner reviews results, signs off or escalates |
| Friday 16:00 | Weekly sample check | Product Owner spot-checks 3 cases from Monday's run |

### Pre-release gate

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Code complete  │ → │   Eval passes   │ → │    Release OK   │
│                 │     │  (18/18, 0 DB)  │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ↓ if fails
                        ┌─────────────────┐
                        │  Block release  │
                        │  Fix and rerun  │
                        └─────────────────┘
```

DB = deal-breaker

---

## How I'll know it's working — Proposed

### Goal

Reduce the 17% application error rate by catching preventable mistakes at submission time, while never trapping applicants or leaking their data.

### Baseline and target

| Metric | Baseline | Target | Review date |
|--------|----------|--------|-------------|
| Application error rate | 17% | <8% | Month 3 (go-live + 1 month) |
| Photo-related rejections | TBD | 50% reduction | Release 2 |
| Time to complete application | TBD | <5 minutes | Month 3 |
| Applicants stuck >2 min | TBD | <5% | Month 3 |

### Usage metric

| Metric | What it measures | Target | Reviewed |
|--------|------------------|--------|----------|
| Eval pass rate | % of eval runs that pass | 100% | Weekly |
| Deal-breaker failure rate | % of runs with at least one deal-breaker fail | 0% | Weekly |
| D4 average | Error message quality across all cases | ≥3.0 | Weekly |
| Calibration agreement | % of scores where graders agree | ≥90% | Monthly |

### Pattern to watch first

**Escaped bugs:** Cases that pass the eval but fail in production.

| Signal | What it means | Action |
|--------|---------------|--------|
| Applicant complaint about wrong validation | Eval case didn't cover this scenario | Add new test case, mark as deal-breaker if appropriate |
| Frontline officer overrides agent decision | Agent rule may be wrong | Review rule, update CLAUDE.md, rerun affected cases |
| D4 average drops below 4.0 | Error messages getting worse | Review recent changes, file bug |

### Stop line

| Condition | Signal | Action |
|-----------|--------|--------|
| Any deal-breaker fails | D3 = No, or DB case fails D1/D2/D5 | **Stop release.** Fix agent, rerun, document. |
| D4 average < 3.0 | Error messages not actionable | Release allowed, but file bug and prioritise fix. |
| >2 escaped bugs in one week | Eval is not catching real issues | Stop releases. Add cases. Review coverage. |
| Grader calibration <80% | Graders are not aligned | Pause eval. Run calibration session. Do not release until aligned. |

---

## First 30 days — Proposed

### Week 1: Setup

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Day 1 | Confirm pass bar with stakeholders | Product Owner | Signed-off pass bar in human-rubric.md |
| Day 2 | Run baseline eval (all 18 cases) | Engineering Lead | eval-results.md with baseline scores |
| Day 3 | Calibrate first grader | Engineering Lead | Calibration scores recorded |
| Day 4 | Review results with Product Owner | Product Owner | Go/no-go for go-live |
| Day 5 | Document any fixes needed | Engineering Lead | Bug tickets filed |

### Week 2: Pre-go-live

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Day 8 | Fix any failing cases | Engineering Lead | Updated CLAUDE.md |
| Day 9 | Rerun affected cases | Engineering Lead | Updated eval-results.md |
| Day 10 | Final eval run (all 18 cases) | Engineering Lead | 18/18 pass, 0 deal-breakers |
| Day 11 | Product Owner signs off | Product Owner | Go-live approval |
| Day 12 | **Go-live** | Engineering Lead | Agent in production |

### Week 3: First production week

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Day 15 | Monitor production telemetry | Ops Lead | Dashboard review |
| Day 16 | First weekly eval run | Engineering Lead | eval-results.md updated |
| Day 17 | Review results + production data | Product Owner | Comparison: eval vs. production |
| Day 18 | Identify escaped bugs (if any) | Engineering Lead | New test cases (if needed) |
| Day 19 | Friday sample check | Product Owner | 3 cases spot-checked |

### Week 4: Stabilise

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Day 22 | Second weekly eval run | Engineering Lead | eval-results.md updated |
| Day 23 | Review + add cases for escaped bugs | Engineering Lead | Updated eval-cases.md |
| Day 24 | Calibrate second grader (if needed) | Engineering Lead | Calibration scores recorded |
| Day 25 | Month-end metrics review | Product Owner | Error rate vs. baseline |
| Day 26 | Adjust pass bar if needed | Product Owner | Updated human-rubric.md |

### Success criteria at Day 30

| Criterion | Target |
|-----------|--------|
| Eval pass rate | 100% (all 4 weekly runs passed) |
| Deal-breaker failures | 0 |
| Escaped bugs | ≤2 (added as new test cases) |
| Grader calibration | ≥90% agreement |
| Production error rate | Trending down from 17% baseline |

---

## Summary

| Question | Answer |
|----------|--------|
| Who signs the pass bar? | Product Owner |
| Who writes test cases? | Engineering Lead |
| Who runs the eval? | Engineering Lead |
| Who reviews a weekly sample? | Product Owner |
| When does it run? | Weekly, before every release, after policy/rule change |
| What's the goal? | Reduce 17% error rate to <8% |
| What's the stop line? | Any deal-breaker fails, or >2 escaped bugs in one week |
| What happens in the first 30 days? | Setup → Pre-go-live → First production week → Stabilise |

All items above are **Proposed** — review and confirm before go-live.
