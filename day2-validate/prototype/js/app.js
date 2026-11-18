// Main application entry point
// Coordinates all modules and step navigation
// Depends on: config.js, validators.js, services.js, step1-triage.js, step2-form.js, step3-review.js

// Step navigation
function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(el => {
        el.style.display = 'none';
    });

    // Show target step
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.style.display = 'block';
        window.scrollTo(0, 0);

        // If showing step 3, populate review data
        if (stepId === 'step3') {
            populateReview();
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Passport Application Prototype - Modular Version');
    console.log('All data is MADE UP for testing purposes.');

    initStep1();
    initStep2();
    initStep3();
});
