document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 1;
    const maxPages = window.maxPages;
    const productGrid = document.getElementById('main-collection-product-grid');
    const loadingSpinner = document.querySelector('.infinite-scroll-loading-overlay');

    if (!productGrid || !loadingSpinner || typeof maxPages === 'undefined') {
        console.error('Necessary elements or variables are not found.');
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && currentPage < maxPages) {
                currentPage++;
                loadMoreProducts(currentPage);
            }
        });
    }, {
        rootMargin: '300px'
    });

    const nextPageLink = document.querySelector('.pagination .pagination-next a');
    if (nextPageLink) {
        observer.observe(nextPageLink);
    } else {
        console.warn('Next page link not found.');
    }

    async function loadMoreProducts(page) {
        loadingSpinner.classList.remove('hidden');
        loadingSpinner.style.display = 'block';

        try {
            const response = await fetch(`?page=${page}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newProducts = doc.querySelector('#main-collection-product-grid').innerHTML;
            if (!newProducts) {
                console.error('No new products found on the fetched page.');
                return;
            }
            productGrid.insertAdjacentHTML('beforeend', newProducts);
            const newNextPageLink = doc.querySelector('.pagination .pagination-next a');
            if (newNextPageLink) {
                observer.observe(newNextPageLink);
            } else {
                observer.disconnect();
                console.log('All pages loaded.');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
                loadingSpinner.classList.add('hidden');
            }, 500);
        }
    }
});
