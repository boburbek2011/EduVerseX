// ============================================================
// ROUTES/CHAT.JS - Chat routes (global & private)
// ============================================================

const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticate } = require('../middleware/auth');

// ============================================================
// GET GLOBAL MESSAGES
// ============================================================
router.get('/global', authenticate, async (req, res) => {
  const limit = parseInt(req.query.limit) || 200;
  try {
    const messages = await allQuery(
      `SELECT id, user_id, username, title, avatar, text, timestamp 
       FROM global_messages 
       ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );
    res.json(messages.reverse());
  } catch (error) {
    console.error('Get global messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// SEND GLOBAL MESSAGE
// ============================================================
router.post('/global', authenticate, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Message text required' });
  }

  if (text.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 chars)' });
  }

  try {
    const result = await runQuery(
      `INSERT INTO global_messages (user_id, username, title, avatar, text) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.user.username, req.user.title, req.user.avatar || null, text.trim()]
    );

    const message = await getQuery(
      `SELECT id, user_id, username, title, avatar, text, timestamp 
       FROM global_messages WHERE id = ?`,
      [result.lastID]
    );

    res.status(201).json(message);
  } catch (error) {
    console.error('Send global message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// OWNER: DELETE GLOBAL MESSAGE
// ============================================================
router.delete('/global/:id', authenticate, async (req, res) => {
  if (!req.user.is_owner) {
    return res.status(403).json({ error: 'Owner access required' });
  }

  try {
    const result = await runQuery('DELETE FROM global_messages WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete global message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET PRIVATE MESSAGES
// ============================================================
router.get('/private/:userId', authenticate, async (req, res) => {
  const otherUserId = parseInt(req.params.userId);
  const myId = req.user.id;

  if (isNaN(otherUserId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const messages = await allQuery(
      `SELECT id, from_user_id, to_user_id, text, timestamp, read
       FROM private_messages 
       WHERE (from_user_id = ? AND to_user_id = ?) 
          OR (from_user_id = ? AND to_user_id = ?)
       ORDER BY timestamp ASC`,
      [myId, otherUserId, otherUserId, myId]
    );

    // Mark messages as read
    await runQuery(
      `UPDATE private_messages SET read = 1 
       WHERE from_user_id = ? AND to_user_id = ? AND read = 0`,
      [otherUserId, myId]
    );

    res.json(messages);
  } catch (error) {
    console.error('Get private messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// SEND PRIVATE MESSAGE
// ============================================================
router.post('/private', authenticate, async (req, res) => {
  const { toUserId, text } = req.body;

  if (!toUserId || !text || text.trim() === '') {
    return res.status(400).json({ error: 'Recipient and message text required' });
  }

  if (parseInt(toUserId) === req.user.id) {
    return res.status(400).json({ error: 'Cannot send message to yourself' });
  }

  if (text.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 chars)' });
  }

  try {
    // Check if recipient exists
    const recipient = await getQuery('SELECT id FROM users WHERE id = ?', [toUserId]);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const result = await runQuery(
      `INSERT INTO private_messages (from_user_id, to_user_id, text) 
       VALUES (?, ?, ?)`,
      [req.user.id, parseInt(toUserId), text.trim()]
    );

    const message = await getQuery(
      `SELECT id, from_user_id, to_user_id, text, timestamp, read 
       FROM private_messages WHERE id = ?`,
      [result.lastID]
    );

    res.status(201).json(message);
  } catch (error) {
    console.error('Send private message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET UNREAD PRIVATE MESSAGES COUNT
// ============================================================
router.get('/unread', authenticate, async (req, res) => {
  try {
    const result = await getQuery(
      'SELECT COUNT(*) as count FROM private_messages WHERE to_user_id = ? AND read = 0',
      [req.user.id]
    );
    res.json({ unread: result?.count || 0 });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET CHAT USERS (users you have chatted with)
// ============================================================
router.get('/users', authenticate, async (req, res) => {
  try {
    const users = await allQuery(
      `SELECT DISTINCT 
        CASE 
          WHEN from_user_id = ? THEN to_user_id 
          ELSE from_user_id 
        END as user_id,
        u.username, u.name, u.avatar, u.title
       FROM private_messages pm
       JOIN users u ON u.id = CASE 
          WHEN pm.from_user_id = ? THEN pm.to_user_id 
          ELSE pm.from_user_id 
        END
       WHERE pm.from_user_id = ? OR pm.to_user_id = ?`,
      [req.user.id, req.user.id, req.user.id, req.user.id]
    );
    res.json(users);
  } catch (error) {
    console.error('Get chat users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;