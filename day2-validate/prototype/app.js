// Prototype: Passport Application (Steps 1 & 2)
// All data is MADE UP for testing purposes

// ==================== STEP 1: TRIAGE ====================

const GUIDANCE = {
    adult: "Adults (18+) can apply on their own behalf. You will need your NRIC and a recent photo.",
    child: "For children under 18, a parent or legal guardian (21+) must submit the application and provide consent. (Made-up rule)"
};

const APPLICATION_GUIDANCE = {
    new: "First-time applicants need a birth certificate or citizenship certificate. (Made-up rule)",
    renewal: "For renewals, have your current passport ready. It can be expired. (Made-up rule)"
};

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

// Step 1 DOM elements
const triageForm = document.getElementById('triage-form');
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

// Handle Step 1 form submission - go to Step 2
triageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // For prototype, we only show Step 2 for child renewal
    if (applicantType === 'child' && applicationType === 'renewal') {
        showStep2();
    } else {
        alert(
            `Path: ${applicantType} ${applicationType}\n\n` +
            `This prototype only includes the "child renewal" path (the most confused user group).\n\n` +
            `Please select Child + Renewal to continue.`
        );
    }
});

function showStep2() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    window.scrollTo(0, 0);
}

function showStep1() {
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    window.scrollTo(0, 0);
}

// Back button
document.getElementById('back-to-step1').addEventListener('click', showStep1);


// ==================== STEP 2: FORM VALIDATION ====================

// Validation rules (all made up)
const VALIDATORS = {
    'child-name': {
        validate: (value) => {
            if (!value.trim()) return { valid: false, error: 'Name is required' };
            if (value !== value.toUpperCase()) return { valid: false, error: 'Please use CAPITAL LETTERS' };
            if (value.length < 2) return { valid: false, error: 'Name is too short' };
            return { valid: true };
        }
    },
    'child-nric': {
        validate: (value) => {
            if (!value.trim()) return { valid: false, error: 'NRIC/Birth Cert No. is required' };
            const pattern = /^[A-Z]\d{7}[A-Z]$/;
            if (!pattern.test(value.toUpperCase())) {
                return { valid: false, error: 'Format: 1 letter, 7 digits, 1 letter (e.g. T1234567A)' };
            }
            return { valid: true };
        }
    },
    'child-dob': {
        validate: (value) => {
            if (!value) return { valid: false, error: 'Date of birth is required' };
            const dob = new Date(value);
            const today = new Date();
            const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            if (age >= 18) return { valid: false, error: 'Child must be under 18 years old' };
            if (age < 0) return { valid: false, error: 'Date cannot be in the future' };
            return { valid: true };
        }
    },
    'current-passport': {
        validate: (value) => {
            if (!value.trim()) return { valid: false, error: 'Current passport number is required' };
            const pattern = /^[A-Z]\d{7}[A-Z]$/;
            if (!pattern.test(value.toUpperCase())) {
                return { valid: false, error: 'Format: 1 letter, 7 digits, 1 letter (e.g. E1234567A)' };
            }
            return { valid: true };
        }
    },
    'parent1-name': {
        validate: (value) => {
            if (!value.trim()) return { valid: false, error: 'Name is required' };
            if (value !== value.toUpperCase()) return { valid: false, error: 'Please use CAPITAL LETTERS' };
            return { valid: true };
        }
    },
    'parent1-nric': {
        validate: (value) => {
            if (!value.trim()) return { valid: false, error: 'NRIC is required' };
            const pattern = /^[A-Z]\d{7}[A-Z]$/;
            if (!pattern.test(value.toUpperCase())) {
                return { valid: false, error: 'Format: 1 letter, 7 digits, 1 letter (e.g. S1234567A)' };
            }
            return { valid: true };
        }
    },
    'parent1-relationship': {
        validate: (value) => {
            if (!value) return { valid: false, error: 'Please select relationship' };
            return { valid: true };
        }
    },
    'parent2-name': {
        validate: (value, formData) => {
            if (formData.singleParent) return { valid: true }; // Skip if single parent
            if (!value.trim()) return { valid: false, error: 'Name is required' };
            if (value !== value.toUpperCase()) return { valid: false, error: 'Please use CAPITAL LETTERS' };
            return { valid: true };
        }
    },
    'parent2-nric': {
        validate: (value, formData) => {
            if (formData.singleParent) return { valid: true }; // Skip if single parent
            if (!value.trim()) return { valid: false, error: 'NRIC is required' };
            const pattern = /^[A-Z]\d{7}[A-Z]$/;
            if (!pattern.test(value.toUpperCase())) {
                return { valid: false, error: 'Format: 1 letter, 7 digits, 1 letter (e.g. S7654321B)' };
            }
            // Check not same as parent 1
            if (value.toUpperCase() === formData.parent1Nric?.toUpperCase()) {
                return { valid: false, error: 'Cannot be the same as Parent 1 NRIC' };
            }
            return { valid: true };
        }
    },
    'parent2-relationship': {
        validate: (value, formData) => {
            if (formData.singleParent) return { valid: true }; // Skip if single parent
            if (!value) return { valid: false, error: 'Please select relationship' };
            return { valid: true };
        }
    }
};

// Track field states
const fieldStates = {};
const TOTAL_FIELDS = 10;

// Get form data for cross-field validation
function getFormData() {
    return {
        singleParent: document.getElementById('single-parent')?.checked || false,
        parent1Nric: document.getElementById('parent1-nric')?.value || ''
    };
}

// Validate a single field
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    const validator = VALIDATORS[fieldId];

    if (!field || !validator) return true;

    const formData = getFormData();
    const result = validator.validate(field.value, formData);

    // Update field styling
    field.classList.remove('valid', 'invalid');
    if (field.value.trim() || field.tagName === 'SELECT') {
        field.classList.add(result.valid ? 'valid' : 'invalid');
    }

    // Update error message
    if (errorEl) {
        errorEl.textContent = result.valid ? '' : result.error;
    }

    // Track state
    fieldStates[fieldId] = result.valid;

    updateProgress();
    return result.valid;
}

// Update progress bar
function updateProgress() {
    const formData = getFormData();
    const fieldsToCheck = formData.singleParent
        ? ['child-name', 'child-nric', 'child-dob', 'current-passport', 'parent1-name', 'parent1-nric', 'parent1-relationship']
        : Object.keys(VALIDATORS);

    const complete = fieldsToCheck.filter(id => fieldStates[id] === true).length;
    const total = fieldsToCheck.length;
    const percent = Math.round((complete / total) * 100);

    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('fields-complete').textContent = complete;
    document.getElementById('fields-total').textContent = total;

    // Enable review button if all fields valid
    const reviewBtn = document.getElementById('review-btn');
    reviewBtn.disabled = complete < total;
}

// Attach validation to all fields
Object.keys(VALIDATORS).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        // Validate on blur (when user leaves field)
        field.addEventListener('blur', () => validateField(fieldId));

        // Also validate on input for immediate feedback
        field.addEventListener('input', () => {
            // Only show validation after user has typed something
            if (field.value.trim()) {
                validateField(fieldId);
            }
        });

        // For select elements, validate on change
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', () => validateField(fieldId));
        }
    }
});

// Single parent checkbox - show/hide guidance and revalidate
const singleParentCheckbox = document.getElementById('single-parent');
const singleParentGuidance = document.getElementById('single-parent-guidance');
const parent2Fields = ['parent2-name', 'parent2-nric', 'parent2-relationship'];

singleParentCheckbox?.addEventListener('change', () => {
    const isChecked = singleParentCheckbox.checked;

    // Show/hide guidance
    if (singleParentGuidance) {
        singleParentGuidance.style.display = isChecked ? 'block' : 'none';
    }

    // Update parent 2 fields styling
    parent2Fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (isChecked) {
                field.classList.remove('invalid');
                field.classList.add('valid');
                field.disabled = true;
                field.style.opacity = '0.5';
                fieldStates[fieldId] = true;
                const errorEl = document.getElementById(`${fieldId}-error`);
                if (errorEl) errorEl.textContent = '';
            } else {
                field.disabled = false;
                field.style.opacity = '1';
                field.classList.remove('valid');
                fieldStates[fieldId] = false;
            }
        }
    });

    updateProgress();
});

// Handle Step 2 form submission
const detailsForm = document.getElementById('details-form');
detailsForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const formData = getFormData();
    const fieldsToCheck = formData.singleParent
        ? ['child-name', 'child-nric', 'child-dob', 'current-passport', 'parent1-name', 'parent1-nric', 'parent1-relationship']
        : Object.keys(VALIDATORS);

    let allValid = true;
    const errors = [];

    fieldsToCheck.forEach(fieldId => {
        const isValid = validateField(fieldId);
        if (!isValid) {
            allValid = false;
            const field = document.getElementById(fieldId);
            const label = field?.closest('.form-group')?.querySelector('label')?.textContent || fieldId;
            const errorEl = document.getElementById(`${fieldId}-error`);
            errors.push(`${label}: ${errorEl?.textContent || 'Invalid'}`);
        }
    });

    // Show validation summary if errors
    const summaryEl = document.getElementById('validation-summary');
    const errorListEl = document.getElementById('error-list');

    if (!allValid) {
        errorListEl.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
        summaryEl.style.display = 'block';
        summaryEl.scrollIntoView({ behavior: 'smooth' });
    } else {
        summaryEl.style.display = 'none';

        // Success - show confirmation (Step 3 not built)
        alert(
            `✓ All fields validated!\n\n` +
            `In the full prototype, this would show Step 3: Review.\n\n` +
            `The review screen would display:\n` +
            `• Summary of all entered data\n` +
            `• Checklist of what the officer will verify\n` +
            `• Final submit button\n\n` +
            `(Step 3 not built yet)`
        );
    }
});
