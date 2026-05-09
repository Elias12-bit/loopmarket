const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { user_id, product_id } = req.body;

  db.query(
    "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
    [user_id, product_id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Added" });
    }
  );
});

router.delete("/", (req, res) => {
  const { user_id, product_id } = req.body;

  db.query(
    "DELETE FROM wishlist WHERE user_id=? AND product_id=?",
    [user_id, product_id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Removed" });
    }
  );
});

router.get("/:userId", (req, res) => {
  const sql = `
    SELECT p.*
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
  `;

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

module.exports = router;