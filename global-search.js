// Global Search Component
// This module provides universal search across all pages

import { db } from './firebase-config.js';
import { collection, getDocs, query, where, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Search state
let searchResults = [];
let searchVisible = false;
let currentSearchType = 'all'; // all, products, orders, users

/**
 * Initialize global search
 * Call this on page load to setup search functionality
 */
export function initGlobalSearch() {
    // Create search overlay if it doesn't exist
    if (!document.getElementById('global-search-overlay')) {
        createSearchOverlay();
    }

    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+K or Cmd+K to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        // Escape to close search
        if (e.key === 'Escape') {
            closeSearch();
        }
    });

    // Setup search input
    const searchInput = document.getElementById('global-search-input');
    const searchClose = document.getElementById('global-search-close');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300); // Debounce search by 300ms
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    // Close on overlay click
    const overlay = document.getElementById('global-search-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeSearch();
            }
        });
    }

    console.log('Global search initialized');
}

/**
 * Create search overlay HTML
 */
function createSearchOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'global-search-overlay';
    overlay.className = 'global-search-overlay';
    overlay.innerHTML = `
        <div class="global-search-container">
            <div class="global-search-header">
                <input 
                    type="text" 
                    id="global-search-input" 
                    placeholder="Search products, orders, users... (Ctrl+K)"
                    autocomplete="off"
                />
                <button id="global-search-close" class="search-close-btn">✕</button>
            </div>
            
            <div class="global-search-filters">
                <button class="search-filter-btn active" data-type="all">All</button>
                <button class="search-filter-btn" data-type="products">Products</button>
                <button class="search-filter-btn" data-type="orders">Orders</button>
                <button class="search-filter-btn" data-type="users">Users</button>
                <button class="search-filter-btn" data-type="investors">Investors</button>
            </div>
            
            <div id="global-search-results" class="global-search-results">
                <div class="search-placeholder">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
                    <div>Start typing to search...</div>
                </div>
            </div>
            
            <div class="global-search-footer">
                <span>Press ESC to close</span>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Setup filter buttons
    document.querySelectorAll('.search-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.search-filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentSearchType = e.target.dataset.type;
            
            // Re-run search with new filter
            const searchInput = document.getElementById('global-search-input');
            if (searchInput && searchInput.value) {
                performSearch(searchInput.value);
            }
        });
    });
}

/**
 * Open search overlay
 */
export function openSearch() {
    const overlay = document.getElementById('global-search-overlay');
    const input = document.getElementById('global-search-input');
    
    if (overlay) {
        overlay.classList.add('active');
        searchVisible = true;
        if (input) {
            input.focus();
            input.select();
        }
    }
}

/**
 * Close search overlay
 */
export function closeSearch() {
    const overlay = document.getElementById('global-search-overlay');
    const input = document.getElementById('global-search-input');
    
    if (overlay) {
        overlay.classList.remove('active');
        searchVisible = false;
        if (input) {
            input.value = '';
        }
        searchResults = [];
    }
}

/**
 * Perform search across collections
 */
async function performSearch(searchTerm) {
    const resultsContainer = document.getElementById('global-search-results');
    
    if (!searchTerm || searchTerm.trim().length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
                <div>Start typing to search...</div>
            </div>
        `;
        return;
    }

    // Show loading
    resultsContainer.innerHTML = '<div class="search-loading"><div class="spinner"></div><div>Searching...</div></div>';

    searchResults = [];
    const term = searchTerm.toLowerCase().trim();

    try {
        // Search based on current type
        if (currentSearchType === 'all' || currentSearchType === 'products') {
            await searchProducts(term);
        }
        if (currentSearchType === 'all' || currentSearchType === 'orders') {
            await searchOrders(term);
        }
        if (currentSearchType === 'all' || currentSearchType === 'users') {
            await searchUsers(term);
        }
        if (currentSearchType === 'all' || currentSearchType === 'investors') {
            await searchInvestors(term);
        }

        // Display results
        displayResults(term);
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
    }
}

/**
 * Search products collection
 */
async function searchProducts(term) {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        
        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data(), type: 'product' };
            
            // Search in name, category, description
            const searchableText = [
                product.name,
                product.category,
                product.description,
                product.brand
            ].filter(Boolean).join(' ').toLowerCase();

            if (searchableText.includes(term)) {
                searchResults.push(product);
            }
        });
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

/**
 * Search orders collection
 */
async function searchOrders(term) {
    try {
        const snapshot = await getDocs(collection(db, 'orders'));
        
        snapshot.forEach(doc => {
            const order = { id: doc.id, ...doc.data(), type: 'order' };
            
            // Search in customer name, contact, order ID
            const searchableText = [
                order.customerName,
                order.contact,
                order.id,
                order.email
            ].filter(Boolean).join(' ').toLowerCase();

            if (searchableText.includes(term)) {
                searchResults.push(order);
            }
        });
    } catch (error) {
        console.error('Error searching orders:', error);
    }
}

/**
 * Search users collection
 */
async function searchUsers(term) {
    try {
        const snapshot = await getDocs(collection(db, 'users'));
        
        snapshot.forEach(doc => {
            const user = { id: doc.id, ...doc.data(), type: 'user' };
            
            // Search in name, email, phone
            const searchableText = [
                user.name,
                user.email,
                user.phone,
                user.role
            ].filter(Boolean).join(' ').toLowerCase();

            if (searchableText.includes(term)) {
                searchResults.push(user);
            }
        });
    } catch (error) {
        console.error('Error searching users:', error);
    }
}

/**
 * Search investors collection
 */
async function searchInvestors(term) {
    try {
        const snapshot = await getDocs(collection(db, 'investors'));
        
        snapshot.forEach(doc => {
            const investor = { id: doc.id, ...doc.data(), type: 'investor' };
            
            // Search in name, code, phone, CNIC
            const searchableText = [
                investor.name,
                investor.code,
                investor.phone,
                investor.cnic
            ].filter(Boolean).join(' ').toLowerCase();

            if (searchableText.includes(term)) {
                searchResults.push(investor);
            }
        });
    } catch (error) {
        console.error('Error searching investors:', error);
    }
}

/**
 * Display search results
 */
function displayResults(term) {
    const resultsContainer = document.getElementById('global-search-results');
    
    if (searchResults.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <div style="font-size: 3rem; margin-bottom: 10px;">😕</div>
                <div>No results found for "<strong>${escapeHtml(term)}</strong>"</div>
            </div>
        `;
        return;
    }

    // Group results by type
    const grouped = {
        products: searchResults.filter(r => r.type === 'product'),
        orders: searchResults.filter(r => r.type === 'order'),
        users: searchResults.filter(r => r.type === 'user'),
        investors: searchResults.filter(r => r.type === 'investor')
    };

    let html = `<div class="search-results-count">${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found</div>`;

    // Products
    if (grouped.products.length > 0) {
        html += '<div class="search-results-group"><h3>🛍️ Products</h3>';
        html += grouped.products.slice(0, 5).map(product => `
            <a href="product.html?id=${product.id}" class="search-result-item" onclick="closeSearch()">
                <div class="search-result-icon">🛍️</div>
                <div class="search-result-content">
                    <div class="search-result-title">${escapeHtml(product.name || 'Unnamed Product')}</div>
                    <div class="search-result-meta">
                        ${product.category ? '📁 ' + escapeHtml(product.category) : ''}
                        ${product.price ? ' | 💰 Rs. ' + (product.sellingPrice || product.price).toLocaleString() : ''}
                    </div>
                </div>
            </a>
        `).join('');
        if (grouped.products.length > 5) {
            html += `<div class="search-result-more">+${grouped.products.length - 5} more products</div>`;
        }
        html += '</div>';
    }

    // Orders
    if (grouped.orders.length > 0) {
        html += '<div class="search-results-group"><h3>📦 Orders</h3>';
        html += grouped.orders.slice(0, 5).map(order => `
            <div class="search-result-item" onclick="goToOrder('${order.id}')">
                <div class="search-result-icon">📦</div>
                <div class="search-result-content">
                    <div class="search-result-title">#${order.id.slice(0, 8).toUpperCase()}</div>
                    <div class="search-result-meta">
                        👤 ${escapeHtml(order.customerName || 'N/A')}
                        | 📞 ${escapeHtml(order.contact || 'N/A')}
                        | 💰 Rs. ${(order.total || 0).toLocaleString()}
                        | <span class="badge badge-${order.status || 'pending'}">${order.status || 'Pending'}</span>
                    </div>
                </div>
            </div>
        `).join('');
        if (grouped.orders.length > 5) {
            html += `<div class="search-result-more">+${grouped.orders.length - 5} more orders</div>`;
        }
        html += '</div>';
    }

    // Users
    if (grouped.users.length > 0) {
        html += '<div class="search-results-group"><h3>👥 Users</h3>';
        html += grouped.users.slice(0, 5).map(user => `
            <div class="search-result-item">
                <div class="search-result-icon">👤</div>
                <div class="search-result-content">
                    <div class="search-result-title">${escapeHtml(user.name || 'Anonymous')}</div>
                    <div class="search-result-meta">
                        📧 ${escapeHtml(user.email || 'N/A')}
                        ${user.role ? ' | 🎭 ' + escapeHtml(user.role) : ''}
                    </div>
                </div>
            </div>
        `).join('');
        if (grouped.users.length > 5) {
            html += `<div class="search-result-more">+${grouped.users.length - 5} more users</div>`;
        }
        html += '</div>';
    }

    // Investors
    if (grouped.investors.length > 0) {
        html += '<div class="search-results-group"><h3>💼 Investors</h3>';
        html += grouped.investors.slice(0, 5).map(investor => `
            <div class="search-result-item">
                <div class="search-result-icon">💼</div>
                <div class="search-result-content">
                    <div class="search-result-title">${escapeHtml(investor.name || 'Unknown')}</div>
                    <div class="search-result-meta">
                        🆔 ${escapeHtml(investor.code || 'N/A')}
                        | 📞 ${escapeHtml(investor.phone || 'N/A')}
                        | 💰 Rs. ${(investor.investment || 0).toLocaleString()}
                    </div>
                </div>
            </div>
        `).join('');
        if (grouped.investors.length > 5) {
            html += `<div class="search-result-more">+${grouped.investors.length - 5} more investors</div>`;
        }
        html += '</div>';
    }

    resultsContainer.innerHTML = html;
}

/**
 * Navigate to order details (admin panel)
 */
window.goToOrder = function(orderId) {
    // If in admin panel, show order details
    if (window.location.pathname.includes('admin.html')) {
        if (window.viewOrderDetails) {
            window.viewOrderDetails(orderId);
        }
    } else {
        // Otherwise redirect to admin
        window.location.href = 'admin.html';
    }
};

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Add search icon to navbar
 * Call this function to add a search icon to any page's navbar
 */
export function addSearchIconToNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Check if search icon already exists
    if (document.getElementById('navbar-search-icon')) return;

    const searchIcon = document.createElement('div');
    searchIcon.id = 'navbar-search-icon';
    searchIcon.className = 'navbar-search-icon';
    searchIcon.innerHTML = '🔍';
    searchIcon.title = 'Search (Ctrl+K)';
    searchIcon.onclick = openSearch;
    searchIcon.style.cursor = 'pointer';

    navbar.appendChild(searchIcon);
}

// Export for global use
window.openGlobalSearch = openSearch;
window.closeGlobalSearch = closeSearch;
