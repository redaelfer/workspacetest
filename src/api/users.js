const crypto = require('crypto');
const { promisify } = require('util');
const express = require('express');
const db = require('@/db');

const router = express.Router();
const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);

  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

function parseUserId(rawId) {
  const userId = Number(rawId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

router.get('/users/:id', async (req, res) => {
  const userId = parseUserId(req.params.id);

  if (!userId) {
    return res.status(400).json({ error: 'Invalid user id' });
  }

  const result = await db.query('SELECT id, email FROM users WHERE id = $1', [userId]);

  if (!result.rows.length) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user: result.rows[0] });
});

router.post('/users', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const passwordHash = await hashPassword(password);
  const result = await db.query(
    'INSERT INTO users (email, password_hash, is_admin) VALUES ($1, $2, false) RETURNING id, email',
    [email, passwordHash]
  );

  return res.status(201).json({ user: result.rows[0] });
});

module.exports = router;
