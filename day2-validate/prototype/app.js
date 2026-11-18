// Prototype: Passport Application (Steps 1 & 2)
// All data is MADE UP for testing purposes

// ==================== STEP 1: TRIAGE ====================

// Guidance for "who are you applying for" (made-up rules)
const APPLICANT_GUIDANCE = {
    myself: "You will need your NRIC and a recent passport photo. Processing takes 4-6 working days. (Made-up rule)",
    onbehalf: "Please select who you are applying on behalf of. Different documents are required depending on the person. (Made-up rule)"
};

// Guidance for "on behalf of who" (made-up rules)
const BEHALF_GUIDANCE = {
    child: "For children under 18, both parents must consent. You will need the child's birth certificate and both parents' NRICs. (Made-up rule)",
    adult: "You will need a letter of authorisation and the applicant's NRIC. The applicant must sign the photo. (Made-up rule)"
};

// Guidance for application type (made-up rules)
const APPLICATION_GUIDANCE = {
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
};

// Requirements for each path (all made-up)
const REQUIREMENTS = {
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
};

// Step 1 DOM elements
const triageForm = document.getElementById('triage-form');
const applicantRadios = document.querySelectorAll('input[name="applicant-type"]');
const behalfRadios = document.querySelectorAll('input[name="behalf-type"]');
const applicationRadios = document.querySelectorAll('input[name="application-type"]');
const applicantGuidance = document.getElementById('applicant-guidance');
const behalfGuidance = document.getElementById('behalf-guidance');
const applicationGuidance = document.getElementById('application-guidance');
const behalfDetails = document.getElementById('behalf-details');
const previewBox = document.getElementById('preview-box');
const requirementsList = document.getElementById('requirements-list');
const nextBtn = document.getElementById('next-btn');

// Track selections
let applyingFor = null;      // 'myself' or 'onbehalf'
let behalfType = null;       // 'child' or 'adult' (only if onbehalf)
let applicationType = null;  // 'new' or 'renewal'

// Get the effective applicant type for requirements lookup
function getEffectiveApplicantType() {
    if (applyingFor === 'myself') return 'myself';
    return behalfType; // 'child' or 'adult'
}

// Update guidance when "who are you applying for" changes
applicantRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        applyingFor = e.target.value;
        applicantGuidance.textContent = APPLICANT_GUIDANCE[applyingFor];

        // Show/hide "on behalf of" follow-up question
        if (applyingFor === 'onbehalf') {
            behalfDetails.style.display = 'block';
            // Clear behalf selection when showing
            behalfRadios.forEach(r => r.checked = false);
            behalfType = null;
            if (behalfGuidance) behalfGuidance.textContent = '';
        } else {
            behalfDetails.style.display = 'none';
            behalfType = null;
        }

        updateApplicationGuidance();
        updatePreview();
    });
});

// Update guidance when "on behalf of who" changes
behalfRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        behalfType = e.target.value;
        if (behalfGuidance) {
            behalfGuidance.textContent = BEHALF_GUIDANCE[behalfType];
        }
        updateApplicationGuidance();
        updatePreview();
    });
});

// Update guidance when application type changes
applicationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        applicationType = e.target.value;
        updateApplicationGuidance();
        updatePreview();
    });
});

// Update the application type guidance based on current selections
function updateApplicationGuidance() {
    if (!applicationType) {
        applicationGuidance.textContent = '';
        return;
    }

    const effectiveType = getEffectiveApplicantType();
    if (effectiveType && APPLICATION_GUIDANCE[applicationType]) {
        applicationGuidance.textContent = APPLICATION_GUIDANCE[applicationType][effectiveType] || '';
    }
}

// Update preview box and enable/disable button
function updatePreview() {
    const effectiveType = getEffectiveApplicantType();

    // Need all selections to show preview
    const hasAllSelections = applyingFor && applicationType &&
        (applyingFor === 'myself' || behalfType);

    if (hasAllSelections) {
        const key = `${effectiveType}-${applicationType}`;
        const requirements = REQUIREMENTS[key];

        if (requirements) {
            requirementsList.innerHTML = requirements
                .map(req => `<li>${req}</li>`)
                .join('');

            previewBox.style.display = 'block';
            nextBtn.disabled = false;
        }
    } else {
        previewBox.style.display = 'none';
        nextBtn.disabled = true;
    }
}

// Handle Step 1 form submission - go to Step 2
triageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const effectiveType = getEffectiveApplicantType();

    // For prototype, we only show Step 2 for child renewal (most confused group)
    if (effectiveType === 'child' && applicationType === 'renewal') {
        showStep2();
    } else {
        alert(
            `Path: ${applyingFor === 'myself' ? 'For myself' : 'On behalf of ' + behalfType} - ${applicationType}\n\n` +
            `This prototype only includes the "child renewal" path (parents applying on behalf of their child).\n\n` +
            `Please select:\n` +
            `• "On behalf of someone" → "My child (under 18)"\n` +
            `• "Renewal"\n\n` +
            `to continue to Step 2.`
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

// ==================== BEHAVIOR: ERROR HANDLING & SAVE PROGRESS ====================

// Simulated system state (made-up)
let systemStatus = {
    policyService: true,  // Set to false to simulate policy error
    aiPhotoService: true, // Set to false to simulate AI error
    lastError: null
};

// Save progress to localStorage (simulated)
function saveProgress() {
    const formData = {};
    Object.keys(VALIDATORS).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            formData[fieldId] = field.value;
        }
    });
    formData.singleParent = document.getElementById('single-parent')?.checked || false;
    formData.savedAt = new Date().toISOString();

    localStorage.setItem('passport-application-draft', JSON.stringify(formData));
    console.log('Progress saved:', formData);
    return formData;
}

// Load saved progress
function loadProgress() {
    const saved = localStorage.getItem('passport-application-draft');
    if (saved) {
        try {
            const formData = JSON.parse(saved);
            Object.keys(formData).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && fieldId !== 'savedAt' && fieldId !== 'singleParent') {
                    field.value = formData[fieldId];
                    if (formData[fieldId]) {
                        validateField(fieldId);
                    }
                }
            });
            if (formData.singleParent) {
                const checkbox = document.getElementById('single-parent');
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change'));
                }
            }
            return formData;
        } catch (e) {
            console.error('Failed to load saved progress:', e);
        }
    }
    return null;
}

// Show system error modal
function showSystemError(errorType, message) {
    // Save progress before showing error
    const savedData = saveProgress();

    const errorModal = document.getElementById('system-error-modal');
    const errorMessage = document.getElementById('system-error-message');
    const errorDetails = document.getElementById('system-error-details');

    if (errorModal && errorMessage) {
        errorMessage.textContent = message;
        errorDetails.textContent = `Your progress has been saved. You can resume later.\nSaved at: ${new Date().toLocaleString()}\nError type: ${errorType} (made-up error for testing)`;
        errorModal.style.display = 'flex';
    }

    systemStatus.lastError = { type: errorType, message, time: new Date() };
}

// Close error modal
function closeSystemError() {
    const errorModal = document.getElementById('system-error-modal');
    if (errorModal) {
        errorModal.style.display = 'none';
    }
}

// Simulate policy service call (made-up)
function checkPolicyService() {
    if (!systemStatus.policyService) {
        return { success: false, error: 'Policy service unavailable' };
    }
    return { success: true };
}

// Simulate AI photo service call (made-up)
function checkAIPhotoService() {
    if (!systemStatus.aiPhotoService) {
        return { success: false, error: 'AI photo validation service unavailable' };
    }
    // Simulate random confidence
    return { success: true, confidence: Math.random() * 0.3 + 0.7 };
}

// FORCED FAILURE: Trigger system error (for testing)
function triggerSystemFailure(service) {
    if (service === 'policy') {
        systemStatus.policyService = false;
        showSystemError('POLICY_ERROR', 'The policy validation service is temporarily unavailable. Please try again another day.');
    } else if (service === 'ai') {
        systemStatus.aiPhotoService = false;
        showSystemError('AI_SERVICE_ERROR', 'The AI photo validation service is temporarily unavailable. Please try again another day.');
    }
}

// Reset system (for testing)
function resetSystem() {
    systemStatus.policyService = true;
    systemStatus.aiPhotoService = true;
    systemStatus.lastError = null;
    closeSystemError();
}

// Auto-save on field change
Object.keys(VALIDATORS).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('change', () => {
            saveProgress();
        });
    }
});

// Load saved progress on page load
document.addEventListener('DOMContentLoaded', () => {
    const saved = loadProgress();
    if (saved && saved.savedAt) {
        console.log('Resumed from saved progress:', saved.savedAt);
    }
});

// Handle Step 2 form submission
const detailsForm = document.getElementById('details-form');
detailsForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // BEHAVIOR: Check system services before proceeding
    const policyCheck = checkPolicyService();
    if (!policyCheck.success) {
        showSystemError('POLICY_ERROR', 'The policy validation service is temporarily unavailable. Please try again another day.');
        return;
    }

    const aiCheck = checkAIPhotoService();
    if (!aiCheck.success) {
        showSystemError('AI_SERVICE_ERROR', 'The AI photo validation service is temporarily unavailable. Please try again another day.');
        return;
    }

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
        // Save progress even on validation error
        saveProgress();
    } else {
        summaryEl.style.display = 'none';

        // Success - show confirmation (Step 3 not built)
        alert(
            `✓ All fields validated!\n\n` +
            `AI Photo confidence: ${(aiCheck.confidence * 100).toFixed(0)}%\n\n` +
            `In the full prototype, this would show Step 3: Review.\n\n` +
            `The review screen would display:\n` +
            `• Summary of all entered data\n` +
            `• Checklist of what the officer will verify\n` +
            `• Final submit button\n\n` +
            `(Step 3 not built yet)`
        );
    }
});

// Expose functions for testing in console
window.triggerSystemFailure = triggerSystemFailure;
window.resetSystem = resetSystem;
window.saveProgress = saveProgress;
window.loadProgress = loadProgress;
