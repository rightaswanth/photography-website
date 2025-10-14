// FILE: /js/services.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Price Toggle Logic ---

    const priceToggleButtons = document.querySelectorAll('.price-toggle-button');

    priceToggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.target.dataset.target;
            const priceSpan = document.getElementById(targetId);
            const priceContainer = priceSpan.closest('.package-card__price');
            const originalPrice = priceContainer.dataset.price;

            if (priceSpan.textContent.includes('Contact')) {
                // Show price
                priceSpan.textContent = originalPrice;
                e.target.textContent = 'Request Price';
                priceSpan.style.fontSize = '3rem';
            } else {
                // Hide price and show 'Contact Us'
                priceSpan.textContent = 'Contact Us';
                priceSpan.style.fontSize = '2rem';
                e.target.textContent = 'Show Price';
            }
        });
    });

    // --- 2. Accordion Logic ---

    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true' || false;
            const content = document.getElementById(button.getAttribute('aria-controls'));

            // Close all other open accordions
            accordionButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.setAttribute('aria-expanded', 'false');
                    document.getElementById(otherButton.getAttribute('aria-controls')).classList.remove('is-open');
                }
            });

            // Toggle the clicked accordion
            button.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('is-open');
        });
    });

    // --- 3. Booking Modal Trigger (Placeholder for STEP 10) ---

    const bookingButtons = document.querySelectorAll('.book-package-btn, .deposit-cta');
    const bookingModal = document.getElementById('booking-modal');

    /**
     * Placeholder function to open the booking modal.
     * This will be fully implemented in STEP 10.
     * @param {string} type - 'package' or 'deposit'
     * @param {string} packageName - The name of the package, if type is 'package'
     */
    const openBookingModal = (type, packageName = null) => {
        // Log the intent for debugging in the browser console
        console.log(`[BOOKING SIMULATION] Opening modal for: ${type}`);
        if (packageName) {
            console.log(`[BOOKING SIMULATION] Package selected: ${packageName}`);
        }
        
        // VISUAL SIMULATION (Will be replaced by proper modal in STEP 10)
        const content = type === 'package'
            ? `Simulated: Starting inquiry for **${packageName}**. Continue to full contact form...`
            : `Simulated: Redirecting to secure deposit payment page. Total: **30% retainer**.`;

        bookingModal.style.display = 'block';
        bookingModal.innerHTML = `<div style="padding: 20px; background: white; border: 1px solid #ccc; max-width: 400px; margin: 100px auto; text-align: center;">
            <p>${content}</p>
            <button onclick="document.getElementById('booking-modal').style.display='none'" class="button button--secondary">Close Simulation</button>
        </div>`;
    };

    bookingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (e.currentTarget.classList.contains('deposit-cta')) {
                // This is the retainer link
                openBookingModal('deposit');
            } else {
                // This is a package booking button
                const packageName = e.currentTarget.dataset.packageName;
                openBookingModal('package', packageName);
            }
        });
    });

});