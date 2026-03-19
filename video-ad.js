// Video Advertisement Manager - Works without Firebase
// Stores settings in localStorage for GitHub Pages compatibility

// Default video ad settings
const defaultVideoAdSettings = {
    enabled: false,
    videoFileName: '',
    videoTitle: 'Special Offer',
    autoPlay: true,
    showCloseButton: true,
    position: 'top'
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

// Render video ad on page
export function renderVideoAd() {
    const settings = getVideoAdSettings();
    
    if (!settings.enabled || !settings.videoFileName) {
        return;
    }

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

    const container = document.getElementById('video-ad-container');
    if (container) {
        container.innerHTML = videoAdHTML;
        
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

// Close video ad function
window.closeVideoAd = function() {
    const adSection = document.getElementById('video-ad-section');
    if (adSection) {
        adSection.style.display = 'none';
    }
    sessionStorage.setItem('videoAdClosed', 'true');
};

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderVideoAd);
} else {
    renderVideoAd();
}
