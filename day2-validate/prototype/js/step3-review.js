// Step 3: Review - summary before submission
// Depends on: validators.js, services.js, config.js, step2-form.js

function initStep3() {
    // Back button
    document.getElementById('back-to-step2')?.addEventListener('click', () => showStep('step2'));

    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => showStep('step2'));
    });

    // Submit button
    document.getElementById('submit-btn')?.addEventListener('click', handleSubmit);
}

function populateReview() {
    const formData = getAllFormData();
    const aiConfidence = window.lastAIConfidence || 0.85;

    // Child information
    document.getElementById('review-child-name').textContent = formData['child-name'] || '-';
    document.getElementById('review-child-nric').textContent = formData['child-nric'] || '-';
    document.getElementById('review-child-dob').textContent = formatDate(formData['child-dob']);
    document.getElementById('review-current-passport').textContent = formData['current-passport'] || '-';

    // Parent 1
    document.getElementById('review-parent1-name').textContent = formData['parent1-name'] || '-';
    document.getElementById('review-parent1-nric').textContent = formData['parent1-nric'] || '-';
    document.getElementById('review-parent1-relationship').textContent =
        capitalise(formData['parent1-relationship']) || '-';

    // Parent 2
    const parent2Section = document.getElementById('review-parent2-section');
    if (formData.singleParent) {
        parent2Section.innerHTML = `
            <p class="single-parent-note">
                <strong>Single parent/guardian:</strong> Supporting documents required.
            </p>
        `;
    } else {
        document.getElementById('review-parent2-name').textContent = formData['parent2-name'] || '-';
        document.getElementById('review-parent2-nric').textContent = formData['parent2-nric'] || '-';
        document.getElementById('review-parent2-relationship').textContent =
            capitalise(formData['parent2-relationship']) || '-';
    }

    // AI Photo result
    const photoStatus = document.getElementById('review-photo-status');
    const confidencePercent = Math.round(aiConfidence * 100);
    if (confidencePercent >= 90) {
        photoStatus.innerHTML = `<span class="status-pass">✓ Passed (${confidencePercent}% confidence)</span>`;
    } else if (confidencePercent >= 70) {
        photoStatus.innerHTML = `<span class="status-warn">⚠️ Review recommended (${confidencePercent}% confidence)</span>`;
    } else {
        photoStatus.innerHTML = `<span class="status-fail">✗ Issues detected (${confidencePercent}% confidence)</span>`;
    }

    // Update checklist based on form data
    updateChecklist(formData);
}

function updateChecklist(formData) {
    const checks = [
        { id: 'check-name', label: "Child's name matches birth certificate", pass: !!formData['child-name'] },
        { id: 'check-nric', label: 'NRIC/Birth Cert format valid', pass: !!formData['child-nric'] },
        { id: 'check-age', label: 'Child is under 18', pass: !!formData['child-dob'] },
        { id: 'check-passport', label: 'Current passport number provided', pass: !!formData['current-passport'] },
        { id: 'check-parent1', label: 'Parent/Guardian 1 details complete', pass: !!formData['parent1-name'] && !!formData['parent1-nric'] },
        { id: 'check-parent2', label: 'Parent/Guardian 2 or single-parent docs', pass: formData.singleParent || (!!formData['parent2-name'] && !!formData['parent2-nric']) },
        { id: 'check-photo', label: 'Photo meets requirements', pass: (window.lastAIConfidence || 0.85) >= 0.7 }
    ];

    const checklistEl = document.getElementById('review-checklist');
    checklistEl.innerHTML = checks.map(c => `
        <li class="${c.pass ? 'check-pass' : 'check-fail'}">
            ${c.pass ? '✓' : '✗'} ${c.label}
        </li>
    `).join('');
}

function handleSubmit() {
    // Check services one more time
    const policyCheck = checkPolicyService();
    if (!policyCheck.success) {
        showSystemError('POLICY_ERROR', 'The policy validation service is temporarily unavailable. Please try again another day.');
        return;
    }

    // Show success modal
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        // Generate application ID
        const appId = 'APP-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        document.getElementById('success-app-id').textContent = appId;

        // Generate collection date (7 days from now)
        const collectionDate = new Date();
        collectionDate.setDate(collectionDate.getDate() + 7);
        document.getElementById('success-collection-date').textContent = formatDate(collectionDate.toISOString().split('T')[0]);

        successModal.style.display = 'flex';

        // Clear saved progress
        clearProgress();
    }
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.style.display = 'none';
    }
    // Reset to step 1
    showStep('step1');
    location.reload();
}

// Utility functions
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function capitalise(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

// Expose for modal close button
window.closeSuccessModal = closeSuccessModal;
