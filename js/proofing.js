// FILE: /js/proofing.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & State ---
    const DEMO_PASSWORD = '{{PROOFING_PASSWORD}}';
    const GALLERY_ID = 'smith-wedding-proofs';
    const STORAGE_KEY = `proofing_favorites_${GALLERY_ID}`;
    
    // Demo data for proofing images
    const PROOF_IMAGES = [
        { id: 'img-001', src: '/assets/img/proofs/smith-proof-001.webp', alt: 'Bride getting ready, natural light.' },
        { id: 'img-002', src: '/assets/img/proofs/smith-proof-002.webp', alt: 'Groom adjusting his tie, candid.' },
        { id: 'img-003', src: '/assets/img/proofs/smith-proof-003.webp', alt: 'First look reaction.' },
        { id: 'img-004', src: '/assets/img/proofs/smith-proof-004.webp', alt: 'Ceremony kiss under arch.' },
        { id: 'img-005', src: '/assets/img/proofs/smith-proof-005.webp', alt: 'Couple portrait by the lake.' },
        { id: 'img-006', src: '/assets/img/proofs/smith-proof-006.webp', alt: 'Wide shot of the dinner reception.' },
        { id: 'img-007', src: '/assets/img/proofs/smith-proof-007.webp', alt: 'Detailed shot of the rings.' },
        { id: 'img-008', src: '/assets/img/proofs/smith-proof-008.webp', alt: 'Black and white dance photo.' },
        { id: 'img-009', src: '/assets/img/proofs/smith-proof-009.webp', alt: 'Cake cutting moment.' },
        // Simulate more items for a real gallery feel (72 total)
        ...Array(63).fill(0).map((_, i) => ({
             id: `img-${String(i + 10).padStart(3, '0')}`,
             src: `/assets/img/proofs/placeholder-${(i % 3) + 1}.webp`, // Use 3 placeholder images
             alt: `Proof image ${i + 10} (Placeholder)`,
        }))
    ];

    // --- DOM Elements ---
    const passwordFormView = document.getElementById('password-form-view');
    const proofingGalleryView = document.getElementById('proofing-gallery-view');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('gallery-password');
    const passwordError = document.getElementById('password-error');
    const proofingGrid = document.getElementById('proofing-grid');
    const favoritesCountEl = document.getElementById('favorites-count');
    const downloadButton = document.getElementById('download-selected-btn');
    const compareButton = document.getElementById('compare-favorites-btn');
    const logoutButton = document.getElementById('logout-button');

    let favorites = loadFavorites();

    // --- 2. Authentication & UI Control ---

    /**
     * Loads favorites from localStorage.
     * @returns {string[]} Array of image IDs.
     */
    function loadFavorites() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Could not load favorites from storage.", e);
            return [];
        }
    }

    /**
     * Saves current favorites to localStorage.
     */
    function saveFavorites() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            updateToolsUI();
        } catch (e) {
            console.error("Could not save favorites to storage.", e);
        }
    }

    /**
     * Handles the password form submission.
     */
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (passwordInput.value === DEMO_PASSWORD) {
            sessionStorage.setItem('isLoggedIn', 'true');
            showGallery();
        } else {
            passwordError.style.display = 'block';
            passwordInput.focus();
        }
    });

    /**
     * Shows the proofing gallery view.
     */
    function showGallery() {
        passwordFormView.style.display = 'none';
        proofingGalleryView.style.display = 'block';
        
        renderProofingGrid();
        updateToolsUI();
    }

    /**
     * Logs the user out (clears session and returns to login).
     */
    function logout() {
        sessionStorage.removeItem('isLoggedIn');
        proofingGalleryView.style.display = 'none';
        passwordFormView.style.display = 'flex';
        passwordInput.value = '';
        passwordError.style.display = 'none';
        passwordInput.focus();
    }
    logoutButton.addEventListener('click', logout);


    // --- 3. Gallery Rendering and Interactivity ---

    /**
     * Creates HTML for a single proofing card.
     * @param {object} image - Image data.
     * @returns {string} HTML markup.
     */
    const createProofingCard = (image) => {
        const isFavorited = favorites.includes(image.id);
        const favoriteClass = isFavorited ? 'is-favorited' : '';

        return `
            <div class="proofing-card" data-id="${image.id}" data-favorited="${isFavorited}">
                <img src="${image.src}" alt="${image.alt}" loading="lazy" width="400" height="500">
                <div class="proofing-card__overlay">
                    <p style="color:white; font-size:small; opacity:0.7;">${image.id}</p>
                    <div class="proofing-card__buttons">
                        <button class="compare-button" aria-label="Compare ${image.id}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM9 13l2 2 4-4"/></svg>
                        </button>
                        <button class="favorite-button ${favoriteClass}" data-id="${image.id}" aria-label="Toggle favorite for ${image.id}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    /**
     * Renders the full grid and attaches listeners.
     */
    function renderProofingGrid() {
        proofingGrid.innerHTML = PROOF_IMAGES.map(createProofingCard).join('');
        
        // Attach listener for favoriting
        proofingGrid.addEventListener('click', (e) => {
            const button = e.target.closest('.favorite-button');
            if (button) {
                toggleFavorite(button);
            }
        });

        // Attach listener for comparison (currently a demo action)
        proofingGrid.querySelectorAll('.compare-button').forEach(button => {
            button.addEventListener('click', () => {
                alert(`Simulated: Comparing image ${button.closest('.proofing-card').dataset.id} (This feature opens a separate viewer in a professional system).`);
            });
        });
    }

    /**
     * Toggles the favorite status of an image.
     * @param {HTMLElement} button - The favorite button element.
     */
    function toggleFavorite(button) {
        const id = button.dataset.id;
        const card = button.closest('.proofing-card');

        if (favorites.includes(id)) {
            // Un-favorite
            favorites = favorites.filter(favId => favId !== id);
            button.classList.remove('is-favorited');
            card.dataset.favorited = 'false';
            button.setAttribute('aria-label', `Add favorite for ${id}`);
        } else {
            // Favorite
            favorites.push(id);
            button.classList.add('is-favorited');
            card.dataset.favorited = 'true';
            button.setAttribute('aria-label', `Remove favorite for ${id}`);
        }
        
        saveFavorites();
    }

    /**
     * Updates the count displayed in the header tools.
     */
    function updateToolsUI() {
        const count = favorites.length;
        favoritesCountEl.textContent = count;
        downloadButton.textContent = `Download Selected (${count})`;
        downloadButton.disabled = count === 0;
        compareButton.textContent = `Compare (${count})`;
        compareButton.disabled = count < 2; // Comparison needs at least two items
    }

    // --- 4. Simulated Download ---

    /**
     * Simulates batch download by sequentially triggering downloads.
     */
    downloadButton.addEventListener('click', () => {
        if (favorites.length === 0) {
            alert("Please select at least one image to download.");
            return;
        }

        const selectedImages = PROOF_IMAGES.filter(img => favorites.includes(img.id));
        
        // **IMPORTANT SECURITY NOTE**: In a real system, a server-side ZIP utility
        // would handle this. This client-side implementation is a DEMO.

        if (confirm(`You are about to download ${selectedImages.length} images. Do you wish to continue?`)) {
            // Simulate the sequential download
            let downloadCount = 0;
            const downloadNext = () => {
                if (downloadCount < selectedImages.length) {
                    const img = selectedImages[downloadCount];
                    
                    // Create a temporary link
                    const a = document.createElement('a');
                    a.href = img.src.replace('.webp', '.jpg'); // Hypothetically download the original JPG
                    a.download = `${GALLERY_ID}-${img.id}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    downloadCount++;
                    // Add a delay to prevent browser security warnings about multiple downloads
                    setTimeout(downloadNext, 500); 
                } else {
                    alert(`Download simulation complete for ${selectedImages.length} images! (Check your downloads folder)`);
                }
            };
            
            downloadNext();
        }
    });

    // --- 5. Initialization ---

    /**
     * Checks login status on load.
     */
    function checkAuth() {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            showGallery();
        } else {
            passwordFormView.style.display = 'flex';
            proofingGalleryView.style.display = 'none';
        }
    }

    checkAuth();
});