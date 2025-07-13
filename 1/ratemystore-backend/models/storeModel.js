const db = require("../db");

// Add a new store
exports.addStore = (storeData) => {
  const { name, email, city, zip, owner_id } = storeData;
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO stores (name, email, city, zip, owner_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, city, zip, owner_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get all stores owned by a store_owner
exports.getStoresByOwner = (ownerId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM stores WHERE owner_id = ?";
    db.query(sql, [ownerId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Delete a store by ID (only by its owner)
exports.deleteStore = (storeId, ownerId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM stores WHERE id = ? AND owner_id = ?";
    db.query(sql, [storeId, ownerId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get all stores with average ratings
exports.getAllStoresWithRatings = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT s.*, AVG(r.rating) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
