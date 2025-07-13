const ratingModel = require("../models/ratingModel");

exports.submitRating = async (req, res) => {
  try {
    const user_id = req.user.id;
    const store_id = req.params.storeId;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    await ratingModel.submitRating(user_id, store_id, rating);
    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Submit Rating Error:", err);
    res.status(500).json({ message: "Server error submitting rating" });
  }
};

exports.getAllStoresWithRatings = async (req, res) => {
  try {
    const stores = await ratingModel.getAllStoresWithAvgRating();
    res.json(stores);
  } catch (err) {
    console.error("Get Ratings Error:", err);
    res.status(500).json({ message: "Server error fetching ratings" });
  }
};
