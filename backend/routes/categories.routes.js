const express = require("express");
const router = express.Router();
const db = require("../db");

// =========================
// GET ALL CATEGORIES
// =========================
router.get("/", (req, res) => {
  const sql = `
    SELECT *
    FROM categories
    ORDER BY id ASC
  `;

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

// =========================
// GET ONE CATEGORY
// =========================
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM categories
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Get category error:", err);
      return res.status(500).json({
        message: "Failed to get category",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(result[0]);
  });
});

// =========================
// GET SUBCATEGORIES BY CATEGORY
// Example: /categories/1/subcategories
// =========================
router.get("/:id/subcategories", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM subcategories
    WHERE category_id = ?
    ORDER BY id ASC
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Get subcategories error:", err);
      return res.status(500).json({
        message: "Failed to get subcategories",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// =========================
// ADD CATEGORY
// =========================
router.post("/", (req, res) => {
  const { name, category_name } = req.body;

  const finalName = name || category_name;

  if (!finalName) {
    return res.status(400).json({
      message: "Category name is required",
    });
  }

  const sql = `
    INSERT INTO categories (name)
    VALUES (?)
  `;

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

// =========================
// ADD SUBCATEGORY
// =========================
router.post("/:id/subcategories", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Subcategory name is required",
    });
  }

  const sql = `
    INSERT INTO subcategories (name, category_id)
    VALUES (?, ?)
  `;

  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.log("Add subcategory error:", err);
      return res.status(500).json({
        message: "Failed to add subcategory",
        error: err.message,
      });
    }

    res.json({
      message: "Subcategory added successfully",
      id: result.insertId,
      name,
      category_id: id,
    });
  });
});

// =========================
// DELETE CATEGORY
// =========================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM categories
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.log("Delete category error:", err);
      return res.status(500).json({
        message: "Failed to delete category",
        error: err.message,
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  });
});

// =========================
// DELETE SUBCATEGORY
// =========================
router.delete("/subcategories/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM subcategories
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.log("Delete subcategory error:", err);
      return res.status(500).json({
        message: "Failed to delete subcategory",
        error: err.message,
      });
    }

    res.json({
      message: "Subcategory deleted successfully",
    });
  });
});

module.exports = router;