const express = require("express");
const router = express.Router();
const db = require("../db");

// =========================
// GET ALL PRODUCTS
// =========================
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      products.*,
      categories.name AS category_name,
      locations.street,
      locations.building,
      cities.name AS city,
      governorates.name AS governorate
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN locations ON products.location_id = locations.id
    LEFT JOIN cities ON locations.city_id = cities.id
    LEFT JOIN governorates ON cities.governorate_id = governorates.id
    ORDER BY products.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Get products error:", err);
      return res.status(500).json({
        message: "Failed to get products",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// =========================
// GET PRODUCTS BY USER
// =========================
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      products.*,
      categories.name AS category_name,
      locations.street,
      locations.building,
      cities.name AS city,
      governorates.name AS governorate
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN locations ON products.location_id = locations.id
    LEFT JOIN cities ON locations.city_id = cities.id
    LEFT JOIN governorates ON cities.governorate_id = governorates.id
    WHERE products.user_id = ?
    ORDER BY products.id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log("Get user products error:", err);
      return res.status(500).json({
        message: "Failed to get user products",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// =========================
// GET PRODUCT IMAGES
// IMPORTANT: this must be before router.get("/:id")
// =========================
router.get("/:id/images", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      id,
      product_id,
      image_url
    FROM product_images
    WHERE product_id = ?
    ORDER BY id ASC
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Get product images error:", err);
      return res.status(500).json({
        message: "Failed to get product images",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// =========================
// GET ONE PRODUCT
// =========================
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      products.*,
      categories.name AS category_name,
      locations.street,
      locations.building,
      cities.name AS city,
      governorates.name AS governorate
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    LEFT JOIN locations ON products.location_id = locations.id
    LEFT JOIN cities ON locations.city_id = cities.id
    LEFT JOIN governorates ON cities.governorate_id = governorates.id
    WHERE products.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Get product error:", err);
      return res.status(500).json({
        message: "Failed to get product",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result[0]);
  });
});

// =========================
// ADD PRODUCT WITH SUPABASE IMAGE URLS
// =========================
router.post("/", (req, res) => {
  const {
    title,
    description,
    price,
    user_id,
    category_id,
    location_id,
    image_urls,
  } = req.body;

  if (
    !title ||
    !description ||
    !price ||
    !user_id ||
    !category_id ||
    !location_id
  ) {
    return res.status(400).json({
      message: "Missing required product fields",
    });
  }

  const imageUrls = Array.isArray(image_urls) ? image_urls : [];
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : "";

  const sql = `
    INSERT INTO products 
    (title, description, price, image_url, user_id, category_id, location_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, price, mainImage, user_id, category_id, location_id],
    (err, result) => {
      if (err) {
        console.log("Add product error:", err);
        return res.status(500).json({
          message: "Failed to add product",
          error: err.message,
        });
      }

      const productId = result.insertId;

      if (imageUrls.length === 0) {
        return res.json({
          message: "Product added successfully",
          productId,
          images: [],
        });
      }

      const imageValues = imageUrls.map((url) => [productId, url]);

      const imagesSql = `
        INSERT INTO product_images (product_id, image_url)
        VALUES ?
      `;

      db.query(imagesSql, [imageValues], (imgErr) => {
        if (imgErr) {
          console.log("Add product images error:", imgErr);
          return res.status(500).json({
            message: "Product added but images failed",
            error: imgErr.message,
          });
        }

        res.json({
          message: "Product added successfully",
          productId,
          images: imageUrls,
        });
      });
    }
  );
});

// =========================
// UPDATE PRODUCT
// This updates title, description, price.
// If image_urls are sent, it replaces old product images.
// =========================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, price, image_urls } = req.body;

  if (!title || !description || !price) {
    return res.status(400).json({
      message: "Missing required product fields",
    });
  }

  const imageUrls = Array.isArray(image_urls) ? image_urls : [];

  // If no new images are sent, update only text fields
  if (imageUrls.length === 0) {
    const sql = `
      UPDATE products 
      SET 
        title = ?,
        description = ?,
        price = ?
      WHERE id = ?
    `;

    db.query(sql, [title, description, price, id], (err) => {
      if (err) {
        console.log("Update product error:", err);
        return res.status(500).json({
          message: "Failed to update product",
          error: err.message,
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    });

    return;
  }

  // If new images are sent, replace old images
  const mainImage = imageUrls[0];

  const updateProductSql = `
    UPDATE products 
    SET 
      title = ?,
      description = ?,
      price = ?,
      image_url = ?
    WHERE id = ?
  `;

  db.query(
    updateProductSql,
    [title, description, price, mainImage, id],
    (err) => {
      if (err) {
        console.log("Update product error:", err);
        return res.status(500).json({
          message: "Failed to update product",
          error: err.message,
        });
      }

      const deleteOldImagesSql = `
        DELETE FROM product_images
        WHERE product_id = ?
      `;

      db.query(deleteOldImagesSql, [id], (deleteErr) => {
        if (deleteErr) {
          console.log("Delete old images error:", deleteErr);
          return res.status(500).json({
            message: "Product updated but old images failed to delete",
            error: deleteErr.message,
          });
        }

        const imageValues = imageUrls.map((url) => [id, url]);

        const insertImagesSql = `
          INSERT INTO product_images (product_id, image_url)
          VALUES ?
        `;

        db.query(insertImagesSql, [imageValues], (imgErr) => {
          if (imgErr) {
            console.log("Update product images error:", imgErr);
            return res.status(500).json({
              message: "Product updated but images failed",
              error: imgErr.message,
            });
          }

          res.json({
            message: "Product updated successfully",
            images: imageUrls,
          });
        });
      });
    }
  );
});

// =========================
// DELETE PRODUCT
// product_images will delete automatically if your FK has ON DELETE CASCADE
// =========================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.log("Delete product error:", err);
      return res.status(500).json({
        message: "Failed to delete product",
        error: err.message,
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  });
});

module.exports = router;