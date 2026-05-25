const express = require("express");
const router = express.Router();
const db = require("../db");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =========================
// UPLOAD SETUP
// =========================
const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// =========================
// GET ALL USERS
// =========================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      id,
      username,
      email,
      phone,
      address,
      image_url,
      description,
      gender,
      dob,
      role
    FROM users
    ORDER BY id DESC
  `;

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

// =========================
// GET ONE USER BY ID
// =========================
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      id,
      username,
      email,
      phone,
      address,
      image_url,
      description,
      gender,
      dob,
      role
    FROM users
    WHERE id = ?
  `;

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

// =========================
// UPDATE USER PROFILE WITH PROFILE IMAGE
// =========================
router.put("/:id", upload.single("profile_image"), (req, res) => {
  const { id } = req.params;

  const { username, email, phone, address, description, gender, dob } = req.body;

  let image_url = req.body.image_url || "";

  if (req.file) {
    image_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  if (!username || !email) {
    return res.status(400).json({
      message: "Username and email are required",
    });
  }

  const sql = `
    UPDATE users
    SET 
      username = ?,
      email = ?,
      phone = ?,
      address = ?,
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
      address,
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

      res.json({
        message: "User updated successfully",
        image_url,
      });
    }
  );
});

// =========================
// CHANGE USER ROLE
// =========================
router.put("/:id/role", (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (role !== "admin" && role !== "user") {
    return res.status(400).json({
      message: "Role must be admin or user",
    });
  }

  const sql = `
    UPDATE users
    SET role = ?
    WHERE id = ?
  `;

  db.query(sql, [role, id], (err) => {
    if (err) {
      console.log("Update role error:", err);
      return res.status(500).json({
        message: "Failed to update role",
        error: err.message,
      });
    }

    res.json({
      message: "User role updated successfully",
    });
  });
});

// =========================
// DELETE USER
// Prevent deleting admin users
// =========================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const checkSql = `
    SELECT role
    FROM users
    WHERE id = ?
  `;

  db.query(checkSql, [id], (checkErr, result) => {
    if (checkErr) {
      console.log("Check user role error:", checkErr);
      return res.status(500).json({
        message: "Failed to check user role",
        error: checkErr.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (result[0].role === "admin") {
      return res.status(403).json({
        message: "Admin users cannot be deleted",
      });
    }

    const deleteSql = `
      DELETE FROM users
      WHERE id = ?
    `;

    db.query(deleteSql, [id], (deleteErr) => {
      if (deleteErr) {
        console.log("Delete user error:", deleteErr);
        return res.status(500).json({
          message: "Failed to delete user",
          error: deleteErr.message,
        });
      }

      res.json({
        message: "User deleted successfully",
      });
    });
  });
});

module.exports = router;