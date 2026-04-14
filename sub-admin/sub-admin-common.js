// Sub-Admin Common Utilities - Shared functions for sub-admin panel
import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, query, where, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ========== AUTHENTICATION ==========

// Check if user is sub-admin (adminType='sub')
export async function isSubAdmin(user) {
    try {
        if (!user || !user.email) {
            console.log('❌ isSubAdmin: No user or email');
            return false;
        }

        console.log('🔍 Checking sub-admin status for:', user.email);
        console.log('🔑 User UID:', user.uid);

        // Check if admin document exists and has adminType='sub'
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));

        if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            console.log('✅ Admin document found');
            console.log('Admin type:', adminData.adminType);
            
            if (adminData.adminType === 'sub') {
                console.log('✅ User is a sub-admin');
                return true;
            } else if (adminData.adminType === 'god') {
                console.log('⚠️ User is a god admin, not sub-admin');
                return false;
            }
        }

        console.log('❌ User is not a sub-admin');
        return false;
    } catch (error) {
        console.error('❌ Error in isSubAdmin:', error);
        return false;
    }
}

// Check if user is god admin
export async function isGodAdmin(user) {
    try {
        if (!user || !user.email) return false;

        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        
        if (adminDoc.exists()) {
            return adminDoc.data().adminType === 'god';
        }

        return false;
    } catch (error) {
        console.error('Error checking god admin status:', error);
        return false;
    }
}

// Sub-admin authentication checker
export async function checkSubAdminAuth() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe(); // Unsubscribe after first check

            if (!user) {
                console.log('No user logged in, redirecting to login');
                window.location.href = 'sub-admin-login.html';
                resolve(false);
                return;
            }

            const subAdminCheck = await isSubAdmin(user);
            if (!subAdminCheck) {
                // Check if god admin trying to access sub-admin panel
                const godCheck = await isGodAdmin(user);
                if (godCheck) {
                    console.log('God admin accessing sub-admin panel');
                    resolve(true);
                    return;
                }

                const errorMsg = `NOT AUTHORIZED AS SUB-ADMIN\n\nYour email: ${user.email}\n\nPlease contact the god admin to be invited as a sub-admin.`;
                console.error(errorMsg);
                alert(errorMsg);
                window.location.href = '../index.html';
                resolve(false);
                return;
            }

            console.log('Sub-admin authorized!');
            resolve(true);
        });
    });
}

// Logout function
export async function logout() {
    try {
        await signOut(auth);
        alert('Logged out successfully!');
        window.location.href = '../index.html';
    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
}

// ========== MOBILE SIDEBAR ==========

// Toggle mobile sidebar
export function toggleMobileSidebar() {
    const sidebar = document.querySelector('.admin-sidebar, .sidebar');
    const overlay = document.querySelector('.admin-overlay, .sidebar-overlay');

    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// Close mobile sidebar
export function closeMobileSidebar() {
    const sidebar = document.querySelector('.admin-sidebar, .sidebar');
    const overlay = document.querySelector('.admin-overlay, .sidebar-overlay');

    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// Setup sidebar link close handlers - call once per page
export function setupSidebarCloseHandlers() {
    document.querySelectorAll('.admin-sidebar a, .sidebar a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileSidebar();
        });
    });
}

// ========== UTILITY FUNCTIONS ==========

// Format currency
export function formatCurrency(amount, currency = 'Rs.') {
    return `${currency} ${(amount || 0).toLocaleString()}`;
}

// Format date
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Format date with time
export function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// Get status badge class
export function getStatusBadgeClass(status) {
    const statusMap = {
        'pending': 'badge-pending',
        'confirmed': 'badge-confirmed',
        'shipped': 'badge-shipped',
        'delivered': 'badge-delivered',
        'cancelled': 'badge-cancelled',
        'approved': 'badge-delivered',
        'rejected': 'badge-cancelled'
    };
    return statusMap[status?.toLowerCase()] || 'badge-pending';
}

// Get status badge HTML
export function getStatusBadge(status) {
    const badgeClass = getStatusBadgeClass(status);
    return `<span class="badge ${badgeClass}">${(status || 'Pending').toUpperCase()}</span>`;
}

// Show loading state
export function showLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="loading" style="text-align: center; padding: 40px; color: var(--text-light);">${message}</div>`;
    }
}

// Show error message
export function showError(message, containerId = null) {
    const errorHtml = `<div class="alert alert-error" style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin: 20px 0;">${message}</div>`;

    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = errorHtml;
    } else {
        alert(message);
    }
}

// Show success message
export function showSuccess(message) {
    alert(message);
}

// Confirm action
export function confirmAction(message) {
    return confirm(message);
}

// Debounce function for search inputs
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== GLOBAL EXPORTS ==========

// Make functions available globally for inline onclick handlers
export function makeGlobalFunctions() {
    window.logout = logout;
    window.toggleMobileSidebar = toggleMobileSidebar;
    window.closeMobileSidebar = closeMobileSidebar;
    window.shareOnFacebook = () => alert('Facebook sharing not implemented');
    window.shareOnWhatsApp = () => alert('WhatsApp sharing not implemented');
    window.shareOnInstagram = () => alert('Instagram sharing not implemented');
    window.copyStoreLink = () => alert('Copy link not implemented');
    window.openUploadGuide = () => window.open('https://imgbb.com/', '_blank');
}
