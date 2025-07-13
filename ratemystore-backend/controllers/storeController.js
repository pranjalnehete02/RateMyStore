const storeModel = require("../models/storeModel");

// Add Store
exports.addStore = async (req, res) => {
  try {
    const owner_id = req.user.id; // from JWT middleware
    const { name, email, city, zip } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    await storeModel.addStore({ name, email, city, zip, owner_id });
    res.status(201).json({ message: "Store added successfully" });
  } catch (err) {
    console.error("Add Store Error:", err);
    res.status(500).json({ message: "Server error while adding store" });
  }
};

// Get Stores by Owner
exports.getMyStores = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const stores = await storeModel.getStoresByOwner(owner_id);
    res.json(stores);
  } catch (err) {
    console.error("Get Stores Error:", err);
    res.status(500).json({ message: "Server error fetching stores" });
  }
};

// Delete Store
exports.deleteStore = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const storeId = req.params.id;

    const result = await storeModel.deleteStore(storeId, owner_id);

    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ message: "You can only delete your own stores" });
    }

    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("Delete Store Error:", err);
    res.status(500).json({ message: "Server error while deleting store" });
  }
};

// Get All Stores with Average Ratings
exports.getAllStores = async (req, res) => {
  try {
    const db = require("../db");
    const user_id = req.user.id;

    const [stores] = await db.query(
      `
        SELECT s.*, 
               ROUND(AVG(r.rating), 1) AS average_rating,
               MAX(CASE WHEN r.user_id = ? THEN r.rating ELSE NULL END) AS user_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        GROUP BY s.id
      `,
      [user_id]
    );

    res.json(stores);
  } catch (err) {
    console.error("Get All Stores Error:", err);
    res.status(500).json({ message: "Server error while fetching stores" });
  }
};
