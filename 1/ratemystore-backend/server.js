const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
// const ratingRoutes = require("./routes/ratingRoutes"); ← Will add in 2.4

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
// app.use("/api/ratings", ratingRoutes); ← Will enable later

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🎉 Welcome to the RateMyStore Backend!");
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
