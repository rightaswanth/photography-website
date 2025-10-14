// FILE: /js/gallery.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Gallery Data (Placeholder - In a real app, fetch from JSON or API) ---

    const galleryData = [
        {
            src: '/assets/img/galleries/smith-01.jpg',
            thumb: '/assets/img/galleries/smith-01-thumb.jpg',
            alt: 'The bride and groom sharing a quiet moment on the stone steps of the villa.',
            caption: 'The first look, soft and elegant in the morning light.'
        },
        {
            src: '/assets/img/galleries/smith-02.jpg',
            thumb: '/assets/img/galleries/smith-02-thumb.jpg',
            alt: 'A detailed shot of the bride\'s designer wedding shoes and floral bouquet.',
            caption: 'Details matter: the floral art and fine accessories.'
        },
        {
            src: '/assets/img/galleries/smith-03.jpg',
            thumb: '/assets/img/galleries/smith-03-thumb.jpg',
            alt: 'A wide aerial view of the reception tables set up under string lights.',
            caption: 'The long tables set for the Italian al-fresco dinner.'
        },
        {
            src: '/assets/img/galleries/smith-04.jpg',
            thumb: '/assets/img/galleries/smith-04-thumb.jpg',
            alt: 'A black and white close-up portrait of the couple laughing.',
            caption: 'Pure joy captured in black and white.'
        },
        {
            src: '/assets/img/galleries/smith-05.jpg',
            thumb: '/assets/img/galleries/smith-05-thumb.jpg',
            alt: 'A portrait of the groom standing by the waters edge of Lake Como.',
            caption: 'Julian, waiting by the beautiful water.'
        }
    ];

    // --- 2. DOM Elements and State ---

    const slideshowTrack = document.getElementById('slideshow-track');
    const thumbnailStrip = document.getElementById('thumbnail-strip');
    const captionEl = document.getElementById('slide-caption');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const downloadButton = document.getElementById('download-button');
    const shareButton = document.getElementById('share-button');

    let currentIndex = 0;
    let trackWidth = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // --- 3. Rendering and Initialization ---

    /**
     * Renders the slideshow track and thumbnails based on galleryData.
     */
    const renderGallery = () => {
        slideshowTrack.innerHTML = '';
        thumbnailStrip.innerHTML = '';

        galleryData.forEach((item, index) => {
            // Create Slide
            const slide = document.createElement('div');
            slide.classList.add('slide');
            slide.setAttribute('role', 'listitem');
            slide.setAttribute('aria-hidden', index !== 0);

            // Use <picture> for proper image optimization in the full viewer
            const picture = document.createElement('picture');
            picture.innerHTML = `
                <source type="image/webp" srcset="${item.src.replace('.jpg', '.webp')} 1600w">
                <img src="${item.src}" 
                     alt="${item.alt}" 
                     data-index="${index}" 
                     loading="lazy"
                     width="1600" height="1200">
            `;
            slide.appendChild(picture);
            slideshowTrack.appendChild(slide);

            // Create Thumbnail
            const thumbnail = document.createElement('button');
            thumbnail.classList.add('thumbnail-item');
            thumbnail.setAttribute('role', 'tab');
            thumbnail.setAttribute('aria-label', `Go to image ${index + 1}: ${item.caption}`);
            thumbnail.setAttribute('tabindex', 0);
            thumbnail.innerHTML = `<img src="${item.thumb}" alt="Thumbnail for ${item.caption}" data-index="${index}" width="80" height="80">`;
            thumbnail.addEventListener('click', () => goToSlide(index));
            thumbnailStrip.appendChild(thumbnail);
        });

        // Initialize state
        updateGalleryUI(0);
        trackWidth = slideshowTrack.offsetWidth;
    };

    // --- 4. Navigation Logic ---

    /**
     * Moves the slideshow to a specific index.
     * @param {number} index - The target slide index.
     */
    const goToSlide = (index) => {
        // Clamp index to boundaries for looping logic
        let newIndex = index;
        if (newIndex < 0) {
            newIndex = galleryData.length - 1;
        } else if (newIndex >= galleryData.length) {
            newIndex = 0;
        }

        currentIndex = newIndex;
        
        // Calculate the translation distance
        const offset = -currentIndex * trackWidth;
        slideshowTrack.style.transform = `translateX(${offset}px)`;

        updateGalleryUI(currentIndex);
    };

    /**
     * Updates all UI elements (caption, thumbnails, buttons, ARIA)
     * @param {number} index - The current slide index.
     */
    const updateGalleryUI = (index) => {
        // Update caption
        captionEl.textContent = `Image ${index + 1} of ${galleryData.length}: ${galleryData[index].caption}`;

        // Update thumbnails
        document.querySelectorAll('.thumbnail-item').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
            thumb.setAttribute('aria-selected', i === index);
            if (i === index) {
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

        // Update ARIA on slides
        document.querySelectorAll('.slide').forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== index);
        });

        // Update button state (always enabled due to looping)
        prevButton.disabled = false;
        nextButton.disabled = false;
    };

    // --- 5. Event Listeners ---

    // Button controls
    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });

    // Handle window resize to recalculate track width
    window.addEventListener('resize', () => {
        trackWidth = slideshowTrack.offsetWidth;
        // Re-apply translation based on new width
        const offset = -currentIndex * trackWidth;
        slideshowTrack.style.transform = `translateX(${offset}px)`;
    });

    // --- 6. Touch/Swipe Logic (Simple implementation) ---

    slideshowTrack.addEventListener('touchstart', (e) => {
        isDragging = true;
        startPos = e.touches[0].clientX;
        prevTranslate = currentTranslate;
        slideshowTrack.style.transition = 'none'; // Disable smooth transition during drag
    });

    slideshowTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentPos = e.touches[0].clientX;
        const diff = currentPos - startPos;
        currentTranslate = prevTranslate + diff;
        
        // Apply immediate translation during drag
        slideshowTrack.style.transform = `translateX(${currentTranslate}px)`;
    });

    slideshowTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        slideshowTrack.style.transition = ''; // Re-enable smooth transition

        const movedBy = currentTranslate - prevTranslate;
        
        // Determine if slide should change (swipe threshold: 10% of track width)
        if (movedBy < -trackWidth * 0.1) {
            goToSlide(currentIndex + 1); // Swiped left (next)
        } else if (movedBy > trackWidth * 0.1) {
            goToSlide(currentIndex - 1); // Swiped right (previous)
        } else {
            // Snap back to the current slide if not enough movement
            const offset = -currentIndex * trackWidth;
            slideshowTrack.style.transform = `translateX(${offset}px)`;
        }
    });
    
    // --- 7. Download and Share Functionality ---

    /**
     * Simulates client-side image download by re-exporting via Canvas (strips EXIF).
     */
    downloadButton.addEventListener('click', () => {
        const currentImage = slideshowTrack.querySelector(`img[data-index="${currentIndex}"]`);
        if (!currentImage) return;
        
        // Simple DOM Image loading to canvas
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Required for canvas operations on cross-origin images (if applicable)
        img.src = currentImage.src;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Re-export as JPEG (no EXIF metadata carried over)
            const dataURL = canvas.toDataURL('image/jpeg', 0.9); 
            
            // Create a temporary link and trigger download
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = `RobinReverie-${galleryData[currentIndex].caption.replace(/[^a-z0-9]/gi, '_')}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            alert(`Simulated download of: ${a.download}. (EXIF metadata stripped via canvas re-export.)`);
        };

        img.onerror = () => {
            alert("Error: Could not load image for download simulation. Check file paths.");
        }
    });

    /**
     * Shares the page using Web Share API or falls back to standard sharing.
     */
    shareButton.addEventListener('click', async () => {
        const shareData = {
            title: document.title,
            text: document.querySelector('meta[name="description"]').content,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Page shared successfully');
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert(`URL copied to clipboard! Share this link: ${shareData.url}`);
            }).catch(err => {
                console.error('Could not copy text: ', err);
                alert('Web Share not supported and failed to copy URL. Please copy the URL from the address bar.');
            });
        }
    });


    // --- 8. Final Execution ---
    renderGallery();
});