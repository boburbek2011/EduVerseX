// ============================================================
// ROUTES/LEADERBOARD.JS - Leaderboard
// ============================================================

const express = require('express');
const router = express.Router();
const { allQuery } = require('../database');
const { authenticate } = require('../middleware/auth');

// ============================================================
// GET LEADERBOARD
// ============================================================
router.get('/', authenticate, async (req, res) => {
  try {
    // Calculate points: 10 per test + 5 per correct answer
    const users = await allQuery(`
      SELECT 
        u.id,
        u.username,
        u.name,
        u.avatar,
        u.title,
        u.is_owner,
        u.is_banned,
        COUNT(tr.id) as total_tests,
        COALESCE(SUM(tr.correct), 0) as correct_answers,
        (COUNT(tr.id) * 10 + COALESCE(SUM(tr.correct), 0) * 5) as points
      FROM users u
      LEFT JOIN test_results tr ON u.id = tr.user_id
      GROUP BY u.id
      ORDER BY points DESC, correct_answers DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET LEADERBOARD BY FILTER
// ============================================================
router.get('/filter/:title', authenticate, async (req, res) => {
  const title = req.params.title;
  const validTitles = ['title-default', 'title-bronze', 'title-silver', 'title-gold', 'title-diamond', 'title-legendary', 'title-owner'];
  
  if (!validTitles.includes(title)) {
    return res.status(400).json({ error: 'Invalid title filter' });
  }

  try {
    const users = await allQuery(`
      SELECT 
        u.id,
        u.username,
        u.name,
        u.avatar,
        u.title,
        u.is_owner,
        u.is_banned,
        COUNT(tr.id) as total_tests,
        COALESCE(SUM(tr.correct), 0) as correct_answers,
        (COUNT(tr.id) * 10 + COALESCE(SUM(tr.correct), 0) * 5) as points
      FROM users u
      LEFT JOIN test_results tr ON u.id = tr.user_id
      WHERE u.title = ?
      GROUP BY u.id
      ORDER BY points DESC, correct_answers DESC
    `, [title]);

    res.json(users);
  } catch (error) {
    console.error('Leaderboard filter error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// SEARCH LEADERBOARD
// ============================================================
router.get('/search', authenticate, async (req, res) => {
  const search = req.query.q || '';
  
  if (!search || search.length < 1) {
    return res.redirect('/api/leaderboard');
  }

  try {
    const users = await allQuery(`
      SELECT 
        u.id,
        u.username,
        u.name,
        u.avatar,
        u.title,
        u.is_owner,
        u.is_banned,
        COUNT(tr.id) as total_tests,
        COALESCE(SUM(tr.correct), 0) as correct_answers,
        (COUNT(tr.id) * 10 + COALESCE(SUM(tr.correct), 0) * 5) as points
      FROM users u
      LEFT JOIN test_results tr ON u.id = tr.user_id
      WHERE u.username LIKE ? OR u.name LIKE ? OR u.email LIKE ?
      GROUP BY u.id
      ORDER BY points DESC, correct_answers DESC
    `, [`%${search}%`, `%${search}%`, `%${search}%`]);

    res.json(users);
  } catch (error) {
    console.error('Leaderboard search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GET USER RANK
// ============================================================
router.get('/rank/:userId', authenticate, async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // Get all users with points
    const users = await allQuery(`
      SELECT 
        u.id,
        (COUNT(tr.id) * 10 + COALESCE(SUM(tr.correct), 0) * 5) as points
      FROM users u
      LEFT JOIN test_results tr ON u.id = tr.user_id
      GROUP BY u.id
      ORDER BY points DESC
    `);

    const rank = users.findIndex(u => u.id === userId) + 1;
    const userPoints = users.find(u => u.id === userId)?.points || 0;
    const totalUsers = users.length;

    res.json({
      userId,
      rank: rank > 0 ? rank : null,
      points: userPoints,
      totalUsers
    });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;