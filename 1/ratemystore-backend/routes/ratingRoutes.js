const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const authMiddleware = require("../middleware/authMiddleware");

// Only allow normal users to rate
const requireNormalUser = (req, res, next) => {
  if (req.user.role !== "normal_user") {
    return res.status(403).json({ message: "Only normal users can rate" });
  }
  next();
};

// Submit rating
router.post(
  "/:storeId",
  authMiddleware,
  requireNormalUser,
  ratingController.submitRating
);

// Get all stores with ratings
router.get(
  "/",
  authMiddleware,
  requireNormalUser,
  ratingController.getAllStoresWithRatings
);

module.exports = router;
