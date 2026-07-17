// ============================================================
// MIDDLEWARE/AUTH.JS - JWT Authentication
// ============================================================

const jwt = require('jsonwebtoken');
const { getQuery } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'eduversex_super_secret_key_2024';

function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      is_owner: user.is_owner === 1
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
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Get fresh user data
  const user = await getQuery('SELECT * FROM users WHERE id = ?', [decoded.id]);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    title: user.title,
    is_owner: user.is_owner === 1,
    is_banned: user.is_banned === 1
  };

  next();
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
  isOwner
};