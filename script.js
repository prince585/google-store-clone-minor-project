// --- 1. MOCK PRODUCT DATA ---
const MOCK_PRODUCTS = {
    phones: [
        { id: 'pixel8', name: 'Google Pixel 8 Pro', price: 999, category: 'phones',
          description: 'The ultimate Google phone with the best-in-class camera and AI features. Powered by the Tensor G3 chip.',
          image: 'https://placehold.co/400x400/4285F4/ffffff?text=Pixel+8+Pro' },
        { id: 'pixel8a', name: 'Google Pixel 8a', price: 499, category: 'phones',
          description: 'Awesome Google features at an incredible value. Durable design and great battery life.',
          image: 'https://placehold.co/400x400/34A853/ffffff?text=Pixel+8a' },
        { id: 'pixelfold', name: 'Google Pixel Fold', price: 1799, category: 'phones',
          description: 'A pocket-sized powerhouse that opens into a tablet. Multitasking redefined.',
          image: 'https://placehold.co/400x400/FBBC05/ffffff?text=Pixel+Fold' }
    ],
    watches: [
        { id: 'watch2', name: 'Google Pixel Watch 2', price: 349, category: 'watches',
          description: 'Advanced health features and a beautifully redesigned interface. Now with improved battery life.',
          image: 'https://placehold.co/400x400/EA4335/ffffff?text=Watch+2' },
        { id: 'watchbands', name: 'Woven Watch Band', price: 49, category: 'watches',
          description: 'Soft, breathable woven fabric for ultimate comfort during all-day wear.',
          image: 'https://placehold.co/400x400/5F6368/ffffff?text=Band' }
    ],
    home: [
        { id: 'nestcam', name: 'Nest Cam (Indoor, Wired)', price: 99, category: 'home',
          description: 'Keep an eye on what matters with 24/7 live view and powerful alerts.',
          image: 'https://placehold.co/400x400/4285F4/ffffff?text=Nest+Cam' },
        { id: 'nestmini', name: 'Nest Mini', price: 49, category: 'home',
          description: 'Small and mighty smart speaker with the Google Assistant. Great sound in every room.',
          image: 'https://placehold.co/400x400/34A853/ffffff?text=Nest+Mini' }
    ]
};

// --- 2. NAVIGATION/ROUTING LOGIC ---

// Helper to switch the active page
function navigateTo(pageId) {
    // Remove 'active' class from all pages
    document.querySelectorAll('.page-content').forEach(section => {
        section.classList.remove('active');
    });
    // Add 'active' class to the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0); // Scroll to top on page change
    } else {
        console.error('Page ID not found:', pageId);
    }
}

// --- 3. CATEGORY PAGE RENDERING ---

// Renders the category listing page with products from the specified category
function renderCategory(categoryKey) {
    const products = MOCK_PRODUCTS[categoryKey];
    const listContainer = document.getElementById('product-list');
    const categoryTitle = document.getElementById('category-title');

    if (!products || products.length === 0) {
        categoryTitle.textContent = `Category: ${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)} (Empty)`;
        listContainer.innerHTML = '<p class="text-center text-gray-500 mt-8">No products found in this category.</p>';
        navigateTo('category-page');
        return;
    }

    // Set Title
    categoryTitle.textContent = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1) + " Devices";

    // Generate HTML for product cards
    listContainer.innerHTML = products.map(product => `
        <div class="product-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer" onclick="renderProduct('${product.id}')">
            <div class="p-4 sm:p-6 text-center">
                <img class="h-48 w-full object-contain mx-auto mb-4" src="${product.image}" onerror="this.onerror=null;this.src='https://placehold.co/400x400/CCCCCC/000000?text=${product.name.replace(/\s/g, '+')}'" alt="${product.name}">
                <h3 class="text-xl font-semibold text-gray-900">${product.name}</h3>
                <p class="text-sm text-gray-500 mt-1">${product.description.substring(0, 50)}...</p>
                <p class="text-2xl font-bold text-gray-900 mt-4">$${product.price}</p>
                <button class="google-btn mt-4 w-full text-sm">Buy Now</button>
            </div>
        </div>
    `).join('');

    // Switch to the category page view
    navigateTo('category-page');
}

// --- 4. PRODUCT DETAIL PAGE RENDERING ---

// Function to find a product by its ID across all categories
function findProductById(productId) {
    for (const category in MOCK_PRODUCTS) {
        const product = MOCK_PRODUCTS[category].find(p => p.id === productId);
        if (product) return product;
    }
    return null;
}

// Renders the detailed view for a single product
function renderProduct(productId) {
    const product = findProductById(productId);
    const detailContainer = document.getElementById('product-detail-content');

    if (!product) {
        detailContainer.innerHTML = '<p class="text-center text-red-500 text-xl">Product not found.</p>';
        navigateTo('product-detail-page');
        return;
    }

    // HTML content for the detailed product view
    detailContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
            <img class="max-h-96 w-full object-contain" src="${product.image}" onerror="this.onerror=null;this.src='https://placehold.co/600x600/CCCCCC/000000?text=Product+Image'" alt="${product.name}">
            <div class="mt-6 flex space-x-2">
                <div class="w-6 h-6 rounded-full border-2 border-google-blue bg-google-blue cursor-pointer transition hover:scale-110"></div>
                <div class="w-6 h-6 rounded-full border border-gray-300 bg-gray-500 cursor-pointer transition hover:scale-110"></div>
                <div class="w-6 h-6 rounded-full border border-gray-300 bg-black cursor-pointer transition hover:scale-110"></div>
            </div>
        </div>

        <div class="flex flex-col justify-between py-4">
            <div>
                <span class="text-sm uppercase tracking-wider text-gray-500">${product.category}</span>
                <h1 class="text-5xl font-extrabold mt-1 text-gray-900">${product.name}</h1>
                <p class="text-4xl font-light text-gray-900 mt-4">$${product.price}</p>
                <hr class="my-6">
                <p class="text-lg text-gray-600 leading-relaxed">${product.description}</p>

                <ul class="list-disc list-inside text-gray-700 mt-6 space-y-2 ml-4">
                    <li>Seamless integration with Google ecosystem.</li>
                    <li>Latest software and security updates guaranteed.</li>
                    <li>24/7 technical support included.</li>
                </ul>
            </div>

            <div class="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button class="google-btn text-xl flex-grow" onclick="showMessage('Added to cart: ${product.name}')">
                    Add to Cart
                </button>
                <button class="bg-white text-google-blue border border-google-blue py-3 px-6 rounded-full font-medium transition hover:bg-gray-100 flex-grow text-xl" onclick="showMessage('Checking nearby stock for: ${product.name}')">
                    Check Stock
                </button>
            </div>
        </div>
    `;

    // Switch to the product detail page view
    navigateTo('product-detail-page');
}

// --- 5. CUSTOM MESSAGE BOX (Replacing alert()) ---

function showMessage(text) {
    const messageBox = document.createElement('div');
    messageBox.textContent = text;
    messageBox.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-2xl transition-opacity duration-300 z-[100]';
    document.body.appendChild(messageBox);

    setTimeout(() => {
        messageBox.style.opacity = '0';
        messageBox.addEventListener('transitionend', () => messageBox.remove());
    }, 3000);
}


// Set the initial page on load
window.onload = function() {
    navigateTo('homepage');

    // Handle browser back/forward navigation for a single-page app
    window.onpopstate = function(event) {
        // Simplistic state check: if state has category, render category, otherwise homepage
        if (event.state && event.state.category) {
            renderCategory(event.state.category);
        } else {
            navigateTo('homepage');
        }
    };
};