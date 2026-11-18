# Handoff Note

Prototype: ICA Passport Application (Scenario B)  
Date: 18 Nov 2026  
Status: Ready for handoff decision

---

## What it does

A passport application prototype with two portals:

1. **Applicant portal** — A 3-step form that asks triage questions, shows only the relevant fields, validates input as you type, and blocks submission until everything is correct.

2. **Officer portal** — A review queue where officers can approve, reject, or escalate applications. They edit a draft reply before sending.

The core idea: catch errors at the point of input instead of rejecting applications days later.

---

## What is synthetic

Everything. No real data was used.

| Item | Synthetic example |
|------|-------------------|
| Applicant names | Tan Wei Ming, Lim Ah Kow |
| NRIC numbers | S1234567A, T0012345B |
| Passport numbers | K12345678A |
| Policy rules | "Child must be under 18", "NRIC format X1234567X" |
| AI photo confidence | Random number between 0.65–0.98 |
| Collection dates | Hard-coded to "25 Nov 2024" |
| Officer queue | 3 applications baked into HTML |

The validation rules (NRIC regex, age check, required fields) are realistic but not official ICA rules.

---

## What is missing for production

| Category | Gap |
|----------|-----|
| **Backend** | No server, no database. Everything runs in the browser with localStorage. |
| **Authentication** | No Singpass. Anyone can access either portal. |
| **File upload** | Buttons exist but are disabled. Photos cannot actually be uploaded. |
| **AI photo check** | Simulated with `Math.random()`. No real model. |
| **Notifications** | No email or SMS. The "sent" reply goes nowhere. |
| **Audit trail** | No logging. Officer actions are not recorded. |
| **Accessibility** | Not tested with screen readers or keyboard-only. |
| **Tests** | No unit tests, no integration tests, no E2E tests. |

---

## Decisions an engineer must not change without asking

These were tested with users or reflect policy constraints:

| Decision | Why it matters |
|----------|----------------|
| **Triage first, form second** | Asking "who are you applying for?" and "new or renewal?" upfront lets us hide 40% of fields. Removing this puts users back in the all-fields-at-once confusion. |
| **Validation on blur, not keystroke** | Users found keystroke validation ("Name is required!") annoying while still typing. Blur gives them time to finish. |
| **Progress bar counts valid fields** | Saying "7 of 10 complete" motivates. Changing to steps or percentages needs new user testing. |
| **Single-parent checkbox disables fields** | Not just hides — disables. This prevents accidental re-enabling and makes it clear the fields are skipped. |
| **Officer must review draft before send** | Legal requirement: officer sees exactly what the applicant will receive. No auto-send. |
| **Labels match across portals** | "Parent/Guardian 1" in the form = "Parent/Guardian 1" in officer view = "Parent/Guardian 1" in the reply. Changing any breaks the chain. |
| **Cannot send reply with placeholders** | `[Officer: enter date]` must be filled. This catches mistakes before the applicant sees a broken message. |

---

## Handoff decision

**My recommendation: Move to production spec.**

### Why now

1. **The riskiest assumption was tested.** We believed that just-in-time guidance (showing help next to the field you're filling, not a wall of text upfront) would reduce confusion. The prototype proves the UX is feasible. The question is now whether it moves metrics, which needs real traffic.

2. **The prototype is feature-complete for the happy path.** Triage → Form → Review → Submit works. Officer approve/reject/escalate works. The gaps (backend, auth, file upload) are engineering work, not design questions.

3. **Staying in prototype risks polish over learning.** We could add animations, better error messages, mobile layout. But none of that answers "does this reduce the 17% error rate?" Only production data will.

4. **The fragile parts are fixed.** Step 3 is built. Code is modular. An engineer can inherit this without untangling a monolith.

### What the spec should cover

- API contract for validation rules (so backend and frontend stay in sync)
- Singpass integration pattern
- AI photo service interface (even if MVP uses a simple rule-based check)
- Telemetry for the stop line: "stuck >2 min on one field"

### What to keep prototyping

If moving to spec feels too early, the next prototype should test:

- Mobile layout (60% of applicants are on phones — we only built desktop)
- Actual file upload flow (where does the photo go? how big? what formats?)
- Escalation path (what does the supervisor see?)

But I believe we learn more from a small production pilot than from more prototypes.

---

## Files to hand off

```
day2-validate/
├── prototype/
│   ├── index.html        — Applicant portal
│   ├── js/               — Modular JS (7 files)
│   ├── styles.css        — Shared styles
│   ├── officer.html      — Officer portal
│   ├── officer.js        — Officer logic
│   └── officer.css       — Officer styles
├── living-prd.md         — What's built, what's not, what to preserve
├── PROMPTS.md            — AI prompts used and their results
└── handoff-note.md       — This file
```
