document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const identifier = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                console.log('Attempting login with:', { identifier, password });
                
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ identifier, password }),
                    credentials: 'include'
                });

                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    if (data.user.is_admin) {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/';
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
    
    initGoogleLogin();
    checkUrlParams();
});

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('login');

    if (error) {
        showError(decodeURIComponent(error));
    }
    if (success === 'success') {
        showSuccess('Login successful!');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.login-container').prepend(successDiv);
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function initGoogleLogin() {
    const googleBtn = document.getElementById('googleLogin');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Initiating Google login...'); // Debug log
            localStorage.setItem('returnTo', window.location.pathname);
            window.location.href = '/auth/google';
        });
    }
}

// Helper function to check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Helper function to get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Add some styles for better visibility of interactive elements
function addHoverEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.cursor = 'pointer';
    });
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', addHoverEffects);
