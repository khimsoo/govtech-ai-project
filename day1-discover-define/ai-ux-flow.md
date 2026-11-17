# AI user flow: the applicant access the passport application form

**Scenario:** B · ICA passport applications

All data in this file is synthetic.

## The moment

the applicant access the passport application form

## The iceberg

### Above the line: what the user sees

Application fields for them to submit their particulars and documents for passport application

### Below the line

- Data: Existing data on the policy and applicant information, e.g. citizenship, existing passport and expiry dates, dependencies
- Model: An AI model that helps to assess the completeness and accuracy of each field. it should provide the related guideline and rules.
- Rules: policy for passports - every citizen is allowed to have 1 passport at any time. For child under age 18, they must have a parent or guardian above 20 years old.
- Handoffs: allow low-confidence cases that are stuck for long time to be handled by officers in the counter service

## The flow

1. **Trigger:** A citizen applying for their passord
   - Trust gap: none
2. **AI step:** based on their profile, triage and direct users to the right flow. when applicant is stuck for more than 30s on one field, offer guideline to help them. track all actions to determine the fields that most users go stuck so that i can improve the product to speed up the time to passport approval
   - Trust gap: Hallucination. Do not add or edit data on behalf of applicant
3. **Human check:** AI should highlight fields that are low-confident so that the error can be reduced
   - Trust gap: Black box. Enable officers to quickly pinpoint the error
4. **Outcome:** Applicant can submit their passport application within 5mins with 0 zero and 95% approved within 1 day
   - Trust gap: Control. The officer cannot undo an AI change to their own wording.

## Fallback when the AI is unsure (Advanced)

Below the confidence threshold, save draft and escalate to backoffice officers to help

## How we measure trust (Expert)

Accept-as-is rate: the share of drafts officers send without edits, checked weekly. Target: 95% cleared within a day, and provide feedback to officers how to improve the design of guideline and models to speed up time to approval
