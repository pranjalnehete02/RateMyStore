const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// Only accessible to 'admin' users
router.get(
  "/admin/dashboard",
  authenticateToken,
  allowRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin! This is your dashboard." });
  }
);

// Only for store owners
router.get(
  "/store/dashboard",
  authenticateToken,
  allowRoles("store_owner"),
  (req, res) => {
    res.json({ message: "Welcome Store Owner!" });
  }
);

// For both admin & normal users
router.get(
  "/user/data",
  authenticateToken,
  allowRoles("admin", "user"),
  (req, res) => {
    res.json({ message: "User access granted." });
  }
);

module.exports = router;
