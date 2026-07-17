// ============================================================
// DATABASE.JS - SQLite (RENDERGA MOSLANGAN) - TUZATILGAN
// ============================================================

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Database fayl yo'li - tashqaridan beriladi
function initDatabase(dbPath) {
  // Papka mavjudligini tekshirish
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new sqlite3.Database(dbPath);

  // ============================================================
  // TABLES
  // ============================================================

  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        avatar TEXT,
        title TEXT DEFAULT 'title-default',
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_owner BOOLEAN DEFAULT 0,
        is_banned BOOLEAN DEFAULT 0
      )
    `);

    // Global messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS global_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        title TEXT DEFAULT 'title-default',
        avatar TEXT,
        text TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Private messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS private_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user_id INTEGER NOT NULL,
        to_user_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT 0,
        FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Test results table
    db.run(`
      CREATE TABLE IF NOT EXISTS test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        correct INTEGER DEFAULT 0,
        wrong INTEGER DEFAULT 0,
        unanswered INTEGER DEFAULT 0,
        total INTEGER DEFAULT 0,
        passed BOOLEAN DEFAULT 0,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Favorites table
    db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        formula_name TEXT NOT NULL,
        formula_text TEXT NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, formula_name, formula_text)
      )
    `);

    // Viewed subjects table
    db.run(`
      CREATE TABLE IF NOT EXISTS viewed_subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subject TEXT NOT NULL,
        viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, subject)
      )
    `);

    // Completed missions table
    db.run(`
      CREATE TABLE IF NOT EXISTS completed_missions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        mission_id INTEGER NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, mission_id)
      )
    `);

    // Check if first user exists, if not create owner
    db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
      if (err) {
        console.error('Error checking users:', err);
        return;
      }
      if (row.count === 0) {
        const ownerPassword = bcrypt.hashSync('admin123', 10);
        db.run(`
          INSERT INTO users (username, email, password, name, title, is_owner)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['admin', 'admin@eduversex.com', ownerPassword, 'Administrator', 'title-owner', 1], function(err) {
          if (err) {
            console.error('Error creating owner:', err);
          } else {
            console.log('👑 Owner created:');
            console.log('   Username: admin');
            console.log('   Email: admin@eduversex.com');
            console.log('   Password: admin123');
          }
        });
      }
    });
  });

  // ============================================================
  // HELPER FUNCTIONS - EKSPORT QILINADI
  // ============================================================

  function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  function getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  function allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // ============================================================
  // RETURN - BU MUHIM!
  // ============================================================
  return {
    db,
    runQuery,
    getQuery,
    allQuery
  };
}

module.exports = initDatabase;
