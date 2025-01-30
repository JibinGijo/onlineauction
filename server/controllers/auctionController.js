const Auction = require("../models/Auction");

exports.getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.getAll();
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAuction = async (req, res) => {
  const { name, image, current_bid, time_left } = req.body;
  try {
    const newAuction = await Auction.create({ name, image, current_bid, time_left });
    res.json(newAuction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAuction = async (req, res) => {
  const { id } = req.params;
  const { current_bid } = req.body;
  try {
    const updatedAuction = await Auction.update(id, { current_bid });
    res.json(updatedAuction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};