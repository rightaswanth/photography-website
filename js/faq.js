// FILE: /js/faq.js

document.addEventListener('DOMContentLoaded', () => {
    const accordionContainer = document.querySelector('.faq-container');
    const buttons = accordionContainer.querySelectorAll('.faq-button');
    const contents = accordionContainer.querySelectorAll('.faq-content');

    // --- 1. Core Toggle Logic ---

    /**
     * Toggles the open/closed state of an accordion item.
     * @param {HTMLElement} button - The button element that was clicked.
     */
    const toggleAccordion = (button) => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const contentId = button.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        // Close all other open accordions (optional: remove this for multi-select)
        buttons.forEach(otherButton => {
            if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
                closeAccordion(otherButton);
            }
        });

        if (isExpanded) {
            closeAccordion(button);
        } else {
            openAccordion(button);
        }
    };

    /**
     * Sets an item to the open state.
     */
    const openAccordion = (button) => {
        const content = document.getElementById(button.getAttribute('aria-controls'));
        button.setAttribute('aria-expanded', 'true');
        content.classList.add('is-open');
        content.removeAttribute('hidden');
    };

    /**
     * Sets an item to the closed state.
     */
    const closeAccordion = (button) => {
        const content = document.getElementById(button.getAttribute('aria-controls'));
        button.setAttribute('aria-expanded', 'false');
        content.classList.remove('is-open');
        content.setAttribute('hidden', '');
    };


    // --- 2. Event Listeners (Click) ---

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            toggleAccordion(button);
        });
    });

    // --- 3. Keyboard Navigation (Accessibility) ---

    // The Tab key navigation is handled naturally by the browser focus order.
    // We enhance this by allowing arrow keys to move between buttons.

    accordionContainer.addEventListener('keydown', (e) => {
        const currentButton = document.activeElement;
        if (!currentButton || !currentButton.classList.contains('faq-button')) {
            return;
        }

        const isLast = currentButton === buttons[buttons.length - 1];
        const isFirst = currentButton === buttons[0];
        let nextButton = null;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                nextButton = isLast ? buttons[0] : buttons[Array.from(buttons).indexOf(currentButton) + 1];
                break;
            case 'ArrowUp':
                e.preventDefault();
                nextButton = isFirst ? buttons[buttons.length - 1] : buttons[Array.from(buttons).indexOf(currentButton) - 1];
                break;
            case 'Home':
                e.preventDefault();
                nextButton = buttons[0];
                break;
            case 'End':
                e.preventDefault();
                nextButton = buttons[buttons.length - 1];
                break;
            case 'Enter':
            case 'Space':
                // Allow browser to handle click/toggle, no need to prevent default
                break;
            default:
                return;
        }

        if (nextButton) {
            nextButton.focus();
        }
    });

    // Ensure only the first button is in the tab order initially,
    // and others are navigable via arrow keys (a common pattern for ARIA role="tablist").
    buttons.forEach((button, index) => {
        if (index === 0) {
            button.setAttribute('tabindex', '0');
        } else {
            button.setAttribute('tabindex', '-1');
        }
    });
});