const express = require("express");
const router = express.Router();
const db = require("../db");
const yup = require("yup");
const authenticateToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// 📌 Validation Schema
const ratingSchema = yup.object().shape({
  store_id: yup.number().required(),
  rating: yup.number().min(1).max(5).required(),
});

// ✅ Submit or Update Rating
router.post("/", authenticateToken, allowRoles("user"), async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  try {
    await ratingSchema.validate({ store_id, rating });

    // Check if the user has already rated this store
    const [existing] = await db.query(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [user_id, store_id]
    );

    if (existing.length > 0) {
      // 🔄 Update existing rating
      await db.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, user_id, store_id]
      );
      return res.json({ message: "Rating updated successfully!" });
    } else {
      // ➕ Add new rating
      await db.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [user_id, store_id, rating]
      );
      return res
        .status(201)
        .json({ message: "Rating submitted successfully!" });
    }
  } catch (err) {
    console.error("Rating error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
