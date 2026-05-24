const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL CATEGORIES
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Get categories error:", err);
      return res.status(500).json({
        message: "Failed to get categories",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// ADD CATEGORY
router.post("/", (req, res) => {
  const { name, category_name } = req.body;

  const finalName = name || category_name;

  if (!finalName) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  const sql = "INSERT INTO categories (name) VALUES (?)";

  db.query(sql, [finalName], (err, result) => {
    if (err) {
      console.log("Add category error:", err);
      return res.status(500).json({
        message: "Failed to add category",
        error: err.message,
      });
    }

    res.json({
      message: "Category added successfully",
      id: result.insertId,
      name: finalName,
    });
  });
});

// DELETE CATEGORY
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM categories WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log("Delete category error:", err);
      return res.status(500).json({
        message: "Failed to delete category",
        error: err.message,
      });
    }

    res.json({ message: "Category deleted successfully" });
  });
});

module.exports = router;