document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadAuctionHistory();

    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Profile updated successfully');
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Password change form submission
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            currentPassword: document.getElementById('currentPassword').value,
            newPassword: document.getElementById('newPassword').value
        };

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Password changed successfully');
                document.getElementById('passwordForm').reset();
            } else {
                throw new Error('Failed to change password');
            }
        } catch (error) {
            alert(error.message);
        }
    });
});

async function loadUserProfile() {
    try {
        const response = await fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone || '';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadAuctionHistory() {
    try {
        const response = await fetch('/api/user/auction-history', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const history = await response.json();
            const historyList = document.getElementById('auctionHistoryList');
            historyList.innerHTML = history.map(auction => `
                <div class="auction-item">
                    <h4>${auction.title}</h4>
                    <p>Status: ${auction.status}</p>
                    <p>Your Bid: $${auction.bid_amount || 'No bid'}</p>
                    <p>Date: ${new Date(auction.created_at).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading auction history:', error);
    }
} 