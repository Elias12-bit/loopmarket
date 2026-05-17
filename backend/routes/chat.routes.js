const express = require("express");
const router = express.Router();
const db = require("../db");

// GET PEOPLE I HAVE CONVERSATIONS WITH
router.get("/conversations/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT DISTINCT 
      u.id,
      u.username,
      u.email,
      u.image,
      u.image_url
    FROM users u
    JOIN messages m
      ON u.id = m.sender_id OR u.id = m.receiver_id
    WHERE 
      (m.sender_id = ? OR m.receiver_id = ?)
      AND u.id != ?
    ORDER BY u.username ASC
  `;

  db.query(sql, [userId, userId, userId], (err, result) => {
    if (err) {
      console.log("Get conversations error:", err);
      return res.status(500).json({
        message: "Failed to get conversations",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// GET MESSAGES BETWEEN TWO USERS
router.get("/messages/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  const sql = `
    SELECT * FROM messages
    WHERE 
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

  db.query(sql, [user1, user2, user2, user1], (err, result) => {
    if (err) {
      console.log("Get messages error:", err);
      return res.status(500).json({
        message: "Failed to get messages",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// SEND MESSAGE
router.post("/messages", (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({
      message: "sender_id, receiver_id, and message are required",
    });
  }

  const sql = `
    INSERT INTO messages (sender_id, receiver_id, message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [sender_id, receiver_id, message], (err) => {
    if (err) {
      console.log("Send message error:", err);
      return res.status(500).json({
        message: "Failed to send message",
        error: err.message,
      });
    }

    res.json({ message: "Message sent" });
  });
});

module.exports = router;