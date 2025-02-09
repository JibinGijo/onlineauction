document.addEventListener('DOMContentLoaded', loadListings);

async function loadListings() {
    try {
        const response = await fetch('/api/admin/listings', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            displayListings(data.listings);
        } else {
            console.error('Failed to load listings:', data.message);
        }
    } catch (error) {
        console.error('Error loading listings:', error);
    }
}

function displayListings(listings) {
    const listingsGrid = document.getElementById('listingsGrid');
    listingsGrid.innerHTML = listings.map(listing => `
        <div class="listing-card">
            <div class="listing-header">
                <h3 class="listing-title">${listing.title}</h3>
                <div class="listing-category">${listing.category}</div>
            </div>
            <div class="listing-body">
                <p class="listing-description">${listing.description}</p>
                <div class="listing-info">
                    <div class="info-item">
                        <span class="info-label">Starting Price</span>
                        <span class="info-value">₹${listing.starting_price}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Current Price</span>
                        <span class="info-value">₹${listing.current_price}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="info-value">${listing.status}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">End Time</span>
                        <span class="info-value">${new Date(listing.end_time).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="listing-actions">
                    <button class="action-btn delete-btn" onclick="deleteListing('${listing.id}')">Delete</button>
                    <button class="action-btn deactivate-btn" onclick="toggleListingStatus('${listing.id}')">
                        ${listing.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function deleteListing(listingId) {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
        const response = await fetch(`/api/admin/listings/${listingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            loadListings(); // Reload the listings
        } else {
            alert('Failed to delete listing: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Error deleting listing');
    }
}

async function toggleListingStatus(listingId) {
    try {
        const response = await fetch(`/api/admin/listings/${listingId}/toggle`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            loadListings(); // Reload the listings
        } else {
            alert('Failed to update listing status: ' + data.message);
        }
    } catch (error) {
        console.error('Error updating listing status:', error);
        alert('Error updating listing status');
    }
}

// Search functionality
document.getElementById('searchListings').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const listingCards = document.querySelectorAll('.listing-card');
    
    listingCards.forEach(card => {
        const title = card.querySelector('.listing-title').textContent.toLowerCase();
        const description = card.querySelector('.listing-description').textContent.toLowerCase();
        const shouldShow = title.includes(searchTerm) || description.includes(searchTerm);
        card.style.display = shouldShow ? 'block' : 'none';
    });
}); 