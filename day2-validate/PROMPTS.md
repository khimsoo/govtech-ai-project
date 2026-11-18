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

**Result:**
- **Worked:** Officer portal with 3 pending applications, approve/reject/escalate buttons, draft reply editing before send, batch application with collated collection dates, empty reply blocked with alert, placeholder text check prevents incomplete replies
- **Broke:** Nothing major. Minor: validation results hard-coded rather than dynamic

## 2. Behavior

**Prompt:** when validation or AI fails, it should inform users and inform them to re-try another day

**Forced failure:** when policy returns nothing or error, it should not allow user to submit but save their progress so that they can resume

**Business rules:**
- do not proceed to next section unless previous section is completed
- do not auto reply unless users triggered

**Edge cases:**
- when rules or ai return error, it should bock them from processing but save their progress

**Result:**
- **Worked:** Error modal shows "System Temporarily Unavailable" with specific message, progress saved to localStorage with timestamp, test controls bar triggers policy/AI failures, modal shows "try again another day" and saved timestamp
- **Broke:** Modal z-index needed adjustment to appear over form. Fixed by ensuring modal-overlay has position:fixed and z-index:1000

## 3. Refine

**Prompt:** ensure all labels are consistently applied; and in the email reply, use the same label

**Business rules:**
- if the fields are empty, stop the job

**Edge cases:**
- Empty fields already handled by existing validation

**Result:**
- **Worked:** Labels now match exactly across application form, officer portal, and email replies. Child's name included in all reply templates. Batch application labels also updated.
- **Broke:** Nothing. Straightforward find-and-replace update.
