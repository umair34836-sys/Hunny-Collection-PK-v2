// Chat System - Real-time messaging between users and admin
// Messages auto-delete after 24 hours

import { db, auth } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    serverTimestamp, 
    where,
    getDoc,
    doc,
    setDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const CHAT_COLLECTION = 'chats';
const MESSAGE_TTL_HOURS = 24; // Messages expire after 24 hours

let currentUser = null;
let isAdminUser = false;
let currentChatId = null;
let unsubscribeChat = null;

// ========== CHECK IF USER IS ADMIN ==========
async function checkAdminStatus(user) {
    if (!user) return false;
    try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        return adminDoc.exists();
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// ========== GET OR CREATE CHAT ROOM ==========
async function getOrCreateChatRoom(userId, isAdmin) {
    try {
        let chatQuery;
        
        if (isAdmin) {
            // Admin needs to see all chats - we'll handle this differently
            return null;
        } else {
            // User gets their own chat room
            chatQuery = query(
                collection(db, CHAT_COLLECTION),
                where('userId', '==', userId)
            );
            
            const querySnapshot = await getDoc(doc(db, CHAT_COLLECTION, userId));
            
            if (!querySnapshot.exists()) {
                // Create new chat room
                const chatData = {
                    userId: userId,
                    userName: currentUser.displayName || currentUser.email,
                    userEmail: currentUser.email,
                    createdAt: serverTimestamp(),
                    lastMessageAt: serverTimestamp(),
                    lastMessage: '',
                    isActive: true
                };
                
                await setDoc(doc(db, CHAT_COLLECTION, userId), chatData);
                return userId;
            } else {
                return userId;
            }
        }
    } catch (error) {
        console.error('Error getting/creating chat room:', error);
        throw error;
    }
}

// ========== SEND MESSAGE ==========
async function sendMessage(messageText) {
    if (!messageText.trim() || !currentUser) return;
    
    try {
        const messageData = {
            chatId: currentChatId || currentUser.uid,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email,
            senderType: isAdminUser ? 'admin' : 'user',
            message: messageText.trim(),
            timestamp: serverTimestamp(),
            expiresAt: new Date(Date.now() + MESSAGE_TTL_HOURS * 60 * 60 * 1000).toISOString(),
            isRead: false
        };
        
        await addDoc(collection(db, 'messages'), messageData);
        
        // Update chat room's last message
        if (currentChatId) {
            await setDoc(doc(db, CHAT_COLLECTION, currentChatId), {
                lastMessage: messageText.trim().substring(0, 100),
                lastMessageAt: serverTimestamp(),
                lastMessageSender: isAdminUser ? 'admin' : 'user'
            }, { merge: true });
        }
        
        return true;
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
        return false;
    }
}

// ========== RENDER MESSAGE ==========
function renderMessage(message) {
    const messageData = message.data();
    const isUserMessage = messageData.senderType === 'user';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUserMessage ? 'user' : 'admin'}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = messageData.message;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    
    if (messageData.timestamp) {
        const date = messageData.timestamp.toDate();
        timeDiv.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    messageDiv.appendChild(bubbleDiv);
    messageDiv.appendChild(timeDiv);
    
    return messageDiv;
}

// ========== LOAD CHAT MESSAGES ==========
function loadChatMessages(chatId) {
    if (!chatId) {
        console.error('chatId is undefined');
        return;
    }
    
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) {
        console.error('Messages container not found');
        return;
    }
    
    if (unsubscribeChat) {
        unsubscribeChat();
    }
    
    // Filter expired messages client-side as backup
    const now = new Date();
    
    // Simple query without orderBy (no index needed)
    const messagesQuery = query(
        collection(db, 'messages'),
        where('chatId', '==', chatId)
    );
    
    unsubscribeChat = onSnapshot(messagesQuery, (snapshot) => {
        messagesContainer.innerHTML = '';
        
        if (snapshot.empty) {
            messagesContainer.innerHTML = `
                <div class="no-messages">
                    <p>💬 No messages yet. Start the conversation!</p>
                </div>
            `;
            return;
        }
        
        let validMessages = [];
        
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            const expiresAt = new Date(messageData.expiresAt);
            
            // Skip expired messages (client-side cleanup)
            if (now < expiresAt) {
                validMessages.push({ id: doc.id, ...messageData });
            }
        });
        
        // Sort by timestamp client-side
        validMessages.sort((a, b) => {
            const timeA = a.timestamp ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp ? b.timestamp.toMillis() : 0;
            return timeA - timeB;
        });
        
        if (validMessages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="no-messages">
                    <p>💬 No messages yet. Start the conversation!</p>
                </div>
            `;
        } else {
            validMessages.forEach((messageData) => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${messageData.senderType}`;
                
                // Add sender label
                const senderLabel = document.createElement('div');
                senderLabel.style.cssText = `
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 4px;
                    padding: 0 12px;
                    color: ${messageData.senderType === 'admin' ? '#34b7f1' : '#666'};
                `;
                senderLabel.textContent = messageData.senderType === 'admin' ? '👨‍💼 Admin' : '👤 You';
                
                const bubbleDiv = document.createElement('div');
                bubbleDiv.className = 'message-bubble';
                bubbleDiv.textContent = messageData.message;
                
                const timeDiv = document.createElement('div');
                timeDiv.className = 'message-time';
                
                if (messageData.timestamp) {
                    const date = messageData.timestamp.toDate();
                    timeDiv.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                
                messageDiv.appendChild(senderLabel);
                messageDiv.appendChild(bubbleDiv);
                messageDiv.appendChild(timeDiv);
                messagesContainer.appendChild(messageDiv);
            });
        }
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, (error) => {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <p>❌ Error loading messages. Please refresh.</p>
            </div>
        `;
    });
}

// ========== SHOW LOGIN PROMPT ==========
function showLoginPrompt() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = `
        <div class="chat-login-prompt">
            <div class="chat-login-prompt-icon">🔒</div>
            <h2>Login to Chat</h2>
            <p>Please login to start chatting with our support team</p>
            <a href="login.html" class="btn-primary" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%); color: white; text-decoration: none; border-radius: 25px; font-weight: 600;">
                Login Now
            </a>
        </div>
    `;
}

// ========== SHOW ADMIN CHAT LIST ==========
function showAdminChatList() {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) {
        console.error('Chat container not found');
        return;
    }
    
    chatContainer.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-icon">💬</div>
            <div class="chat-header-info">
                <h1>Admin Chat Dashboard</h1>
                <p>Manage all user conversations</p>
            </div>
        </div>
        <div id="chat-list" style="flex: 1; overflow-y: auto; padding: 20px;">
            <div class="no-messages">
                <p>Loading chats...</p>
            </div>
        </div>
    `;

    // Load all chat rooms - simple query without orderBy
    const chatsQuery = query(
        collection(db, CHAT_COLLECTION)
    );

    onSnapshot(chatsQuery, (snapshot) => {
        const chatListContainer = document.getElementById('chat-list');
        
        if (!chatListContainer) {
            console.error('Chat list container not found');
            return;
        }

        if (snapshot.empty) {
            chatListContainer.innerHTML = `
                <div class="no-messages">
                    <p>💬 No active conversations yet</p>
                </div>
            `;
            return;
        }

        chatListContainer.innerHTML = '';
        const chats = [];

        snapshot.forEach((doc) => {
            chats.push({ id: doc.id, ...doc.data() });
        });

        // Sort client-side
        chats.sort((a, b) => {
            const timeA = a.lastMessageAt ? a.lastMessageAt.toMillis() : 0;
            const timeB = b.lastMessageAt ? b.lastMessageAt.toMillis() : 0;
            return timeB - timeA;
        });

        chats.forEach((chatData) => {
            const chatDiv = document.createElement('div');
            chatDiv.className = 'chat-item';
            chatDiv.style.cssText = `
                background: white;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 12px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;
            
            chatDiv.onmouseover = () => {
                chatDiv.style.transform = 'translateY(-2px)';
                chatDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            };
            chatDiv.onmouseout = () => {
                chatDiv.style.transform = 'translateY(0)';
                chatDiv.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            };
            
            const lastMessageTime = chatData.lastMessageAt ? 
                chatData.lastMessageAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            
            chatDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${chatData.userName}</strong>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9rem;">${chatData.userEmail}</p>
                    </div>
                    <span style="color: #999; font-size: 0.85rem;">${lastMessageTime}</span>
                </div>
                ${chatData.lastMessage ? `<p style="margin: 8px 0 0 0; color: #999; font-size: 0.85rem;">${chatData.lastMessage}</p>` : ''}
            `;
            
            chatDiv.onclick = () => openAdminChat(chatData, doc.id);
            
            chatListContainer.appendChild(chatDiv);
        });
    });
}

// ========== OPEN ADMIN CHAT ==========
function openAdminChat(chatData, chatId) {
    currentChatId = chatId;
    const chatContainer = document.getElementById('chat-container');
    
    chatContainer.innerHTML = `
        <div class="chat-header">
            <button id="back-to-list" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9rem;">← Back</button>
            <div class="chat-header-icon">💬</div>
            <div class="chat-header-info">
                <h1>Chat with ${chatData.userName}</h1>
                <p>${chatData.userEmail}</p>
            </div>
        </div>
        <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 20px; background: #f5f5f5;"></div>
        <div class="chat-input-container">
            <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." maxlength="1000">
            <button id="chat-send-btn" class="chat-send-btn">Send</button>
        </div>
    `;
    
    // Load messages
    loadChatMessages(chatId);
    
    // Setup event listeners
    document.getElementById('back-to-list').onclick = () => showAdminChatList();
    
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    
    sendBtn.onclick = async () => {
        const message = inputField.value.trim();
        if (message) {
            sendBtn.disabled = true;
            await sendMessage(message);
            inputField.value = '';
            sendBtn.disabled = false;
            inputField.focus();
        }
    };
    
    inputField.onkeypress = async (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    };
}

// ========== SHOW USER CHAT ==========
function showUserChat() {
    const chatContainer = document.getElementById('chat-container');
    
    if (!chatContainer) {
        console.error('Chat container not found');
        return;
    }
    
    chatContainer.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-icon">💬</div>
            <div class="chat-header-info">
                <h1>Chat with Support</h1>
                <p>We typically reply within a few minutes</p>
            </div>
            <div class="chat-status">
                <span class="status-dot"></span>
                <span>Online</span>
            </div>
        </div>
        <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 20px; background: #f5f5f5;"></div>
        <div class="chat-input-container">
            <input type="text" id="chat-input" class="chat-input" placeholder="Type your message..." maxlength="1000">
            <button id="chat-send-btn" class="chat-send-btn">Send</button>
        </div>
    `;
    
    // Load messages
    if (currentUser && currentUser.uid) {
        loadChatMessages(currentUser.uid);
    }
    
    // Setup event listeners
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    
    sendBtn.onclick = async () => {
        const message = inputField.value.trim();
        if (message) {
            sendBtn.disabled = true;
            const success = await sendMessage(message);
            if (success) {
                inputField.value = '';
            }
            sendBtn.disabled = false;
            inputField.focus();
        }
    };
    
    inputField.onkeypress = async (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    };
}

// ========== INITIALIZE CHAT ==========
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    
    if (!user) {
        showLoginPrompt();
        return;
    }
    
    isAdminUser = await checkAdminStatus(user);
    currentChatId = user.uid;
    
    if (isAdminUser) {
        showAdminChatList();
    } else {
        showUserChat();
    }
});
