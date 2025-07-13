const db = require("../db");

exports.submitRating = (user_id, store_id, rating) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = ?`;

    db.query(sql, [user_id, store_id, rating, rating], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getAllStoresWithAvgRating = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        s.id, s.name, s.email, s.city, s.zip, s.owner_id,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(r.rating) AS total_ratings
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
