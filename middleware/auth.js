// ============================================================
// MIDDLEWARE/AUTH.JS - JWT Authentication (TUZATILGAN)
// ============================================================

const jwt = require('jsonwebtoken');
const path = require('path');

// Database funksiyalarini to'g'ri import qilish
const dbPath = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'
    ? '/tmp/database.sqlite'
    : path.join(__dirname, '..', 'database.sqlite');

const db = require('../database')(dbPath);
const { getQuery } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'eduversex_super_secret_key_2024_secure';

function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      is_owner: user.is_owner === 1 || user.is_owner === true
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    // ✅ getQuery endi ishlaydi
    const user = await getQuery('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.is_banned === 1) {
      return res.status(403).json({ error: 'User is banned' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      title: user.title,
      is_owner: user.is_owner === 1,
      is_banned: user.is_banned === 1,
      registered_at: user.registered_at
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

function isOwner(req, res, next) {
  if (!req.user || !req.user.is_owner) {
    return res.status(403).json({ error: 'Owner access required' });
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  isOwner,
  JWT_SECRET
};
