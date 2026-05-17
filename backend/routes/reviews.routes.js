const express = require("express");
const router = express.Router();
const db = require("../db");

// GET AVERAGE RATING FOR SELLER
router.get("/seller/:sellerId", (req, res) => {
  const { sellerId } = req.params;

  const sql = `
    SELECT 
      seller_id,
      ROUND(AVG(rating), 1) AS average_rating,
      COUNT(*) AS total_reviews
    FROM reviews
    WHERE seller_id = ?
    GROUP BY seller_id
  `;

  db.query(sql, [sellerId], (err, result) => {
    if (err) {
      console.log("Get seller rating error:", err);
      return res.status(500).json({
        message: "Failed to get seller rating",
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.json({
        seller_id: sellerId,
        average_rating: 0,
        total_reviews: 0,
      });
    }

    res.json(result[0]);
  });
});

// ADD OR UPDATE SELLER RATING
router.post("/", (req, res) => {
  const { reviewer_id, seller_id, product_id, rating } = req.body;

  if (!reviewer_id || !seller_id || !product_id || !rating) {
    return res.status(400).json({
      message: "reviewer_id, seller_id, product_id, and rating are required",
    });
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  if (Number(reviewer_id) === Number(seller_id)) {
    return res.status(400).json({
      message: "You cannot rate yourself",
    });
  }

  const checkSql = `
    SELECT id FROM reviews
    WHERE reviewer_id = ? AND seller_id = ? AND product_id = ?
  `;

  db.query(
    checkSql,
    [reviewer_id, seller_id, product_id],
    (checkErr, checkResult) => {
      if (checkErr) {
        console.log("Check review error:", checkErr);
        return res.status(500).json({
          message: "Failed to check review",
          error: checkErr.message,
        });
      }

      if (checkResult.length > 0) {
        const updateSql = `
          UPDATE reviews
          SET rating = ?
          WHERE reviewer_id = ? AND seller_id = ? AND product_id = ?
        `;

        db.query(
          updateSql,
          [rating, reviewer_id, seller_id, product_id],
          (updateErr) => {
            if (updateErr) {
              console.log("Update review error:", updateErr);
              return res.status(500).json({
                message: "Failed to update rating",
                error: updateErr.message,
              });
            }

            res.json({ message: "Rating updated successfully" });
          }
        );
      } else {
        const insertSql = `
          INSERT INTO reviews (reviewer_id, seller_id, product_id, rating)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [reviewer_id, seller_id, product_id, rating],
          (insertErr) => {
            if (insertErr) {
              console.log("Insert review error:", insertErr);
              return res.status(500).json({
                message: "Failed to submit rating",
                error: insertErr.message,
              });
            }

            res.json({ message: "Rating submitted successfully" });
          }
        );
      }
    }
  );
});

module.exports = router;