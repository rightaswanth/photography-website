// FILE: /js/films.js

document.addEventListener('DOMContentLoaded', () => {
    const filmsGrid = document.getElementById('films-grid');
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('video-player-container');
    const closeButton = document.getElementById('modal-close-button');

    let isModalOpen = false;
    let triggerElement = null; // Element that opened the modal for focus return

    // --- 1. Data Fetching and Rendering ---

    /**
     * Fetches film data and renders the initial grid.
     */
    const initFilms = async () => {
        try {
            const response = await fetch('/assets/data/films.json');
            const filmData = await response.json();
            
            filmsGrid.innerHTML = '';
            filmData.forEach(item => {
                filmsGrid.appendChild(createFilmCard(item));
            });
            
            // Attach click handlers to the new cards
            document.querySelectorAll('.film-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    triggerElement = card;
                    openModal(card.dataset.type, card.dataset.src, card.dataset.title);
                });
            });

        } catch (error) {
            console.error('Error fetching film data:', error);
            filmsGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: red;">Failed to load film gallery.</p>';
        }
    };

    /**
     * Creates the HTML markup for a single film card.
     * @param {object} item - Film data object.
     * @returns {HTMLElement} The film card element.
     */
    const createFilmCard = (item) => {
        const card = document.createElement('article');
        card.classList.add('film-card');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Play film: ${item.title}`);
        // Store video data for lazy loading
        card.dataset.type = item.type; 
        card.dataset.src = item.video_src;
        card.dataset.title = item.title;

        card.innerHTML = `
            <a href="#" class="film-card__content">
                <picture>
                    <source type="image/webp" 
                        srcset="${item.poster_400} 400w, ${item.poster_800} 800w" 
                        sizes="(max-width: 600px) 100vw, 50vw">
                    <img src="${item.poster_800.replace('.webp', '.jpg')}" 
                        alt="Poster for ${item.title}" 
                        class="film-card__poster" 
                        loading="lazy" 
                        width="800" height="450">
                </picture>
                <div class="film-card__play-button" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5 3L19 12L5 21V3Z"/></svg>
                </div>
            </a>
            <div class="film-card__info">
                <h3>${item.title}</h3>
                <p>${item.location}</p>
            </div>
        `;
        return card;
    };

    // --- 2. Modal Logic ---

    /**
     * Opens the modal and injects the lazy-loaded player content.
     * @param {string} type - 'html5' or 'youtube'.
     * @param {string} src - The video source URL.
     * @param {string} title - The title for ARIA label.
     */
    const openModal = (type, src, title) => {
        playerContainer.innerHTML = ''; // Clear previous content

        if (type === 'html5') {
            playerContainer.innerHTML = `
                <video controls autoplay muted playsinline class="video-modal__player" 
                       aria-label="Video player for ${title}">
                    <source src="${src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            // Focus on the video element for a simple focus trap start
            playerContainer.querySelector('video').focus(); 
        } else if (type === 'youtube') {
            // Use iframe for YouTube, enabling autoplay and controls.
            // rel=0 hides related videos; modestbranding hides logo
            const youtubeSrc = `${src}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`;
            playerContainer.innerHTML = `
                <iframe src="${youtubeSrc}" frameborder="0" allow="autoplay; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen class="video-modal__player" 
                        title="YouTube video player for ${title}"></iframe>
            `;
             // Focus on the iframe container
             playerContainer.querySelector('iframe').focus(); 
        }

        // Show modal
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        isModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Ensure focus is on the close button or the video player itself
        closeButton.focus();
    };

    /**
     * Closes the modal and pauses the video.
     */
    const closeModal = () => {
        // Pause/stop video playback
        const videoElement = playerContainer.querySelector('video');
        const iframeElement = playerContainer.querySelector('iframe');

        if (videoElement) {
            videoElement.pause();
        } else if (iframeElement) {
            // Stop YouTube iframe playback by reloading source (empty source)
            iframeElement.src = iframeElement.src;
        }

        // Hide modal
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        isModalOpen = false;
        document.body.style.overflow = '';
        playerContainer.innerHTML = ''; // Clear content to fully lazy-unload

        // Return focus to the trigger element
        if (triggerElement) {
            triggerElement.focus();
            triggerElement = null;
        }
    };

    // --- 3. Event Listeners ---

    closeButton.addEventListener('click', closeModal);

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (isModalOpen && e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    });

    // Close modal on click outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- 4. Final Execution ---
    initFilms();
});