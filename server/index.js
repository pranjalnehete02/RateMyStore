const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

const ratingRoutes = require("./routes/ratings");
app.use("/api/ratings", ratingRoutes);

const storeRoutes = require("./routes/stores");
app.use("/api/stores", storeRoutes);

const testRoutes = require("./routes/test");
app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("RateMyStore API is running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
