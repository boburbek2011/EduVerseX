// ============================================================
// ROUTES/USERS.JS - User management
// ============================================================

const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticate, isOwner } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// ============================================================
// GET ALL USERS (with optional search)
// ============================================================
router.get('/', authenticate, async (req, res) => {
  const search = req.query.search || '';
  try {
    let query = 'SELECT id, username, email, name, avatar, title, is_owner, is_banned, registered_at FROM users';
    let params = [];
    if (search) {
      query += ' WHERE username LIKE ? OR name LIKE ? OR email LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }
    query += ' ORDER BY username ASC';
    const users = await allQuery(query, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET USER BY ID
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await getQuery(
      'SELECT id, username, email, name, avatar, title, is_owner, is_banned, registered_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// UPDATE USER
// ============================================================
router.put('/:id', authenticate, async (req, res) => {
  const { name, avatar, title } = req.body;
  const userId = parseInt(req.params.id);

  if (userId !== req.user.id && !req.user.is_owner) {
    return res.status(403).json({ error: 'You can only update your own profile' });
  }

  try {
    let updates = [];
    let params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (avatar) {
      updates.push('avatar = ?');
      params.push(avatar);
    }
    if (title && req.user.is_owner) {
      updates.push('title = ?');
      params.push(title);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(userId);
    await runQuery(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    const user = await getQuery('SELECT id, username, email, name, avatar, title, is_owner FROM users WHERE id = ?', [userId]);
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// OWNER: BAN USER
// ============================================================
router.put('/:id/ban', authenticate, isOwner, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { banned } = req.body;

  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Cannot ban yourself' });
  }

  try {
    await runQuery('UPDATE users SET is_banned = ? WHERE id = ?', [banned ? 1 : 0, userId]);
    const user = await getQuery('SELECT id, username, is_banned FROM users WHERE id = ?', [userId]);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// OWNER: CHANGE USER TITLE
// ============================================================
router.put('/:id/title', authenticate, isOwner, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { title } = req.body;

  const validTitles = ['title-default', 'title-bronze', 'title-silver', 'title-gold', 'title-diamond', 'title-legendary', 'title-owner'];
  if (!validTitles.includes(title)) {
    return res.status(400).json({ error: 'Invalid title' });
  }

  try {
    await runQuery('UPDATE users SET title = ? WHERE id = ?', [title, userId]);
    const user = await getQuery('SELECT id, username, title FROM users WHERE id = ?', [userId]);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Change title error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET USER STATS (favorites count, tests count, etc.)
// ============================================================
router.get('/:id/stats', authenticate, async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const favorites = await getQuery('SELECT COUNT(*) as count FROM favorites WHERE user_id = ?', [userId]);
    const tests = await getQuery('SELECT COUNT(*) as count, SUM(correct) as correct, SUM(total) as total FROM test_results WHERE user_id = ?', [userId]);

    res.json({
      favorites: favorites?.count || 0,
      tests: {
        total: tests?.total || 0,
        correct: tests?.correct || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET USER TEST RESULTS
// ============================================================
router.get('/:id/tests', authenticate, async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const results = await allQuery(
      'SELECT subject, correct, wrong, unanswered, total, passed, completed_at FROM test_results WHERE user_id = ? ORDER BY completed_at DESC',
      [userId]
    );
    res.json(results);
  } catch (error) {
    console.error('Get test results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;