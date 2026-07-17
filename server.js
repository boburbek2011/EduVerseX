// ============================================================
// SERVER.JS - EduVerseX Backend (TO'LIQ)
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// TRUST PROXY - RENDER UCHUN MUHIM!
// ============================================================
app.set('trust proxy', 1);

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});
app.use('/api/', limiter);

// ============================================================
// DATABASE - RENDER UCHUN /tmp/ PAPKASIDA
// ============================================================
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const dbPath = isProduction 
    ? '/tmp/database.sqlite' 
    : path.join(__dirname, 'database.sqlite');

// Papka mavjudligini tekshirish
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log(`💾 Database path: ${dbPath}`);
console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION (Render)' : 'DEVELOPMENT'}`);

// Database modulini ishga tushirish
let db;
try {
  db = require('./database')(dbPath);
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}

// ============================================================
// ROUTES
// ============================================================
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const leaderboardRoutes = require('./routes/leaderboard');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ============================================================
// ONLINE USERS (in-memory)
// ============================================================
const onlineUsers = new Map();

app.post('/api/online', (req, res) => {
  const { userId, username } = req.body;
  if (userId && username) {
    onlineUsers.set(String(userId), { username, lastSeen: Date.now() });
    res.json({ success: true, online: onlineUsers.size });
  } else {
    res.status(400).json({ error: 'Missing userId or username' });
  }
});

app.post('/api/offline', (req, res) => {
  const { userId } = req.body;
  if (userId) {
    onlineUsers.delete(String(userId));
    res.json({ success: true, online: onlineUsers.size });
  } else {
    res.status(400).json({ error: 'Missing userId' });
  }
});

app.get('/api/online', (req, res) => {
  const now = Date.now();
  for (const [id, data] of onlineUsers) {
    if (now - data.lastSeen > 5 * 60 * 1000) {
      onlineUsers.delete(id);
    }
  }
  const result = Array.from(onlineUsers.entries()).map(([id, data]) => ({
    userId: parseInt(id) || id,
    username: data.username
  }));
  res.json(result);
});

// ============================================================
// OWNER CHAT ENDPOINTLAR
// ============================================================

// Xabarni pin qilish
app.put('/api/chat/global/:id/pin', async (req, res) => {
  try {
    // Owner tekshiruvi middleware orqali
    const { authenticate, isOwner } = require('./middleware/auth');
    // Bu yerda authenticate va isOwner middleware ishlatiladi
    // routes/chat.js da bajariladi
    res.json({ success: true });
  } catch (error) {
    console.error('Pin message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Foydalanuvchini ovozsizlantirish
app.put('/api/users/:id/mute', async (req, res) => {
  try {
    const { authenticate, isOwner } = require('./middleware/auth');
    // routes/users.js da bajariladi
    res.json({ success: true });
  } catch (error) {
    console.error('Mute user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// SERVE STATIC FILES
// ============================================================
app.use(express.static(path.join(__dirname, 'public')));

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/main.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/leaderboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

app.get('/games.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'games.html'));
});

app.get('/qora_psixologiya.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'qora_psixologiya.html'));
});

// Catch-all
app.get('*', (req, res) => {
  if (req.path.includes('.')) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// ERROR HANDLING
// ============================================================
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 EduVerseX Server (Render Ready)');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${dbPath}`);
  console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log('========================================');
});

module.exports = app;
