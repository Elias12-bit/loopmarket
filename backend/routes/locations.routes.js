const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL CITIES
router.get("/cities", (req, res) => {
  const sql = `
    SELECT 
      cities.id,
      cities.name,
      cities.governorate_id,
      governorates.name AS governorate_name
    FROM cities
    LEFT JOIN governorates 
    ON cities.governorate_id = governorates.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Get cities error:", err);
      return res.status(500).json({
        message: "Failed to get cities",
        error: err.message,
      });
    }

    res.json(result);
  });
});

// ADD LOCATION
router.post("/", (req, res) => {
  const { city_id, street, building } = req.body;

  if (!city_id) {
    return res.status(400).json({
      message: "city_id is required",
    });
  }

  const sql = `
    INSERT INTO locations (city_id, street, building)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [city_id, street, building], (err, result) => {
    if (err) {
      console.log("Add location error:", err);
      return res.status(500).json({
        message: "Failed to add location",
        error: err.message,
      });
    }

    res.json({
      message: "Location added successfully",
      location_id: result.insertId,
    });
  });
});

module.exports = router;