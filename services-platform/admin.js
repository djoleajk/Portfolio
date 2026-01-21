// ===========================
// ADMIN PANEL FUNCTIONALITY
// ===========================

let currentAdminSection = 'dashboard';
let selectedUserId = null;
let selectedReviewId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!currentUser || currentUser.type !== 'admin') {
        showNotification('Nemate pristup administratorskom panelu!', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    // Sidebar navigation
    document.querySelectorAll('.admin-sidebar .sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchAdminSection(section);
        });
    });
    
    // Load initial data
    loadDashboard();
    loadUsers();
    loadProvidersTable();
    loadReviewsAdmin();
    loadBookingsAdmin();
    loadCategoriesAdmin();
    
    // Search functionality
    const searchUsers = document.getElementById('searchUsers');
    if (searchUsers) {
        searchUsers.addEventListener('input', function() {
            filterUsersTable(this.value);
        });
    }
    
    const searchProviders = document.getElementById('searchProviders');
    if (searchProviders) {
        searchProviders.addEventListener('input', function() {
            filterProvidersTable(this.value);
        });
    }
    
    // Filter reviews
    const filterReviewStatus = document.getElementById('filterReviewStatus');
    if (filterReviewStatus) {
        filterReviewStatus.addEventListener('change', function() {
            loadReviewsAdmin(this.value);
        });
    }
    
    // Filter bookings
    const filterBookingStatus = document.getElementById('filterBookingStatus');
    if (filterBookingStatus) {
        filterBookingStatus.addEventListener('change', function() {
            loadBookingsAdmin(this.value);
        });
    }
    
    // Edit user form
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', handleEditUser);
    }
    
    // Add category button
    const btnAddCategory = document.getElementById('btnAddCategory');
    if (btnAddCategory) {
        btnAddCategory.addEventListener('click', function() {
            const categoryName = prompt('Unesite naziv nove kategorije:');
            if (categoryName) {
                showNotification('Kategorija dodата! (Ovo je demo verzija)', 'success');
            }
        });
    }
});

function switchAdminSection(section) {
    currentAdminSection = section;
    
    // Update sidebar
    document.querySelectorAll('.admin-sidebar .sidebar-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const sectionElement = document.getElementById(`section-${section}`);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    // Load section data
    switch (section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
        case 'providers':
            loadProvidersTable();
            break;
        case 'reviews':
            loadReviewsAdmin();
            break;
        case 'bookings':
            loadBookingsAdmin();
            break;
        case 'categories':
            loadCategoriesAdmin();
            break;
    }
}

function loadDashboard() {
    const users = getUsers();
    const providers = getProviders();
    const bookings = getBookings();
    const reviews = getReviews();
    
    // Update stats
    document.getElementById('statTotalUsers').textContent = users.length;
    document.getElementById('statTotalProviders').textContent = providers.length;
    document.getElementById('statTotalBookings').textContent = bookings.length;
    document.getElementById('statTotalReviews').textContent = reviews.length;
    
    // Recent activity
    const recentActivity = document.getElementById('recentActivity');
    const activities = [];
    
    // Add recent bookings
    bookings.slice(-5).reverse().forEach(booking => {
        activities.push({
            icon: 'calendar-check',
            text: `Novi termin: ${booking.clientName} → ${booking.providerName}`,
            time: booking.createdAt
        });
    });
    
    // Add recent reviews
    reviews.slice(-5).reverse().forEach(review => {
        activities.push({
            icon: 'star',
            text: `Nova recenzija za ${review.providerName}`,
            time: review.createdAt
        });
    });
    
    // Sort by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    recentActivity.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="activity-item" style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
            <i class="fas fa-${activity.icon}" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
            <span>${activity.text}</span>
            <span style="float: right; color: var(--text-secondary); font-size: 0.875rem;">
                ${formatDateTime(activity.time)}
            </span>
        </div>
    `).join('');
    
    // Category stats
    const categoryStats = document.getElementById('categoryStats');
    const categoryCounts = {};
    
    providers.forEach(provider => {
        categoryCounts[provider.category] = (categoryCounts[provider.category] || 0) + 1;
    });
    
    categoryStats.innerHTML = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => `
            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
                <span>${category}</span>
                <span style="font-weight: 600; color: var(--primary-color);">${count}</span>
            </div>
        `).join('');
}

function loadUsers() {
    const users = getUsers();
    const tbody = document.getElementById('usersTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="status-badge">${getUserTypeText(user.type)}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td><span class="status-badge status-${user.status}">${getStatusLabel(user.status)}</span></td>
            <td>
                <button class="btn btn-outline" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.type !== 'admin' ? `
                <button class="btn btn-danger" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function filterUsersTable(searchTerm) {
    const users = getUsers();
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = filtered.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="status-badge">${getUserTypeText(user.type)}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td><span class="status-badge status-${user.status}">${getStatusLabel(user.status)}</span></td>
            <td>
                <button class="btn btn-outline" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.type !== 'admin' ? `
                <button class="btn btn-danger" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function editUser(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    selectedUserId = userId;
    document.getElementById('editUserId').value = userId;
    document.getElementById('editUserStatus').value = user.status;
    
    openModal('editUserModal');
}

function handleEditUser(e) {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById('editUserId').value);
    const status = document.getElementById('editUserStatus').value;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].status = status;
        setUsers(users);
        
        showNotification('Korisnik je ažuriran!', 'success');
        closeModal('editUserModal');
        loadUsers();
    }
}

function deleteUser(userId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
        return;
    }
    
    let users = getUsers();
    users = users.filter(u => u.id !== userId);
    setUsers(users);
    
    // Also delete provider profile if exists
    let providers = getProviders();
    providers = providers.filter(p => p.userId !== userId);
    setProviders(providers);
    
    showNotification('Korisnik je obrisan!', 'success');
    loadUsers();
    loadProvidersTable();
}

function loadProvidersTable() {
    const providers = getProviders();
    const tbody = document.getElementById('providersTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = providers.map(provider => `
        <tr>
            <td>${provider.id}</td>
            <td>${provider.name}</td>
            <td>${provider.category}</td>
            <td>${provider.location}</td>
            <td>
                <span class="stars">${generateStars(provider.rating)}</span>
                ${provider.rating > 0 ? provider.rating.toFixed(1) : 'Novi'}
            </td>
            <td>${provider.reviewCount}</td>
            <td><span class="status-badge status-${provider.status}">${getStatusLabel(provider.status)}</span></td>
            <td>
                <button class="btn btn-outline" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="viewProviderAdmin(${provider.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-danger" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="toggleProviderStatus(${provider.id})">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterProvidersTable(searchTerm) {
    const providers = getProviders();
    const filtered = providers.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tbody = document.getElementById('providersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = filtered.map(provider => `
        <tr>
            <td>${provider.id}</td>
            <td>${provider.name}</td>
            <td>${provider.category}</td>
            <td>${provider.location}</td>
            <td>
                <span class="stars">${generateStars(provider.rating)}</span>
                ${provider.rating > 0 ? provider.rating.toFixed(1) : 'Novi'}
            </td>
            <td>${provider.reviewCount}</td>
            <td><span class="status-badge status-${provider.status}">${getStatusLabel(provider.status)}</span></td>
            <td>
                <button class="btn btn-outline" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="viewProviderAdmin(${provider.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-danger" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="toggleProviderStatus(${provider.id})">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewProviderAdmin(providerId) {
    window.location.href = `usluge.html?provider=${providerId}`;
}

function toggleProviderStatus(providerId) {
    const providers = getProviders();
    const providerIndex = providers.findIndex(p => p.id === providerId);
    
    if (providerIndex !== -1) {
        providers[providerIndex].status = providers[providerIndex].status === 'active' ? 'suspended' : 'active';
        setProviders(providers);
        
        showNotification('Status pružaoca je promenjen!', 'success');
        loadProvidersTable();
    }
}

function loadReviewsAdmin(statusFilter = '') {
    let reviews = getReviews();
    
    if (statusFilter) {
        reviews = reviews.filter(r => r.status === statusFilter);
    }
    
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="text-secondary text-center">Nema recenzija.</p>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <div class="review-author">${review.clientName} → ${review.providerName}</div>
                    <div class="stars">${generateStars(review.rating)}</div>
                </div>
                <div>
                    <span class="status-badge status-${review.status}">${getReviewStatusLabel(review.status)}</span>
                    <span class="review-date">${formatDate(review.createdAt)}</span>
                </div>
            </div>
            <p>${review.comment}</p>
            <div class="mt-2">
                ${review.status === 'pending' ? `
                <button class="btn btn-success" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="approveReview(${review.id})">
                    <i class="fas fa-check"></i> Odobri
                </button>
                <button class="btn btn-danger" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="rejectReview(${review.id})">
                    <i class="fas fa-times"></i> Odbij
                </button>
                ` : ''}
                <button class="btn btn-danger" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="deleteReview(${review.id})">
                    <i class="fas fa-trash"></i> Obriši
                </button>
            </div>
        </div>
    `).join('');
}

function approveReview(reviewId) {
    const reviews = getReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].status = 'approved';
        setReviews(reviews);
        
        showNotification('Recenzija je odobrena!', 'success');
        loadReviewsAdmin();
    }
}

function rejectReview(reviewId) {
    const reviews = getReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].status = 'rejected';
        setReviews(reviews);
        
        showNotification('Recenzija je odbijena!', 'success');
        loadReviewsAdmin();
    }
}

function deleteReview(reviewId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu recenziju?')) {
        return;
    }
    
    let reviews = getReviews();
    const review = reviews.find(r => r.id === reviewId);
    
    reviews = reviews.filter(r => r.id !== reviewId);
    setReviews(reviews);
    
    // Update provider rating
    if (review) {
        const providers = getProviders();
        const providerReviews = reviews.filter(r => r.providerId === review.providerId);
        const providerIndex = providers.findIndex(p => p.id === review.providerId);
        
        if (providerIndex !== -1) {
            if (providerReviews.length > 0) {
                const avgRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
                providers[providerIndex].rating = Math.round(avgRating * 10) / 10;
                providers[providerIndex].reviewCount = providerReviews.length;
            } else {
                providers[providerIndex].rating = 0;
                providers[providerIndex].reviewCount = 0;
            }
            setProviders(providers);
        }
    }
    
    showNotification('Recenzija je obrisana!', 'success');
    loadReviewsAdmin();
}

function loadBookingsAdmin(statusFilter = '') {
    let bookings = getBookings();
    
    if (statusFilter) {
        bookings = bookings.filter(b => b.status === statusFilter);
    }
    
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary">Nema termina.</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.clientName}</td>
            <td>${booking.providerName}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${booking.time}</td>
            <td><span class="status-badge status-${booking.status}">${getBookingStatusLabel(booking.status)}</span></td>
            <td>
                <button class="btn btn-danger" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" 
                        onclick="deleteBooking(${booking.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteBooking(bookingId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) {
        return;
    }
    
    let bookings = getBookings();
    bookings = bookings.filter(b => b.id !== bookingId);
    setBookings(bookings);
    
    showNotification('Termin je obrisan!', 'success');
    loadBookingsAdmin();
    loadDashboard();
}

function loadCategoriesAdmin() {
    const categories = [
        { name: 'Popravke', icon: 'tools', count: 0 },
        { name: 'Dom i Bašta', icon: 'home', count: 0 },
        { name: 'Lepota i Wellness', icon: 'spa', count: 0 },
        { name: 'IT i Tehnologija', icon: 'laptop-code', count: 0 },
        { name: 'Edukacija', icon: 'graduation-cap', count: 0 },
        { name: 'Transport', icon: 'truck', count: 0 }
    ];
    
    const providers = getProviders();
    categories.forEach(cat => {
        cat.count = providers.filter(p => p.category === cat.name).length;
    });
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card">
            <div class="category-icon">
                <i class="fas fa-${cat.icon}"></i>
            </div>
            <h3>${cat.name}</h3>
            <p>${cat.count} pružalaca</p>
        </div>
    `).join('');
}

// Utility functions
function getUserTypeText(type) {
    const types = {
        'admin': 'Administrator',
        'provider': 'Pružalac',
        'client': 'Klijent'
    };
    return types[type] || type;
}

function getStatusLabel(status) {
    const labels = {
        'active': 'Aktivan',
        'suspended': 'Suspendovan',
        'banned': 'Banovan'
    };
    return labels[status] || status;
}

function getReviewStatusLabel(status) {
    const labels = {
        'pending': 'Na čekanju',
        'approved': 'Odobrena',
        'rejected': 'Odbijena'
    };
    return labels[status] || status;
}

function getBookingStatusLabel(status) {
    const labels = {
        'pending': 'Na čekanju',
        'confirmed': 'Potvrđen',
        'completed': 'Završen',
        'cancelled': 'Otkazan'
    };
    return labels[status] || status;
}

