// ============================================================
// ROUTES/AUTH.JS - Authentication routes (TUZATILGAN)
// ============================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { generateToken, authenticate } = require('../middleware/auth');

// Database funksiyalarini req dan olish
const getDb = () => {
  const { runQuery, getQuery, allQuery } = require('../database')(process.env.NODE_ENV === 'production' ? '/tmp/database.sqlite' : './database.sqlite');
  return { runQuery, getQuery, allQuery };
};

// ============================================================
// REGISTER
// ============================================================
router.post('/register', async (req, res) => {
  const { username, email, password, name } = req.body;
  const { getQuery, runQuery } = getDb();

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password too weak (min 6 chars)' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existing = await getQuery('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await runQuery(
      'INSERT INTO users (username, email, password, name, title) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, name || username, 'title-default']
    );

    const user = await getQuery('SELECT * FROM users WHERE id = ?', [result.lastID]);
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        title: user.title,
        is_owner: user.is_owner === 1,
        registered_at: user.registered_at
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// LOGIN
// ============================================================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { getQuery } = getDb();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const user = await getQuery('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.is_banned === 1) {
      return res.status(403).json({ error: 'User is banned' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        title: user.title,
        is_owner: user.is_owner === 1,
        registered_at: user.registered_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET CURRENT USER (ME)
// ============================================================
router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

// ============================================================
// LOGOUT
// ============================================================
router.post('/logout', authenticate, async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
