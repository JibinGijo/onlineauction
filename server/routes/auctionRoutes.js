const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");

// Get all auctions
router.get("/", auctionController.getAuctions);

// Create a new auction
router.post("/", auctionController.createAuction);

// Update an auction (e.g., place a bid)
router.put("/:id", auctionController.updateAuction);

module.exports = router;