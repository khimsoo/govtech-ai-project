// Validation rules (all made-up)
// Each validator returns { valid: boolean, error?: string }

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
            if (formData.singleParent) return { valid: true };
            if (!value.trim()) return { valid: false, error: 'Name is required' };
            if (value !== value.toUpperCase()) return { valid: false, error: 'Please use CAPITAL LETTERS' };
            return { valid: true };
        }
    },
    'parent2-nric': {
        validate: (value, formData) => {
            if (formData.singleParent) return { valid: true };
            if (!value.trim()) return { valid: false, error: 'NRIC is required' };
            const pattern = /^[A-Z]\d{7}[A-Z]$/;
            if (!pattern.test(value.toUpperCase())) {
                return { valid: false, error: 'Format: 1 letter, 7 digits, 1 letter (e.g. S7654321B)' };
            }
            if (value.toUpperCase() === formData.parent1Nric?.toUpperCase()) {
                return { valid: false, error: 'Cannot be the same as Parent 1 NRIC' };
            }
            return { valid: true };
        }
    },
    'parent2-relationship': {
        validate: (value, formData) => {
            if (formData.singleParent) return { valid: true };
            if (!value) return { valid: false, error: 'Please select relationship' };
            return { valid: true };
        }
    }
};

// Get list of fields to validate based on form state
function getFieldsToValidate(formData) {
    if (formData.singleParent) {
        return ['child-name', 'child-nric', 'child-dob', 'current-passport',
                'parent1-name', 'parent1-nric', 'parent1-relationship'];
    }
    return Object.keys(VALIDATORS);
}
