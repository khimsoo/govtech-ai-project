// Officer Portal - Prototype
// All data is MADE UP for testing purposes

// Draft reply templates (made-up)
const REPLY_TEMPLATES = {
    approve: {
        single: `Dear Applicant,

Your passport application (APP-ID) has been APPROVED.

Collection Details:
- Collection Date: COLLECTION_DATE
- Location: ICA Building, Level 3, Counter 12-15
- Bring: Original NRIC and this notification

Please collect within 30 days of the collection date.

This is a made-up reply for prototype testing.`,

        batch: `Dear Applicant,

Your passport applications have been APPROVED.

Collection Details (all passports collected together):
COLLECTION_LIST
- Location: ICA Building, Level 3, Counter 12-15
- Bring: Original NRIC and this notification

Please collect within 30 days of the earliest collection date.

This is a made-up reply for prototype testing.`
    },

    reject: `Dear Applicant,

Your passport application (APP-ID) requires attention.

Issue Found:
REJECTION_REASON

Next Steps:
Please resubmit with the corrected information. Your progress has been saved — you can resume from where you left off.

If you believe this is an error, please contact our hotline or visit any ICA counter.

This is a made-up reply for prototype testing.`,

    escalate: `Dear Applicant,

Your passport application (APP-ID) has been referred for further review.

Your case requires additional verification. A senior officer will review your application within 3-5 working days.

You do not need to take any action at this time. We will contact you if additional documents are required.

Reference: ESCALATION_REF

This is a made-up reply for prototype testing.`
};

// Made-up data for applications
const APP_DATA = {
    'app-001': {
        id: 'APP-2024-001',
        childName: 'TAN WEI MING',
        collectionDate: '25 Nov 2024'
    },
    'app-002': {
        id: 'APP-2024-002',
        childName: 'LEE XIAO MING',
        collectionDate: '26 Nov 2024'
    },
    'app-003': {
        id: 'APP-2024-003',
        children: [
            { name: 'CHEN YU XIN', id: 'APP-2024-003A', collectionDate: '27 Nov 2024' },
            { name: 'CHEN YU HAN', id: 'APP-2024-003B', collectionDate: '27 Nov 2024' }
        ]
    }
};

// Current action being taken
let currentAction = null;

// Show draft reply for officer to edit
function showDraftReply(appId, action) {
    const draftEl = document.getElementById(`draft-${appId}`);
    const textareaEl = document.getElementById(`reply-text-${appId}`);
    const appData = APP_DATA[appId];

    currentAction = action;

    let template = '';

    if (action === 'approve') {
        template = REPLY_TEMPLATES.approve.single
            .replace('APP-ID', appData.id)
            .replace('COLLECTION_DATE', appData.collectionDate);
    } else if (action === 'approve-batch') {
        const collectionList = appData.children
            .map(c => `- ${c.name}: ${c.collectionDate}`)
            .join('\n');
        template = REPLY_TEMPLATES.approve.batch
            .replace('COLLECTION_LIST', collectionList);
    } else if (action === 'reject') {
        template = REPLY_TEMPLATES.reject
            .replace('APP-ID', appData.id)
            .replace('REJECTION_REASON', '[Officer: Enter rejection reason here]');
    } else if (action === 'escalate') {
        template = REPLY_TEMPLATES.escalate
            .replace('APP-ID', appData.id)
            .replace('ESCALATION_REF', 'ESC-' + Date.now().toString().slice(-6));
    }

    textareaEl.value = template;
    draftEl.style.display = 'block';
    textareaEl.focus();

    // Scroll to draft
    draftEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Cancel draft
function cancelDraft(appId) {
    const draftEl = document.getElementById(`draft-${appId}`);
    draftEl.style.display = 'none';
    currentAction = null;
}

// Send reply
function sendReply(appId) {
    const textareaEl = document.getElementById(`reply-text-${appId}`);
    const replyText = textareaEl.value.trim();

    // Edge case: cannot send empty reply
    if (!replyText) {
        alert('Cannot send empty reply. Please enter a message.');
        return;
    }

    // Check for placeholder text that wasn't filled in
    if (replyText.includes('[Officer:')) {
        alert('Please complete all placeholder fields (marked with [Officer:...])');
        return;
    }

    // Hide the application card
    const appCard = document.getElementById(appId);
    appCard.style.display = 'none';

    // Add to sent log
    addToSentLog(appId, currentAction, replyText);

    // Update badge count
    updateBadge();

    currentAction = null;
}

// Add sent reply to log
function addToSentLog(appId, action, replyText) {
    const sentSection = document.getElementById('sent-section');
    const sentLog = document.getElementById('sent-log');

    sentSection.style.display = 'block';

    const appData = APP_DATA[appId];
    const actionClass = action.includes('approve') ? '' : (action === 'reject' ? 'rejected' : 'escalated');
    const actionLabel = action.includes('approve') ? 'APPROVED' : (action === 'reject' ? 'REJECTED' : 'ESCALATED');

    const sentCard = document.createElement('div');
    sentCard.className = `sent-card ${actionClass}`;
    sentCard.innerHTML = `
        <div class="sent-header">
            <strong>${appData.id || appData.children.map(c => c.id).join(', ')} — ${actionLabel}</strong>
            <span class="sent-time">Just now (made-up)</span>
        </div>
        <div class="sent-content">${escapeHtml(replyText)}</div>
    `;

    sentLog.insertBefore(sentCard, sentLog.firstChild);
}

// Update pending badge count
function updateBadge() {
    const visibleCards = document.querySelectorAll('.application-card:not([style*="display: none"])');
    const badge = document.querySelector('.queue-section .badge');
    badge.textContent = visibleCards.length;

    if (visibleCards.length === 0) {
        const queueSection = document.querySelector('.queue-section');
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-queue';
        emptyMsg.textContent = 'No pending applications. Great work!';
        emptyMsg.style.cssText = 'text-align: center; color: #2e7d32; padding: 40px; background: #f1f8e9; border-radius: 8px;';
        queueSection.appendChild(emptyMsg);
    }
}

// Escape HTML for safe display
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Edge case validation: Prevent action without selection
document.addEventListener('DOMContentLoaded', () => {
    console.log('Officer Portal loaded. All data is made-up for prototype testing.');
});
