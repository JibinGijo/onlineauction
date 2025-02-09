const { supabaseAdmin } = require('../utils/db');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { getIO } = require('../utils/io');

dotenv.config();

const supabase = require('../utils/db').supabase;

exports.index = async (req, res) => {
    try {
        const { data: auctions, error } = await supabaseAdmin
            .from('auctions')
            .select(`
                *,
                seller:users(username),
                categories:auction_categories(name)
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        res.json({ success: true, auctions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    // Implement login logic
};

exports.logout = async (req, res) => {
    // Implement logout logic
};

exports.register = async (req, res) => {
    // Implement registration logic
};

exports.categories = async (req, res) => {
    // Implement logic to fetch categories
};

exports.category = async (req, res) => {
    // Implement logic to fetch a specific category
};

exports.createListing = async (req, res) => {
    try {
        const { title, description, starting_price, end_time, category_ids, image_urls } = req.body;
        const seller_id = req.user.id;

        const { data: auction, error } = await supabaseAdmin
            .from('auctions')
            .insert({
                title,
                description,
                seller_id,
                starting_price,
                current_price: starting_price,
                end_time,
                status: 'active',
                image_urls
            })
            .select()
            .single();

        if (error) throw error;

        // Add categories
        if (category_ids?.length) {
            const categoryLinks = category_ids.map(category_id => ({
                auction_id: auction.id,
                category_id
            }));

            const { error: categoryError } = await supabaseAdmin
                .from('auction_categories')
                .insert(categoryLinks);

            if (categoryError) throw categoryError;
        }

        res.json({ success: true, auction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.yourListings = async (req, res) => {
    // Implement logic to fetch user's listings
};

exports.wonListings = async (req, res) => {
    // Implement logic to fetch won listings
};

exports.watchList = async (req, res) => {
    // Implement logic to fetch watch list
};

exports.viewListing = async (req, res) => {
    // Implement logic to view a specific listing
};

exports.watch = async (req, res) => {
    // Implement logic to watch a listing
};

exports.closeAuction = async (req, res) => {
    // Implement logic to close an auction
};

exports.bid = async (req, res) => {
    // Implement logic to place a bid
};

exports.comment = async (req, res) => {
    // Implement logic to comment on a listing
};

exports.otpVerification = async (req, res) => {
    // Implement OTP verification logic
};

exports.otpSuccess = async (req, res) => {
    // Implement logic for OTP success
};

exports.forgotPassword = async (req, res) => {
    // Implement forgot password logic
};

exports.passwordOtp = async (req, res) => {
    // Implement password OTP logic
};

exports.passwordResetSuccess = async (req, res) => {
    // Implement password reset success logic
};

exports.viewProfile = async (req, res) => {
    // Implement logic to view user profile
};

exports.editProfile = async (req, res) => {
    // Implement logic to edit user profile
};

exports.editPassword = async (req, res) => {
    // Implement logic to edit user password
};

exports.adminView = async (req, res) => {
    // Implement logic for admin dashboard view
};

exports.manageUsers = async (req, res) => {
    // Implement logic to manage users
};

exports.manageListings = async (req, res) => {
    // Implement logic to manage listings
};

exports.deactivateListing = async (req, res) => {
    // Implement logic to deactivate a listing
};

exports.deleteListing = async (req, res) => {
    // Implement logic to delete a listing
};

exports.reports = async (req, res) => {
    // Implement logic to generate reports
};

exports.forbiddenView = async (req, res) => {
    res.status(403).json({ success: false, message: 'Forbidden' });
};

exports.getAuctions = async (req, res) => {
    try {
        const { data: auctions, error } = await supabaseAdmin
            .from('auctions')
            .select('*');

        if (error) throw error;

        res.json({ success: true, auctions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAuction = async (req, res) => {
    const { name, image, current_bid, time_left } = req.body;
    try {
        const { data, error } = await supabaseAdmin
            .from('auctions')
            .insert([{ 
                name, 
                image, 
                current_bid, 
                time_left 
            }])
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAuction = async (req, res) => {
    const { id } = req.params;
    const { current_bid } = req.body;
    try {
        const { data, error } = await supabaseAdmin
            .from('auctions')
            .update({ current_bid })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update validateEmail to use Supabase
exports.validateEmail = async (req, res, next) => {
    const { email } = req.body;
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) {
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

exports.placeBid = async (req, res) => {
    const { auctionId, bidAmount } = req.body;
    const userId = req.user.id;

    try {
        // Fetch the auction
        const { data: auction, error } = await supabaseAdmin
            .from('auctions')
            .select('*')
            .eq('id', auctionId)
            .single();

        if (error || !auction) {
            return res.status(404).json({ error: 'Auction not found' });
        }

        // Validate bid
        if (bidAmount <= auction.current_price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Bid must be higher than the current price' 
            });
        }

        // Start a transaction
        const { data: bid, error: bidError } = await supabaseAdmin
            .from('bids')
            .insert({
                auction_id: auctionId,
                bidder_id: userId,
                amount: bidAmount
            })
            .select()
            .single();

        if (bidError) throw bidError;

        // Update auction current price
        const { error: updateError } = await supabaseAdmin
            .from('auctions')
            .update({ 
                current_price: bidAmount,
                highest_bidder_id: userId
            })
            .eq('id', auctionId);

        if (updateError) throw updateError;

        // Emit the bid update to all clients
        getIO().emit('bidUpdate', { 
            auctionId, 
            bidAmount,
            bidderId: userId 
        });

        res.json({ success: true, message: 'Bid placed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};