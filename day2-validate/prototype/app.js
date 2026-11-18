// Prototype: Passport Application Triage (Step 1)
// All data is MADE UP for testing purposes

const GUIDANCE = {
    adult: "Adults (18+) can apply on their own behalf. You will need your NRIC and a recent photo.",
    child: "For children under 18, a parent or legal guardian (21+) must submit the application and provide consent. (Made-up rule)"
};

const APPLICATION_GUIDANCE = {
    new: "First-time applicants need a birth certificate or citizenship certificate. (Made-up rule)",
    renewal: "For renewals, have your current passport ready. It can be expired. (Made-up rule)"
};

// Made-up requirements for each path
const REQUIREMENTS = {
    "adult-new": [
        "NRIC (front and back)",
        "Recent passport photo (white background)",
        "Birth certificate or citizenship certificate",
        "Processing fee: $70 (made-up)"
    ],
    "adult-renewal": [
        "NRIC (front and back)",
        "Recent passport photo (white background)",
        "Current or expired passport",
        "Processing fee: $70 (made-up)"
    ],
    "child-new": [
        "Child's birth certificate",
        "Recent passport photo of child (white background)",
        "Both parents' NRICs",
        "Consent form signed by both parents",
        "Processing fee: $70 (made-up)"
    ],
    "child-renewal": [
        "Child's current or expired passport",
        "Recent passport photo of child (white background)",
        "Both parents' NRICs",
        "Consent form signed by both parents",
        "Processing fee: $70 (made-up)"
    ]
};

// DOM elements
const form = document.getElementById('triage-form');
const applicantRadios = document.querySelectorAll('input[name="applicant-type"]');
const applicationRadios = document.querySelectorAll('input[name="application-type"]');
const applicantGuidance = document.getElementById('applicant-guidance');
const applicationGuidance = document.getElementById('application-guidance');
const previewBox = document.getElementById('preview-box');
const requirementsList = document.getElementById('requirements-list');
const nextBtn = document.getElementById('next-btn');

// Track selections
let applicantType = null;
let applicationType = null;

// Update guidance when applicant type changes
applicantRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        applicantType = e.target.value;
        applicantGuidance.textContent = GUIDANCE[applicantType];
        updatePreview();
    });
});

// Update guidance when application type changes
applicationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        applicationType = e.target.value;
        applicationGuidance.textContent = APPLICATION_GUIDANCE[applicationType];
        updatePreview();
    });
});

// Update preview box and enable/disable button
function updatePreview() {
    if (applicantType && applicationType) {
        const key = `${applicantType}-${applicationType}`;
        const requirements = REQUIREMENTS[key];

        requirementsList.innerHTML = requirements
            .map(req => `<li>${req}</li>`)
            .join('');

        previewBox.style.display = 'block';
        nextBtn.disabled = false;
    } else {
        previewBox.style.display = 'none';
        nextBtn.disabled = true;
    }
}

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // In a real app, this would navigate to Step 2
    // For this prototype, we just show an alert
    alert(
        `Triage complete!\n\n` +
        `Applicant: ${applicantType}\n` +
        `Type: ${applicationType}\n\n` +
        `Next step would show the form fields for "${applicantType} ${applicationType}" path.\n\n` +
        `(This is where Step 2 would begin - not built yet)`
    );
});
