const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../utils/db');
const { authenticateToken, checkAdmin } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(checkAdmin);

// Helper functions to fetch dashboard data
async function getUserListings() {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select(`
            username,
            listings:auctions(count)
        `);
    
    if (error) throw error;
    
    return data.map(user => ({
        username: user.username,
        total_listings: user.listings.length
    }));
}

async function getRegistrationData() {
    // Get weekly data
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: weekly, error: weeklyError } = await supabaseAdmin
        .from('users')
        .select('created_at')
        .gte('created_at', weekAgo.toISOString());

    if (weeklyError) throw weeklyError;

    // Get monthly data
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const { data: monthly, error: monthlyError } = await supabaseAdmin
        .from('users')
        .select('created_at')
        .gte('created_at', threeMonthsAgo.toISOString());

    if (monthlyError) throw monthlyError;

    return {
        weekly: processWeeklyData(weekly),
        monthly: processMonthlyData(monthly)
    };
}

async function getListingsData() {
    const { data, error } = await supabaseAdmin
        .from('auctions')
        .select('created_at');
    
    if (error) throw error;

    return {
        daily: processDailyData(data),
        monthly: processMonthlyData(data)
    };
}

async function getCategoryData() {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select(`
            name,
            auctions:auction_categories(count)
        `);
    
    if (error) throw error;

    return data.map(category => ({
        name: category.name,
        total_listings: category.auctions.length
    }));
}

async function getBidsData() {
    // Get most bid item
    const { data: mostBid, error: mostBidError } = await supabaseAdmin
        .from('auctions')
        .select(`
            title,
            bids(count),
            categories!auction_categories(name)
        `)
        .order('bids(count)', { ascending: false })
        .limit(1)
        .single();

    if (mostBidError) throw mostBidError;

    // Get least bid item
    const { data: leastBid, error: leastBidError } = await supabaseAdmin
        .from('auctions')
        .select(`
            title,
            bids(count),
            categories!auction_categories(name)
        `)
        .order('bids(count)', { ascending: true })
        .limit(1)
        .single();

    if (leastBidError) throw leastBidError;

    // Get top bidders
    const { data: topBidders, error: topBiddersError } = await supabaseAdmin
        .from('users')
        .select(`
            username,
            bids(count)
        `)
        .order('bids(count)', { ascending: false })
        .limit(5);

    if (topBiddersError) throw topBiddersError;

    return {
        mostBid: {
            title: mostBid.title,
            total_bids: mostBid.bids.length,
            category: mostBid.categories[0]?.name
        },
        leastBid: {
            title: leastBid.title,
            total_bids: leastBid.bids.length,
            category: leastBid.categories[0]?.name
        },
        topBidders: topBidders.map(bidder => ({
            username: bidder.username,
            total_bids: bidder.bids.length
        }))
    };
}

// Helper functions for data processing
function processWeeklyData(data) {
    const days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(date => ({
        date,
        count: data.filter(item => 
            item.created_at.split('T')[0] === date
        ).length
    }));
}

function processMonthlyData(data) {
    const months = [...Array(3)].map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return d.getMonth() + 1;
    }).reverse();

    return months.map(month => ({
        month,
        count: data.filter(item => 
            new Date(item.created_at).getMonth() + 1 === month
        ).length
    }));
}

function processDailyData(data) {
    const today = new Date();
    const days = [...Array(7)].map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(date => ({
        date,
        count: data.filter(item => 
            item.created_at.split('T')[0] === date
        ).length
    }));
}

router.get('/dashboard', async (req, res) => {
    try {
        // Fetch all required dashboard data
        const [userListings, registrations, listings, categories, bids] = await Promise.all([
            getUserListings(),
            getRegistrationData(),
            getListingsData(),
            getCategoryData(),
            getBidsData()
        ]);

        res.json({
            userListings,
            registrations,
            listings,
            categories,
            bids
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ error: 'Error fetching dashboard data' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select('username, email')
            .order('username', { ascending: true });

        if (error) throw error;

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

router.get('/listings', async (req, res) => {
    try {
        const { data: listings, error } = await supabaseAdmin
            .from('auctions')
            .select(`
                *,
                seller:users(username),
                categories:auction_categories(name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            listings
        });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch listings'
        });
    }
});

router.delete('/listings/:id', async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('auctions')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Listing deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete listing'
        });
    }
});

router.put('/listings/:id/toggle', async (req, res) => {
    try {
        const { data: listing, error: fetchError } = await supabaseAdmin
            .from('auctions')
            .select('status')
            .eq('id', req.params.id)
            .single();

        if (fetchError) throw fetchError;

        const newStatus = listing.status === 'active' ? 'inactive' : 'active';

        const { error: updateError } = await supabaseAdmin
            .from('auctions')
            .update({ status: newStatus })
            .eq('id', req.params.id);

        if (updateError) throw updateError;

        res.json({
            success: true,
            message: 'Listing status updated successfully'
        });
    } catch (error) {
        console.error('Error updating listing status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update listing status'
        });
    }
});

module.exports = router; 