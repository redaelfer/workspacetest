// Intentionally simple backend user lookup endpoint.
// Reviewers should catch the security and correctness issues here.
const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  // BUG: raw string interpolation makes this vulnerable to SQL injection.
  const query = `SELECT id, email, password_hash FROM users WHERE id = ${userId}`;
  const result = await db.query(query);

  // BUG: this returns 200 with null instead of a 404 for missing users.
  if (!result.rows.length) {
    return res.json({ user: null });
  }

  // BUG: password_hash is leaked in the API response.
  res.json({ user: result.rows[0] });
});

router.post('/users', async (req, res) => {
  const { email, password } = req.body;

  // BUG: password is stored without hashing and admin can be set by any caller.
  const result = await db.query(
    `INSERT INTO users (email, password, is_admin) VALUES ('${email}', '${password}', ${req.body.is_admin}) RETURNING *`
  );

  // BUG: createdUser is undefined, so this route throws after inserting.
  res.status(201).json({ user: createdUser, raw: result.rows[0] });
});

module.exports = router;
