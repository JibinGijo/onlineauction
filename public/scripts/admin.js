document.addEventListener('DOMContentLoaded', async () => {
    // Fetch dashboard data
    try {
        const response = await fetch('/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            updateUserListings(data.userListings);
            updateRegistrationReports(data.registrationReports);
            updateListingsCharts(data.listings);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
});

function updateUserListings(users) {
    const tbody = document.getElementById('userListingsTable');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.total_listings}</td>
        </tr>
    `).join('');
}

function updateRegistrationReports(reports) {
    const tbody = document.getElementById('registrationReportsTable');
    tbody.innerHTML = reports.map(report => `
        <tr>
            <td>${new Date(report.date).toLocaleDateString()}</td>
            <td>${report.total_registrations}</td>
        </tr>
    `).join('');

    // Create registration chart
    const ctx = document.getElementById('registrationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: reports.map(r => new Date(r.date).toLocaleDateString()),
            datasets: [{
                label: 'Registrations',
                data: reports.map(r => r.total_registrations),
                backgroundColor: '#326789'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateListingsCharts(listings) {
    // Day-wise listings chart
    const dayCtx = document.getElementById('dayWiseListingsChart').getContext('2d');
    new Chart(dayCtx, {
        type: 'line',
        data: {
            labels: listings.daily.map(l => l.date),
            datasets: [{
                label: 'Daily Listings',
                data: listings.daily.map(l => l.count),
                borderColor: '#326789',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Month-wise listings
    const monthCtx = document.getElementById('monthWiseListingsChart').getContext('2d');
    new Chart(monthCtx, {
        type: 'bar',
        data: {
            labels: listings.monthly.map(l => l.month),
            datasets: [{
                label: 'Monthly Listings',
                data: listings.monthly.map(l => l.count),
                backgroundColor: '#E65C4F'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateCategoryData(categories) {
    // Update category table
    const tbody = document.querySelector('#categoryTable tbody');
    tbody.innerHTML = categories.map(cat => `
        <tr>
            <td>${cat.name}</td>
            <td>${cat.total_listings}</td>
        </tr>
    `).join('');

    // Create category chart
    new Chart(document.getElementById('categoryChart'), {
        type: 'bar',
        data: {
            labels: categories.map(c => c.name),
            datasets: [{
                label: 'Listings',
                data: categories.map(c => c.total_listings),
                backgroundColor: '#326789'
            }]
        }
    });
}

function updateBidsSection(bids) {
    document.getElementById('mostBidItem').innerHTML = `
        <div class="bid-item">
            <h4>${bids.mostBid.title}</h4>
            <p>Total Bids: ${bids.mostBid.total_bids}</p>
            <p>Category: ${bids.mostBid.category}</p>
        </div>
    `;

    document.getElementById('leastBidItem').innerHTML = `
        <div class="bid-item">
            <h4>${bids.leastBid.title}</h4>
            <p>Total Bids: ${bids.leastBid.total_bids}</p>
            <p>Category: ${bids.leastBid.category}</p>
        </div>
    `;

    document.getElementById('topBidders').innerHTML = bids.topBidders.map(bidder => `
        <div class="bidder">
            <span>${bidder.username}</span>
            <span>${bidder.total_bids} bids</span>
        </div>
    `).join('');
} 