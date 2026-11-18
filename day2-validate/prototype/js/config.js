// Configuration and guidance data (all made-up)
// Shared across modules

const CONFIG = {
    // Guidance for "who are you applying for"
    APPLICANT_GUIDANCE: {
        myself: "You will need your NRIC and a recent passport photo. Processing takes 4-6 working days. (Made-up rule)",
        onbehalf: "Please select who you are applying on behalf of. Different documents are required depending on the person. (Made-up rule)"
    },

    // Guidance for "on behalf of who"
    BEHALF_GUIDANCE: {
        child: "For children under 18, both parents must consent. You will need the child's birth certificate and both parents' NRICs. (Made-up rule)",
        adult: "You will need a letter of authorisation and the applicant's NRIC. The applicant must sign the photo. (Made-up rule)"
    },

    // Guidance for application type
    APPLICATION_GUIDANCE: {
        new: {
            myself: "First-time applicants need a birth certificate or citizenship certificate. (Made-up rule)",
            child: "First-time child applicants need a birth certificate. Both parents must be present or provide notarised consent. (Made-up rule)",
            adult: "First-time applications on behalf require additional identity verification. (Made-up rule)"
        },
        renewal: {
            myself: "Have your current passport ready. It can be expired up to 2 years. (Made-up rule)",
            child: "Have the child's current passport ready. It can be expired. Both parents must consent. (Made-up rule)",
            adult: "Have the current passport ready. The applicant must sign the application form. (Made-up rule)"
        }
    },

    // Requirements for each path
    REQUIREMENTS: {
        "myself-new": [
            "NRIC (front and back)",
            "Recent passport photo (white background)",
            "Birth certificate or citizenship certificate",
            "Processing fee: $70 (made-up)"
        ],
        "myself-renewal": [
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
        ],
        "adult-new": [
            "Applicant's NRIC (front and back)",
            "Recent passport photo (signed by applicant)",
            "Birth certificate or citizenship certificate",
            "Letter of authorisation",
            "Your NRIC (as representative)",
            "Processing fee: $70 (made-up)"
        ],
        "adult-renewal": [
            "Applicant's NRIC (front and back)",
            "Recent passport photo (signed by applicant)",
            "Current or expired passport",
            "Letter of authorisation",
            "Your NRIC (as representative)",
            "Processing fee: $70 (made-up)"
        ]
    },

    // Field labels for display
    FIELD_LABELS: {
        'child-name': "Child's full name",
        'child-nric': "Child's NRIC / Birth Certificate No.",
        'child-dob': "Child's date of birth",
        'current-passport': "Current passport number",
        'parent1-name': "Parent / Guardian 1 name",
        'parent1-nric': "Parent / Guardian 1 NRIC",
        'parent1-relationship': "Parent / Guardian 1 relationship",
        'parent2-name': "Parent / Guardian 2 name",
        'parent2-nric': "Parent / Guardian 2 NRIC",
        'parent2-relationship': "Parent / Guardian 2 relationship"
    }
};
