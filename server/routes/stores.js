const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const yup = require("yup");

// ✅ GET /api/stores
router.get("/", authenticateToken, allowRoles("user"), async (req, res) => {
  const userId = req.user.id;
  const { name, address } = req.query;

  try {
    let query = `
        SELECT 
          s.id, s.name, s.email, s.address,
          ROUND(AVG(r.rating), 1) AS avg_rating,
          (
            SELECT r2.rating
            FROM ratings r2
            WHERE r2.store_id = s.id AND r2.user_id = ?
          ) AS your_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE 1=1
      `;

    const params = [userId];

    // Optional filters
    if (name) {
      query += " AND s.name LIKE ?";
      params.push(`%${name}%`);
    }

    if (address) {
      query += " AND s.address LIKE ?";
      params.push(`%${address}%`);
    }

    query += " GROUP BY s.id";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Store listing error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST /api/stores/:storeId/rate
router.post(
  "/:storeId/rate",
  authenticateToken,
  allowRoles("user"),
  async (req, res) => {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // 📌 Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be a number between 1 and 5",
      });
    }

    try {
      // 🔍 Check if store exists
      const [storeCheck] = await db.query(
        "SELECT id FROM stores WHERE id = ?",
        [storeId]
      );

      if (storeCheck.length === 0) {
        return res.status(404).json({ error: "Store not found" });
      }

      // 🔄 Check if user already rated this store
      const [existing] = await db.query(
        "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
        [userId, storeId]
      );

      if (existing.length > 0) {
        // 🔁 Update rating
        await db.query(
          "UPDATE ratings SET rating = ?, updated_at = NOW() WHERE user_id = ? AND store_id = ?",
          [rating, userId, storeId]
        );

        return res.json({ message: "Rating updated successfully!" });
      } else {
        // ➕ Insert new rating
        await db.query(
          "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
          [userId, storeId, rating]
        );

        return res
          .status(201)
          .json({ message: "Rating submitted successfully!" });
      }
    } catch (err) {
      console.error("Rating error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ Submit or Update Rating
router.post(
  "/:id/rate",
  authenticateToken,
  allowRoles("user"),
  async (req, res) => {
    const storeId = req.params.id;
    const userId = req.user.id;
    const { rating } = req.body;

    // ✅ Validate rating input
    const schema = yup
      .number()
      .min(1)
      .max(5)
      .required("Rating between 1 and 5 is required");

    try {
      await schema.validate(rating);

      // 🔍 Check if the user already rated this store
      const [existingRating] = await db.query(
        "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
        [userId, storeId]
      );

      if (existingRating.length > 0) {
        // 🔁 Update existing rating
        await db.query(
          "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
          [rating, userId, storeId]
        );
        return res.json({ message: "Rating updated successfully" });
      } else {
        // 🆕 Insert new rating
        await db.query(
          "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
          [userId, storeId, rating]
        );
        return res
          .status(201)
          .json({ message: "Rating submitted successfully" });
      }
    } catch (err) {
      console.error("Rating submission error:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
