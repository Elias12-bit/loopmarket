const express = require("express");
const router = express.Router();
const db = require("../db");

const isAdmin = require("../middleware/admin.middleware");

// GET ALL USERS (admin only)
router.get("/", isAdmin, (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// GET ONE USER
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result[0]);
    }
  );
});

// UPDATE USER
router.put("/:id", (req, res) => {
  const { name, image, description, gender, dob, phone, email } = req.body;

  db.query(
    `UPDATE users SET name=?, image=?, description=?, gender=?, dob=?, phone=?, email=? WHERE id=?`,
    [name, image, description, gender, dob, phone, email, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Updated" });
    }
  );
});

// DELETE USER (admin only)
router.delete("/:id", isAdmin, (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Deleted" });
  });
});

module.exports = router;