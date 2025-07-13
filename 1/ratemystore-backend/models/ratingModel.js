const db = require("../db");

// Submit a new rating
exports.submitRating = (userId, storeId, rating) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [userId, storeId, rating], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Get a user's previous rating for a store
exports.getUserRatingForStore = (userId, storeId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT rating FROM ratings
      WHERE user_id = ? AND store_id = ?
    `;
    db.query(sql, [userId, storeId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};
