# Agent Control Panel

Scope: Field validation and triage routing for ICA passport applications.

All data is synthetic and for testing only.

---

## What the agent is doing

Two workflows that run automatically when an applicant interacts with the form:

### 1. Triage routing

**Trigger:** Applicant answers "Who are you applying for?" and "New or renewal?"

**Action:** Shows only the fields and documents required for that path.

| Applicant type | Application type | Fields shown |
|----------------|------------------|--------------|
| Myself | New | 6 fields |
| Myself | Renewal | 5 fields (no birth cert) |
| Child under 18 | New | 10 fields + parent/guardian |
| Child under 18 | Renewal | 9 fields + parent/guardian |
| Adult on behalf | New | 8 fields + authorisation |
| Adult on behalf | Renewal | 7 fields + authorisation |

**Output:** Form adapts. Irrelevant fields never appear.

### 2. Field validation

**Trigger:** Applicant leaves a field (blur event) or clicks "Next".

**Action:** Checks the value against the rule for that field.

| Field | Rule | Error message |
|-------|------|---------------|
| child_name | Non-empty, CAPITALS only | "Enter the child's full name in CAPITAL LETTERS" |
| child_nric | Format X1234567X | "Enter a valid NRIC or Birth Cert number (e.g. T1234567A)" |
| child_dob | Valid date, age < 18 | "Child must be under 18 years old" |
| passport_number | Format X12345678X | "Enter a valid passport number (e.g. K12345678A)" |
| parent1_nric | Format X1234567X, ≠ child | "Enter a valid NRIC different from the child's" |
| parent2_nric | Format X1234567X, ≠ child, ≠ parent1 | "Enter a valid NRIC different from the child's and Parent 1's" |

**Output:** Field border turns green (valid) or red (invalid) with specific error message. Progress bar updates.

---

## Opportunity portfolio

| Opportunity | Current state | With automation | Volume | Effort |
|-------------|---------------|-----------------|--------|--------|
| **Reduce NRIC typos** | 8% of returns are format errors | Blocked at input | ~7,000/year | Low |
| **Catch age errors** | Child >18 submitted as child | Blocked at input | ~500/year | Low |
| **Hide irrelevant fields** | All 15 fields shown to everyone | 40% fewer fields shown | 338,000 online/year | Low |
| **Reduce "what do I need" calls** | Hotline answers checklist questions | Checklist appears after triage | ~12,000 calls/year | Low |

**Not in scope (deferred to Release 2):**
- Photo quality check (needs AI model)
- Document upload validation (needs file handling)
- Email notifications (needs backend)

---

## Rules of engagement

### Decides alone (no human in the loop)

| Action | When | Why safe |
|--------|------|----------|
| Show/hide fields based on triage | Applicant answers triage questions | Reversible — applicant can change answers and fields update |
| Mark field valid (green border) | Value matches rule | No harm — correct input is accepted |
| Mark field invalid (red border) | Value fails rule | Reversible — applicant can fix and resubmit |
| Update progress bar | Field state changes | Display only — no data changed |
| Show guidance text | Field receives focus | Display only — no data changed |

### Proposes and waits (human confirms)

| Action | When | Why wait |
|--------|------|----------|
| Block "Next" button | One or more fields invalid | Applicant must fix errors — but they choose when. No auto-submit. |
| Show "Request officer review" | Applicant clicks the escape hatch | Applicant chooses to escalate — system does not force it |

### A person reviews (officer decides)

| Action | When | Why human |
|--------|------|-----------|
| Approve application | All validation passes, queued for officer | Officer has final authority per policy |
| Reject application | Officer determines application is incomplete | Only officer can reject — system only flags |
| Escalate to supervisor | Edge case outside standard rules | Judgement call — not automatable |
| Override validation | Applicant has legitimate exception | Officer can accept what system flagged |

---

## Stop conditions

### Stop the workflow if

| Condition | Action | Who is notified |
|-----------|--------|-----------------|
| Validation rules fail to load | Show "Service temporarily unavailable" modal | Applicant sees error; logs alert ops |
| Unknown applicant_type or application_type | Route to officer queue with "Unknown path" reason | Officer reviews manually |
| Field fails validation 3+ times in session | Show "Request officer review" button prominently | Applicant can self-escalate |
| >10% of applicants stuck on one field for >2 minutes | Disable that field's blocking validation | Ops alerted; product reviews the rule |

### Do not stop for

| Condition | Why continue |
|-----------|--------------|
| Single field error | Normal — applicant fixes it |
| Applicant takes >5 minutes | Their pace — no timeout on form |
| Browser refresh | Progress saved to localStorage; resume |

---

## What stays human

| Decision | Why not automate |
|----------|------------------|
| **Approve or reject applications** | Legal requirement. Officers have final authority. |
| **Override a validation rule** | Exceptions exist (e.g., name with non-ASCII characters for foreign-born). Only officer can judge. |
| **Change validation rules** | Policy decision. Product team reviews data before changing a rule. |
| **Handle "Request officer review"** | Applicant chose to escalate. Human must respond. |
| **Decide child vs adult passport for 17y 6m+ applicants** | Validity period affects applicant's travel plans. Officer confirms. |
| **Contact applicant directly** | All outbound communication (email, SMS, call) requires officer action. System does not send. |

---

## Summary

| Category | Count |
|----------|-------|
| Decides alone | 5 actions |
| Proposes and waits | 2 actions |
| Human reviews | 6 decisions |
| Stop conditions | 4 triggers |
| Stays human | 6 decisions |

The agent validates and routes. It does not approve, reject, contact, or override.
