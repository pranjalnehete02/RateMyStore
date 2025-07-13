const db = require("../db");

exports.submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check for existing rating
    const [existing] = await db.query(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existing.length > 0) {
      // Update existing rating
      await db.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, userId, storeId]
      );
    } else {
      // Insert new rating
      await db.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [userId, storeId, rating]
      );
    }
    console.log("Who is rating?", req.user);

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Submit rating error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
