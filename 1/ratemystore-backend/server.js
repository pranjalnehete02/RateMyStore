// server.js
const app = require("./app");
const dotenv = require("dotenv");
const db = require("./config/db"); // 👈 Import DB

// Load .env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
