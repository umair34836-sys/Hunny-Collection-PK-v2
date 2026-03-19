// Main Application JavaScript
import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit, addDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Check auth state
let currentUser = null;

// Global auth state listener
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateAuthLink(user);
    updateCartCount();
});

// Update auth link in header
function updateAuthLink(user) {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;

    if (user) {
        authLink.textContent = '👤 Account';
        authLink.href = 'account.html';
    } else {
        authLink.textContent = 'Login';
        authLink.href = 'login.html';
    }
}

// Perform logout
async function performLogout() {
    try {
        await signOut(auth);
        alert('Logged out successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
}

// Update cart count
export function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (!cartCountEl) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCountEl.textContent = count;
}

// Load categories
export async function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });

        if (categories.length === 0) {
            container.innerHTML = '<p class="loading">Categories coming soon...</p>';
            return;
        }

        container.innerHTML = categories.map(cat => `
            <a href="shop.html?category=${encodeURIComponent(cat.name)}" class="category-card">
                <div class="category-icon">🌸</div>
                <div class="category-name">${cat.name}</div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
        container.innerHTML = '<p class="loading">Error loading categories</p>';
    }
}

// Load featured products
export async function loadFeaturedProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(8));
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        if (products.length === 0) {
            container.innerHTML = '<p class="loading">Products coming soon! Check back later.</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <a href="product.html?id=${product.id}" class="product-card">
                <img src="${product.images?.[0] || 'https://via.placeholder.com/300x300/FFB6C1/333?text=No+Image'}" 
                     alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">Rs. ${(product.price || 0).toLocaleString()}</div>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<p class="loading">Error loading products</p>';
    }
}

// Load all products for shop page
export async function loadAllProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        if (products.length === 0) {
            container.innerHTML = '<p class="loading">No products available</p>';
            return;
        }

        window.allProducts = products;
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<p class="loading">Error loading products</p>';
    }
}

// Render products helper
function renderProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <a href="product.html?id=${product.id}" class="product-card">
            <img src="${product.images?.[0] || 'https://via.placeholder.com/300x300/FFB6C1/333?text=No+Image'}" 
                 alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-title">${product.name}</div>
                <div class="product-price">Rs. ${(product.price || 0).toLocaleString()}</div>
            </div>
        </a>
    `).join('');
}

// Add to cart
export function addToCart(product, variant = {}, quantity = 1) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return false;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(
        item => item.id === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
        cart.push({ ...product, variant, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    return true;
}

// Get cart items
export function getCartItems() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Remove from cart
export function removeFromCart(index) {
    const cart = getCartItems();
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.renderCart) window.renderCart();
}

// Update cart quantity
export function updateCartQuantity(index, quantity) {
    const cart = getCartItems();
    if (quantity <= 0) {
        removeFromCart(index);
        return;
    }
    cart[index].quantity = quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    if (window.renderCart) window.renderCart();
}

// Render cart page
export function renderCartPage() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const totalFinalEl = document.getElementById('cart-total-final');
    if (!container) return;

    const cart = getCartItems();

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p class="loading">Add items to your cart to see them here</p><a href="shop.html" class="btn-primary" style="display:inline-block;margin-top:20px;">Start Shopping</a></div>';
        if (totalEl) totalEl.textContent = '0';
        if (totalFinalEl) totalFinalEl.textContent = '0';
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.images?.[0] || 'https://via.placeholder.com/100x100'}" 
                 alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-category">${item.category}</p>
                ${item.variant?.size ? `<p>Size: ${item.variant.size}</p>` : ''}
                ${item.variant?.color ? `<p>Color: ${item.variant.color}</p>` : ''}
                <p>Rs. ${(item.price || 0).toLocaleString()} × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button onclick="window.updateQuantity(${index}, ${item.quantity - 1})" class="btn-sm">-</button>
                <span>${item.quantity}</span>
                <button onclick="window.updateQuantity(${index}, ${item.quantity + 1})" class="btn-sm">+</button>
                <button onclick="window.removeFromCart(${index})" class="btn-sm btn-danger">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    if (totalEl) totalEl.textContent = total.toLocaleString();
    if (totalFinalEl) totalFinalEl.textContent = total.toLocaleString();
}

// Make functions available globally
window.removeFromCart = removeFromCart;
window.updateQuantity = updateCartQuantity;
window.renderCart = renderCartPage;

// Load single product
export async function loadProduct(productId) {
    const container = document.getElementById('product-detail');
    const pageTitle = document.getElementById('page-title');
    if (!container) return;

    try {
        // Get all products and find the matching one
        const querySnapshot = await getDocs(collection(db, 'products'));
        let product = null;

        querySnapshot.forEach((doc) => {
            if (doc.id === productId) {
                product = { id: doc.id, ...doc.data() };
            }
        });

        if (!product) {
            container.innerHTML = '<div class="loading">Product not found</div>';
            return;
        }

        if (pageTitle) {
            pageTitle.textContent = `${product.name} - Hunny Collection PK`;
        }

        window.currentProduct = product;
        let selectedSize = null;
        let currentImageIndex = 0;

        // Generate image gallery with navigation
        const images = product.images || [product.image || 'https://via.placeholder.com/500x500'];
        const mainImage = images[0] || 'https://via.placeholder.com/500x500';

        container.innerHTML = `
            <div class="product-detail-grid">
                <div class="product-images">
                    <div class="product-image-wrapper">
                        <button class="gallery-nav gallery-prev" onclick="previousImage()" id="prev-btn" style="display: ${images.length > 1 ? 'flex' : 'none'};">‹</button>
                        <img src="${mainImage}" alt="${product.name}" class="product-main-image" id="main-image">
                        <button class="gallery-nav gallery-next" onclick="nextImage()" id="next-btn" style="display: ${images.length > 1 ? 'flex' : 'none'};">›</button>
                    </div>
                    <div class="image-counter" id="image-counter" style="${images.length > 1 ? '' : 'display: none;'}">1 / ${images.length}</div>
                    ${images.length > 1 ? `
                        <div class="product-thumbnails">
                            ${images.map((img, idx) => `
                                <img src="${img}" class="product-thumbnail ${idx === 0 ? 'active' : ''}"
                                     onclick="changeImage(${idx}, '${img}', this)">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="product-details">
                    <span class="badge">${product.category}</span>
                    <h1>${product.name}</h1>
                    <p class="price">Rs. ${(product.price || 0).toLocaleString()}</p>
                    ${product.description ? `<p class="description">${product.description}</p>` : ''}
                    
                    ${product.variants?.length ? `
                        <div class="variant-group">
                            <label>Size:</label>
                            <div class="size-options">
                                ${product.variants.map(size => `
                                    <button class="size-btn" onclick="selectSize('${size}', this)">${size}</button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="quantity-group">
                        <label>Quantity:</label>
                        <input type="number" id="quantity" value="1" min="1" class="quantity-input">
                    </div>
                    
                    <button onclick="addToCartClick()" class="btn-primary btn-large">Add to Cart</button>
                    <button onclick="buyNow()" class="btn-secondary btn-large">Buy Now</button>
                    
                    <!-- Share Buttons -->
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border-color);">
                        <h4 style="margin-bottom: 10px; color: var(--text-dark);">Share This Product</h4>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button onclick="shareProductWhatsApp('${product.id}', '${product.name}')" class="btn-sm" style="background: #25d366; color: white; border: none; cursor: pointer;">
                                📱 WhatsApp
                            </button>
                            <button onclick="shareProductFacebook('${product.id}')" class="btn-sm" style="background: #1877f2; color: white; border: none; cursor: pointer;">
                                📘 Facebook
                            </button>
                            <button onclick="copyProductLink('${product.id}')" class="btn-sm" style="background: #6c757d; color: white; border: none; cursor: pointer;">
                                🔗 Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading product:', error);
        container.innerHTML = '<p>Error loading product</p>';
    }
}

// Change main image
window.changeImage = (imageUrl, thumbnail) => {
    document.getElementById('main-image').src = imageUrl;
    document.querySelectorAll('.product-thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
};

// Global functions for product page
window.selectSize = (size, btn) => {
    window.selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
};

window.addToCartClick = () => {
    const quantity = parseInt(document.getElementById('quantity')?.value || 1);
    const variant = window.selectedSize ? { size: window.selectedSize } : {};
    
    if (addToCart(window.currentProduct, variant, quantity)) {
        alert('Added to cart!');
    }
};

window.buyNow = () => {
    window.addToCartClick();
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
};

// Share functions
window.shareProductWhatsApp = function(productId, productName) {
    const url = window.location.href.split('?')[0] + '?id=' + productId;
    const message = '🌸 Check out this product: ' + productName + ' at Hunny Collection PK! Shop now: ' + url;
    window.open('https://wa.me/?text=' + encodeURIComponent(message), '_blank');
};

window.shareProductFacebook = function(productId) {
    const url = window.location.href.split('?')[0] + '?id=' + productId;
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'width=600,height=400');
};

window.copyProductLink = function(productId) {
    const url = window.location.href.split('?')[0] + '?id=' + productId;
    navigator.clipboard.writeText(url).then(() => {
        alert('✅ Product link copied to clipboard!\n\n' + url);
    }).catch(() => {
        prompt('Copy this link:', url);
    });
};

// Place order
export async function placeOrder(orderData) {
    try {
        await addDoc(collection(db, 'orders'), orderData);
        localStorage.removeItem('cart');
        updateCartCount();
        return { success: true };
    } catch (error) {
        console.error('Error placing order:', error);
        return { success: false, error: error.message };
    }
}

// Export for global use
window.updateCartCount = updateCartCount;
window.loadProduct = loadProduct;
window.changeImage = changeImage;
window.selectSize = selectSize;
window.addToCartClick = addToCartClick;
window.buyNow = buyNow;

// Image gallery navigation functions
let currentImageIndex = 0;
let productImages = [];

window.changeImage = function(index, imageUrl, thumbnailElement) {
    productImages = productImages || [];
    if (productImages.length === 0) {
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        productImages = Array.from(thumbnails).map(img => img.src);
    }
    
    currentImageIndex = index;
    const mainImage = document.getElementById('main-image');
    const counter = document.getElementById('image-counter');
    
    if (mainImage) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = imageUrl;
            mainImage.style.opacity = '1';
        }, 200);
    }
    
    // Update thumbnails
    document.querySelectorAll('.product-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    if (thumbnailElement) {
        thumbnailElement.classList.add('active');
    }
    
    // Update counter
    if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${productImages.length}`;
    }
    
    // Update navigation buttons
    updateNavButtons();
};

window.previousImage = function() {
    if (productImages.length === 0) {
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        productImages = Array.from(thumbnails).map(img => img.src);
    }
    
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    const thumbnail = document.querySelectorAll('.product-thumbnail')[currentImageIndex];
    window.changeImage(currentImageIndex, productImages[currentImageIndex], thumbnail);
};

window.nextImage = function() {
    if (productImages.length === 0) {
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        productImages = Array.from(thumbnails).map(img => img.src);
    }
    
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    const thumbnail = document.querySelectorAll('.product-thumbnail')[currentImageIndex];
    window.changeImage(currentImageIndex, productImages[currentImageIndex], thumbnail);
};

function updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn && nextBtn && productImages.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
}

// Initialize product images on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        if (thumbnails.length > 0) {
            productImages = Array.from(thumbnails).map(img => img.src);
            updateNavButtons();
        }
    });
}
