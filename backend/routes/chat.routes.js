const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/messages", (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  db.query(
    "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
    [sender_id, receiver_id, message],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Sent" });
    }
  );
});

router.get("/messages/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  const sql = `
    SELECT * FROM messages
    WHERE (sender_id=? AND receiver_id=?)
       OR (sender_id=? AND receiver_id=?)
    ORDER BY created_at ASC
  `;

  db.query(sql, [user1, user2, user2, user1], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

module.exports = router;