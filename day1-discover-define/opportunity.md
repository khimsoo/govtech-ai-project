# Opportunity: ensure all submissions are accurate and according to the guideline

**Scenario:** B · ICA passport applications

All quotes and metrics are synthetic and labelled as made up.

## Problem Framework

### 1. Goal

The goal is to ensure all submissions can be processed efficiently by the backend officers, by reducing errors in submission.

### 2. Problem

Currently, ICA received 520000 applications per annum.  65% are using online submission and there are 17% error rate, and each error could cost 6 days of delay.  38% of  read the guideline before they apply. Most returns could have been avoided before submission. Applicants did not know what a complete application looked like for their situation. Parents renewing for a child were the most confused group.

### 3. Context

ICA back office staff reviewing the applications and rejects whenever there are error or missing documents

### 4. Constraints

Applications contain identity documents and sensitive personal data. Final decisions stay with ICA officers. Whatever replaces the channel must be clear about what officers decide versus what the system only suggests, and must stay accurate as rules change.

### 5. Success

pass if 100% of the applications are complete according to the guideline, validated with all required documents

### 6. Explore

1. Will validation and just in time guideline with each field reduce error ? 
2. can i automate all the checks in the guideline? 
3. Is it a language barrier? do i need to handle multiple language?

## Evidence (synthetic)

### User quotes

- i am busy parent with children, and no time to review all the guideline before i apply. I do not know what is a complete application looks like and i just try to apply

### Metrics

- approval time for passport submission

## Hypothesis

1) Incorporating validation in the application form will reduce error and improve approval for passport.

- Risk type: Feasibility (build a functional app first)
- Kill switch: applicants get stuck in the process
- Kill-switch signal: applicants stuck in one page for more than 2 minutes
- Success signal: 9 of 10 applications are approved without error for 1 month
