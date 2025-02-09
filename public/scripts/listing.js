document.addEventListener('DOMContentLoaded', async () => {
    // Get listing ID from URL
    const listingId = window.location.pathname.split('/').pop();
    
    try {
        // Fetch listing details
        const response = await fetch(`/api/auctions/${listingId}`);
        const data = await response.json();
        
        if (data.success) {
            const listing = data.listing;
            
            // Update page content
            document.getElementById('listingImage').src = listing.image_url || '/images/placeholder.jpg';
            document.getElementById('listingTitle').textContent = listing.title;
            document.getElementById('listingDescription').textContent = listing.description;
            document.getElementById('ownerName').textContent = listing.seller.username;
            document.getElementById('initialPrice').textContent = `₹${listing.starting_price}`;
            document.getElementById('currentPrice').textContent = `₹${listing.current_price}`;
            document.getElementById('highestBidder').textContent = listing.highest_bidder?.username || 'No bids yet';
            
            // Update bid section based on auth status
            const user = JSON.parse(localStorage.getItem('user'));
            const bidSection = document.getElementById('bidSection');
            
            if (user) {
                if (user.id === listing.seller_id) {
                    bidSection.innerHTML = '<p>This is your listing</p>';
                } else {
                    bidSection.innerHTML = `
                        <form id="bidForm">
                            <p>Please login to place a bid</p>
                            <a href="/login.html" class="bid-now-btn">Login to Bid</a>
                        </form>
                    `;
                }
            } else {
                bidSection.innerHTML = `
                    <p class="login-message">
                        Please <a href="/login.html">login</a> to place a bid
                    </p>
                `;
            }
        }
    } catch (error) {
        console.error('Error fetching listing:', error);
    }
}); 