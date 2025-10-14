// FILE: /js/blog.js

document.addEventListener('DOMContentLoaded', () => {
    const filters = document.getElementById('category-filters');
    const searchInput = document.getElementById('blog-search');
    const blogGrid = document.getElementById('blog-grid');
    const blogCards = blogGrid.querySelectorAll('.blog-card');
    const noResultsMessage = document.getElementById('no-results');

    let activeFilter = 'all';
    let searchTerm = '';

    /**
     * Filters and searches the blog cards based on the active state.
     */
    const filterAndSearch = () => {
        let visibleCount = 0;
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        blogCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.dataset.title.toLowerCase();

            const categoryMatch = activeFilter === 'all' || category === activeFilter;
            const searchMatch = !normalizedSearchTerm || title.includes(normalizedSearchTerm);

            if (categoryMatch && searchMatch) {
                card.style.display = ''; // Show
                visibleCount++;
            } else {
                card.style.display = 'none'; // Hide
            }
        });

        // Toggle 'No Results' message
        noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    // --- 1. Category Filtering ---
    
    filters.addEventListener('click', (e) => {
        const target = e.target.closest('.filter-tag');
        if (!target) return;

        // Update active filter state
        filters.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('is-active');
            tag.setAttribute('aria-pressed', 'false');
        });
        
        target.classList.add('is-active');
        target.setAttribute('aria-pressed', 'true');
        activeFilter = target.dataset.filter;

        filterAndSearch();
    });

    // --- 2. Search Input ---

    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        filterAndSearch();
    });

    // Initial run (in case search/filter terms were pre-populated)
    filterAndSearch();
});