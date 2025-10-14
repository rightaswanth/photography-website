// FILE: /js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // Utility & Performance
    // --------------------------------------------------------------------------

    // Set current year in footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Lazy load non-native image fallback (for demonstration/older browsers)
    const lazyLoadImages = () => {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported, no need for polyfill
            return;
        }

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Replace src with data-src if implemented, or simply remove loading attribute
                        img.removeAttribute('loading');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => observer.observe(img));
        }
    };
    lazyLoadImages();

    // --------------------------------------------------------------------------
    // Mobile Menu Logic (with Focus Trap)
    // --------------------------------------------------------------------------

    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const header = document.querySelector('.header');

    // Function to close the menu and reset focus
    const closeMenu = () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
        document.body.style.overflow = ''; // Restore body scroll
        // Return focus to the toggle button (best practice for accessibility)
        menuToggle.focus();
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
            // Simple focus trap: focus the first link in the nav
            const firstLink = mainNav.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu on link click (mobile only)
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    // Close menu on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // --------------------------------------------------------------------------
    // Smooth Scroll for Hero CTA
    // --------------------------------------------------------------------------

    const scrollToContact = document.querySelector('.js-scroll-to-contact');
    const contactSection = document.getElementById('contact-cta');

    if (scrollToContact && contactSection) {
        scrollToContact.addEventListener('click', (e) => {
            e.preventDefault();
            // Use native smooth scroll for best performance/support
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --------------------------------------------------------------------------
    // Testimonials Carousel Logic (Vanilla JS)
    // --------------------------------------------------------------------------

    const carousel = document.querySelector('.carousel');
    const track = document.getElementById('testimonial-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.carousel__button--next');
    const prevButton = carousel.querySelector('.carousel__button--prev');
    const dotsContainer = carousel.querySelector('.carousel__dots');

    if (carousel && slides.length > 0) {
        let currentSlideIndex = 0;
        let autoAdvanceInterval;
        const SLIDE_INTERVAL = 6000; // 6 seconds

        // 1. Create Dots & Dot Listeners
        const createDots = () => {
            slides.forEach((slide, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel__dot');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-controls', slide.id);
                dot.setAttribute('id', `testimonial-${index + 1}-tab`);
                dot.setAttribute('aria-label', `View testimonial ${index + 1}`);
                dot.addEventListener('click', () => moveToSlide(index));
                dotsContainer.appendChild(dot);
            });
        };

        // 2. Main Slide Function
        const moveToSlide = (targetIndex) => {
            const currentSlide = slides[currentSlideIndex];
            const targetSlide = slides[targetIndex];

            if (!targetSlide) return;

            // Calculate new position
            const amountToMove = targetSlide.offsetLeft;
            track.style.transform = 'translateX(-' + amountToMove + 'px)';

            // Update ARIA and Dot State
            currentSlide.setAttribute('aria-hidden', 'true');
            targetSlide.removeAttribute('aria-hidden');

            const currentDot = dotsContainer.children[currentSlideIndex];
            const targetDot = dotsContainer.children[targetIndex];
            currentDot.removeAttribute('aria-selected');
            targetDot.setAttribute('aria-selected', 'true');

            currentSlideIndex = targetIndex;

            updateButtonState();
        };

        // 3. Update Button State (Disabled at ends - optional for loop carousel)
        const updateButtonState = () => {
            prevButton.disabled = currentSlideIndex === 0;
            nextButton.disabled = currentSlideIndex === slides.length - 1;

            // Simple loop logic (Uncomment to enable looping)
            // prevButton.disabled = false;
            // nextButton.disabled = false;
        };

        // 4. Button Listeners
        nextButton.addEventListener('click', () => {
            let targetIndex = currentSlideIndex + 1;
            if (targetIndex >= slides.length) {
                targetIndex = 0; // Loop to start
            }
            moveToSlide(targetIndex);
            resetAutoAdvance();
        });

        prevButton.addEventListener('click', () => {
            let targetIndex = currentSlideIndex - 1;
            if (targetIndex < 0) {
                targetIndex = slides.length - 1; // Loop to end
            }
            moveToSlide(targetIndex);
            resetAutoAdvance();
        });

        // 5. Auto Advance & Hover/Focus Pause
        const startAutoAdvance = () => {
            autoAdvanceInterval = setInterval(() => {
                let targetIndex = currentSlideIndex + 1;
                if (targetIndex >= slides.length) {
                    targetIndex = 0; // Loop
                }
                moveToSlide(targetIndex);
            }, SLIDE_INTERVAL);
        };

        const stopAutoAdvance = () => {
            clearInterval(autoAdvanceInterval);
        };

        const resetAutoAdvance = () => {
            stopAutoAdvance();
            startAutoAdvance();
        };

        // Pause on hover/focus
        carousel.addEventListener('mouseenter', stopAutoAdvance);
        carousel.addEventListener('focusin', stopAutoAdvance);
        carousel.addEventListener('mouseleave', startAutoAdvance);
        carousel.addEventListener('focusout', startAutoAdvance);

        // Initialization
        createDots();
        // Hide all but the first slide initially
        slides.forEach((slide, index) => {
            if (index !== 0) {
                slide.setAttribute('aria-hidden', 'true');
            }
        });
        moveToSlide(0); // Initialize UI state
        startAutoAdvance();
    }
});