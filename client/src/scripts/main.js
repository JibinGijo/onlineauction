document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedAuctions();
    setupSearchBar();
    setupUserMenu();
});

async function loadFeaturedAuctions() {
    try {
        const response = await fetch('/api/auctions/featured');
        const auctions = await response.json();
        
        const auctionGrid = document.getElementById('featuredAuctions');
        auctionGrid.innerHTML = auctions.map(auction => `
            <div class="auction-card">
                <img src="${auction.image_urls[0] || '/images/placeholder.jpg'}" alt="${auction.title}">
                <div class="auction-card-content">
                    <h3>${auction.title}</h3>
                    <p class="price">Current Bid: $${auction.current_price}</p>
                    <p class="time-left">${getTimeLeft(auction.end_time)}</p>
                    <a href="/auction/${auction.id}" class="btn btn-primary">Bid Now</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured auctions:', error);
    }
}

function getTimeLeft(endTime) {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return 'Auction ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
}

function setupSearchBar() {
    const searchForm = document.querySelector('.search-bar');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchForm.querySelector('input').value;
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    });
}

function setupUserMenu() {
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.preventDefault();
            const menu = document.createElement('div');
            menu.className = 'user-menu';
            menu.innerHTML = `
                <a href="/profile">My Profile</a>
                <a href="/auctions/my-bids">My Bids</a>
                <a href="/auctions/my-listings">My Listings</a>
                <a href="/settings">Settings</a>
                <a href="#" onclick="logout()">Logout</a>
            `;
            userProfile.appendChild(menu);
        });
    }
}

async function logout() {
    try {
        await fetch('/auth/logout', { method: 'POST' });
        localStorage.removeItem('token');
        window.location.href = '/';
    } catch (error) {
        console.error('Error logging out:', error);
    }
} 