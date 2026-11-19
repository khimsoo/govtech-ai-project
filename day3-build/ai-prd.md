# AI PRD: Passport Application Validator

Release 1 scope: Field validation and triage routing only.

All data is synthetic and for testing only.

---

## Problem and user

**User:** Applicants submitting passport applications online, especially parents renewing for a child.

**Problem:**
- 520,000 applications per year, 65% online (338,000)
- 17% error rate → ~57,000 returned applications per year
- Each error causes 6-day delay
- Only 38% read guidelines before applying
- Parents renewing for a child are the most confused group

**Root cause:** Guidance arrives too early (wall of text upfront) and validation arrives too late (rejection days later). No moment exists where the right guidance meets the applicant while they can still act on it.

**Agent's job:** Move validation and guidance to the point of input. Block errors before submission. Never approve, reject, or contact.

---

## Instructions

The agent runs two workflows:

### 1. Triage routing

When the applicant answers "Who are you applying for?" and "New or renewal?", show only the fields required for that path.

| Path | Fields |
|------|--------|
| Myself × New | 6 |
| Myself × Renewal | 5 |
| Child × New | 10 + parent |
| Child × Renewal | 9 + parent |
| Adult on behalf × New | 8 + authorisation |
| Adult on behalf × Renewal | 7 + authorisation |

If the applicant changes their answer, update the form immediately.

### 2. Field validation

When the applicant leaves a field (blur) or clicks "Next", check the value against the rule:

| Field | Rule |
|-------|------|
| child_name | Non-empty, CAPITALS only |
| child_nric | Format X1234567X |
| child_dob | Valid date, age < 18 |
| passport_number | Format X12345678X |
| parent1_nric | Format X1234567X, ≠ child |
| parent2_nric | Format X1234567X, ≠ child, ≠ parent1 (unless single_parent) |

If valid: green border. If invalid: red border + specific error message. Update progress bar.

If all fields valid: enable "Next" button. If any invalid: disable "Next" button.

---

## Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `get_validation_rules` | Look up which fields are required | applicant_type, application_type | List of field IDs |
| `validate_field` | Check one field against its rule | field_name, value, context | `{valid: true}` or `{valid: false, error: "..."}` |
| `log_event` | Record action for audit | application_id, event_type, details | `{logged: true}` |
| `save_progress` | Store form state | form_data | `{saved: true, timestamp}` |
| `load_progress` | Retrieve saved form state | — | form_data or null |

**Not available in Release 1:**
- `check_photo` — deferred to Release 2
- `route_to_officer` — deferred (requires backend)
- `send_notification` — deferred (requires email service)

---

## Context and memory

### What the agent receives

| Field | Example | Source |
|-------|---------|--------|
| applicant_type | "child_under_18" | Triage question 1 |
| application_type | "renewal" | Triage question 2 |
| form_data | `{child_name: "LIM JIA HUI", ...}` | Form fields |
| single_parent | true/false | Checkbox |

### What the agent remembers

**Within a session:** Form state saved to localStorage. Survives browser refresh.

**Between sessions:** Nothing. Each session starts fresh. No cross-session memory.

### What the agent can look up

- Validation rules for each path (hard-coded in config)
- Guidance text for each field (hard-coded in config)
- Required documents checklist (hard-coded in config)

### What the agent cannot access

- Other applicants' data
- Officer queue
- Historical applications
- Singpass identity data

---

## Permissions

Every action the agent can take, with proposed tier and setting.

### Tier definitions

| Tier | What it means |
|------|---------------|
| **Read** | Look at data, no change |
| **Draft** | Prepare output, not yet visible to anyone |
| **Write** | Change data or UI the applicant sees |
| **Send** | Deliver to another person (officer, applicant via email) |

### Setting definitions

| Setting | What it means |
|---------|---------------|
| **Auto** | Agent does it without asking |
| **Confirm** | Agent proposes, human confirms |
| **Block** | Agent cannot do this |

### Action list

| # | Action | Tier | Setting | Proposed | Notes |
|---|--------|------|---------|----------|-------|
| 1 | Read applicant_type from triage answer | Read | ? | **Proposed: Auto** | Needed to determine which fields to show |
| 2 | Read application_type from triage answer | Read | ? | **Proposed: Auto** | Needed to determine which fields to show |
| 3 | Read form field value | Read | ? | **Proposed: Auto** | Needed to validate |
| 4 | Read single_parent checkbox state | Read | ? | **Proposed: Auto** | Affects parent2 validation |
| 5 | Read saved progress from localStorage | Read | ? | **Proposed: Auto** | Resume after refresh |
| 6 | Look up validation rules | Read | ? | **Proposed: Auto** | Config lookup, no user data |
| 7 | Look up guidance text | Read | ? | **Proposed: Auto** | Config lookup, no user data |
| 8 | Show/hide form fields based on triage | Write | ? | **Proposed: Auto** | Reversible — applicant can change triage answers |
| 9 | Show guidance text on field focus | Write | ? | **Proposed: Auto** | Display only, no data changed |
| 10 | Mark field valid (green border) | Write | ? | **Proposed: Auto** | Positive feedback, no harm |
| 11 | Mark field invalid (red border) | Write | ? | **Proposed: Auto** | Reversible — applicant can fix and retry |
| 12 | Show specific error message | Write | ? | **Proposed: Auto** | Helps applicant fix the error |
| 13 | Update progress bar | Write | ? | **Proposed: Auto** | Display only, no data changed |
| 14 | Show "What you'll need" checklist | Write | ? | **Proposed: Auto** | Guidance only |
| 15 | Save progress to localStorage | Write | ? | **Proposed: Auto** | Protects applicant's work |
| 16 | Disable "Next" button | Write | ? | **Proposed: Confirm** | Blocks applicant until they fix errors |
| 17 | Enable "Next" button | Write | ? | **Proposed: Auto** | Unblocks applicant |
| 18 | Show "Request officer review" option | Write | ? | **Proposed: Auto** | Escape hatch — applicant chooses to use it |
| 19 | Log validation_started event | Write | ? | **Proposed: Auto** | Audit trail, no PII |
| 20 | Log field_valid event | Write | ? | **Proposed: Auto** | Audit trail, no PII |
| 21 | Log field_error event | Write | ? | **Proposed: Auto** | Audit trail, hashed values only |
| 22 | Clear progress on successful submit | Write | ? | **Proposed: Auto** | Cleanup |
| 23 | Route application to officer queue | Send | ? | **Proposed: Block** | Not in Release 1 — requires backend |
| 24 | Send email to applicant | Send | ? | **Proposed: Block** | Not in Release 1 — requires email service |
| 25 | Send SMS to applicant | Send | ? | **Proposed: Block** | Not in Release 1 — requires SMS service |
| 26 | Approve application | Write | ? | **Proposed: Block** | Officers only — legal requirement |
| 27 | Reject application | Write | ? | **Proposed: Block** | Officers only — legal requirement |
| 28 | Edit applicant-submitted data | Write | ? | **Proposed: Block** | Agent validates, never edits |
| 29 | Override a validation rule | Write | ? | **Proposed: Block** | Officers only |
| 30 | Access other applicants' data | Read | ? | **Proposed: Block** | Privacy — one application at a time |

---

## Human checkpoints

When to stop automation and involve a person.

| Trigger | What happens | Who acts |
|---------|--------------|----------|
| Field fails validation 3+ times | Show "Request officer review" prominently | Applicant decides whether to escalate |
| Applicant clicks "Request officer review" | Queue for officer | Officer reviews |
| Child age ≥17y 6m | Flag on review screen | Officer confirms passport type |
| Single parent checkbox + no supporting doc | Flag on review screen | Officer confirms |
| Name contains non-ASCII characters | Flag on review screen | Officer confirms encoding |
| Unknown applicant_type or application_type | Show error, suggest restart | Applicant restarts or calls hotline |

---

## Stop conditions

### Stop immediately

| Condition | Action | Log event |
|-----------|--------|-----------|
| Validation rules fail to load | Show "Service temporarily unavailable" | `system_error` |
| Unknown path (applicant_type + application_type) | Show error modal | `unknown_path` |
| localStorage unavailable | Continue without save/resume | `storage_unavailable` |

### Stop the batch (ops alert)

| Condition | Signal | Action |
|-----------|--------|--------|
| >10% of applicants stuck on one field for >2 min | Telemetry | Disable that field's blocking; alert product |
| Error rate >50% in last 100 sessions | Telemetry | Pause validation; alert ops |

### Do not stop

| Condition | Why continue |
|-----------|--------------|
| Single field error | Normal — applicant fixes it |
| Applicant takes >5 minutes | Their pace |
| Browser refresh | Progress saved; resume |

---

## Logs

### What to log

| Event | When | Fields |
|-------|------|--------|
| `session_started` | Page load | session_id, applicant_type, application_type |
| `triage_completed` | Both questions answered | path (e.g., "child_renewal") |
| `field_focused` | Field receives focus | field_name |
| `field_valid` | Validation passes | field_name |
| `field_error` | Validation fails | field_name, error_code (not raw value) |
| `progress_saved` | localStorage write | timestamp |
| `progress_resumed` | localStorage read | saved_at timestamp |
| `step_completed` | Applicant clicks "Next" | step_number, fields_valid |
| `session_completed` | Final submit | total_duration, total_errors |

### What NOT to log

- Raw NRIC values (hash if needed)
- Full names
- Dates of birth
- Any value that could identify a real person

### Retention

- Session logs: 7 years (audit requirement)
- Aggregated metrics: indefinite
- Applicant can request their session log via data access request

---

## Business rules

Rules that must not change without policy review.

| Rule | Source | Why |
|------|--------|-----|
| Child must be under 18 | ICA policy | Age boundary for child passport |
| NRIC format X1234567X | National standard | Checksum validation |
| Parent NRICs must differ | Business logic | Catches copy-paste errors |
| Single-parent disables parent2 fields | UX decision, tested | Prevents confusion |
| Validation on blur, not keystroke | UX decision, tested | Users found keystroke annoying |
| Progress bar counts valid fields | UX decision, tested | Motivates completion |
| Labels match across portals | Consistency requirement | "Parent/Guardian 1" everywhere |
| Officer must review before any outbound | Legal | No auto-send |

---

## What engineering decides

Decisions within engineering's authority — no product approval needed.

| Decision | Constraints |
|----------|-------------|
| Validation implementation (regex, library, custom) | Must match the rules exactly |
| localStorage vs sessionStorage | Must survive refresh |
| Error message wording | Must be specific and actionable |
| Progress bar animation | Must update in real-time |
| Field border colours | Must be accessible (not red/green only) |
| Mobile breakpoints | Must work on 375px width |
| Loading states | Must show during validation |
| Retry logic for localStorage | Must handle quota exceeded |

---

## Open decisions

Decisions that need your input before engineering proceeds.

| # | Decision | Options | Impact | Your pick |
|---|----------|---------|--------|-----------|
| 1 | **Disable "Next" button setting** | Auto (agent blocks), Confirm (applicant clicks to proceed anyway), or somewhere in between? | Auto = fewer errors submitted, more friction. Confirm = applicant can override, more errors reach officer. | ___________ |
| 2 | **Show error on first blur or only after "Next" click?** | First blur (immediate feedback) vs "Next" click (batch feedback) | First blur = catches errors early but may annoy. Next click = less interruption but errors pile up. | ___________ |
| 3 | **How long before "Request officer review" appears?** | After 3 failed attempts on same field? After 2 minutes stuck? Always visible? | Too early = encourages bypass. Too late = frustrates stuck users. | ___________ |
| 4 | **What happens when localStorage is full?** | Continue without save? Show warning? Clear old sessions? | Affects applicants who abandon and return. | ___________ |
| 5 | **Should progress bar show "7 of 10" or "70%"?** | Count vs percentage | Prototype used count. Percentage is standard. Needs user testing if changed. | ___________ |
| 6 | **Age boundary: 17y 6m or different?** | 17y 6m (current), 17y 0m (more conservative), 17y 9m (less conservative) | Affects how many applications route to officer. | ___________ |
| 7 | **Permission setting for action #16 (disable Next button)** | Auto or Confirm? | See Permissions table above. | ___________ |
