// ============================================================
// SERVER.JS - EduVerseX Backend (RENDERGA MOSLANGAN)
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ============================================================
// DATABASE - RENDER UCHUN /tmp/ PAPKASIDA
// ============================================================
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const dbPath = isProduction 
    ? '/tmp/database.sqlite'  // ✅ Renderda /tmp/ papkasida
    : path.join(__dirname, 'database.sqlite');  // ✅ Lokalda

// Papka mavjudligini tekshirish
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log(`💾 Database path: ${dbPath}`);
console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION (Render)' : 'DEVELOPMENT'}`);

// Database modulini ishga tushirish
const db = require('./database')(dbPath);

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
  // Clean up stale entries (5 minutes)
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

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// ERROR HANDLING
// ============================================================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
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
