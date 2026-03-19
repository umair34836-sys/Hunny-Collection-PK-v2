// Video Advertisement Manager - Works without Firebase
// Stores settings in localStorage for GitHub Pages compatibility

// Default video ad settings
const defaultVideoAdSettings = {
    enabled: false,
    mediaFileName: '',
    mediaType: 'video', // 'video' or 'image'
    videoTitle: 'Special Offer',
    autoPlay: true,
    showCloseButton: true,
    position: 'top',
    showOnPages: ['index.html'],
    clickUrl: ''
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

    if (!settings.enabled || !settings.mediaFileName) {
        return;
    }

    // Check if video should show on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const showOnPages = settings.showOnPages || ['index.html'];
    
    if (!showOnPages.includes(currentPage)) {
        console.log('Media ad not shown on this page:', currentPage);
        return;
    }

    const closedSession = sessionStorage.getItem('videoAdClosed');
    if (closedSession && settings.position === 'popup') {
        return;
    }

    // Detect media type from file extension
    const fileExt = settings.mediaFileName.toLowerCase().split('.').pop();
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExt);
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

    const clickUrl = settings.clickUrl || '';
    const clickHandler = clickUrl ? `onclick="window.open('${escapeHtml(clickUrl)}', '_blank')"` : '';
    const cursorStyle = clickUrl ? 'cursor: pointer;' : '';

    let mediaContent = '';
    
    if (isVideo) {
        // Video content
        mediaContent = `
            <video ${settings.autoPlay ? 'autoplay muted loop playsinline' : 'controls'} id="media-player">
                <source src="assets/${escapeHtml(settings.mediaFileName)}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    } else if (isImage) {
        // Image content
        mediaContent = `
            <img src="assets/${escapeHtml(settings.mediaFileName)}" alt="${escapeHtml(settings.videoTitle)}" id="media-player" style="width: 100%; height: 100%; object-fit: contain;">
        `;
    } else {
        console.error('Unsupported media type:', fileExt);
        return;
    }

    const mediaAdHTML = `
        <section class="video-ad-section" id="media-ad-section">
            <div class="video-ad-container">
                ${settings.videoTitle ? `<h3 class="video-ad-title">${escapeHtml(settings.videoTitle)}</h3>` : ''}
                <div class="video-ad-wrapper" ${clickHandler} style="${cursorStyle}">
                    ${settings.showCloseButton ? '<button class="video-ad-close" onclick="closeMediaAd(event)" aria-label="Close media">✕</button>' : ''}
                    <button class="video-mute-btn" onclick="toggleMute(event)" aria-label="Toggle mute" id="mute-btn" style="display: none;">🔇</button>
                    ${mediaContent}
                </div>
            </div>
        </section>
    `;

    // Choose container based on position setting
    const containerId = settings.position === 'bottom' 
        ? 'video-ad-container-bottom' 
        : 'video-ad-container-top';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.log('Container not found:', containerId);
        return;
    }
    
    if (container) {
        container.innerHTML = mediaAdHTML;

        const mediaPlayer = document.getElementById('media-player');
        const muteBtn = document.getElementById('mute-btn');

        // Show mute button only for video
        if (mediaPlayer && muteBtn && isVideo) {
            mediaPlayer.onloadedmetadata = function() {
                muteBtn.style.display = 'flex';
            };

            mediaPlayer.onvolumechange = function() {
                muteBtn.textContent = mediaPlayer.muted || mediaPlayer.volume === 0 ? '🔇' : '🔊';
            };
        }

        // Auto-play for video
        if (isVideo && settings.autoPlay) {
            mediaPlayer.play().then(() => {
                console.log('Video autoplayed (muted). User can unmute.');
            }).catch(err => {
                console.log('Auto-play prevented, showing controls:', err);
                mediaPlayer.controls = true;
                if (muteBtn) muteBtn.style.display = 'flex';
            });
        }
        
        // Scroll to ad if position is top
        if (settings.position === 'top' && settings.autoPlay) {
            setTimeout(() => {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }
}

// Close media ad function (video or image)
window.closeMediaAd = function(event) {
    if (event) event.stopPropagation();
    
    const adSection = document.getElementById('media-ad-section');
    const mediaPlayer = document.getElementById('media-player');
    
    if (adSection) {
        adSection.style.display = 'none';
    }
    
    // Stop video if it's a video
    if (mediaPlayer && mediaPlayer.tagName === 'VIDEO') {
        mediaPlayer.pause();
        mediaPlayer.currentTime = 0;
        mediaPlayer.muted = true;
    }
    
    sessionStorage.setItem('videoAdClosed', 'true');
};

// Toggle mute/unmute (only for video)
window.toggleMute = function(event) {
    if (event) event.stopPropagation();
    
    const mediaPlayer = document.getElementById('media-player');
    const muteBtn = document.getElementById('mute-btn');
    
    if (mediaPlayer && muteBtn && mediaPlayer.tagName === 'VIDEO') {
        if (mediaPlayer.muted) {
            mediaPlayer.muted = false;
            mediaPlayer.volume = 1.0;
            muteBtn.textContent = '🔊';
            muteBtn.style.background = 'rgba(255, 105, 180, 0.9)';
        } else {
            mediaPlayer.muted = true;
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
