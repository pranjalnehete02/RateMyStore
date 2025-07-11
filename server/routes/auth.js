const express = require("express");
const bcrypt = require("bcryptjs");
const yup = require("yup");
const db = require("../db");

const router = express.Router();

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

module.exports = router;
