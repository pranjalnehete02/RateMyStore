const express = require("express");
const bcrypt = require("bcryptjs");
const yup = require("yup");
const db = require("../db");

const router = express.Router();

// At the top of auth.js
const authenticateToken = require("../middleware/authMiddleware");

// Password validation schema
const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required(),
  newPassword: yup
    .string()
    .min(8)
    .max(16)
    .matches(/[A-Z]/, "must contain an uppercase letter")
    .matches(/[!@#$%^&*]/, "must contain a special character")
    .required(),
});

// ✅ Change Password Route (Protected)
router.post("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Validate incoming data
    await changePasswordSchema.validate({ currentPassword, newPassword });

    // Get user from DB
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update in DB
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedNewPassword,
      req.user.id,
    ]);

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Password change error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// 📌 Signup Validation Schema
const signupSchema = yup.object().shape({
  name: yup.string().min(2).max(60).required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8)
    .max(16)
    .matches(/[A-Z]/, "must contain an uppercase letter")
    .matches(/[!@#$%^&*]/, "must contain a special character")
    .required(),
  address: yup.string().max(400).required(),
});

// 📌 POST /auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    // ✅ Validate data
    await signupSchema.validate({ name, email, password, address });

    // 🔍 Check if user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ error: "User already exists with this email." });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧠 Default role = 'user'
    const role = "user";

    // 💾 Insert into DB
    await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

// ----------------------------JWT--------------------------

const jwt = require("jsonwebtoken");

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await loginSchema.validate({ email, password });

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("🔑 Incoming password:", password);
    console.log("🔐 Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Do they match?", isMatch);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(400).json({ error: err.message });
  }
});

//----------------------------    ------------------------

// ✅ Change Password Route
router.put(
  "/change-password",
  authenticateToken, // 🛡️ must be logged in
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      // 1️⃣ Validate new password format using yup
      const schema = yup
        .string()
        .min(8)
        .max(16)
        .matches(/[A-Z]/, "Must include an uppercase letter")
        .matches(/[!@#$%^&*]/, "Must include a special character")
        .required();

      await schema.validate(newPassword);

      // 2️⃣ Fetch user by ID
      const [userRows] = await db.query("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);
      const user = userRows[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 3️⃣ Compare old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }

      // 4️⃣ Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 5️⃣ Update password in DB
      await db.query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        userId,
      ]);

      return res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("Password change error:", err.message);
      return res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
