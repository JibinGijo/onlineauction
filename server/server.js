require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const { authenticateToken, checkAdmin } = require("./middleware/authMiddleware");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const auctionRoutes = require("./routes/auctionRoutes");
app.use("/auctions", auctionRoutes);

// Protect dashboard route
app.use("/dashboard", authenticateToken, checkAdmin, express.static(path.join(__dirname, "../public/dashboard.html")));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});