const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin } = require('../utils/db');
const { jwtSecret } = require('../config/jwt');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/authMiddleware');

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { email, username, password, name } = req.body;
        console.log('Registration attempt:', { email, username, name });

        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if user exists using parameterized query
        const { data: existingUser, error: checkError } = await supabaseAdmin
            .from('users')
            .select('*')
            .or(`email.eq.${email},username.eq.${username}`)
            .single();

        if (checkError) {
            console.error('Error checking existing user:', checkError);
            throw checkError;
        }

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email or username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const { data: newUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert([
                {
                    email: email,
                    username: username,
                    password_hash: hashedPassword,
                    name: name || username,
                    is_admin: false,
                    is_verified: false
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Error creating user:', insertError);
            throw insertError;
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: newUser.id },
            jwtSecret,
            { expiresIn: '24h' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                name: newUser.name
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login a user
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log('Login attempt:', { identifier });

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Special case for admin
        if (identifier === 'admin' && password === 'admin') {
            const token = jwt.sign(
                { 
                    userId: 'admin',
                    isAdmin: true 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                success: true,
                token,
                user: {
                    id: 'admin',
                    username: 'admin',
                    email: 'admin@bidbazaar.com',
                    is_admin: true
                }
            });
        }

        // For regular users
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .or(`email.eq."${identifier}",username.eq."${identifier}"`)
            .single();

        console.log('User lookup result:', { user, error });

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                is_admin: user.is_admin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
});

// Check if user is admin
router.get("/check-admin", authenticateToken, async (req, res) => {
    try {
        res.json({ isAdmin: req.user?.is_admin || false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update the logout route
router.get('/logout', (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');
        
        // Clear session if you're using sessions
        if (req.session) {
            req.session.destroy();
        }

        // Send success response
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Error during logout' });
    }
});

module.exports = router;