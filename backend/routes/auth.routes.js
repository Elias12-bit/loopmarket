const express = require("express");
const router = express.Router();
const db = require("../db");

// =========================
// SIGNUP
// After signup, return user data so frontend can login automatically
// =========================
router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const checkSql = `
    SELECT *
    FROM users
    WHERE email = ?
  `;

  db.query(checkSql, [email], (checkErr, checkResult) => {
    if (checkErr) {
      console.log("Signup check error:", checkErr);
      return res.status(500).json({
        message: "Signup failed",
        error: checkErr.message,
      });
    }

    if (checkResult.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const role = "user";

    const insertSql = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertSql, [username, email, password, role], (err, result) => {
      if (err) {
        console.log("Signup error:", err);
        return res.status(500).json({
          message: "Signup failed",
          error: err.message,
        });
      }

      res.json({
        message: "Signup successful",
        id: result.insertId,
        username,
        email,
        role,
      });
    });
  });
});

// =========================
// LOGIN
// =========================
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const sql = `
    SELECT 
      id,
      username,
      email,
      role,
      phone,
      address,
      image_url,
      description,
      gender,
      dob
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log("Login error:", err);
      return res.status(500).json({
        message: "Login failed",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json(result[0]);
  });
});

module.exports = router;