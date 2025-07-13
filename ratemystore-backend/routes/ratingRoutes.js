const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ratingController = require("../controllers/ratingController");

// POST /api/ratings/:storeId
router.post("/:storeId", authMiddleware, ratingController.submitRating);

module.exports = router;
