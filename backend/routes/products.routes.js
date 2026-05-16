const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL PRODUCTS
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      c.name AS category_name,
      l.street,
      l.building,
      ci.name AS city,
      g.name AS governorate
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN locations l ON p.location_id = l.id
    LEFT JOIN cities ci ON l.city_id = ci.id
    LEFT JOIN governorates g ON ci.governorate_id = g.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Get products error:", err);
      return res.status(500).json({ message: "Failed to get products" });
    }

    res.json(result);
  });
});

// GET PRODUCTS BY USER / MY ADS
// IMPORTANT: this route must be BEFORE router.get("/:id")
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      p.*,
      c.name AS category_name,
      l.street,
      l.building,
      ci.name AS city,
      g.name AS governorate
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN locations l ON p.location_id = l.id
    LEFT JOIN cities ci ON l.city_id = ci.id
    LEFT JOIN governorates g ON ci.governorate_id = g.id
    WHERE p.user_id = ?
    ORDER BY p.id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log("Get user products error:", err);
      return res.status(500).json({ message: "Failed to get user products" });
    }

    res.json(result);
  });
});

// GET ONE PRODUCT
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.*,
      c.name AS category_name,
      l.street,
      l.building,
      ci.name AS city,
      g.name AS governorate
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN locations l ON p.location_id = l.id
    LEFT JOIN cities ci ON l.city_id = ci.id
    LEFT JOIN governorates g ON ci.governorate_id = g.id
    WHERE p.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Get product details error:", err);
      return res.status(500).json({ message: "Failed to get product" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result[0]);
  });
});

// ADD PRODUCT
router.post("/", (req, res) => {
  const {
    title,
    description,
    price,
    image_url,
    user_id,
    category_id,
    location_id,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  const sql = `
    INSERT INTO products 
    (title, description, price, image_url, user_id, category_id, location_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, price, image_url, user_id, category_id, location_id],
    (err, result) => {
      if (err) {
        console.log("Add product error:", err);
        return res.status(500).json({ message: "Failed to add product" });
      }

      res.json({
        message: "Product added successfully",
        productId: result.insertId,
      });
    }
  );
});

// UPDATE PRODUCT
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    price,
    image_url,
    category_id,
    location_id,
  } = req.body;

  const sql = `
    UPDATE products 
    SET 
      title = ?,
      description = ?,
      price = ?,
      image_url = ?,
      category_id = ?,
      location_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, description, price, image_url, category_id, location_id, id],
    (err) => {
      if (err) {
        console.log("Update product error:", err);
        return res.status(500).json({ message: "Failed to update product" });
      }

      res.json({ message: "Product updated successfully" });
    }
  );
});

// DELETE PRODUCT
// Allows owner OR admin to delete
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.headers.userid;

  if (!userId) {
    return res.status(401).json({ message: "User ID is required" });
  }

  const userSql = "SELECT role FROM users WHERE id = ?";

  db.query(userSql, [userId], (userErr, userResult) => {
    if (userErr) {
      console.log("Check user role error:", userErr);
      return res.status(500).json({ message: "Failed to check user" });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = userResult[0].role;

    let deleteSql;
    let values;

    if (role === "admin") {
      deleteSql = "DELETE FROM products WHERE id = ?";
      values = [id];
    } else {
      deleteSql = "DELETE FROM products WHERE id = ? AND user_id = ?";
      values = [id, userId];
    }

    db.query(deleteSql, values, (deleteErr, result) => {
      if (deleteErr) {
        console.log("Delete product error:", deleteErr);
        return res.status(500).json({ message: "Failed to delete product" });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({
          message: "You are not allowed to delete this product",
        });
      }

      res.json({ message: "Product deleted successfully" });
    });
  });
});

module.exports = router;