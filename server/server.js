require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});