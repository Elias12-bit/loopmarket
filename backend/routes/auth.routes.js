const express = require("express");
const router = express.Router();
const db = require("../db");

// SIGNUP
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  const sql = `
    INSERT INTO users (username, name, email, password, role)
    VALUES (?, ?, ?, ?, 'user')
  `;

  db.query(sql, [username, username, email, password], (err) => {
    if (err) {
      console.log("Signup error:", err);
      return res.status(500).json({ message: "Signup failed", error: err });
    }

    res.json({ message: "User created successfully" });
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id, username, name, email, role, image, image_url, description, phone
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("Login error:", err);
      return res.status(500).json({ message: "Login failed", error: err });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json(result[0]);
  });
});

module.exports = router;