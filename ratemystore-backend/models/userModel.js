// models/userModel.js
const db = require("../db");

const createUser = (name, email, hashedPassword, role) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]); // returns undefined if not found
    });
  });
};

module.exports = {
  createUser,
  findUserByEmail,
};
