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
                    <button class="video-mute-btn" onclick="toggleMute()" aria-label="Toggle mute" id="mute-btn" style="display: none;">🔇</button>
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

        const videoPlayer = document.getElementById('video-ad-player');
        const muteBtn = document.getElementById('mute-btn');

        // Show mute button after video loads
        if (videoPlayer && muteBtn) {
            videoPlayer.onloadedmetadata = function() {
                muteBtn.style.display = 'flex';
            };

            videoPlayer.onvolumechange = function() {
                muteBtn.textContent = videoPlayer.muted || videoPlayer.volume === 0 ? '🔇' : '🔊';
            };
        }

        if (settings.autoPlay) {
            if (videoPlayer) {
                videoPlayer.play().then(() => {
                    // Auto-play successful, but muted
                    console.log('Video autoplayed (muted). User can unmute.');
                }).catch(err => {
                    console.log('Auto-play prevented, showing controls:', err);
                    videoPlayer.controls = true;
                    if (muteBtn) muteBtn.style.display = 'flex';
                });
            }
        }
    }
}

// Close video ad function
window.closeVideoAd = function() {
    const adSection = document.getElementById('video-ad-section');
    const videoPlayer = document.getElementById('video-ad-player');
    
    if (adSection) {
        adSection.style.display = 'none';
    }
    
    // Stop video and audio
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPlayer.muted = true;
    }
    
    sessionStorage.setItem('videoAdClosed', 'true');
};

// Toggle mute/unmute
window.toggleMute = function() {
    const videoPlayer = document.getElementById('video-ad-player');
    const muteBtn = document.getElementById('mute-btn');
    
    if (videoPlayer && muteBtn) {
        if (videoPlayer.muted) {
            videoPlayer.muted = false;
            videoPlayer.volume = 1.0;
            muteBtn.textContent = '🔊';
            muteBtn.style.background = 'rgba(255, 105, 180, 0.9)';
        } else {
            videoPlayer.muted = true;
            muteBtn.textContent = '🔇';
            muteBtn.style.background = 'rgba(0, 0, 0, 0.7)';
        }
    }
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
