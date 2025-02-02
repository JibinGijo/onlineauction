const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.checkAdmin = async (req, res, next) => {
  try {
    const isAdmin = await User.isAdmin(req.user.email);
    if (!isAdmin) return res.sendStatus(403);
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
