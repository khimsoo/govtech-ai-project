// Step 2: Form - field validation and progress tracking
// Depends on: validators.js, services.js, config.js

const fieldStates = {};

function getFormData() {
    return {
        singleParent: document.getElementById('single-parent')?.checked || false,
        parent1Nric: document.getElementById('parent1-nric')?.value || ''
    };
}

function getAllFormData() {
    const data = {};
    Object.keys(VALIDATORS).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            data[fieldId] = field.value;
        }
    });
    data.singleParent = document.getElementById('single-parent')?.checked || false;
    return data;
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    const validator = VALIDATORS[fieldId];

    if (!field || !validator) return true;

    const formData = getFormData();
    const result = validator.validate(field.value, formData);

    field.classList.remove('valid', 'invalid');
    if (field.value.trim() || field.tagName === 'SELECT') {
        field.classList.add(result.valid ? 'valid' : 'invalid');
    }

    if (errorEl) {
        errorEl.textContent = result.valid ? '' : result.error;
    }

    fieldStates[fieldId] = result.valid;
    updateProgress();
    return result.valid;
}

function updateProgress() {
    const formData = getFormData();
    const fieldsToCheck = getFieldsToValidate(formData);

    const complete = fieldsToCheck.filter(id => fieldStates[id] === true).length;
    const total = fieldsToCheck.length;
    const percent = Math.round((complete / total) * 100);

    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('fields-complete').textContent = complete;
    document.getElementById('fields-total').textContent = total;

    const reviewBtn = document.getElementById('review-btn');
    reviewBtn.disabled = complete < total;
}

function initStep2() {
    // Attach validation to all fields
    Object.keys(VALIDATORS).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId));
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    validateField(fieldId);
                }
            });
            field.addEventListener('change', () => {
                validateField(fieldId);
                saveProgress();
            });
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', () => validateField(fieldId));
            }
        }
    });

    // Single parent checkbox
    const singleParentCheckbox = document.getElementById('single-parent');
    const singleParentGuidance = document.getElementById('single-parent-guidance');
    const parent2Fields = ['parent2-name', 'parent2-nric', 'parent2-relationship'];

    singleParentCheckbox?.addEventListener('change', () => {
        const isChecked = singleParentCheckbox.checked;

        if (singleParentGuidance) {
            singleParentGuidance.style.display = isChecked ? 'block' : 'none';
        }

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

    // Back button
    document.getElementById('back-to-step1').addEventListener('click', () => showStep('step1'));

    // Form submission
    const detailsForm = document.getElementById('details-form');
    detailsForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check services
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
        const fieldsToCheck = getFieldsToValidate(formData);

        let allValid = true;
        const errors = [];

        fieldsToCheck.forEach(fieldId => {
            const isValid = validateField(fieldId);
            if (!isValid) {
                allValid = false;
                const label = CONFIG.FIELD_LABELS[fieldId] || fieldId;
                const errorEl = document.getElementById(`${fieldId}-error`);
                errors.push(`${label}: ${errorEl?.textContent || 'Invalid'}`);
            }
        });

        const summaryEl = document.getElementById('validation-summary');
        const errorListEl = document.getElementById('error-list');

        if (!allValid) {
            errorListEl.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
            summaryEl.style.display = 'block';
            summaryEl.scrollIntoView({ behavior: 'smooth' });
            saveProgress();
        } else {
            summaryEl.style.display = 'none';
            // Store AI confidence for Step 3
            window.lastAIConfidence = aiCheck.confidence;
            showStep('step3');
        }
    });

    // Load saved progress
    const saved = loadProgress();
    if (saved) {
        Object.keys(saved).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && fieldId !== 'savedAt' && fieldId !== 'singleParent') {
                field.value = saved[fieldId];
                if (saved[fieldId]) {
                    validateField(fieldId);
                }
            }
        });
        if (saved.singleParent) {
            const checkbox = document.getElementById('single-parent');
            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
        }
        console.log('Resumed from saved progress:', saved.savedAt);
    }
}
