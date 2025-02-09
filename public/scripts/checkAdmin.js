document.addEventListener('DOMContentLoaded', () => {
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                const response = await fetch('/auth/check-admin', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();

                if (data.isAdmin) {
                    window.location.href = '/admin';
                } else {
                    alert('Access denied. You must be an administrator to access this area.');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                alert('You must be logged in as an administrator to access this area.');
            }
        });
    }
}); 