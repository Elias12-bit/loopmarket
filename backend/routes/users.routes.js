const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL USERS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM users";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Get users error:", err);
      return res.status(500).json({
        message: "Failed to get users",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// GET ONE USER BY ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Get user error:", err);
      return res.status(500).json({
        message: "Failed to get user",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result[0]);
  });
});

// UPDATE USER PROFILE
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    username,
    email,
    phone,
    image_url,
    description,
    gender,
    dob,
  } = req.body;

  const sql = `
    UPDATE users
    SET 
      username = ?,
      email = ?,
      phone = ?,
      image_url = ?,
      description = ?,
      gender = ?,
      dob = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      username,
      email,
      phone,
      image_url,
      description,
      gender,
      dob || null,
      id,
    ],
    (err) => {
      if (err) {
        console.log("Update user error:", err);
        return res.status(500).json({
          message: "Failed to update user",
          error: err.message,
        });
      }

      res.json({ message: "User updated successfully" });
    }
  );
});
// DELETE USER
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) {
      console.log("Delete user error:", err);
      return res.status(500).json({
        message: "Failed to delete user",
        error: err.message,
      });
    }

    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;