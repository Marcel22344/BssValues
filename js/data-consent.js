document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('dataConsentChoice');
    
    if (!consentChoice) {
        // Show popup if no choice has been made
        const popup = document.getElementById('data-consent-popup');
        if (popup) {
            popup.classList.add('visible');
        }
    }

    // Handle accept button click
    const acceptButton = document.getElementById('accept-consent');
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            localStorage.setItem('dataConsentChoice', 'accepted');
            const popup = document.getElementById('data-consent-popup');
            if (popup) {
                popup.classList.remove('visible');
            }
            // Here you can add any additional logic for when user accepts
        });
    }

    // Handle decline button click
    const declineButton = document.getElementById('decline-consent');
    if (declineButton) {
        declineButton.addEventListener('click', function() {
            localStorage.setItem('dataConsentChoice', 'declined');
            const popup = document.getElementById('data-consent-popup');
            if (popup) {
                popup.classList.remove('visible');
            }
            // Here you can add any additional logic for when user declines
        });
    }
}); 