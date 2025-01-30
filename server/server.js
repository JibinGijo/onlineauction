const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

app.use("/auth", authRoutes);
app.use("/auctions", auctionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});