const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-app-name.onrender.com'
    : 'http://localhost:3000';

export async function fetchAuctions() {
  const response = await fetch(`${API_URL}/auctions`);
  return await response.json();
}

export async function placeBid(auctionId, bidAmount) {
  const response = await fetch(`${API_URL}/auctions/${auctionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current_bid: bidAmount }),
  });
  return await response.json();
}

// New function to register a user
export async function registerUser(userData) {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            credentials: 'include'
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

// New function to login a user
export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return await response.json();
}

// API functions for authentication and user management
export async function checkAdmin() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const response = await fetch('/auth/check-admin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data.isAdmin;
    } catch (error) {
        console.error('Check admin error:', error);
        return false;
    }
}

export async function checkLoggedIn() {
    return !!localStorage.getItem('token');
}