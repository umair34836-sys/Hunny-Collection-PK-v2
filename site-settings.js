// Site Settings Loader
import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export async function loadSiteSettings() {
    try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
        
        if (settingsDoc.exists()) {
            const settings = settingsDoc.data();
            applySettings(settings);
        } else {
            applyDefaultSettings();
        }
    } catch (error) {
        console.log('Settings not loaded, using defaults');
        applyDefaultSettings();
    }
}

function applySettings(settings) {
    // Store Name
    document.querySelectorAll('.store-name').forEach(el => {
        if (settings.storeName) el.textContent = settings.storeName;
    });
    
    // Tagline
    document.querySelectorAll('.store-tagline').forEach(el => {
        if (settings.storeTagline) el.textContent = settings.storeTagline;
    });
    
    // Description
    document.querySelectorAll('.store-description').forEach(el => {
        if (settings.storeDescription) el.textContent = settings.storeDescription;
    });
    
    // WhatsApp
    document.querySelectorAll('.whatsapp-number').forEach(el => {
        if (settings.whatsappNumber) el.textContent = settings.whatsappNumber;
    });
    
    // Email
    document.querySelectorAll('.contact-email').forEach(el => {
        if (settings.contactEmail) el.textContent = settings.contactEmail;
    });
    
    // Location
    document.querySelectorAll('.location').forEach(el => {
        if (settings.location) el.textContent = settings.location;
    });
    
    // Copyright
    document.querySelectorAll('.copyright-text').forEach(el => {
        if (settings.copyrightText) {
            el.textContent = settings.copyrightText;
        } else {
            el.textContent = '© ' + new Date().getFullYear() + ' Hunny Collection PK. All rights reserved.';
        }
    });
    
    // Meta Description
    if (settings.metaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', settings.metaDescription);
    }
    
    // Meta Keywords
    if (settings.metaKeywords) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) metaKeywords.setAttribute('content', settings.metaKeywords);
    }
}

function applyDefaultSettings() {
    const defaults = {
        storeName: 'Hunny Collection PK',
        storeTagline: 'Your Premium Destination for Female Fashion',
        storeDescription: 'Your premium destination for female fashion.',
        whatsappNumber: '+92 301 8858303',
        contactEmail: 'MrCopper804@gmil.com',
        location: 'Pakistan',
        copyrightText: '© ' + new Date().getFullYear() + ' Hunny Collection PK. All rights reserved.'
    };
    applySettings(defaults);
}

// Auto-load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSiteSettings);
} else {
    loadSiteSettings();
}

export { applySettings };
