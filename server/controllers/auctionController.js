const Auction = require("../models/Auction");
const User = require("../models/User"); // Assuming you have a User model
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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

// New function to validate registered email
exports.validateEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Email not registered" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New function to handle user registration
exports.registerUser = async (req, res) => {
  const { username, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, phone, password: hashedPassword }]);

    if (error) {
      throw error;
    }

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New function to handle user login
exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Invalid username/email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid username/email or password' });
    }

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};