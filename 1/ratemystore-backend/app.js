// app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes"); // 👈 Import routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

app.use("/api/auth", authRoutes); // 👈 Mount routes

// Sample route (we’ll remove later)
app.get("/", (req, res) => {
  res.send("RateMyStore Backend is Live 🎯");
});

// Route mounting point (future use)
// app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app;
