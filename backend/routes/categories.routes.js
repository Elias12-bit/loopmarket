const express = require("express");
const router = express.Router();
const db = require("../db");

const isAdmin = require("../middleware/admin.middleware");

// GET
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// ADD (admin only)
router.post("/", isAdmin, (req, res) => {
  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [req.body.name],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Added" });
    }
  );
});

// DELETE (admin only)
router.delete("/:id", isAdmin, (req, res) => {
  db.query("DELETE FROM categories WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Deleted" });
  });
});

module.exports = router;