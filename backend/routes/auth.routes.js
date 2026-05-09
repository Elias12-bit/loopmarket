const express = require("express");
const router = express.Router();
const db = require("../db");

// SIGNUP
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "User created" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json(result[0]);
    }
  );
});

module.exports = router;