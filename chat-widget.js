// Floating Chat Widget - Appears on all pages
import { db, auth } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp, 
    where,
    limit,
    getDoc,
    doc,
    setDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const CHAT_COLLECTION = 'chats';
const MESSAGE_TTL_HOURS = 24;

let currentUser = null;
let widgetUnsubscribe = null;

// ========== CREATE WIDGET HTML ==========
function createWidget() {
    const widgetHTML = `
        <div class="chat-widget-container" id="chat-widget-container">
            <button class="chat-widget-button" id="chat-widget-toggle" onclick="toggleChatWidget()">
                <span class="chat-widget-icon">💬</span>
                <span class="chat-widget-badge" id="chat-widget-badge" style="display: none;">0</span>
            </button>
            <div class="chat-widget-popup" id="chat-widget-popup">
                <div class="chat-widget-header">
                    <div class="chat-widget-header-info">
                        <span class="chat-widget-header-icon">💬</span>
                        <div class="chat-widget-header-text">
                            <h4>Chat with Support</h4>
                            <p>We typically reply within minutes</p>
                        </div>
                    </div>
                    <button class="chat-widget-close" onclick="toggleChatWidget()">×</button>
                </div>
                <div id="chat-widget-messages" class="chat-widget-messages">
                    <div class="chat-widget-empty">
                        <div class="chat-widget-empty-icon">💭</div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
}

// ========== TOGGLE WIDGET ==========
window.toggleChatWidget = function() {
    const popup = document.getElementById('chat-widget-popup');
    popup.classList.toggle('active');
    
    if (popup.classList.contains('active') && currentUser) {
        loadWidgetMessages();
    }
};

// ========== LOAD WIDGET MESSAGES ==========
function loadWidgetMessages() {
    if (!currentUser || !currentUser.uid || widgetUnsubscribe) return;
    
    const messagesContainer = document.getElementById('chat-widget-messages');
    if (!messagesContainer) return;
    
    // Simple query without orderBy (no index needed)
    const messagesQuery = query(
        collection(db, 'messages'),
        where('chatId', '==', currentUser.uid)
    );
    
    widgetUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        if (snapshot.empty) {
            messagesContainer.innerHTML = `
                <div class="chat-widget-empty">
                    <div class="chat-widget-empty-icon">💭</div>
                    <p>No messages yet</p>
                    <p style="font-size: 11px; margin-top: 8px;">Start the conversation!</p>
                </div>
            `;
            return;
        }
        
        messagesContainer.innerHTML = '';
        const now = new Date();
        const messages = [];
        
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const expiresAt = new Date(messageData.expiresAt);
            
            if (now < expiresAt) {
                messages.push(messageData);
            }
        });
        
        // Sort by timestamp client-side (oldest first)
        messages.sort((a, b) => {
            const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
            return timeA - timeB;
        });
        
        messages.forEach((messageData) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-widget-message-item ${messageData.senderType}`;
            
            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'chat-widget-message-bubble';
            bubbleDiv.textContent = messageData.message;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'chat-widget-message-time';
            
            if (messageData.timestamp) {
                const date = messageData.timestamp.toDate();
                timeDiv.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            
            messageDiv.appendChild(bubbleDiv);
            messageDiv.appendChild(timeDiv);
            messagesContainer.appendChild(messageDiv);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

// ========== SEND WIDGET MESSAGE ==========
async function sendWidgetMessage(messageText) {
    if (!messageText.trim() || !currentUser) return false;
    
    try {
        const messageData = {
            chatId: currentUser.uid,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email,
            senderType: 'user',
            message: messageText.trim(),
            timestamp: serverTimestamp(),
            expiresAt: new Date(Date.now() + MESSAGE_TTL_HOURS * 60 * 60 * 1000).toISOString(),
            isRead: false
        };
        
        await addDoc(collection(db, 'messages'), messageData);
        
        await setDoc(doc(db, CHAT_COLLECTION, currentUser.uid), {
            userId: currentUser.uid,
            userName: currentUser.displayName || currentUser.email,
            userEmail: currentUser.email,
            createdAt: serverTimestamp(),
            lastMessageAt: serverTimestamp(),
            lastMessage: messageText.trim().substring(0, 100),
            isActive: true
        }, { merge: true });
        
        return true;
    } catch (error) {
        console.error('Error sending widget message:', error);
        return false;
    }
}

// ========== SHOW WIDGET CONTENT ==========
function showWidgetContent() {
    const messagesContainer = document.getElementById('chat-widget-messages');
    
    messagesContainer.innerHTML = `
        <div class="chat-widget-login-prompt">
            <div class="chat-widget-login-prompt-icon">💬</div>
            <h3>Chat with Us!</h3>
            <p>Get instant support from our team</p>
            <a href="chat.html" class="chat-widget-login-btn">Open Full Chat</a>
        </div>
    `;
    
    if (currentUser) {
        messagesContainer.innerHTML = `
            <div style="padding: 12px; background: white; border-top: 1px solid #eee;">
                <input type="text" id="widget-message-input" class="chat-widget-input" placeholder="Type a message..." maxlength="500" style="margin-bottom: 8px;">
                <button id="widget-send-btn" class="chat-widget-send" style="width: 100%;">Send Message</button>
                <a href="chat.html" style="display: block; text-align: center; margin-top: 8px; color: #8CE4FF; font-size: 12px; text-decoration: none;">Open Full Chat →</a>
            </div>
        `;
        
        // Setup send button
        setTimeout(() => {
            const sendBtn = document.getElementById('widget-send-btn');
            const input = document.getElementById('widget-message-input');
            
            if (sendBtn && input) {
                sendBtn.onclick = async () => {
                    const message = input.value.trim();
                    if (message) {
                        sendBtn.disabled = true;
                        const success = await sendWidgetMessage(message);
                        if (success) {
                            input.value = '';
                            loadWidgetMessages();
                        }
                        sendBtn.disabled = false;
                    }
                };
                
                input.onkeypress = (e) => {
                    if (e.key === 'Enter') {
                        sendBtn.click();
                    }
                };
            }
        }, 100);
        
        loadWidgetMessages();
    }
}

// ========== INITIALIZE WIDGET ==========
export function initChatWidget() {
    createWidget();
    
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        showWidgetContent();
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initChatWidget());
} else {
    initChatWidget();
}
