# Prompt chain

**Scenario:** B · ICA passport applications
**Prototype today:** providing bitesize guideline just in time to reduce error in application process and include AI photo review to ensure the photo quality meets the criteria

All data is synthetic and labelled as made up.

## 1. Expand

**Prompt:** enable internal officers review and approve, reject or escalate the use case
allow applicant to submit multiple application at one time

**Business rules:**
- never send a reply without officer action
- draft reply to applicant and allow them to edit before reply.
- if its approved, it should include the collection date, collate the collection date if applicant has mutlple application

**Edge cases:**
- cannot submit empty forms and ensure everything is checked

**Result:** _fill in after you run it: what worked, what broke._

## 2. Behavior

**Prompt:** when validation or AI fails, it should inform users and inform them to re-try another day

**Forced failure:** when policy returns nothing or error, it should not allow user to submit but save their progress so that they can resume

**Business rules:**
- do not proceed to next section unless previous section is completed
- do not auto reply unless users triggered

**Edge cases:**
- when rules or ai return error, it should bock them from processing but save their progress

**Result:** _fill in after you run it: what worked, what broke._

## 3. Refine

**Prompt:** ensure all labels are consistently applied; and in the email reply, use the same label

**Business rules:**
- if the fields are empty, stop the job

**Edge cases:**

**Result:** _fill in after you run it: what worked, what broke._
