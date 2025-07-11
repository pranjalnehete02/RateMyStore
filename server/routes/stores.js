const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

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

module.exports = router;
