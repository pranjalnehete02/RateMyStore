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

// ✅ Admin Add New User
router.post(
  "/users",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    const { name, email, password, address, role } = req.body;

    // ✅ Schema validation using Yup
    const userSchema = yup.object().shape({
      name: yup.string().min(2).max(60).required(),
      email: yup.string().email().required(),
      password: yup
        .string()
        .min(8)
        .max(16)
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(
          /[!@#$%^&*]/,
          "Password must contain at least one special character"
        )
        .required(),
      address: yup.string().max(400).required(),
      role: yup.mixed().oneOf(["admin", "user", "store_owner"]).required(),
    });

    try {
      await userSchema.validate({ name, email, password, address, role });

      // 🔍 Check if user already exists
      const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      if (existing.length > 0) {
        return res
          .status(409)
          .json({ error: "User with this email already exists." });
      }

      // 🔐 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 💾 Insert into DB
      await db.query(
        "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, address, role]
      );

      return res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      console.error("Admin add user error:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

// ✅ Get All Stores (Admin Only) — with filtering and owner info
router.get(
  "/stores",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, address, owner_name } = req.query;

      // 🧠 Start with base query (JOIN with users table to get owner name)
      let baseQuery = `
          SELECT 
            stores.id, 
            stores.name, 
            stores.email, 
            stores.address, 
            users.name AS owner_name 
          FROM stores 
          JOIN users ON stores.owner_id = users.id 
          WHERE 1=1
        `;
      const params = [];

      // 🔍 Add filters if present
      if (name) {
        baseQuery += " AND stores.name LIKE ?";
        params.push(`%${name}%`);
      }
      if (email) {
        baseQuery += " AND stores.email LIKE ?";
        params.push(`%${email}%`);
      }
      if (address) {
        baseQuery += " AND stores.address LIKE ?";
        params.push(`%${address}%`);
      }
      if (owner_name) {
        baseQuery += " AND users.name LIKE ?";
        params.push(`%${owner_name}%`);
      }

      const [rows] = await db.query(baseQuery, params);
      res.json(rows);
    } catch (err) {
      console.error("Error fetching stores:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ Admin can add a new store
// ✅ Add New Store (Admin Only)
router.post(
  "/stores",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    // ✅ Basic validation
    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({
        error: "Please provide name, email, address, and owner_id",
      });
    }

    try {
      // 🔍 Check if email is already used
      const [existing] = await db.query(
        "SELECT * FROM stores WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        return res
          .status(409)
          .json({ error: "Store with this email already exists" });
      }

      // 🔍 Check if owner exists and has role 'store_owner'
      const [owners] = await db.query(
        "SELECT * FROM users WHERE id = ? AND role = 'store_owner'",
        [owner_id]
      );
      if (owners.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid owner_id or user is not a store owner" });
      }

      // ✅ Insert store
      await db.query(
        "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
        [name, email, address, owner_id]
      );

      res.status(201).json({ message: "Store added successfully!" });
    } catch (err) {
      console.error("Error adding store:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ✅ Get Specific User Details (Admin Only)
router.get(
  "/users/:id",
  authenticateToken,
  allowRoles("admin"),
  async (req, res) => {
    const userId = req.params.id;

    try {
      // 1️⃣ Fetch user by ID
      const [userRows] = await db.query(
        "SELECT id, name, email, address, role FROM users WHERE id = ?",
        [userId]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userRows[0];

      // 2️⃣ If user is a store owner, fetch store(s) & average rating(s)
      if (user.role === "store_owner") {
        const [storeRows] = await db.query(
          `SELECT 
               stores.id,
               stores.name,
               stores.address,
               stores.email,
               COALESCE(ROUND(AVG(ratings.rating), 2), 0) AS average_rating
             FROM stores
             LEFT JOIN ratings ON stores.id = ratings.store_id
             WHERE stores.owner_id = ?
             GROUP BY stores.id`,
          [userId]
        );

        return res.json({
          ...user,
          stores_owned: storeRows,
        });
      }

      // 3️⃣ For other roles, just return user info
      return res.json(user);
    } catch (err) {
      console.error("Error fetching user details:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
