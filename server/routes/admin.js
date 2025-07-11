const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const bcrypt = require("bcryptjs");
const yup = require("yup");

// ✅ Admin Dashboard Route (Real Data)
router.get(
  "/dashboard",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const [userCount] = await db.query(
        "SELECT COUNT(*) AS total_users FROM users"
      );
      const [storeCount] = await db.query(
        "SELECT COUNT(*) AS total_stores FROM stores"
      );
      const [ratingCount] = await db.query(
        "SELECT COUNT(*) AS total_ratings FROM ratings"
      );

      res.json({
        message: "Welcome Admin!",
        total_users: userCount[0].total_users,
        total_stores: storeCount[0].total_stores,
        total_ratings: ratingCount[0].total_ratings,
      });
    } catch (err) {
      console.error("Admin dashboard error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ Store Owner Dashboard (optional)
router.get(
  "/store/dashboard",
  authenticateToken,
  allowRoles("store_owner"),
  (req, res) => {
    res.json({ message: "Welcome Store Owner!" });
  }
);

// ✅ Common route for Admin and Normal Users
router.get(
  "/user/data",
  authenticateToken,
  allowRoles("admin", "user"),
  (req, res) => {
    res.json({ message: "User access granted." });
  }
);

// ✅ Get all users (Admin only)
router.get(
  "/users",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, role } = req.query;

      // 🧠 Dynamic query building
      let baseQuery =
        "SELECT id, name, email, address, role FROM users WHERE 1=1";
      const params = [];

      if (name) {
        baseQuery += " AND name LIKE ?";
        params.push(`%${name}%`);
      }
      if (email) {
        baseQuery += " AND email LIKE ?";
        params.push(`%${email}%`);
      }
      if (role) {
        baseQuery += " AND role = ?";
        params.push(role);
      }

      const [rows] = await db.query(baseQuery, params);
      res.json(rows);
    } catch (err) {
      console.error("Error fetching users:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ Create a new user (Admin Only)
router.post(
  "/users",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    const { name, email, password, address, role } = req.body;

    // 🔒 Validation Schema
    const schema = yup.object().shape({
      name: yup.string().min(2).max(60).required(),
      email: yup.string().email().required(),
      password: yup
        .string()
        .min(8)
        .max(16)
        .matches(/[A-Z]/, "Password must include uppercase letter")
        .matches(/[!@#$%^&*]/, "Password must include special character")
        .required(),
      address: yup.string().max(400).required(),
      role: yup.string().oneOf(["admin", "user", "store_owner"]).required(),
    });

    try {
      // ✅ Validate data
      await schema.validate({ name, email, password, address, role });

      // 🔍 Check if user already exists
      const [existingUser] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (existingUser.length > 0) {
        return res
          .status(409)
          .json({ error: "User already exists with this email" });
      }

      // 🔐 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 💾 Insert new user
      await db.query(
        "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, address, role]
      );

      res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      console.error("User creation error:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

// ✅ View all stores (Admin only)
router.get(
  "/stores",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { name, owner } = req.query;

      let baseQuery = `
          SELECT 
            s.id,
            s.name AS store_name,
            s.email AS store_email,
            s.address AS store_address,
            s.owner_id,
            u.name AS owner_name,
            u.email AS owner_email,
            IFNULL(AVG(r.rating), 0) AS average_rating
          FROM stores s
          JOIN users u ON s.owner_id = u.id
          LEFT JOIN ratings r ON s.id = r.store_id
          WHERE 1=1
        `;

      const params = [];

      if (name) {
        baseQuery += " AND s.name LIKE ?";
        params.push(`%${name}%`);
      }

      if (owner) {
        baseQuery += " AND u.name LIKE ?";
        params.push(`%${owner}%`);
      }

      baseQuery += " GROUP BY s.id";

      const [stores] = await db.query(baseQuery, params);
      res.json(stores);
    } catch (err) {
      console.error("Error fetching stores:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ Admin can add a new store
router.post(
  "/stores",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    try {
      // 🔍 Check if store with email already exists
      const [existingStore] = await db.query(
        "SELECT * FROM stores WHERE email = ?",
        [email]
      );
      if (existingStore.length > 0) {
        return res
          .status(409)
          .json({ error: "Store already exists with this email." });
      }

      // 🔍 Validate owner exists and is a store_owner
      const [owner] = await db.query(
        "SELECT * FROM users WHERE id = ? AND role = 'store_owner'",
        [owner_id]
      );
      if (owner.length === 0) {
        return res
          .status(404)
          .json({ error: "Store owner not found or invalid role." });
      }

      // 💾 Insert store
      await db.query(
        "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
        [name, email, address, owner_id]
      );

      res.status(201).json({ message: "Store added successfully!" });
    } catch (err) {
      console.error("Add store error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
