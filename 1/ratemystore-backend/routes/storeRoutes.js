const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected: Only logged-in users with 'store_owner' role
const requireStoreOwner = (req, res, next) => {
  if (req.user.role !== "store_owner") {
    return res
      .status(403)
      .json({ message: "Only store owners can perform this action" });
  }
  next();
};

// POST: Add new store
router.post(
  "/add",
  authMiddleware,
  requireStoreOwner,
  storeController.addStore
);

// GET: Get stores added by this owner
router.get(
  "/owner",
  authMiddleware,
  requireStoreOwner,
  storeController.getMyStores
);

// DELETE: Remove a store
router.delete(
  "/:id",
  authMiddleware,
  requireStoreOwner,
  storeController.deleteStore
);

module.exports = router;
