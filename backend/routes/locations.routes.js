const express = require("express");
const router = express.Router();
const db = require("../db");

// ADD LOCATION
router.post("/", (req, res) => {
  const { city_id, street, building } = req.body;

  db.query(
    "INSERT INTO locations (city_id, street, building) VALUES (?, ?, ?)",
    [city_id, street, building],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ location_id: result.insertId });
    }
  );
});

module.exports = router;