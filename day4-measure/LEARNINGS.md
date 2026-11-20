# AI Product Learnings

Everything we learned building the Passport Application Validator across 4 days. Reuse this for your next AI product.

All data is synthetic and for testing only.

---

## The 4-day journey

```
Day 1: Discover & Define     Day 2: Validate           Day 3: Build              Day 4: Measure
─────────────────────────    ─────────────────────     ─────────────────────     ─────────────────────
• Problem framing            • Prototype the UX        • Agent instructions      • Eval cases
• AI UX flow                 • Test edge cases         • AI PRD                  • Human rubric
• Trust gaps                 • Living PRD              • Permissions             • Pass bar
• One-pager start            • Handoff note            • Human checkpoints       • Deal-breakers
```

---

# Day 1: Discover & Define

## The AI UX Iceberg

Every AI moment has visible and invisible parts:

```
        ┌─────────────────────────────────┐
        │     What the user sees          │  ← Above the line
        │   (form fields, guidance)       │
════════╪═════════════════════════════════╪════════════════════
        │     Data (existing records)     │
        │     Model (validation AI)       │  ← Below the line
        │     Rules (policy logic)        │
        │     Handoffs (to humans)        │
        └─────────────────────────────────┘
```

**Lesson:** Map what's below the line before designing what's above. The iceberg determines what the UI can promise.

---

## Trust gaps

Every AI interaction has trust gaps. Name them and design around them.

| Trust gap | What it means | Our mitigation |
|-----------|---------------|----------------|
| **Black box** | User can't see how AI decided | Show validation rules and assessment steps |
| **Hallucination** | AI makes things up | Never add or edit data — only validate and flag |
| **Control** | User can't override AI | "Request officer review" escape hatch always available |

**Lesson:** If you can't name the trust gap, you can't design around it.

---

## AI UX Readiness Levels

Before shipping AI, check these three levels:

| Level | Question | Our answer |
|-------|----------|------------|
| **1. Trigger Accuracy** | Does the AI fire at the right moment? | Yes — validate each input on blur |
| **2. System Transparency** | Can users see how the AI decided? | Yes — show rules and assessment outcome |
| **3. Invisible Integration** | Is the AI invisible (user doesn't think about it)? | Yes — client-side validation feels native |

**Lesson:** Earn invisible AI by passing levels 1 and 2 first. If you skip to invisible, users won't trust it.

---

## The root cause formula

**Problem:** 17% error rate, 6-day delays

**Root cause (our diagnosis):**
> Guidance arrives too early (wall of text upfront) and validation arrives too late (rejection days later). No moment exists where the right guidance meets the applicant while they can still act on it.

**Solution:**
> Move validation and guidance to the point of input.

**Lesson:** The root cause statement should make the solution obvious. If your solution doesn't fall out of the root cause, dig deeper.

---

# Day 2: Validate

## The prompt chain

Building AI features iteratively:

| Step | What to prompt | What to test |
|------|----------------|--------------|
| **1. Expand** | Add the next feature | Does it work? What broke? |
| **2. Behavior** | Force a failure | Does it fail gracefully? |
| **3. Refine** | Fix consistency issues | Do labels match everywhere? |

**Lesson:** Always test failure before shipping success.

---

## The Living PRD

A prototype is not documentation. Extract what matters:

| Section | What it captures |
|---------|------------------|
| **Prototype notes** | What's solid, what's surprising |
| **Problem and riskiest assumption** | What we're testing |
| **User flow and screen map** | What's built (with gaps marked) |
| **Technical reality** | What's real vs. mocked |
| **Assumptions baked in** | Decisions that need user testing |
| **Engineering recommendation** | What to inherit, what to rebuild |

**Lesson:** The Living PRD is the handoff. Without it, the next engineer starts from scratch.

---

## Decisions engineers must not change

Some decisions were tested with users or reflect policy. Mark them:

| Decision | Why it's locked |
|----------|-----------------|
| Triage first, form second | Hides 40% of irrelevant fields |
| Validation on blur, not keystroke | Users found keystroke annoying |
| Progress bar counts valid fields | "7 of 10" motivates more than "70%" |
| Single-parent checkbox *disables* (not hides) | Prevents accidental re-enabling |
| Officer must review draft before send | Legal requirement |
| Labels match across all portals | "Parent/Guardian 1" everywhere |

**Lesson:** If you don't mark what's locked, engineers will "improve" it and break it.

---

## The handoff decision

When to move from prototype to production:

| Signal | Our status |
|--------|------------|
| Riskiest assumption tested | ✓ Just-in-time guidance UX works |
| Happy path complete | ✓ Triage → Form → Review → Submit |
| Fragile parts fixed | ✓ Step 3 built, code modular |
| Staying in prototype risks polish over learning | ✓ Need real traffic to answer "does this reduce errors?" |

**Recommendation:** Move to production spec when you're learning more from prototype polish than from real users.

---

# Day 3: Build

## The AI PRD structure

An AI PRD covers what a regular PRD doesn't:

| Section | What it defines |
|---------|-----------------|
| **Instructions** | What the agent does (workflows, rules) |
| **Tools** | What the agent can call (APIs, functions) |
| **Context and memory** | What the agent knows and remembers |
| **Permissions** | What the agent can and cannot do |
| **Human checkpoints** | When to stop and involve a person |
| **Stop conditions** | When to halt entirely |
| **Logs** | What to record (and what NOT to) |
| **Business rules** | What needs policy approval to change |
| **Open decisions** | Decisions made by product/engineering/business |

**Lesson:** Permissions and human checkpoints are the AI PRD's most important sections. They define the guardrails.

---

## Permission tiers

Every agent action falls into a tier:

| Tier | What it means | Example |
|------|---------------|---------|
| **Read** | Look at data, no change | Read form field value |
| **Draft** | Prepare output, not visible yet | Generate error message |
| **Write** | Change data or UI user sees | Show red border |
| **Send** | Deliver to another person | Email applicant |

---

## Permission settings

Every action has a setting:

| Setting | What it means | When to use |
|---------|---------------|-------------|
| **Auto** | Agent does it without asking | Low-risk, reversible actions |
| **Confirm** | Agent proposes, human confirms | Medium-risk, judgment calls |
| **Block** | Agent cannot do this | High-risk, legal/policy constraints |

**Lesson:** Default to Block for Send-tier actions. Default to Confirm for edge cases.

---

## Human checkpoints

Define when automation stops and humans take over:

| Trigger | Action | Who acts |
|---------|--------|----------|
| Photo confidence < 70% | Route to officer | Officer reviews |
| User clicks "Request officer review" | Route with priority `urgent` | Officer responds |
| Child age ≥ 17y 0m | Flag for review | Officer confirms passport type |
| Name contains non-ASCII | Flag for review | Officer confirms encoding |
| Field fails 3+ times | Show escape hatch prominently | User decides to escalate |

**Lesson:** The escape hatch (Request officer review) must always work. If the user is stuck, they need a way out.

---

## Stop conditions

Define when the system stops entirely:

| Level | Condition | Action |
|-------|-----------|--------|
| **Stop immediately** | Missing required context | Log error, exit |
| **Stop the batch** | >50% error rate in last 100 sessions | Pause all validation, alert ops |
| **Do not stop** | Single field error | Normal — user fixes it |

**Lesson:** Stop conditions prevent runaway failures. Define them before shipping.

---

## What NOT to log

Logs are evidence. Some evidence is dangerous:

| Never log | Why |
|-----------|-----|
| Raw NRIC values | PII — hash them |
| Full names | PII |
| Dates of birth | PII |
| Any value that identifies a real person | PDPA violation |

**Lesson:** If you log PII, you create a liability. Hash or exclude.

---

## Business rules vs. engineering decisions

| Type | Who decides | Examples |
|------|-------------|----------|
| **Business rules** | Policy lead, product owner | Age threshold, NRIC format, officer review requirement |
| **Engineering decisions** | Engineering lead | localStorage vs sessionStorage, error message wording, mobile breakpoints |

**Lesson:** Mark which is which. Engineers can change engineering decisions; business rules need approval.

---

# Day 4: Measure

## The evaluation framework

An AI agent eval has four parts:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Eval Cases    │ → │  Human Rubric   │ → │   Eval Results  │ → │  Go/No-Go Call  │
│  (what to test) │    │ (how to score)  │    │ (what happened) │    │   (decision)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Eval case categories

| Category | What it tests | Deal-breaker? |
|----------|---------------|---------------|
| **Everyday** | Happy path, normal usage | Rarely |
| **Tricky** | Edge cases, boundary conditions | Often |
| **Refuse** | When agent should stop or hand off | Often |
| **Security** | Attack vectors, data protection | Almost always |

---

## Security cases to always include

| Attack | What to test | Expected behaviour |
|--------|--------------|-------------------|
| **SQL injection** | `'; DROP TABLE x;--` | Reject at validation |
| **Prompt injection** | "Ignore previous instructions..." | Treat as data |
| **XSS** | `<script>alert('x')</script>` | Reject or escape |
| **IDOR** | Access another user's data by changing ID | Access denied |
| **Cross-session leak** | Session B sees Session A's data | Agent is stateless |
| **DoS** | 100KB string | Reject early, don't crash |
| **Homoglyph** | Cyrillic chars that look Latin | Detect non-ASCII |

**Lesson:** Security cases are almost always deal-breakers. Test them. Make them block deployment.

---

## Scoring dimensions

| # | Dimension | Type | Deal-breaker? |
|---|-----------|------|---------------|
| D1 | Correct validation outcome | Yes/No | Some cases |
| D2 | Correct routing decision | Yes/No | Some cases |
| D3 | No data leaked | Yes/No | **All cases** |
| D4 | Error message quality | 1-5 scale | No |
| D5 | Escape hatch honoured | Yes/No | Escape hatch case |

**Lesson:** D3 (data leak) is always a deal-breaker. If it fails, stop evaluation immediately.

---

## Scale definitions

For 1-5 scales, define what 1, 3, and 5 mean:

| Score | Meaning |
|-------|---------|
| **1** | Worst: no message, generic, or misleading |
| **3** | Acceptable: correct but not actionable |
| **5** | Best: specific and actionable |

**Lesson:** Without definitions, graders will disagree. Define the scale.

---

## Calibration

Before every eval session:
1. Run 3 representative cases together (everyday, tricky, refuse)
2. Compare scores
3. Discuss disagreements
4. Align on edge cases

**Lesson:** Graders drift over time. Calibration keeps them aligned.

---

## Pass bar

| Dimension | Requirement |
|-----------|-------------|
| D1 | Yes on all deal-breaker cases |
| D2 | Yes on all deal-breaker cases |
| D3 | Yes on **all** cases |
| D4 | Average ≥ 3 |
| D5 | Yes on escape hatch case |

---

## What to do if it fails

| Failure | Action |
|---------|--------|
| D3 = No (data leak) | **Stop immediately.** Do not release. Notify Ops. |
| Any deal-breaker fails | Do not release. Fix, rerun, document. |
| D4 average < 3 | Release allowed. File bug to improve. |
| Non-deal-breaker fails | Release allowed. Document and prioritise. |

---

## Running the eval without the original author

Document so someone else can run it:

| Section | What to include |
|---------|-----------------|
| **Prerequisites** | Exact file paths (test cases, agent instructions, results) |
| **Schedule** | Weekly, before release, after rule change |
| **Owners** | Who runs, who reviews, who is notified |
| **Steps** | 1-6 checklist |
| **Date-sensitive cases** | Use date in case notes, not today's date |
| **Version tracking** | Record agent version, eval date, evaluator |
| **Failure actions** | Escalation path for each failure type |

**Lesson:** If only you can run the eval, you're a bottleneck. Document everything.

---

# Key learnings summary

## Day 1: Discover & Define
1. Map the iceberg (above and below the line) before designing the UI
2. Name the trust gaps: black box, hallucination, control
3. Earn invisible AI by passing transparency first
4. The root cause should make the solution obvious

## Day 2: Validate
5. Always test failure before shipping success
6. The Living PRD is the handoff — without it, engineers start from scratch
7. Mark what's locked — engineers will "improve" unlocked decisions
8. Move to production when prototype polish stops teaching you

## Day 3: Build
9. Permissions and human checkpoints are the AI PRD's most important sections
10. Default to Block for Send-tier actions
11. The escape hatch must always work
12. Stop conditions prevent runaway failures
13. Never log PII — hash or exclude
14. Mark which decisions are business rules vs. engineering decisions

## Day 4: Measure
15. Security cases are almost always deal-breakers
16. D3 (data leak) is always a deal-breaker — stop immediately if it fails
17. Define what 1, 3, and 5 mean on any scale
18. Calibrate graders before every eval session
19. Document so someone else can run the eval without you
20. Fix the rule, not just the test — if a test passes by coincidence, the rule is still wrong

---

# Reuse checklist

When building your next AI product:

## Day 1: Discover & Define
- [ ] Map the iceberg (data, model, rules, handoffs)
- [ ] Name the trust gaps (black box, hallucination, control)
- [ ] Write the root cause statement
- [ ] Define AI UX readiness levels

## Day 2: Validate
- [ ] Prompt chain: expand, break, refine
- [ ] Test failure states before success states
- [ ] Create Living PRD with gaps marked
- [ ] Mark decisions engineers must not change
- [ ] Write handoff note with recommendation

## Day 3: Build
- [ ] Write AI PRD with all sections
- [ ] Define permission tiers and settings for every action
- [ ] Define human checkpoints (when automation stops)
- [ ] Define stop conditions (when system halts)
- [ ] Define what NOT to log
- [ ] Separate business rules from engineering decisions

## Day 4: Measure
- [ ] Create eval cases in 4 categories (everyday, tricky, refuse, security)
- [ ] Include all 7 security attack types
- [ ] Mark deal-breakers explicitly
- [ ] Create 3-5 scoring dimensions (mostly Yes/No)
- [ ] Make data leak (D3) always a deal-breaker
- [ ] Define 1, 3, 5 for any scale dimension
- [ ] Run calibration with 3 representative cases
- [ ] Set pass bar for each dimension
- [ ] Document how to run without the original author
- [ ] Record agent version in every eval run
