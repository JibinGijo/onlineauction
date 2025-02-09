const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', auctionController.index);
router.get('/categories', auctionController.categories);
router.get('/category/:category', auctionController.category);
router.get('/listing/:listingId', auctionController.viewListing);

// Authentication routes
router.post('/register', auctionController.register);
router.post('/login', auctionController.login);
router.post('/logout', auctionController.logout);
router.post('/otp-verification', auctionController.otpVerification);
router.get('/otp-success', auctionController.otpSuccess);
router.post('/forgot-password', auctionController.forgotPassword);
router.post('/forgot-password-otp', auctionController.passwordOtp);
router.post('/reset-password', auctionController.passwordResetSuccess);

// Protected routes (require authentication)
router.use(authenticateToken);
router.post('/create-listing', auctionController.createListing);
router.get('/your-listings', auctionController.yourListings);
router.get('/won-listings', auctionController.wonListings);
router.get('/watch-list', auctionController.watchList);
router.post('/listing/:listingId/watch', auctionController.watch);
router.post('/listing/:listingId/close', auctionController.closeAuction);
router.post('/listing/:listingId/bid', auctionController.bid);
router.post('/listing/:listingId/comment', auctionController.comment);

// Profile routes
router.get('/profile', auctionController.viewProfile);
router.post('/profile/edit', auctionController.editProfile);
router.post('/profile/edit/password', auctionController.editPassword);

// Admin routes
router.get('/admin-dashboard', auctionController.adminView);
router.get('/admin-dashboard/manage-users', auctionController.manageUsers);
router.get('/admin-dashboard/manage-listings', auctionController.manageListings);
router.post('/deactivate-listing/:listingId', auctionController.deactivateListing);
router.delete('/delete-listing/:listingId', auctionController.deleteListing);
router.get('/admin-dashboard/reports', auctionController.reports);

// Error routes
router.get('/forbidden', auctionController.forbiddenView);

module.exports = router;