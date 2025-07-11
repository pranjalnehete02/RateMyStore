const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Only accessible to 'store_owner'
router.get(
  "/store/dashboard",
  authenticateToken,
  allowRoles("store_owner"),
  (req, res) => {
    res.json({
      message: "Welcome Store Owner!",
      accessedAt: new Date().toLocaleString(),
      user: req.user,
    });
  }
);

module.exports = router;
