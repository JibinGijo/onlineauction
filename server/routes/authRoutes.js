const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register a new user
router.post("/register", authController.register);

// Login a user
router.post("/login", authController.login);

// Check if user is admin
router.get("/check-admin", authController.checkAdmin);

module.exports = router;