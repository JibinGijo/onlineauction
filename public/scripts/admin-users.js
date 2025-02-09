document.addEventListener('DOMContentLoaded', loadUsers);

async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            displayUsers(data.users);
        } else {
            console.error('Failed to load users:', data.message);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-profile">
                    <div class="user-avatar">
                        ${user.username.charAt(0).toUpperCase()}
                    </div>
                </div>
            </td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <a href="#" class="view-profile-btn">View Profile</a>
            </td>
        </tr>
    `).join('');
} 