// ============================================================
// MAIN.JS - Asosiy ilova logikasi (TO'LIQ)
// ============================================================

// ============================================================
// API CONFIG
// ============================================================
if (typeof API_URL === 'undefined') {
    const API_URL = window.location.origin + '/api';
}
function getToken() {
    return localStorage.getItem('jwt_token');
}

function setToken(token) {
    localStorage.setItem('jwt_token', token);
}

function removeToken() {
    localStorage.removeItem('jwt_token');
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const response = await fetch(API_URL + endpoint, {
        ...options,
        headers
    });

    if (response.status === 401) {
        removeToken();
        localStorage.removeItem('app_current_user');
        window.location.href = 'index.html';
        return null;
    }

    return response;
}

// ============================================================
// GLOBAL O'ZGARUVCHILAR
// ============================================================
let currentUser = null;
let favorites = [];
let calcUsageCount = 0;
let currentSubject = null;
let currentTopic = null;
let completedMissions = [];
let currentCalcFormula = null;
let selectedTestAnswers = {};
let testsCompleted = 0;

// ============================================================
// MISSIYALAR
// ============================================================
const missions = [
    { id: 1, title: "Birinchi qadam", desc: "1 ta formulani sevimlilarga qo'shing", reward: "title-bronze", rewardName: "🥉 Bronze", check: () => favorites.length >= 1 },
    { id: 2, title: "Kalkulyator ustasi", desc: "Kalkulyatordan 5 marta foydalaning", reward: "title-silver", rewardName: "⭐ Silver", check: () => calcUsageCount >= 5 },
    { id: 3, title: "Test yechuvchi", desc: "10 ta testni to'g'ri yeching", reward: "title-gold", rewardName: "🥇 Gold", check: () => getCompletedTestCount() >= 10 },
    { id: 4, title: "Fanlar olimpi", desc: "Barcha fanlardan kamida 1 ta formula ko'ring", reward: "title-diamond", rewardName: "💎 Diamond", check: () => false },
    { id: 5, title: "Mutaxassis", desc: "50 ta testni to'g'ri yeching", reward: "title-legendary", rewardName: "👑 Legendary", check: () => getCompletedTestCount() >= 50 }
];

// ============================================================
// FOYDALANUVCHI FUNKSIYALARI
// ============================================================

function getCurrentUser() {
    try {
        const saved = localStorage.getItem('app_current_user');
        if (!saved) return null;
        return JSON.parse(saved);
    } catch {
        return null;
    }
}

function isOwner(user) {
    return user && user.is_owner === true;
}

function getTitleHTML(title) {
    const titleNames = {
        'title-default': '👤 Default',
        'title-bronze': '🥉 Bronze',
        'title-silver': '⭐ Silver',
        'title-gold': '🥇 Gold',
        'title-diamond': '💎 Diamond',
        'title-legendary': '👑 Legendary',
        'title-owner': '👑 OWNER',
        'title-banned': '🚫 BANNED'
    };
    const name = titleNames[title] || '👤 Default';
    return `<span class="title-tag ${title}">${name}</span>`;
}

function getTitleDisplay(title) {
    const emojis = {
        'title-default': '👤 Default',
        'title-bronze': '🥉 Bronze',
        'title-silver': '🥈 Silver',
        'title-gold': '🥇 Gold',
        'title-diamond': '💎 Diamond',
        'title-legendary': '🌟 Legendary',
        'title-owner': '👑 OWNER'
    };
    return emojis[title] || '👤 Default';
}

// ============================================================
// TITLE TANLASH - FAQAT BAJARILGAN MISSIYALAR ASOSIDA
// ============================================================

function getAvailableTitles() {
    const user = getCurrentUser();
    if (!user) return [];
    
    // OWNER bo'lsa hamma title'ni tanlay oladi
    if (isOwner(user)) {
        return [
            { id: 'title-default', name: '👤 Default' },
            { id: 'title-bronze', name: '🥉 Bronze' },
            { id: 'title-silver', name: '🥈 Silver' },
            { id: 'title-gold', name: '🥇 Gold' },
            { id: 'title-diamond', name: '💎 Diamond' },
            { id: 'title-legendary', name: '🌟 Legendary' },
            { id: 'title-owner', name: '👑 OWNER' }
        ];
    }
    
    // Oddiy foydalanuvchi - faqat bajarilgan mission title'larini tanlay oladi
    const available = [{ id: 'title-default', name: '👤 Default' }];
    
    missions.forEach(mission => {
        // ✅ title-owner ni oddiy foydalanuvchiga qo'shma!
        if (completedMissions.includes(mission.id) && mission.reward && mission.reward !== 'title-owner') {
            available.push({
                id: mission.reward,
                name: mission.rewardName || mission.reward
            });
        }
    });
    
    return available;
}

function openTitleSelector() {
    const user = getCurrentUser();
    if (!user) {
        alert('Tizimga kiring!');
        return;
    }
    
    const available = getAvailableTitles();
    if (available.length === 1 && available[0].id === 'title-default') {
        alert('⚠️ Hali hech qanday title ochilmagan! Missiyalarni bajaring.');
        return;
    }
    
    const modal = document.getElementById('titleSelectorModal');
    if (!modal) {
        createTitleSelectorModal();
        return;
    }
    modal.classList.remove('hidden');
    renderTitleOptions();
}

function createTitleSelectorModal() {
    if (document.getElementById('titleSelectorModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'titleSelectorModal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:450px;">
            <button class="close-btn" onclick="closeModal('titleSelectorModal')">✕</button>
            <h2 style="color:#4a6cf7;">🏷️ Title tanlash</h2>
            <p style="color:#888;font-size:14px;margin-bottom:16px;">O'zingiz ochgan title'lardan birini tanlang:</p>
            <div id="titleOptionsList"></div>
            <button onclick="closeModal('titleSelectorModal')" style="margin-top:16px;width:100%;padding:12px;background:#333;border:none;border-radius:8px;color:#aaa;cursor:pointer;">Yopish</button>
        </div>
    `;
    document.body.appendChild(modal);
    renderTitleOptions();
}

function renderTitleOptions() {
    const container = document.getElementById('titleOptionsList');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        container.innerHTML = '<p style="color:#888;">Tizimga kiring</p>';
        return;
    }
    
    const available = getAvailableTitles();
    const currentTitle = currentUser.title || 'title-default';
    const isOwnerUser = isOwner(currentUser);
    
    if (available.length === 1 && available[0].id === 'title-default') {
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:#888;">
                <p>📭 Hali hech qanday title ochilmagan!</p>
                <p style="font-size:13px;">Missiyalarni bajarib, title'larni oching.</p>
                <button onclick="closeModal('titleSelectorModal')" style="margin-top:12px;padding:8px 20px;background:#4a6cf7;border:none;border-radius:6px;color:white;cursor:pointer;">Yopish</button>
            </div>
        `;
        return;
    }
    
    let html = '<div style="margin-bottom:12px;color:#888;font-size:13px;">🎯 Siz ochgan title\'lar:</div>';
    
    html += available.map(title => {
        const isActive = currentTitle === title.id;
        
        return `
            <div onclick="${isActive ? '' : `selectTitle('${title.id}')`}" style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                padding:12px 16px;
                background: ${isActive ? '#1a2a4a' : '#0a0a0a'};
                border: 2px solid ${isActive ? '#4a6cf7' : '#333'};
                border-radius:10px;
                margin-bottom:8px;
                cursor: ${isActive ? 'default' : 'pointer'};
                transition:0.3s;
                opacity: ${isActive ? 1 : 0.8};
            " ${!isActive ? `onmouseover="this.style.borderColor='#4a6cf7'" onmouseout="this.style.borderColor='#333'"` : ''}>
                <span style="font-size:16px;">${title.name}</span>
                ${isActive ? '<span style="color:#4a6cf7;">✅ Tanlangan</span>' : '<span style="color:#888;">Tanlash</span>'}
            </div>
        `;
    }).join('');
    
    if (!isOwnerUser) {
        html += `
            <div style="margin-top:12px;padding:12px;background:#1a1a1a;border-radius:8px;border:1px solid #333;text-align:center;">
                <div style="color:#888;font-size:12px;">
                    💡 Yangi title'lar ochish uchun missiyalarni bajaring!
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

async function selectTitle(titleId) {
    const user = getCurrentUser();
    if (!user) {
        alert('Tizimga kiring!');
        return;
    }
    
    const available = getAvailableTitles();
    if (!available.find(t => t.id === titleId)) {
        alert('❌ Bu title sizga ruxsat etilmagan!');
        return;
    }
    
    try {
        const response = await apiRequest(`/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify({ title: titleId })
        });
        
        if (!response) return;
        const updatedUser = await response.json();
        
        localStorage.setItem('app_current_user', JSON.stringify(updatedUser));
        updateUI();
        renderTitleOptions();
        
        showNotification(`✅ Title o'zgartirildi!`, 'success');
        closeModal('titleSelectorModal');
    } catch (error) {
        console.error('Title o\'zgartirish xatosi:', error);
        alert('Xatolik yuz berdi');
    }
}

// ============================================================
// LOCALSTORAGE YORDAMCHI FUNKSIYALAR
// ============================================================

function saveState() {
    try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        localStorage.setItem('calcUsageCount', String(calcUsageCount));
        localStorage.setItem('completedMissions', JSON.stringify(completedMissions));
        localStorage.setItem('selectedTestAnswers', JSON.stringify(selectedTestAnswers));
    } catch(e) { console.warn('LocalStorage xato:', e); }
}

function loadState() {
    try {
        const f = localStorage.getItem('favorites');
        const c = localStorage.getItem('calcUsageCount');
        const m = localStorage.getItem('completedMissions');
        const t = localStorage.getItem('selectedTestAnswers');

        if (f) favorites = JSON.parse(f);
        if (c) calcUsageCount = parseInt(c) || 0;
        if (m) completedMissions = JSON.parse(m);
        if (t) selectedTestAnswers = JSON.parse(t);

        currentUser = getCurrentUser();
    } catch(e) { console.warn('LocalStorage xato:', e); }
}

// ============================================================
// GET COMPLETED TEST COUNT
// ============================================================
function getCompletedTestCount() {
    let completed = 0;
    if (typeof allTests !== 'undefined') {
        for (const key in selectedTestAnswers) {
            const idx = parseInt(key);
            if (selectedTestAnswers[idx] !== undefined && 
                selectedTestAnswers[idx] === allTests[idx]?.correct) {
                completed++;
            }
        }
    }
    return completed;
}

// ============================================================
// UPDATE UI
// ============================================================
function updateUI() {
    currentUser = getCurrentUser();
    
    const sidebarUsername = document.getElementById('sidebarUsername');
    const sidebarEmail = document.getElementById('sidebarEmail');
    const sidebarUserId = document.getElementById('sidebarUserId');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const logoutBtn = document.getElementById('sidebarLogout');
    const loginBtn = document.getElementById('loginBtn');
    const favCount = document.getElementById('favCount');
    const testCount = document.getElementById('testCount');
    const titleCount = document.getElementById('titleCount');

    if (sidebarUsername) sidebarUsername.textContent = currentUser?.username || 'Mehmon';
    if (sidebarEmail) sidebarEmail.textContent = currentUser?.email || 'Tizimga kirmagansiz';
    if (sidebarUserId) sidebarUserId.textContent = currentUser ? `🆔 ID: ${currentUser.id}` : '';
    
    if (sidebarAvatar) {
        if (currentUser?.avatar) {
            sidebarAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="avatar">`;
        } else {
            sidebarAvatar.innerHTML = '👤';
        }
    }

    if (logoutBtn) logoutBtn.style.display = currentUser ? 'flex' : 'none';
    if (loginBtn) loginBtn.classList.toggle('hide', !!currentUser);
    if (favCount) favCount.textContent = favorites?.length || 0;
    if (testCount) testCount.textContent = getCompletedTestCount();
    
    if (titleCount) {
        const available = getAvailableTitles();
        titleCount.textContent = available.length - 1;
    }

    // Profile
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    const profileRegDate = document.getElementById('profileRegDate');
    const profileFavCount = document.getElementById('profileFavCount');
    const profileTestCount = document.getElementById('profileTestCount');
    const profileCalcCount = document.getElementById('profileCalcCount');
    const profileTitleDisplay = document.getElementById('profileTitleDisplay');
    const profileUserId = document.getElementById('profileUserId');

    if (profileUsername) profileUsername.textContent = currentUser?.username || '-';
    if (profileEmail) profileEmail.textContent = currentUser?.email || '-';
    if (profileRegDate) profileRegDate.textContent = currentUser?.registered_at || '-';
    if (profileFavCount) profileFavCount.textContent = favorites?.length || 0;
    if (profileTestCount) profileTestCount.textContent = getCompletedTestCount();
    if (profileCalcCount) profileCalcCount.textContent = calcUsageCount || 0;
    if (profileUserId) profileUserId.textContent = currentUser?.id || '-';
    
    if (profileTitleDisplay && currentUser) {
        const title = isOwner(currentUser) ? 'title-owner' : (currentUser.title || 'title-default');
        profileTitleDisplay.innerHTML = getTitleHTML(title);
    }

    // Stats
    const statsTotalFormulas = document.getElementById('statsTotalFormulas');
    const statsTotalSubjects = document.getElementById('statsTotalSubjects');
    const statsFavCount = document.getElementById('statsFavCount');
    const statsUsersCount = document.getElementById('statsUsersCount');
    const statsTestsCount = document.getElementById('statsTestsCount');

    if (statsTotalFormulas) {
        const total = Object.values(formulasData || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        statsTotalFormulas.textContent = total;
    }
    if (statsTotalSubjects) statsTotalSubjects.textContent = Object.keys(subjectInfo || {}).length;
    if (statsFavCount) statsFavCount.textContent = favorites?.length || 0;
    if (statsUsersCount) statsUsersCount.textContent = 'Loading...';
    if (statsTestsCount) statsTestsCount.textContent = getCompletedTestCount();

    saveState();
    updateFormulaCounts();
    loadPrivateChats();
}

function updateFormulaCounts() {
    if (typeof formulasData === 'undefined') return;
    Object.keys(subjectInfo).forEach(key => {
        const count = formulasData[key] ? formulasData[key].length : 0;
        const badge = document.getElementById(`badge-${key}`);
        const countEl = document.getElementById(`count-${key}`);
        if (badge) badge.textContent = `${count} formula`;
        if (countEl) countEl.textContent = count;
    });
}

// ============================================================
// LOGOUT
// ============================================================
function logoutUser() {
    const user = getCurrentUser();
    if (user) {
        fetch(API_URL + '/offline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
        }).catch(() => {});
    }
    removeToken();
    localStorage.removeItem('app_current_user');
    window.location.href = 'index.html';
}

// ============================================================
// ONLINE USERS
// ============================================================
async function updateOnlineStatus() {
    const user = getCurrentUser();
    if (!user) return;

    try {
        await fetch(API_URL + '/online', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                username: user.username
            })
        });
    } catch (error) {
        console.error('Update online status error:', error);
    }
}

async function getOnlineUsers() {
    try {
        const response = await fetch(API_URL + '/online');
        return await response.json();
    } catch (error) {
        console.error('Get online users error:', error);
        return [];
    }
}

// ============================================================
// GLOBAL CHAT
// ============================================================
async function loadChatMessages() {
    try {
        const response = await apiRequest('/chat/global');
        if (!response) return;
        const messages = await response.json();

        const container = document.getElementById('chatMessages');
        if (!container) return;

        const currentUser = getCurrentUser();
        const isOwnerUser = currentUser && isOwner(currentUser);

        let html = messages.map((msg) => {
            const isOwn = currentUser && msg.user_id === currentUser.id;
            let titleToUse = msg.title || 'title-default';
            if (isOwnerUser && msg.user_id === currentUser.id) {
                titleToUse = 'title-owner';
            }

            let avatarHTML = msg.avatar 
                ? `<img class="msg-avatar" src="${msg.avatar}" alt="${msg.username}">` 
                : `<div class="msg-avatar-placeholder">👤</div>`;

            let actionsHTML = '';
            if (isOwnerUser) {
                actionsHTML = `
                    <div class="msg-actions">
                        <button class="delete-btn" onclick="deleteGlobalMessage(${msg.id})" title="O'chirish">🗑️</button>
                    </div>
                `;
            }

            return `
                <div class="msg ${isOwn ? 'own' : 'other'}" id="msg-${msg.id}">
                    ${!isOwn ? avatarHTML : ''}
                    <div class="msg-content">
                        <div class="msg-user">
                            ${msg.username}
                            <span class="msg-user-id">#${msg.user_id}</span>
                            ${getTitleHTML(titleToUse)}
                        </div>
                        <div class="msg-text">${msg.text}</div>
                        <div class="msg-time">${new Date(msg.timestamp).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute: '2-digit'})}</div>
                        ${actionsHTML}
                    </div>
                    ${isOwn ? avatarHTML : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('Load chat error:', error);
    }
}

async function sendChatMessage(text) {
    if (!text || text.trim() === '') return;
    if (!getCurrentUser()) {
        alert('Avval tizimga kiring!');
        return;
    }

    try {
        const response = await apiRequest('/chat/global', {
            method: 'POST',
            body: JSON.stringify({ text: text.trim() })
        });

        if (!response) return;
        await response.json();

        loadChatMessages();
        const input = document.getElementById('chatInput');
        if (input) input.value = '';
    } catch (error) {
        console.error('Send chat error:', error);
        alert('Xabar yuborishda xatolik: ' + error.message);
    }
}

async function deleteGlobalMessage(messageId) {
    if (!confirm('Xabarni o\'chirasizmi?')) return;

    try {
        const response = await apiRequest(`/chat/global/${messageId}`, {
            method: 'DELETE'
        });

        if (!response) return;
        const data = await response.json();

        if (data.success) {
            loadChatMessages();
            alert('✅ Xabar o\'chirildi!');
        }
    } catch (error) {
        console.error('Delete message error:', error);
        alert('Xatolik: ' + error.message);
    }
}

// ============================================================
// PRIVATE CHAT
// ============================================================
async function loadPrivateChats() {
    try {
        const response = await apiRequest('/chat/users');
        if (!response) return;
        const users = await response.json();

        const section = document.getElementById('privateChatsSection');
        if (!section) return;

        if (!getCurrentUser()) {
            section.innerHTML = `
                <h4>💬 Shaxsiy chatlar</h4>
                <p style="color:#888;text-align:center;padding:12px;font-size:13px;">Tizimga kiring</p>
            `;
            return;
        }

        if (users.length === 0) {
            section.innerHTML = `
                <h4>💬 Shaxsiy chatlar</h4>
                <p style="color:#888;text-align:center;padding:12px;font-size:13px;">Hali chatlar yo'q</p>
            `;
            return;
        }

        let html = `<h4>💬 Shaxsiy chatlar</h4>`;
        users.forEach(user => {
            html += `
                <div class="private-chat-item" onclick="openPrivateChat(${user.user_id}, '${user.username}')">
                    <div class="chat-avatar">${user.avatar ? `<img src="${user.avatar}" alt="">` : '👤'}</div>
                    <div class="chat-info">
                        <div class="chat-name">${user.username}</div>
                        <div class="chat-id">${user.name || ''}</div>
                    </div>
                </div>
            `;
        });
        section.innerHTML = html;
    } catch (error) {
        console.error('Load private chats error:', error);
    }
}

let currentPrivateChatUserId = null;

async function openPrivateChat(userId, username) {
    currentPrivateChatUserId = userId;
    const modal = document.getElementById('privateChatModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('privateChatTitle').textContent = '💬 ' + username;
    }
    await loadPrivateMessages(userId);
}

async function loadPrivateMessages(userId) {
    try {
        const response = await apiRequest(`/chat/private/${userId}`);
        if (!response) return;
        const messages = await response.json();

        const container = document.getElementById('privateChatMessages');
        if (!container) return;

        const currentUser = getCurrentUser();
        let html = messages.map(msg => {
            const isOwn = msg.from_user_id === currentUser?.id;
            return `
                <div class="msg ${isOwn ? 'own' : 'other'}">
                    <div class="msg-content">
                        <div class="msg-text">${msg.text}</div>
                        <div class="msg-time">${new Date(msg.timestamp).toLocaleTimeString('uz-UZ', {hour: '2-digit', minute: '2-digit'})}</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html || '<div style="color:#888;text-align:center;padding:20px;">Hali xabarlar yo\'q</div>';
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('Load private messages error:', error);
    }
}

async function sendPrivateMessage() {
    const input = document.getElementById('privateChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    if (!currentPrivateChatUserId) return;

    try {
        const response = await apiRequest('/chat/private', {
            method: 'POST',
            body: JSON.stringify({ 
                toUserId: currentPrivateChatUserId, 
                text: text 
            })
        });

        if (!response) return;
        await response.json();
        input.value = '';
        await loadPrivateMessages(currentPrivateChatUserId);
    } catch (error) {
        console.error('Send private message error:', error);
        alert('Xatolik: ' + error.message);
    }
}

function closePrivateChat() {
    const modal = document.getElementById('privateChatModal');
    if (modal) modal.style.display = 'none';
    currentPrivateChatUserId = null;
}

// ============================================================
// MODALLAR
// ============================================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        if (id === 'favoritesModal') renderFavorites();
        if (id === 'missionsModal') renderMissions();
        if (id === 'profileModal') updateUI();
        if (id === 'testsModal') {
            showTestsView();
        }
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

// ============================================================
// NAVIGATSIYA
// ============================================================
function showMain() {
    const formulasView = document.getElementById('formulasView');
    const calculatorView = document.getElementById('formulaCalculatorView');
    const testsView = document.getElementById('testsView');
    const menuGrid = document.getElementById('menuGrid');

    if (formulasView) formulasView.style.display = 'none';
    if (calculatorView) calculatorView.style.display = 'none';
    if (testsView) testsView.style.display = 'none';
    if (menuGrid) menuGrid.style.display = 'grid';
    window.scrollTo(0, 0);
}

function showTestsView() {
    const testsView = document.getElementById('testsView');
    const menuGrid = document.getElementById('menuGrid');
    const formulasView = document.getElementById('formulasView');
    const calculatorView = document.getElementById('formulaCalculatorView');

    if (testsView) testsView.style.display = 'block';
    if (menuGrid) menuGrid.style.display = 'none';
    if (formulasView) formulasView.style.display = 'none';
    if (calculatorView) calculatorView.style.display = 'none';

    if (typeof renderTests === 'function') {
        renderTests();
        console.log('✅ Tests rendered in showTestsView()');
    }
}

function showSubject(subjectKey) {
    currentSubject = subjectKey;
    currentTopic = null;

    const menuGrid = document.getElementById('menuGrid');
    const formulasView = document.getElementById('formulasView');
    const calculatorView = document.getElementById('formulaCalculatorView');
    const testsView = document.getElementById('testsView');

    if (menuGrid) menuGrid.style.display = 'none';
    if (calculatorView) calculatorView.style.display = 'none';
    if (testsView) testsView.style.display = 'none';
    if (formulasView) formulasView.style.display = 'block';

    if (getCurrentUser()) {
        apiRequest('/users/viewed-subject', {
            method: 'POST',
            body: JSON.stringify({ subject: subjectKey })
        }).catch(() => {});
    }

    const subjectFilter = document.getElementById('subjectFilter');
    if (subjectFilter) {
        subjectFilter.innerHTML = '<option value="">Barcha fanlar</option>';
        Object.keys(subjectInfo).forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = `${subjectInfo[key].icon} ${subjectInfo[key].name}`;
            if (key === subjectKey) opt.selected = true;
            subjectFilter.appendChild(opt);
        });
    }

    updateTopicFilter();
    renderFormulas();
    window.scrollTo(0, 0);
}

// ============================================================
// FORMULA KALKULYATOR
// ============================================================
function showFormulaCalculator() {
    const menuGrid = document.getElementById('menuGrid');
    const formulasView = document.getElementById('formulasView');
    const testsView = document.getElementById('testsView');
    const calculatorView = document.getElementById('formulaCalculatorView');

    if (menuGrid) menuGrid.style.display = 'none';
    if (formulasView) formulasView.style.display = 'none';
    if (testsView) testsView.style.display = 'none';
    if (calculatorView) calculatorView.style.display = 'block';

    const select = document.getElementById('calcSubject');
    if (select) {
        select.innerHTML = '<option value="">Fan tanlang...</option>';
        const calcSubjects = ['physics', 'chemistry', 'algebra', 'geometry'];
        calcSubjects.forEach(key => {
            if (subjectInfo[key]) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = `${subjectInfo[key].icon} ${subjectInfo[key].name}`;
                select.appendChild(opt);
            }
        });
    }
    window.scrollTo(0, 0);
}

function updateCalcFormulas() {
    const subject = document.getElementById('calcSubject').value;
    const formulaSelect = document.getElementById('calcFormula');

    if (!subject || !formulasData[subject]) {
        if (formulaSelect) formulaSelect.innerHTML = '<option value="">Formula tanlang...</option>';
        return;
    }

    if (formulaSelect) {
        formulaSelect.innerHTML = '<option value="">Formula tanlang...</option>';
        formulasData[subject].forEach((f, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = f.name;
            formulaSelect.appendChild(opt);
        });
    }

    document.getElementById('formulaInfo').style.display = 'none';
    document.getElementById('calcInputs').innerHTML = '';
    document.getElementById('calcResult').style.display = 'none';
}

function loadFormulaCalc() {
    const subject = document.getElementById('calcSubject').value;
    const idx = document.getElementById('calcFormula').value;

    if (!subject || idx === '') return;

    currentCalcFormula = formulasData[subject][parseInt(idx)];

    document.getElementById('calcFormulaName').textContent = currentCalcFormula.name;
    document.getElementById('calcFormulaText').textContent = currentCalcFormula.formula;
    document.getElementById('calcFormulaVars').textContent = currentCalcFormula.vars || '';
    document.getElementById('formulaInfo').style.display = 'block';

    const varsMatch = currentCalcFormula.formula.match(/[A-Z][a-z]?|_[a-z]+|[α-ω]/g) || [];
    const uniqueVars = [...new Set(varsMatch)].filter(v =>
        !['sin','cos','tan','log','sqrt','const','return','if'].includes(v) && v.length <= 3
    );

    const inputsDiv = document.getElementById('calcInputs');
    inputsDiv.innerHTML = '<div style="margin-bottom:12px;color:#888;font-size:14px;">O\'zgaruvchilarni kiriting:</div>';

    uniqueVars.forEach(v => {
        const div = document.createElement('div');
        div.style.marginBottom = '12px';
        div.innerHTML = `
            <label style="display:block;margin-bottom:4px;color:#aaa;font-size:13px;">${v}:</label>
            <input type="number" step="any" id="calc_var_${v}" placeholder="${v} qiymati"
                   style="width:100%;padding:8px;background:#0a0a0a;border:1px solid #333;border-radius:6px;color:#f0f0f0;">
        `;
        inputsDiv.appendChild(div);
    });
}

function calculateFormulaValue() {
    if (!currentCalcFormula || !currentCalcFormula.calc) {
        alert('Bu formula uchun kalkulyator mavjud emas');
        return;
    }

    const varsMatch = currentCalcFormula.formula.match(/[A-Z][a-z]?|_[a-z]+|[α-ω]/g) || [];
    const uniqueVars = [...new Set(varsMatch)].filter(v =>
        !['sin','cos','tan','log','sqrt','const','return','if'].includes(v) && v.length <= 3
    );

    const values = {};
    uniqueVars.forEach(v => {
        const input = document.getElementById(`calc_var_${v}`);
        if (input && input.value !== '') {
            values[v] = parseFloat(input.value);
        }
    });

    try {
        const result = currentCalcFormula.calc(values);
        const resultDiv = document.getElementById('calcResult');
        resultDiv.style.display = 'block';

        if (result && result.ok) {
            resultDiv.innerHTML = `<div style="color:#2ecc71;font-size:24px;font-weight:600;">✅ Natija:</div><div style="font-size:28px;font-family:'Courier New',monospace;margin-top:8px;color:#4a6cf7;">${result.r}</div>`;
            calcUsageCount++;
            saveState();
            updateUI();
        } else {
            resultDiv.innerHTML = `<div style="color:#e74c3c;">⚠️ ${result?.msg || 'Barcha o\'zgaruvchilarni kiriting'}</div>`;
        }
    } catch(e) {
        const resultDiv = document.getElementById('calcResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<div style="color:#e74c3c;">❌ Xatolik: ${e.message}</div>`;
    }
}

// ============================================================
// FILTER & FORMULALAR
// ============================================================
function updateTopicFilter() {
    const topicFilter = document.getElementById('topicFilter');
    const topicTabs = document.getElementById('topicTabs');
    if (!topicFilter || !topicTabs) return;

    topicFilter.innerHTML = '<option value="">Barcha mavzular</option>';
    topicTabs.innerHTML = '';

    if (currentSubject && subjectTopics[currentSubject]) {
        const topics = subjectTopics[currentSubject];
        Object.keys(topics).forEach(key => {
            const count = formulasData[currentSubject]?.filter(f => f.topic === key).length || 0;
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = topics[key];
            topicFilter.appendChild(opt);

            const tab = document.createElement('div');
            tab.className = 'topic-tab' + (currentTopic === key ? ' active' : '');
            tab.innerHTML = `${topics[key]} <span class="count">${count}</span>`;
            tab.onclick = () => {
                currentTopic = key;
                document.getElementById('topicFilter').value = key;
                updateTopicFilter();
                renderFormulas();
            };
            topicTabs.appendChild(tab);
        });
    }
}

function filterFormulas() {
    const sf = document.getElementById('subjectFilter');
    const tf = document.getElementById('topicFilter');
    if (sf) currentSubject = sf.value || null;
    if (tf) currentTopic = tf.value || null;
    updateTopicFilter();
    renderFormulas();
}

function renderFormulas() {
    const list = document.getElementById('formulasList');
    if (!list) return;

    let formulas = [];
    if (currentSubject && formulasData[currentSubject]) {
        formulas = formulasData[currentSubject];
        if (currentTopic) formulas = formulas.filter(f => f.topic === currentTopic);
    } else {
        Object.keys(formulasData).forEach(key => {
            formulas = formulas.concat(formulasData[key].map(f => ({...f, subjectKey: key})));
        });
    }

    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (search) {
        formulas = formulas.filter(f =>
            f.name.toLowerCase().includes(search) ||
            f.formula.toLowerCase().includes(search) ||
            (f.vars && f.vars.toLowerCase().includes(search))
        );
    }

    if (formulas.length === 0) {
        list.innerHTML = '<div class="no-results">📭 Formulalar topilmadi</div>';
        return;
    }

    list.innerHTML = formulas.map((f, idx) => {
        const isFav = favorites.some(fav => fav.name === f.name && fav.formula === f.formula);
        const subjectName = f.subjectKey ? subjectInfo[f.subjectKey]?.name : (currentSubject ? subjectInfo[currentSubject]?.name : '');

        return `
            <div class="law-card">
                <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite('${f.name.replace(/'/g, "\\'")}', '${f.formula.replace(/'/g, "\\'")}')" title="Sevimlilarga qo'shish">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <div class="law-name">${f.name}</div>
                ${subjectName ? `<div style="font-size:12px;color:#888;margin-bottom:4px;">📚 ${subjectName} › ${subjectTopics[currentSubject || '']?.[f.topic] || f.topic}</div>` : ''}
                <div class="law-formula">${f.formula}</div>
                ${f.vars ? `<div class="law-vars">${f.vars}</div>` : ''}
                ${f.example ? `<div class="law-example">${f.example}</div>` : ''}
            </div>
        `;
    }).join('');
}

function toggleFavorite(name, formula) {
    const exists = favorites.findIndex(f => f.name === name && f.formula === formula);
    if (exists !== -1) {
        favorites.splice(exists, 1);
    } else {
        favorites.push({name, formula});
    }
    saveState();
    updateUI();
    renderFormulas();
}

function renderFavorites() {
    const list = document.getElementById('favoritesList');
    if (!list) return;
    if (favorites.length === 0) {
        list.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">Sevimli formulalar yo\'q</p>';
        return;
    }
    list.innerHTML = favorites.map((f, idx) => `
        <div class="law-card">
            <button class="favorite-btn active" onclick="removeFavorite(${idx})" title="Olib tashlash">❤️</button>
            <div class="law-name">${f.name}</div>
            <div class="law-formula">${f.formula}</div>
        </div>
    `).join('');
}

function removeFavorite(idx) {
    favorites.splice(idx, 1);
    saveState();
    updateUI();
    renderFavorites();
    renderFormulas();
}

// ============================================================
// MISSIYALAR
// ============================================================
function renderMissions() {
    const list = document.getElementById('missionsList');
    if (!list) return;

    list.innerHTML = missions.map(m => {
        const completed = completedMissions.includes(m.id);
        const available = m.check();
        const canClaim = available && !completed;

        return `
            <div class="mission-card ${completed ? 'completed' : ''} ${!available && !completed ? 'locked' : ''}" onclick="${canClaim ? `claimMission(${m.id})` : ''}">
                <div class="mission-title">${completed ? '✅' : available ? '🔓' : '🔒'} ${m.title}</div>
                <div class="mission-desc">${m.desc}</div>
                <div class="mission-reward">
                    Mukofot: <span class="title-tag ${m.reward}">${m.rewardName}</span>
                </div>
            </div>
        `;
    }).join('');
}

function claimMission(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || !mission.check() || completedMissions.includes(missionId)) return;

    completedMissions.push(missionId);
    
    const user = getCurrentUser();
    if (user) {
        const title = isOwner(user) ? 'title-owner' : mission.reward;
        apiRequest(`/users/${user.id}/title`, {
            method: 'PUT',
            body: JSON.stringify({ title })
        }).then(() => {
            user.title = title;
            localStorage.setItem('app_current_user', JSON.stringify(user));
            saveState();
            updateUI();
            alert(`🎉 Tabriklaymiz! "${mission.rewardName}" title ochdingiz!`);
            renderMissions();
        }).catch(() => {
            alert('Xatolik yuz berdi');
        });
    }
}

// ============================================================
// CHAT MODAL
// ============================================================
function openChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.style.display = 'flex';
        loadChatMessages();
    }
}

function closeChat() {
    const modal = document.getElementById('chatModal');
    if (modal) modal.style.display = 'none';
}

// ============================================================
// AVATAR YUKLASH
// ============================================================
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const user = getCurrentUser();
        if (!user) return;
        
        try {
            const response = await apiRequest(`/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({ avatar: e.target.result })
            });
            
            if (!response) return;
            const updatedUser = await response.json();
            localStorage.setItem('app_current_user', JSON.stringify(updatedUser));
            updateUI();
        } catch (error) {
            console.error('Avatar upload error:', error);
        }
    };
    reader.readAsDataURL(file);
}

// ============================================================
// SHOW RANDOM FORMULA
// ============================================================
function showRandomFormula() {
    if (typeof formulasData === 'undefined') return;
    const allFormulas = [];
    Object.keys(formulasData).forEach(key => {
        formulasData[key].forEach(f => allFormulas.push({...f, subjectKey: key}));
    });
    if (allFormulas.length === 0) return;
    const random = allFormulas[Math.floor(Math.random() * allFormulas.length)];
    alert(`🎲 ${random.name}\n${random.formula}`);
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Fanlar olami yuklandi!');
    
    loadState();
    currentUser = getCurrentUser();
    
    updateUI();
    updateFormulaCounts();
    
    if (document.getElementById('chatMessages')) {
        loadChatMessages();
        setInterval(loadChatMessages, 5000);
    }
    
    if (document.getElementById('privateChatsSection')) {
        loadPrivateChats();
        setInterval(loadPrivateChats, 10000);
    }
    
    updateOnlineStatus();
    setInterval(updateOnlineStatus, 30000);
    
    if (currentUser) {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('sidebarLogout');
        if (loginBtn) loginBtn.classList.add('hide');
        if (logoutBtn) logoutBtn.style.display = 'flex';
    }
    
    setTimeout(function() {
        if (typeof renderTests === 'function') {
            const testsView = document.getElementById('testsView');
            if (testsView && testsView.style.display !== 'none') {
                renderTests();
            }
            console.log('✅ Tests render ready');
        } else {
            console.warn('⚠️ renderTests function not found');
        }
    }, 500);
    
    window.openTitleSelector = openTitleSelector;
    window.selectTitle = selectTitle;
    window.getAvailableTitles = getAvailableTitles;
    window.renderTitleOptions = renderTitleOptions;
});

// ============================================================
// KLAVIATURA QISQA YO'LLARI
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(m => {
            if (m.id) closeModal(m.id);
        });
        document.querySelectorAll('.chat-modal[style*="display: flex"]').forEach(m => {
            if (m.id === 'chatModal') closeChat();
        });
        closePrivateChat();
    }
    if (e.key === 'Enter' && e.target.id === 'chatInput') {
        e.preventDefault();
        sendChatMessage(document.getElementById('chatInput').value);
    }
    if (e.key === 'Enter' && e.target.id === 'privateChatInput') {
        e.preventDefault();
        sendPrivateMessage();
    }
});

// ============================================================
// MAIN.JS - QO'SHIMCHA FUNKSIYALAR (main.js ga qo'shing)
// ============================================================

// ============================================================
// OWNER TITLE TIKLASH
// ============================================================
async function restoreOwnerTitle() {
    const user = getCurrentUser();
    if (!user || !isOwner(user)) {
        alert('❌ Faqat owner bu amalni bajarishi mumkin!');
        return;
    }
    
    try {
        const response = await apiRequest(`/users/${user.id}/title`, {
            method: 'PUT',
            body: JSON.stringify({ title: 'title-owner' })
        });
        
        if (!response) return;
        const updatedUser = await response.json();
        localStorage.setItem('app_current_user', JSON.stringify(updatedUser));
        updateUI();
        alert('👑 Owner title tiklandi!');
        location.reload();
    } catch (error) {
        console.error('Restore owner title error:', error);
        alert('Xatolik yuz berdi');
    }
}

// ============================================================
// OWNER CHAT FUNKSIYALARI
// ============================================================
async function pinGlobalMessage(messageId) {
    if (!getCurrentUser() || !isOwner(getCurrentUser())) {
        alert('❌ Faqat owner bu amalni bajarishi mumkin!');
        return;
    }
    
    try {
        const response = await apiRequest(`/chat/global/${messageId}/pin`, {
            method: 'PUT'
        });
        if (response) {
            loadChatMessages();
            alert('📌 Xabar pinlandi!');
        }
    } catch (error) {
        console.error('Pin message error:', error);
    }
}

async function muteUser(userId) {
    if (!getCurrentUser() || !isOwner(getCurrentUser())) {
        alert('❌ Faqat owner bu amalni bajarishi mumkin!');
        return;
    }
    
    try {
        const response = await apiRequest(`/users/${userId}/mute`, {
            method: 'PUT'
        });
        if (response) {
            alert('🔇 Foydalanuvchi ovozsizlantirildi!');
        }
    } catch (error) {
        console.error('Mute user error:', error);
    }
}

// ============================================================
// GLOBAL FUNKSIYALARNI EKSPORT QILISH
// ============================================================
window.restoreOwnerTitle = restoreOwnerTitle;
window.pinGlobalMessage = pinGlobalMessage;
window.muteUser = muteUser;
window.isOwner = isOwner;

console.log('✅ Main.js extra functions loaded!');
console.log('✅ Main.js yuklandi!');
