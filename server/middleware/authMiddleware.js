const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { jwtSecret } = require('../config/jwt');
const { supabaseAdmin } = require('../utils/db');

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || 
                     req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Special case for admin
        if (decoded.userId === 'admin') {
            req.user = {
                id: 'admin',
                username: 'admin',
                is_admin: true
            };
            return next();
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

const checkAdmin = (req, res, next) => {
    if (!req.user?.is_admin) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

module.exports = { authenticateToken, checkAdmin };

