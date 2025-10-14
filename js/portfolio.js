// FILE: /js/portfolio.js

document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-button');
    const filterStatus = document.getElementById('filter-status');
    const lightbox = document.getElementById('lightbox');
    const lightboxImageContainer = document.getElementById('lightbox-image-container');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const prevButton = lightbox.querySelector('.lightbox__button--prev');
    const nextButton = lightbox.querySelector('.lightbox__button--next');
    const closeButton = lightbox.querySelector('.lightbox__button--close');

    let allGalleryData = [];
    let filteredGalleryData = [];
    let currentLightboxIndex = 0;
    let initialLoadComplete = false;
    let isLightboxOpen = false;

    // --- 1. Data Fetching and Initialization ---

    /**
     * Fetches portfolio data and initializes the page.
     */
    const initPortfolio = async () => {
        try {
            const response = await fetch('/assets/data/portfolio.json');
            allGalleryData = await response.json();
            
            // Check URL for initial filter state
            const urlParams = new URLSearchParams(window.location.search);
            const initialFilter = urlParams.get('filter') || 'All';
            
            // Apply initial filter and render
            applyFilter(initialFilter);
            
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
            portfolioGrid.innerHTML = '<p class="text-center" style="color: red;">Failed to load portfolio items. Please try again later.</p>';
        }
    };

    /**
     * Renders a single gallery item card.
     * @param {object} item - The gallery data object.
     * @returns {string} The HTML markup for the card.
     */
    const createGalleryCard = (item) => {
        // Fallback to gallery slug for link if hero_path is not present
        const galleryLink = `gallery-${item.slug}.html`;
        
        return `
            <div class="gallery-item" data-category="${item.category}" data-index="${item.id}" tabindex="0">
                <a href="${galleryLink}" class="gallery-card-link" data-id="${item.id}" aria-label="View case study for ${item.title}">
                    <picture>
                        <source type="image/webp" 
                            srcset="${item.thumb_400} 400w, ${item.thumb_800} 800w" 
                            sizes="(max-width: 768px) 100vw, 33vw">
                        <img src="${item.thumb_800.replace('.webp', '.jpg')}" 
                            alt="${item.title} by Robin Reverie" 
                            loading="lazy" 
                            width="800" height="1200">
                    </picture>
                    <div class="gallery-caption">
                        <h3>${item.title}</h3>
                        <p>${item.location} | ${item.category}</p>
                    </div>
                </a>
            </div>
        `;
    };

    /**
     * Renders the filtered data into the portfolio grid.
     * @param {array} data - The array of gallery data to display.
     */
    const renderGrid = (data) => {
        portfolioGrid.innerHTML = ''; // Clear existing content
        filteredGalleryData = data;
        let delay = 0;

        if (data.length === 0) {
             portfolioGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No galleries found for this category.</p>';
             return;
        }

        data.forEach((item, index) => {
            const cardHtml = createGalleryCard(item);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHtml.trim();
            const card = tempDiv.firstChild;
            
            portfolioGrid.appendChild(card);
            
            // Apply animation effect after grid is attached to DOM
            if (!initialLoadComplete) {
                setTimeout(() => {
                    card.classList.add('visible');
                }, delay);
                delay += 50; // Staggered delay for simple animation
            } else {
                card.classList.add('visible');
            }
        });

        if (!initialLoadComplete) {
            initialLoadComplete = true;
        }

        // Re-attach lightbox listeners to new items
        attachItemListeners();
    };

    // --- 2. Filtering Logic ---

    /**
     * Filters the gallery items and updates the URL.
     * @param {string} category - The category to filter by (e.g., 'Weddings', 'All').
     */
    const applyFilter = (category) => {
        // 1. Filter Data
        const filteredData = (category === 'All')
            ? allGalleryData
            : allGalleryData.filter(item => item.category === category);

        // 2. Render Grid
        renderGrid(filteredData);
        
        // 3. Update Active Button State
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.removeAttribute('aria-pressed');
            }
        });

        // 4. Update ARIA Live Region
        filterStatus.textContent = `Filtered portfolio, showing ${category} results. Total items: ${filteredData.length}.`;

        // 5. Update URL (Shareable State)
        const newUrl = (category === 'All') 
            ? window.location.pathname 
            : `${window.location.pathname}?filter=${category}`;
        history.pushState({ filter: category }, '', newUrl);
    };

    // Attach filter button listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if implemented as anchors
            const category = e.currentTarget.dataset.filter;
            applyFilter(category);
        });
    });

    // Handle back/forward browser navigation
    window.addEventListener('popstate', (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter') || 'All';
        // Note: applyFilter should not pushState again here
        applyFilter(filter);
    });

    // --- 3. Lightbox Functionality ---

    /**
     * Opens the lightbox with a specific item.
     * @param {number} id - The ID of the item to show.
     */
    const openLightbox = (id) => {
        const itemIndex = filteredGalleryData.findIndex(item => item.id === id);
        if (itemIndex === -1) return;

        currentLightboxIndex = itemIndex;
        updateLightboxContent();

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        isLightboxOpen = true;

        // Simple focus trap: set focus to the close button
        closeButton.focus(); 
        document.body.style.overflow = 'hidden';
    };

    /**
     * Updates the lightbox content based on the currentLightboxIndex.
     */
    const updateLightboxContent = () => {
        const item = filteredGalleryData[currentLightboxIndex];
        
        // Use thumb_800 path as a simplified full-screen viewer demo
        const imagePath = item.thumb_800 || item.thumb_400; 

        lightboxImageContainer.innerHTML = `
            <img src="${imagePath}" 
                 alt="${item.title} - ${item.location}" 
                 class="lightbox__img" 
                 width="800" height="1200">
        `;
        lightboxCaption.textContent = `${item.title} (${item.category}, ${item.location})`;

        // Update button visibility for ends of array
        prevButton.disabled = currentLightboxIndex === 0;
        nextButton.disabled = currentLightboxIndex === filteredGalleryData.length - 1;
    };

    /**
     * Navigates the lightbox.
     * @param {number} direction - 1 for next, -1 for previous.
     */
    const navigateLightbox = (direction) => {
        const newIndex = currentLightboxIndex + direction;

        if (newIndex >= 0 && newIndex < filteredGalleryData.length) {
            currentLightboxIndex = newIndex;
            updateLightboxContent();
        }
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        isLightboxOpen = false;
        document.body.style.overflow = '';
        // Return focus to the item that opened the lightbox (best practice)
        document.querySelector(`.gallery-item[data-index="${filteredGalleryData[currentLightboxIndex].id}"]`).focus();
    };

    // Attach lightbox item listeners (Delegation or run after renderGrid)
    const attachItemListeners = () => {
        // Attach click listeners to all new gallery cards
        document.querySelectorAll('.gallery-card-link').forEach(link => {
            // Note: Preventing default to open Lightbox DEMO here.
            // In a real multi-page site, you'd navigate to the slug page instead.
            // We follow the prompt requirement: "Clicking a card opens the accessible lightbox (can be modal or navigate to /gallery-{{slug}}.html — both OK)"
            link.addEventListener('click', (e) => {
                // If JS is disabled, the default link navigation will work.
                e.preventDefault(); 
                const id = parseInt(e.currentTarget.dataset.id);
                openLightbox(id);
            });
        });
    };

    // Attach lightbox control listeners
    prevButton.addEventListener('click', () => navigateLightbox(-1));
    nextButton.addEventListener('click', () => navigateLightbox(1));
    closeButton.addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isLightboxOpen) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });


    // --- 4. Final Execution ---
    initPortfolio();
});