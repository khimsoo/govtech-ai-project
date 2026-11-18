// Services: system status, save/load progress, error handling
// All data is MADE UP for testing purposes

// Simulated system state
const systemStatus = {
    policyService: true,
    aiPhotoService: true,
    lastError: null
};

// ==================== SAVE/LOAD PROGRESS ====================

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

function loadProgress() {
    const saved = localStorage.getItem('passport-application-draft');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load saved progress:', e);
        }
    }
    return null;
}

function clearProgress() {
    localStorage.removeItem('passport-application-draft');
}

// ==================== ERROR HANDLING ====================

function showSystemError(errorType, message) {
    saveProgress();

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

function closeSystemError() {
    const errorModal = document.getElementById('system-error-modal');
    if (errorModal) {
        errorModal.style.display = 'none';
    }
}

// ==================== SERVICE CHECKS ====================

function checkPolicyService() {
    if (!systemStatus.policyService) {
        return { success: false, error: 'Policy service unavailable' };
    }
    return { success: true };
}

function checkAIPhotoService() {
    if (!systemStatus.aiPhotoService) {
        return { success: false, error: 'AI photo validation service unavailable' };
    }
    return { success: true, confidence: Math.random() * 0.3 + 0.7 };
}

// ==================== TEST CONTROLS ====================

function triggerSystemFailure(service) {
    if (service === 'policy') {
        systemStatus.policyService = false;
        showSystemError('POLICY_ERROR', 'The policy validation service is temporarily unavailable. Please try again another day.');
    } else if (service === 'ai') {
        systemStatus.aiPhotoService = false;
        showSystemError('AI_SERVICE_ERROR', 'The AI photo validation service is temporarily unavailable. Please try again another day.');
    }
}

function resetSystem() {
    systemStatus.policyService = true;
    systemStatus.aiPhotoService = true;
    systemStatus.lastError = null;
    closeSystemError();
}

// Expose for testing
window.triggerSystemFailure = triggerSystemFailure;
window.resetSystem = resetSystem;
window.saveProgress = saveProgress;
window.loadProgress = loadProgress;
