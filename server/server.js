require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { jwtSecret } = require('./config/jwt');
const helmet = require('helmet');
const compression = require('compression');
const ensureAdminExists = require('./utils/setupAdmin');
const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin } = require('./utils/db');
const auctionRoutes = require('./routes/auctionRoutes');
const http = require('http');
const { initIO, getIO } = require('./utils/io');
const passport = require('./config/passport');

const app = express();
const server = http.createServer(app);
const io = initIO(server);
const port = process.env.PORT || 3000;

// Ensure admin user exists
ensureAdminExists();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-app-name.onrender.com' 
        : 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: jwtSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Move the static files middleware BEFORE the route handlers
app.use(express.static(path.join(__dirname, "../public")));

// Add these routes AFTER the static middleware but BEFORE your API routes
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

// Then your existing API routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/api/auctions', auctionRoutes);
app.use("/api/admin", adminRoutes);

// Add logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    if (req.session) {
        req.session.destroy();
    }
    res.redirect('/login');
});

// Admin route handler - must be before the catch-all route
app.get('/admin*', async (req, res, next) => {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.redirect('/login.html?redirect=/admin');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('is_admin')
            .eq('id', decoded.userId)
            .single();

        if (error || !user?.is_admin) {
            return res.redirect('/?error=adminRequired');
        }

        res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
    } catch (error) {
        console.error('Admin access error:', error);
        res.redirect('/login.html?redirect=/admin');
    }
});

// Verify Supabase connection
async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('users').select('count');
        if (error) throw error;
        console.log('Supabase connection successful');
    } catch (error) {
        console.error('Supabase connection error:', error);
    }
}

testSupabaseConnection();

// Generic HTML file handler (for any other .html files)
app.get('/:page.html', (req, res) => {
    const filePath = path.join(__dirname, `../public/${req.params.page}.html`);
    console.log('Attempting to serve:', filePath);
    res.sendFile(filePath);
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Keep your existing error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Move socket connection handling to after io initialization
io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('bid', (data) => {
        // Handle bid logic
        io.emit('bidUpdate', data); // Broadcast bid update to all clients
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.use(passport.initialize());
app.use(passport.session());