# Agent Run Log

Three test runs of the Passport Application Validator agent.

All data is synthetic and for testing only.

---

## Test Case 1: Complete (all fields valid)

### Input

```json
{
  "application_id": "APP-2026-H8P3Q1",
  "application_type": "renewal",
  "applicant_type": "child_under_18",
  "single_parent": false,
  "photo_url": "https://storage.example.gov.sg/photos/h8p3q1.jpg",
  "form_data": {
    "child_name": "LIM JIA HUI",
    "child_nric": "T1534567A",
    "child_dob": "2015-06-12",
    "passport_number": "K98765432B",
    "parent1_name": "LIM AH KOW",
    "parent1_nric": "S7612345B",
    "parent1_relationship": "father",
    "parent2_name": "TAN MEI LING",
    "parent2_nric": "S7898765C",
    "parent2_relationship": "mother"
  }
}
```

### Turn 1

**Goal:** Validate the child passport renewal application APP-2026-H8P3Q1.

**Plan:**
1. Log validation_started
2. Validate all required fields for child_under_18 renewal
3. Check photo quality
4. Log validation_complete with outcome

**Act:**
```
log_event("APP-2026-H8P3Q1", "validation_started", {
  "application_type": "renewal",
  "applicant_type": "child_under_18"
})
```

**Observe:**
```json
{ "logged": true, "timestamp": "2026-11-19T09:14:22Z" }
```

**Check:** Event logged. Proceed to field validation.

### Turn 2

**Goal:** Validate child information fields.

**Plan:** Check child_name, child_nric, child_dob, passport_number.

**Act:**
```
validate_field("child_name", "LIM JIA HUI", {})
validate_field("child_nric", "T1534567A", {})
validate_field("child_dob", "2015-06-12", {})
validate_field("passport_number", "K98765432B", {})
```

**Observe:**
```json
{ "child_name": { "valid": true } }
{ "child_nric": { "valid": true } }
{ "child_dob": { "valid": true, "age_years": 11, "age_months": 5 } }
{ "passport_number": { "valid": true } }
```

**Check:** All child fields valid. Child is 11 years old — not near age boundary. Proceed to parent fields.

### Turn 3

**Goal:** Validate parent/guardian fields.

**Plan:** Check parent1_nric and parent2_nric. Verify they differ from each other and from child.

**Act:**
```
validate_field("parent1_nric", "S7612345B", { "child_nric": "T1534567A" })
validate_field("parent2_nric", "S7898765C", { "child_nric": "T1534567A", "parent1_nric": "S7612345B" })
```

**Observe:**
```json
{ "parent1_nric": { "valid": true } }
{ "parent2_nric": { "valid": true } }
```

**Check:** Both parent NRICs valid and unique. Proceed to photo check.

### Turn 4

**Goal:** Check photo quality.

**Plan:** Call check_photo service. If confidence ≥ 0.70, pass. If < 0.70, route to officer.

**Act:**
```
check_photo("https://storage.example.gov.sg/photos/h8p3q1.jpg")
```

**Observe:**
```json
{
  "pass": true,
  "confidence": 0.94,
  "checks": {
    "face_visible": true,
    "face_centred": true,
    "background": "white",
    "glasses": false,
    "shadows": false,
    "dimensions": "valid"
  }
}
```

**Check:** Photo passes with 94% confidence. No issues detected.

### Turn 5

**Goal:** Complete validation and log outcome.

**Plan:** Log photo result. Log validation_complete. Return success.

**Act:**
```
log_event("APP-2026-H8P3Q1", "photo_checked", {
  "pass": true,
  "confidence": 0.94
})

log_event("APP-2026-H8P3Q1", "validation_complete", {
  "total_errors": 0,
  "outcome": "ready_for_officer_review"
})
```

**Observe:**
```json
{ "logged": true, "timestamp": "2026-11-19T09:14:23Z" }
{ "logged": true, "timestamp": "2026-11-19T09:14:23Z" }
```

**Check:** Validation complete. Zero errors. Application ready for officer review queue.

### Outcome

| Field | Result |
|-------|--------|
| **Status** | ✅ Complete |
| **Errors** | 0 |
| **Photo** | Pass (94% confidence) |
| **Action** | Queued for officer review |
| **Duration** | 1.2 seconds |

---

## Test Case 2: Escalate (near age boundary)

### Input

```json
{
  "application_id": "APP-2026-M2K7R9",
  "application_type": "renewal",
  "applicant_type": "child_under_18",
  "single_parent": false,
  "photo_url": "https://storage.example.gov.sg/photos/m2k7r9.jpg",
  "form_data": {
    "child_name": "CHEN WEI LONG",
    "child_nric": "T0812345D",
    "child_dob": "2008-12-21",
    "passport_number": "K11223344E",
    "parent1_name": "CHEN DA WEI",
    "parent1_nric": "S6512345F",
    "parent1_relationship": "father",
    "parent2_name": "ONG SHU FANG",
    "parent2_nric": "S6898765G",
    "parent2_relationship": "mother"
  }
}
```

### Turn 1

**Goal:** Validate the child passport renewal application APP-2026-M2K7R9.

**Plan:**
1. Log validation_started
2. Validate all required fields
3. Check for human checkpoint triggers
4. Check photo quality

**Act:**
```
log_event("APP-2026-M2K7R9", "validation_started", {
  "application_type": "renewal",
  "applicant_type": "child_under_18"
})
```

**Observe:**
```json
{ "logged": true, "timestamp": "2026-11-19T09:18:05Z" }
```

**Check:** Event logged. Proceed to field validation.

### Turn 2

**Goal:** Validate child information fields.

**Plan:** Check child_name, child_nric, child_dob, passport_number.

**Act:**
```
validate_field("child_name", "CHEN WEI LONG", {})
validate_field("child_nric", "T0812345D", {})
validate_field("child_dob", "2008-12-21", {})
validate_field("passport_number", "K11223344E", {})
```

**Observe:**
```json
{ "child_name": { "valid": true } }
{ "child_nric": { "valid": true } }
{ "child_dob": { "valid": true, "age_years": 17, "age_months": 10 } }
{ "passport_number": { "valid": true } }
```

**Check:** ⚠️ Child is 17 years 10 months old. This is close to the 17 years 11 months threshold. Continue validation but flag for review.

### Turn 3

**Goal:** Validate parent/guardian fields.

**Plan:** Check parent NRICs for validity and uniqueness.

**Act:**
```
validate_field("parent1_nric", "S6512345F", { "child_nric": "T0812345D" })
validate_field("parent2_nric", "S6898765G", { "child_nric": "T0812345D", "parent1_nric": "S6512345F" })
```

**Observe:**
```json
{ "parent1_nric": { "valid": true } }
{ "parent2_nric": { "valid": true } }
```

**Check:** Parent fields valid. Proceed to photo check.

### Turn 4

**Goal:** Check photo quality.

**Plan:** Call check_photo service.

**Act:**
```
check_photo("https://storage.example.gov.sg/photos/m2k7r9.jpg")
```

**Observe:**
```json
{
  "pass": true,
  "confidence": 0.88,
  "checks": {
    "face_visible": true,
    "face_centred": true,
    "background": "white",
    "glasses": false,
    "shadows": false,
    "dimensions": "valid"
  }
}
```

**Check:** Photo passes with 88% confidence. No issues.

### Turn 5

**Goal:** Apply human checkpoint rules and complete.

**Plan:** Child is 17 years 10 months — very close to 18. Per CLAUDE.md: "Child's age exactly 17 years 11 months" triggers escalation. At 17y 10m, this is one month away. Escalate to officer with note about age boundary.

**Act:**
```
log_event("APP-2026-M2K7R9", "photo_checked", {
  "pass": true,
  "confidence": 0.88
})

route_to_officer("APP-2026-M2K7R9", "Near age boundary — child turns 18 in 2 months, verify passport validity period covers travel dates", "escalate")

log_event("APP-2026-M2K7R9", "routed_to_officer", {
  "reason": "Near age boundary",
  "priority": "escalate"
})

log_event("APP-2026-M2K7R9", "validation_complete", {
  "total_errors": 0,
  "outcome": "escalated_to_officer"
})
```

**Observe:**
```json
{ "logged": true }
{ "routed": true, "queue_position": 3 }
{ "logged": true }
{ "logged": true, "timestamp": "2026-11-19T09:18:07Z" }
```

**Check:** Application escalated. Officer will verify that the passport validity period (5 years for child, but switches to 10 years at 18) aligns with applicant's needs.

### Outcome

| Field | Result |
|-------|--------|
| **Status** | ⚠️ Escalated |
| **Errors** | 0 |
| **Photo** | Pass (88% confidence) |
| **Reason** | Child age 17y 10m — near adult boundary |
| **Action** | Routed to officer with priority `escalate` |
| **Duration** | 1.8 seconds |

---

## Test Case 3: Refuse (missing required context)

### Input

```json
{
  "application_type": "new",
  "applicant_type": "child_under_18",
  "form_data": {
    "child_name": "WONG KAI XUAN"
  }
}
```

Note: `application_id` is missing.

### Turn 1

**Goal:** Validate the passport application.

**Plan:**
1. Check for required context (application_id, form_data)
2. If missing, log invalid_input and stop

**Act:**
```
// Check input
assert(input.application_id !== undefined, "application_id required")
```

**Observe:**
```
AssertionError: application_id required
```

**Check:** ❌ Stop condition triggered. CLAUDE.md says: "Missing required context — application_id or form_data not provided. Log invalid_input and exit."

### Turn 2

**Goal:** Log the refusal and exit.

**Plan:** Log invalid_input event. Return error to caller. Do not process further.

**Act:**
```
log_event(null, "invalid_input", {
  "error": "application_id missing",
  "received_fields": ["application_type", "applicant_type", "form_data"],
  "missing_fields": ["application_id"]
})
```

**Observe:**
```json
{
  "logged": true,
  "timestamp": "2026-11-19T09:22:31Z",
  "warning": "application_id was null — logged under system audit"
}
```

**Check:** Event logged to system audit trail. Returning error response.

### Turn 3

**Goal:** Return error to caller.

**Plan:** Send structured error response. Do not attempt validation.

**Act:**
```
return {
  "success": false,
  "error": "MISSING_REQUIRED_FIELD",
  "message": "application_id is required but was not provided",
  "action": "none",
  "suggestion": "Retry with a valid application_id from the submission system"
}
```

**Observe:** Response sent to caller.

**Check:** Refused to process. No validation attempted. No data touched.

### Outcome

| Field | Result |
|-------|--------|
| **Status** | ❌ Refused |
| **Errors** | 1 (missing application_id) |
| **Photo** | Not checked |
| **Reason** | Stop condition: missing required context |
| **Action** | Logged and returned error |
| **Duration** | 0.1 seconds |

---

## Summary

| Test | Input | Outcome | Reason |
|------|-------|---------|--------|
| 1 | Valid child renewal | ✅ Complete | All fields valid, photo 94% |
| 2 | Child age 17y 10m | ⚠️ Escalated | Near age boundary |
| 3 | Missing application_id | ❌ Refused | Stop condition triggered |

All three cases followed the agent instructions in CLAUDE.md:
- Case 1 validated all fields and completed normally
- Case 2 triggered a human checkpoint (age boundary) and escalated
- Case 3 hit a stop condition (missing context) and refused to proceed

---

## Rule Change and Rerun

### Problem with Test Case 2

As an ICA officer reviewing this log, I would not trust **Test Case 2**.

The agent escalated a child aged 17 years 10 months, but the rule in CLAUDE.md said:

> Child's age **exactly** 17 years 11 months

This is inconsistent. Either:
1. The agent ignored its own rule (17y 10m ≠ 17y 11m)
2. The rule is too narrow — "exactly" one month is a brittle condition

**Real-world issue:** A child applying at 17y 6m could turn 18 during processing. Child passports have 5-year validity; adult passports have 10-year validity. The officer needs to verify which type to issue based on travel dates.

### Rule Change

**Old rule:**
> Child's age exactly 17 years 11 months → Route with reason "Near age boundary — verify travel dates"

**New rule:**
> Child's age 17 years 6 months or older → Route with reason "Near age boundary — verify passport type and validity period"

This gives a 6-month buffer and clarifies what the officer should check.

---

## Test Case 2 Rerun (with fixed rule)

### Input (same as before)

```json
{
  "application_id": "APP-2026-M2K7R9",
  "application_type": "renewal",
  "applicant_type": "child_under_18",
  "single_parent": false,
  "photo_url": "https://storage.example.gov.sg/photos/m2k7r9.jpg",
  "form_data": {
    "child_name": "CHEN WEI LONG",
    "child_nric": "T0812345D",
    "child_dob": "2008-12-21",
    "passport_number": "K11223344E",
    "parent1_name": "CHEN DA WEI",
    "parent1_nric": "S6512345F",
    "parent1_relationship": "father",
    "parent2_name": "ONG SHU FANG",
    "parent2_nric": "S6898765G",
    "parent2_relationship": "mother"
  }
}
```

### Turn 1

**Goal:** Validate the child passport renewal application APP-2026-M2K7R9.

**Plan:**
1. Log validation_started
2. Validate all required fields
3. Check age against new rule (≥17y 6m)
4. If triggered, escalate with updated reason

**Act:**
```
log_event("APP-2026-M2K7R9", "validation_started", {
  "application_type": "renewal",
  "applicant_type": "child_under_18"
})
```

**Observe:**
```json
{ "logged": true, "timestamp": "2026-11-19T14:32:10Z" }
```

**Check:** Event logged. Proceed to field validation.

### Turn 2

**Goal:** Validate child information fields and check age rule.

**Plan:** Validate fields. Check if child_dob results in age ≥ 17 years 6 months.

**Act:**
```
validate_field("child_name", "CHEN WEI LONG", {})
validate_field("child_nric", "T0812345D", {})
validate_field("child_dob", "2008-12-21", {})
validate_field("passport_number", "K11223344E", {})
```

**Observe:**
```json
{ "child_name": { "valid": true } }
{ "child_nric": { "valid": true } }
{ "child_dob": { "valid": true, "age_years": 17, "age_months": 10 } }
{ "passport_number": { "valid": true } }
```

**Check:** Child is 17 years 10 months. New rule triggers at ≥17y 6m. **Rule triggered.**

### Turn 3

**Goal:** Validate parent fields before escalating.

**Plan:** Complete validation so officer has full picture.

**Act:**
```
validate_field("parent1_nric", "S6512345F", { "child_nric": "T0812345D" })
validate_field("parent2_nric", "S6898765G", { "child_nric": "T0812345D", "parent1_nric": "S6512345F" })
```

**Observe:**
```json
{ "parent1_nric": { "valid": true } }
{ "parent2_nric": { "valid": true } }
```

**Check:** All fields valid. Proceed to photo check.

### Turn 4

**Goal:** Check photo quality.

**Plan:** Call check_photo. Include result in escalation.

**Act:**
```
check_photo("https://storage.example.gov.sg/photos/m2k7r9.jpg")
```

**Observe:**
```json
{
  "pass": true,
  "confidence": 0.88,
  "checks": {
    "face_visible": true,
    "face_centred": true,
    "background": "white",
    "glasses": false,
    "shadows": false,
    "dimensions": "valid"
  }
}
```

**Check:** Photo passes. Now escalate with complete information.

### Turn 5

**Goal:** Escalate to officer with new reason.

**Plan:** Route with updated reason that specifies what officer should verify.

**Act:**
```
log_event("APP-2026-M2K7R9", "photo_checked", {
  "pass": true,
  "confidence": 0.88
})

route_to_officer("APP-2026-M2K7R9", "Near age boundary — verify passport type and validity period. Child is 17y 10m, will turn 18 on 2026-12-21. Confirm if child (5-year) or adult (10-year) passport is appropriate for applicant's travel plans.", "escalate")

log_event("APP-2026-M2K7R9", "routed_to_officer", {
  "reason": "Age ≥17y 6m triggers checkpoint",
  "priority": "escalate",
  "age_at_application": "17y 10m",
  "18th_birthday": "2026-12-21"
})

log_event("APP-2026-M2K7R9", "validation_complete", {
  "total_errors": 0,
  "outcome": "escalated_to_officer",
  "checkpoint_triggered": "age_boundary"
})
```

**Observe:**
```json
{ "logged": true }
{ "routed": true, "queue_position": 5 }
{ "logged": true }
{ "logged": true, "timestamp": "2026-11-19T14:32:12Z" }
```

**Check:** Escalated with clear guidance. Officer knows:
- Child's exact age (17y 10m)
- When child turns 18 (2026-12-21)
- What decision to make (passport type and validity)

### Outcome (Rerun)

| Field | Result |
|-------|--------|
| **Status** | ⚠️ Escalated |
| **Errors** | 0 |
| **Photo** | Pass (88% confidence) |
| **Rule triggered** | Age ≥17y 6m (new threshold) |
| **Reason** | "Verify passport type and validity period" (more specific) |
| **Action** | Routed to officer with priority `escalate` |
| **Duration** | 1.9 seconds |

### What changed

| Before | After |
|--------|-------|
| Rule: "exactly 17y 11m" | Rule: "17y 6m or older" |
| Reason: "verify travel dates" | Reason: "verify passport type and validity period" |
| Agent stretched the rule to cover 17y 10m | Agent correctly applies threshold |
| Officer unclear on what to check | Officer knows to decide child vs adult passport |

The rerun is now **consistent** with the rule and **actionable** for the officer.
