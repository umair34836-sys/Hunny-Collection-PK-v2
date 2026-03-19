// Video Advertisement Manager - Works without Firebase
// Stores settings in localStorage for GitHub Pages compatibility

// Default video ad settings
const defaultVideoAdSettings = {
    enabled: false,
    videoFileName: '',
    videoTitle: 'Special Offer',
    autoPlay: true,
    showCloseButton: true,
    position: 'top' // top, bottom, popup
};

// Load video ad settings from localStorage
export function getVideoAdSettings() {
    try {
        const stored = localStorage.getItem('videoAdSettings');
        if (stored) {
            return JSON.parse(stored);
        }
        return defaultVideoAdSettings;
    } catch (error) {
        console.error('Error loading video ad settings:', error);
        return defaultVideoAdSettings;
    }
}

// Save video ad settings to localStorage
export function saveVideoAdSettings(settings) {
    try {
        localStorage.setItem('videoAdSettings', JSON.stringify(settings));
        console.log('Video ad settings saved successfully');
        return true;
    } catch (error) {
        console.error('Error saving video ad settings:', error);
        return false;
    }
}

// Check if video exists in assets folder
export function videoExists(fileName) {
    if (!fileName) return false;
    // We'll try to load the video and check if it succeeds
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.onloadedmetadata = () => resolve(true);
        video.onerror = () => resolve(false);
        video.src = `assets/${fileName}`;
    });
}

// Render video ad on page
export function renderVideoAd() {
    const settings = getVideoAdSettings();
    
    if (!settings.enabled || !settings.videoFileName) {
        return;
    }

    // Check if user has closed this ad session
    const closedSession = sessionStorage.getItem('videoAdClosed');
    if (closedSession && settings.position === 'popup') {
        return;
    }

    const videoAdHTML = `
        <section class="video-ad-section" id="video-ad-section">
            <div class="video-ad-container">
                ${settings.videoTitle ? `<h3 class="video-ad-title">${escapeHtml(settings.videoTitle)}</h3>` : ''}
                <div class="video-ad-wrapper">
                    ${settings.showCloseButton ? '<button class="video-ad-close" onclick="closeVideoAd()" aria-label="Close video">✕</button>' : ''}
                    <video ${settings.autoPlay ? 'autoplay muted loop playsinline' : 'controls'} id="video-ad-player">
                        <source src="assets/${escapeHtml(settings.videoFileName)}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    `;

    // Insert video ad at appropriate position
    const container = document.getElementById('video-ad-container');
    if (container) {
        container.innerHTML = videoAdHTML;
        
        // Auto-play if enabled
        if (settings.autoPlay) {
            const videoPlayer = document.getElementById('video-ad-player');
            if (videoPlayer) {
                videoPlayer.play().catch(err => {
                    console.log('Auto-play prevented, showing controls:', err);
                    videoPlayer.controls = true;
                });
            }
        }
    }
}

// Close video ad (for popup mode)
window.closeVideoAd = function() {
    const adSection = document.getElementById('video-ad-section');
    if (adSection) {
        adSection.style.display = 'none';
    }
    // Remember user closed it for this session
    sessionStorage.setItem('videoAdClosed', 'true');
};

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize video ad when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderVideoAd);
} else {
    renderVideoAd();
}

// Export for manual use
export { renderVideoAd };
