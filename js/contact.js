// FILE: /js/contact.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');
    const dateInput = document.getElementById('event-date');
    const dateFeedback = document.getElementById('date-feedback');

    // --- Configuration ---
    const PAYMENT_PROVIDER = '{{PAYMENT_PROVIDER}}'; // Placeholder for 'STRIPE' or 'PAYPAL'
    const STRIPE_PUBLIC_KEY = '{{STRIPE_PUBLIC_KEY}}'; // Placeholder for pk_live...
    const SERVER_CHECKOUT_ENDPOINT = '{{SERVER_CHECKOUT_ENDPOINT}}'; // Placeholder for /api/create-checkout-session
    const BOOKING_API_ENDPOINT = '/api/book'; // Placeholder for server-side form handling

    // --- 1. Client-Side Validation ---

    /**
     * Shows an error message for a given input.
     */
    const showValidationError = (input, message) => {
        input.classList.add('invalid');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            input.setAttribute('aria-invalid', 'true');
        }
    };

    /**
     * Clears validation error for a given input.
     */
    const clearValidationError = (input) => {
        input.classList.remove('invalid');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.classList.remove('show');
            input.setAttribute('aria-invalid', 'false');
        }
    };

    /**
     * Checks if the form is fully valid.
     * @returns {boolean}
     */
    const validateForm = () => {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            clearValidationError(input);
            
            if (input.id === 'email' && input.value && !/\S+@\S+\.\S+/.test(input.value)) {
                showValidationError(input, 'Please enter a valid email address.');
                isValid = false;
            } else if (input.value.trim() === '') {
                // Generic required field check
                showValidationError(input, `This field is required.`);
                isValid = false;
            } else if (input.type === 'date' && new Date(input.value) < new Date()) {
                 // Date validation
                showValidationError(input, 'Please select a future event date.');
                isValid = false;
            }
        });

        return isValid;
    };

    // Attach real-time validation listeners
    form.querySelectorAll('[required]').forEach(input => {
        input.addEventListener('blur', () => {
            // Validate on blur only if the field is not empty
            if (input.value.trim() !== '') {
                validateForm();
            }
        });
        input.addEventListener('input', () => {
            // Clear error as soon as user starts typing/changing
            clearValidationError(input);
        });
    });


    // --- 2. Availability Check Simulation ---

    let blockedDates = [];

    /**
     * Fetches blocked dates from JSON file.
     */
    const fetchBlockedDates = async () => {
        try {
            const response = await fetch('/assets/data/blockedDates.json');
            const data = await response.json();
            blockedDates = data.blockedDates || [];
            console.log('Blocked dates loaded:', blockedDates);
        } catch (e) {
            console.error('Could not load blocked dates.', e);
        }
    };

    /**
     * Checks if the selected date is blocked.
     */
    const checkAvailability = (dateString) => {
        if (!dateString) {
            dateFeedback.textContent = '';
            return true;
        }

        const isBlocked = blockedDates.includes(dateString);

        if (isBlocked) {
            dateFeedback.textContent = '⛔ Unavailable. This date is fully booked.';
            dateFeedback.className = 'date-unavailable';
            return false;
        } else {
            dateFeedback.textContent = '✅ Date is currently available!';
            dateFeedback.className = 'date-available';
            return true;
        }
    };

    dateInput.addEventListener('change', (e) => {
        checkAvailability(e.target.value);
    });

    // --- 3. Submission and Payment Flow ---

    /**
     * Starts the loading animation on the button.
     */
    const startLoading = () => {
        submitButton.classList.add('button-loading');
        submitButton.disabled = true;
        formStatus.textContent = 'Processing request...';
    };

    /**
     * Stops the loading animation.
     */
    const stopLoading = () => {
        submitButton.classList.remove('button-loading');
        submitButton.disabled = false;
        formStatus.textContent = '';
    };

    /**
     * Collects form data into a structured object.
     */
    const collectFormData = () => {
        const data = {};
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            // Skip the file, as we only log/POST text data in this demo
            if (key !== 'file_upload') {
                data[key] = value;
            }
        });
        return data;
    };

    /**
     * Sends the collected data to the booking endpoint.
     * @param {object} bookingData - The data to send.
     */
    const sendBookingData = async (bookingData) => {
        try {
            const response = await fetch(BOOKING_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                // Successful submission
                console.log('Booking data successfully posted to API.', bookingData);
                sessionStorage.setItem('bookingSummary', JSON.stringify(bookingData));
                window.location.href = '/thanks.html';
            } else {
                throw new Error(`Server error: ${response.status}`);
            }
        } catch (e) {
            console.error('Submission failed:', e);
            formStatus.textContent = '❌ Submission failed. Please try again later.';
            stopLoading();
        }
    };

    /**
     * Simulates a payment success and then proceeds to booking.
     */
    const runSandboxCheckout = (bookingData) => {
        formStatus.textContent = 'Simulating secure checkout...';
        console.log('[SANDBOX] Payment simulated as SUCCESS.');
        
        // Simulate a delay for payment processing
        setTimeout(() => {
            formStatus.textContent = 'Payment successful. Finalizing booking...';
            sendBookingData(bookingData);
        }, 1500);
    };

    /**
     * Initiates the Stripe Checkout process.
     */
    const redirectToStripeCheckout = (bookingData) => {
        // This is a placeholder. Real implementation requires server-side logic
        // to create a Stripe Checkout Session and redirect the user.

        formStatus.textContent = 'Redirecting to secure payment portal...';
        console.warn('Real Stripe flow requires server endpoint to create session. Running sandbox instead.');

        // Fall back to sandbox if keys are present but we are running client-side demo
        runSandboxCheckout(bookingData);
    };

    // --- 4. Form Submission Handler ---

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Client-Side Validation
        if (!validateForm()) {
            formStatus.textContent = 'Please correct the errors in the form.';
            return;
        }

        const bookingData = collectFormData();
        
        // 2. Availability Check
        if (!checkAvailability(bookingData.event_date)) {
            formStatus.textContent = 'The selected date is currently unavailable.';
            return;
        }

        startLoading();

        // 3. Payment/Booking Flow
        if (STRIPE_PUBLIC_KEY.startsWith('pk_') && SERVER_CHECKOUT_ENDPOINT.includes('/api/')) {
            // Keys seem to be provided (even if they are placeholders),
            // we initiate the Stripe path, which in this demo will fallback.
            redirectToStripeCheckout(bookingData);
        } else {
            // No keys provided: proceed directly to sandbox flow (simulated payment + API post)
            runSandboxCheckout(bookingData);
        }
    });
    
    // --- 5. Initialization ---
    fetchBlockedDates();
});