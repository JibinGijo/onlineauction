const express = require("express");
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { supabase } = require('../utils/db');
const { authenticateToken } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

// Protected routes
router.use(authenticateToken);

// Update email
router.post("/update-email", async (req, res) => {
    try {
        const { newEmail } = req.body;
        
        const { data, error } = await supabase
            .from('users')
            .update({ email: newEmail })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, user: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update username
router.post("/update-username", async (req, res) => {
    try {
        const { username } = req.body;
        
        const { data, error } = await supabase
            .from('users')
            .update({ username })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, user: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update phone
router.post("/update-phone", async (req, res) => {
    try {
        const { phone } = req.body;
        
        const { data, error } = await supabase
            .from('users')
            .update({ phone, is_phone_verified: false })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, user: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username,
                is_admin: user.is_admin,
                is_phone_verified: user.is_phone_verified,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const { name, email, username } = req.body;
        
        const { data, error } = await supabase
            .from('users')
            .update({ name, email, username })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            user: {
                id: data.id,
                email: data.email,
                name: data.name,
                username: data.username
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Get auction history
router.get('/auction-history', async (req, res) => {
    try {
        const { data: history, error } = await supabase
            .from('bids')
            .select(`
                *,
                auction:auctions(
                    id,
                    title,
                    current_price,
                    end_time,
                    status
                )
            `)
            .eq('bidder_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Auction history error:', error);
        res.status(500).json({ message: 'Error fetching auction history' });
    }
});

// Change password
router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get current user
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('password_hash, has_password')
            .eq('id', req.user.id)
            .single();

        if (userError) throw userError;

        // Verify current password if user has one
        if (user.has_password) {
            const isValid = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
        }

        // Hash and update new password
        const password_hash = await bcrypt.hash(newPassword, 10);
        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                password_hash,
                has_password: true
            })
            .eq('id', req.user.id);

        if (updateError) throw updateError;

        res.json({ 
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

module.exports = router;
