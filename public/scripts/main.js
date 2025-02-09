document.addEventListener('DOMContentLoaded', async () => {
    // Load recent listings
    try {
        const response = await fetch('/auctions/recent');
        const data = await response.json();

        if (data.success) {
            const listingsGrid = document.getElementById('recentListings');
            listingsGrid.innerHTML = data.listings.map(listing => `
                <div class="listing-card">
                    <img src="${listing.image_url || 'images/placeholder.jpg'}" alt="${listing.title}">
                    <div class="listing-details">
                        <h3>${listing.title}</h3>
                        <p class="current-bid">Current Bid: ₹${listing.current_price}</p>
                        <p class="status ${listing.status.toLowerCase()}">${listing.status}</p>
                        <a href="/auction/${listing.id}" class="bid-now-btn">BID NOW</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error fetching recent listings:', error);
    }

    // Update auth buttons based on login status
    const authButtons = document.getElementById('authButtons');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        authButtons.innerHTML = `
            <span class="welcome-text">Welcome, ${user.username}!</span>
            <a href="/profile" class="nav-btn">Profile</a>
            <a href="/logout" class="nav-btn">Logout</a>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="/login.html" class="nav-btn">Login</a>
            <a href="/register.html" class="nav-btn primary">Register</a>
        `;
    }

    // Update the logout function
    function logout() {
        fetch('/auth/logout', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login page
                window.location.href = '/login';
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('Error during logout. Please try again.');
        });
    }

    // Add event listener to logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}); 