const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL PRODUCTS (JOIN EVERYTHING)
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      c.name AS category_name,
      l.street,
      ci.name AS city,
      g.name AS governorate
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN locations l ON p.location_id = l.id
    LEFT JOIN cities ci ON l.city_id = ci.id
    LEFT JOIN governorates g ON ci.governorate_id = g.id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// GET ONE PRODUCT
router.get("/:id", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      c.name AS category_name,
      l.street,
      ci.name AS city,
      g.name AS governorate
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN locations l ON p.location_id = l.id
    LEFT JOIN cities ci ON l.city_id = ci.id
    LEFT JOIN governorates g ON ci.governorate_id = g.id
    WHERE p.id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
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

  const sql = `
    INSERT INTO products 
    (title, description, price, image_url, user_id, category_id, location_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, price, image_url, user_id, category_id, location_id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Product added" });
    }
  );
});

// UPDATE PRODUCT
router.put("/:id", (req, res) => {
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
    SET title=?, description=?, price=?, image_url=?, category_id=?, location_id=?
    WHERE id=?
  `;

  db.query(
    sql,
    [title, description, price, image_url, category_id, location_id, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Updated" });
    }
  );
});

module.exports = router;