# Living PRD

Extracted from day2-validate/prototype code. All data is synthetic.

## Prototype notes

| Type | Note |
|------|------|
| **Solid** | Edge case handling — empty reply blocked, placeholder check, single-parent toggle |
| **Fragile** | Step 3 missing — "Review" step shown in progress bar but not built |
| **Surprise** | No tests — no unit or integration tests |

---

## 1. Product overview

**What it is:** A passport application prototype for ICA that provides just-in-time guidance and validation to reduce submission errors.

**Two portals:**
- **Applicant portal** (index.html) — Form with triage routing, inline validation, progress tracking
- **Officer portal** (officer.html) — Review queue with approve/reject/escalate actions, draft reply editing

**Core idea:** Move validation to the point of input. Instead of rejecting applications days later, block errors before submission.

---

## 2. Problem and riskiest assumption

**Problem (from code context):**
- 520,000 applications per year, 65% online
- 17% error rate, each error causes 6-day delay
- Only 38% read guidelines before applying
- Parents renewing for a child are the most confused group

**Riskiest assumption:**
> Showing field-specific guidance at the moment of input will reduce errors more than front-loading all guidelines.

**How prototype tests this:**
- Triage questions adapt the form to the applicant's situation
- Guidance text appears next to each field as they fill it
- Validation blocks proceed until fields are correct

---

## 3. User flow and screen map

```
APPLICANT FLOW
==============
Step 1: Triage
├── Who are you applying for? (myself / on behalf)
│   └── [if on behalf] Child under 18 / Another adult
├── What type? (new / renewal)
├── "What you'll need" checklist appears
└── [Next] → Step 2

Step 2: Fill details (child renewal path built)
├── Child's Information
│   ├── Full name (CAPITALS required)
│   ├── NRIC/Birth Cert No. (format: X1234567X)
│   ├── Date of birth (must be under 18)
│   └── Current passport number
├── Parent/Guardian 1 (name, NRIC, relationship)
├── Parent/Guardian 2 (or single-parent checkbox)
├── Documents (upload placeholders)
├── Progress bar: "X of 10 fields complete"
└── [Next: Review] → Step 3 (NOT BUILT)

Step 3: Review (NOT BUILT)
└── Shows in progress bar but no screen exists

ERROR STATE
├── System error modal appears
├── Progress saved to localStorage
└── "Try again another day" message


OFFICER FLOW
============
Officer Review Portal
├── Pending Applications queue (badge count)
│   ├── Application card with summary
│   ├── Validation results (pass/warn)
│   └── Action buttons: Approve / Reject / Escalate
├── Draft Reply (editable before send)
│   ├── Template with placeholders
│   ├── Child's name and collection date included
│   └── Cannot send empty or with [Officer:...] placeholders
└── Sent Replies log
```

---

## 4. Success metrics

**From one-pager.md — what the prototype should move:**

| Metric | Baseline | Target | How prototype supports |
|--------|----------|--------|------------------------|
| Application error rate | 17% | <8% | Inline validation blocks bad input |
| Photo rejections | TBD | 50% reduction | AI photo check (simulated) |
| Time to complete | TBD | <5 min | Triage reduces fields shown |
| Stuck >2 min on one field | TBD | <5% | Just-in-time guidance |

**Stop line:** >10% stuck on one page for >2 minutes → revert to simpler validation

---

## 5. Technical reality

### What's actually built

| Component | Status | Implementation |
|-----------|--------|----------------|
| Triage routing | ✅ Built | 6 paths: myself/child/adult × new/renewal |
| Field validation | ✅ Built | 10 validators with regex, age check, cross-field |
| Progress tracking | ✅ Built | Counts valid fields, updates progress bar |
| Just-in-time guidance | ✅ Built | Text appears on selection/focus |
| Single-parent toggle | ✅ Built | Disables parent 2 fields, adjusts validation |
| Error modal | ✅ Built | Shows on service failure, saves progress |
| Save/load progress | ✅ Built | localStorage with timestamp |
| Officer review queue | ✅ Built | 3 synthetic applications |
| Draft reply editing | ✅ Built | Templates with placeholders |
| Batch applications | ✅ Built | Collated collection dates |

### What's not built

| Component | Status | Notes |
|-----------|--------|-------|
| Step 3: Review | ❌ Missing | Progress bar shows it, no screen |
| Backend/API | ❌ None | All client-side localStorage |
| Authentication | ❌ None | No Singpass integration |
| Real AI photo check | ❌ Simulated | Math.random() confidence scores |
| File upload | ❌ Placeholder | Buttons disabled |
| Database | ❌ None | Hard-coded synthetic data |
| Tests | ❌ None | No unit or integration tests |

### Code structure

```
day2-validate/prototype/
├── index.html     (17KB) — Applicant form, steps 1-2
├── app.js         (24KB) — All applicant logic in one file
├── styles.css     (8KB)  — Shared styles
├── officer.html   (14KB) — Officer portal, 3 applications
├── officer.js     (7KB)  — Officer actions
├── officer.css    (5KB)  — Officer-specific styles
└── README.md      (1KB)  — Setup instructions
```

---

## 6. Assumptions and risks

### Assumptions baked into prototype

1. **Triage reduces confusion** — Asking 2-3 questions upfront lets us hide irrelevant fields
2. **Inline validation is not annoying** — Showing errors on blur, not on every keystroke
3. **Officers want to edit replies** — Draft appears, officer can change before send
4. **Single-parent is common enough** — Deserves its own checkbox and flow
5. **Batch submissions happen** — Same parent, multiple children

### Risks exposed by prototype

| Risk | Evidence in code | Mitigation |
|------|------------------|------------|
| **Scope creep** | 6 applicant paths × officer actions = complexity | Only child-renewal path fully built |
| **Hard-coded data** | 3 applications baked into HTML | Would need API for real system |
| **No escape hatch** | If validation is wrong, user is stuck | Need "Request officer review" button |
| **Date brittleness** | "18 Nov 2024" hard-coded | Would break in production |

---

## 7. In and out of scope

### In scope (prototype proves)

- [x] Triage questions adapt the form
- [x] Field-level validation with specific error messages
- [x] Progress indicator shows completion
- [x] Just-in-time guidance next to fields
- [x] Single-parent exception handling
- [x] Officer can approve/reject/escalate
- [x] Officer edits reply before sending
- [x] Batch applications with collated dates
- [x] System error saves progress

### Out of scope (not in prototype)

- [ ] Singpass authentication
- [ ] Real backend and database
- [ ] AI photo validation (only simulated)
- [ ] File uploads
- [ ] Step 3: Review summary
- [ ] Email/SMS notifications
- [ ] Payment processing
- [ ] Audit trail
- [ ] Multiple languages
- [ ] Accessibility testing

---

## 8. Engineering recommendation

### To inherit this prototype

1. **Use it for UX reference, not as a codebase** — The validation rules, field labels, and flow are the value. The code structure (monolithic JS, inline handlers, hard-coded data) should not carry forward.

2. **Extract the validation rules** — `VALIDATORS` object in app.js contains the real logic. Port these to your backend validation layer.

3. **Keep the guidance text** — `APPLICANT_GUIDANCE`, `BEHALF_GUIDANCE`, `APPLICATION_GUIDANCE`, `REQUIREMENTS` objects are the content. Move to a CMS or config file.

4. **Build Step 3 first** — It's shown in the UI but missing. Users will expect it.

5. **Add tests before adding features** — No test coverage means any change could break validation logic silently.

### Rebuild priorities

| Priority | What | Why |
|----------|------|-----|
| 1 | Backend API with validation | Can't ship client-side only |
| 2 | Step 3: Review screen | Promised in UI |
| 3 | Real authentication | Singpass required |
| 4 | Test suite | Validation logic is critical |
| 5 | AI photo integration | After core flow works |

### What to preserve

- **Label consistency** — Form labels match officer portal and email replies exactly
- **Validation UX** — Errors on blur, green/red borders, progress bar
- **Single-parent flow** — Checkbox disables fields and adjusts validation
- **Draft reply pattern** — Officer always reviews before send
