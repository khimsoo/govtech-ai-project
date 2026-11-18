// Step 1: Triage - applicant type selection
// Depends on: config.js

// Track selections
let applyingFor = null;
let behalfType = null;
let applicationType = null;

function getEffectiveApplicantType() {
    if (applyingFor === 'myself') return 'myself';
    return behalfType;
}

function initStep1() {
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

    function updateApplicationGuidance() {
        if (!applicationType) {
            applicationGuidance.textContent = '';
            return;
        }
        const effectiveType = getEffectiveApplicantType();
        if (effectiveType && CONFIG.APPLICATION_GUIDANCE[applicationType]) {
            applicationGuidance.textContent = CONFIG.APPLICATION_GUIDANCE[applicationType][effectiveType] || '';
        }
    }

    function updatePreview() {
        const effectiveType = getEffectiveApplicantType();
        const hasAllSelections = applyingFor && applicationType &&
            (applyingFor === 'myself' || behalfType);

        if (hasAllSelections) {
            const key = `${effectiveType}-${applicationType}`;
            const requirements = CONFIG.REQUIREMENTS[key];

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

    // Who are you applying for
    applicantRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            applyingFor = e.target.value;
            applicantGuidance.textContent = CONFIG.APPLICANT_GUIDANCE[applyingFor];

            if (applyingFor === 'onbehalf') {
                behalfDetails.style.display = 'block';
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

    // On behalf of who
    behalfRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            behalfType = e.target.value;
            if (behalfGuidance) {
                behalfGuidance.textContent = CONFIG.BEHALF_GUIDANCE[behalfType];
            }
            updateApplicationGuidance();
            updatePreview();
        });
    });

    // Application type
    applicationRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            applicationType = e.target.value;
            updateApplicationGuidance();
            updatePreview();
        });
    });

    // Form submission
    triageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const effectiveType = getEffectiveApplicantType();

        if (effectiveType === 'child' && applicationType === 'renewal') {
            showStep('step2');
        } else {
            alert(
                `Path: ${applyingFor === 'myself' ? 'For myself' : 'On behalf of ' + behalfType} - ${applicationType}\n\n` +
                `This prototype only includes the "child renewal" path.\n\n` +
                `Please select:\n` +
                `• "On behalf of someone" → "My child (under 18)"\n` +
                `• "Renewal"\n\n` +
                `to continue.`
            );
        }
    });
}
