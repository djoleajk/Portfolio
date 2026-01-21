// ===========================
// DATA MANAGEMENT & STORAGE
// ===========================

// Initialize localStorage data
function initializeData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            {
                id: 1,
                name: 'Admin',
                email: 'admin@platforma.rs',
                password: 'admin123',
                type: 'admin',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ]));
    }

    if (!localStorage.getItem('providers')) {
        const sampleProviders = [
            {
                id: 1,
                userId: 2,
                name: 'Marko Petrović',
                email: 'marko@email.com',
                category: 'Popravke',
                location: 'Beograd',
                description: 'Iskusan vodoinstalater sa 10 godina iskustva. Brz i pouzdan servis.',
                price: 2000,
                rating: 4.8,
                reviewCount: 45,
                status: 'active',
                phone: '+381 60 123 4567'
            },
            {
                id: 2,
                userId: 3,
                name: 'Ana Jovanović',
                email: 'ana@email.com',
                category: 'Lepota i Wellness',
                location: 'Novi Sad',
                description: 'Profesionalni frizer i stilista. Specijalizovana za moderne frizure i bojenje.',
                price: 1500,
                rating: 4.9,
                reviewCount: 67,
                status: 'active',
                phone: '+381 63 234 5678'
            },
            {
                id: 3,
                userId: 4,
                name: 'Stefan Nikolić',
                email: 'stefan@email.com',
                category: 'IT i Tehnologija',
                location: 'Beograd',
                description: 'Full-stack web developer. Kreiram moderne, responzivne web aplikacije.',
                price: 3500,
                rating: 4.7,
                reviewCount: 34,
                status: 'active',
                phone: '+381 64 345 6789'
            },
            {
                id: 4,
                userId: 5,
                name: 'Milica Đorđević',
                email: 'milica@email.com',
                category: 'Dom i Bašta',
                location: 'Niš',
                description: 'Profesionalno čišćenje stanova i kuća. Tim od 5 osoba.',
                price: 1200,
                rating: 4.6,
                reviewCount: 89,
                status: 'active',
                phone: '+381 65 456 7890'
            },
            {
                id: 5,
                userId: 6,
                name: 'Nikola Ilić',
                email: 'nikola@email.com',
                category: 'Edukacija',
                location: 'Beograd',
                description: 'Privatni časovi matematike i fizike za sve uzraste.',
                price: 1800,
                rating: 4.9,
                reviewCount: 56,
                status: 'active',
                phone: '+381 66 567 8901'
            },
            {
                id: 6,
                userId: 7,
                name: 'Jelena Pavlović',
                email: 'jelena@email.com',
                category: 'Transport',
                location: 'Kragujevac',
                description: 'Profesionalne selidbe sa kompletnom opremom i osiguranjem.',
                price: 2500,
                rating: 4.5,
                reviewCount: 23,
                status: 'active',
                phone: '+381 67 678 9012'
            }
        ];
        localStorage.setItem('providers', JSON.stringify(sampleProviders));
    }

    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }

    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }

    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify([]));
    }
}

// Data access functions
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getProviders() {
    return JSON.parse(localStorage.getItem('providers') || '[]');
}

function setProviders(providers) {
    localStorage.setItem('providers', JSON.stringify(providers));
}

function getReviews() {
    return JSON.parse(localStorage.getItem('reviews') || '[]');
}

function setReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function getBookings() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
}

function setBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function getMessages() {
    return JSON.parse(localStorage.getItem('messages') || '[]');
}

function setMessages(messages) {
    localStorage.setItem('messages', JSON.stringify(messages));
}

// ===========================
// AUTHENTICATION
// ===========================

let currentUser = null;

function checkAuth() {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
        currentUser = JSON.parse(userStr);
        updateNavigation();
        return true;
    }
    return false;
}

function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        if (user.status === 'suspended' || user.status === 'banned') {
            showNotification('Vaš nalog je suspendovan. Kontaktirajte administratora.', 'error');
            return false;
        }
        
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        updateNavigation();
        showNotification('Uspešno ste se prijavili!', 'success');
        return true;
    }
    
    showNotification('Neispravni pristupni podaci!', 'error');
    return false;
}

function register(name, email, password, userType, category, location) {
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
        showNotification('Email je već registrovan!', 'error');
        return false;
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password,
        type: userType,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    setUsers(users);
    
    // If provider, create provider profile
    if (userType === 'provider') {
        const providers = getProviders();
        const newProvider = {
            id: providers.length > 0 ? Math.max(...providers.map(p => p.id)) + 1 : 1,
            userId: newUser.id,
            name,
            email,
            category: category || 'Popravke',
            location: location || '',
            description: '',
            price: 0,
            rating: 0,
            reviewCount: 0,
            status: 'active',
            phone: ''
        };
        providers.push(newProvider);
        setProviders(providers);
    }
    
    showNotification('Uspešno ste se registrovali! Možete se prijaviti.', 'success');
    return true;
}

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    updateNavigation();
    showNotification('Uspešno ste se odjavili!', 'success');
    window.location.href = 'index.html';
}

function updateNavigation() {
    const btnLogin = document.getElementById('btnLogin');
    const btnRegister = document.getElementById('btnRegister');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const navDashboard = document.getElementById('navDashboard');
    const navAdmin = document.getElementById('navAdmin');
    
    if (currentUser) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userName) userName.textContent = currentUser.name.split(' ')[0];
        
        if (navDashboard) {
            navDashboard.style.display = 'block';
            navDashboard.href = 'dashboard.html';
        }
        
        if (navAdmin && currentUser.type === 'admin') {
            navAdmin.style.display = 'block';
        }
    } else {
        if (btnLogin) btnLogin.style.display = 'inline-flex';
        if (btnRegister) btnRegister.style.display = 'inline-flex';
        if (userMenu) userMenu.style.display = 'none';
        if (navDashboard) navDashboard.style.display = 'none';
        if (navAdmin) navAdmin.style.display = 'none';
    }
}

// ===========================
// MODAL MANAGEMENT
// ===========================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ===========================
// NOTIFICATIONS
// ===========================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - rating < 1) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// ===========================
// EVENT LISTENERS - GLOBAL
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize data
    initializeData();
    checkAuth();
    
    // Add animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Login button
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => openModal('loginModal'));
    }
    
    // Register button
    const btnRegister = document.getElementById('btnRegister');
    if (btnRegister) {
        btnRegister.addEventListener('click', () => openModal('registerModal'));
    }
    
    // Logout button
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Switch between login and register
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openModal('registerModal');
        });
    }
    
    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            openModal('loginModal');
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (login(email, password)) {
                closeModal('loginModal');
                loginForm.reset();
                
                // Redirect based on user type
                if (currentUser.type === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    const registerUserType = document.getElementById('registerUserType');
    const providerFields = document.getElementById('providerFields');
    
    if (registerUserType && providerFields) {
        registerUserType.addEventListener('change', function() {
            if (this.value === 'provider') {
                providerFields.style.display = 'block';
            } else {
                providerFields.style.display = 'none';
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const userType = document.getElementById('registerUserType').value;
            const category = document.getElementById('registerCategory')?.value;
            const location = document.getElementById('registerLocation')?.value;
            
            if (register(name, email, password, userType, category, location)) {
                closeModal('registerModal');
                registerForm.reset();
                openModal('loginModal');
            }
        });
    }
    
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Category cards navigation
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            window.location.href = `usluge.html?category=${encodeURIComponent(category)}`;
        });
    });
    
    // Hero search
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', function() {
            const search = document.getElementById('heroSearchInput').value;
            const location = document.getElementById('heroLocationInput').value;
            window.location.href = `usluge.html?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`;
        });
    }
    
    // Become provider button
    const becomeProviderBtn = document.getElementById('becomeProviderBtn');
    if (becomeProviderBtn) {
        becomeProviderBtn.addEventListener('click', function() {
            if (!currentUser) {
                openModal('registerModal');
                document.getElementById('registerUserType').value = 'provider';
                document.getElementById('providerFields').style.display = 'block';
            } else {
                showNotification('Već ste prijavljeni!', 'info');
            }
        });
    }
    
    // Load top providers on homepage
    const topProviders = document.getElementById('topProviders');
    if (topProviders) {
        loadTopProviders();
    }
    
    // User dropdown profile link
    const dropdownProfile = document.getElementById('dropdownProfile');
    if (dropdownProfile) {
        dropdownProfile.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }
    
    // User dropdown messages link
    const dropdownMessages = document.getElementById('dropdownMessages');
    if (dropdownMessages) {
        dropdownMessages.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'dashboard.html#messages';
        });
    }
    
    // User dropdown bookings link
    const dropdownBookings = document.getElementById('dropdownBookings');
    if (dropdownBookings) {
        dropdownBookings.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'dashboard.html#bookings';
        });
    }
    
    // Update message badge
    updateMessageBadge();
});

// ===========================
// HOMEPAGE FUNCTIONS
// ===========================

function loadTopProviders() {
    const providers = getProviders();
    const topProviders = providers
        .filter(p => p.status === 'active')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    
    const container = document.getElementById('topProviders');
    if (!container) return;
    
    container.innerHTML = topProviders.map(provider => `
        <div class="provider-card" onclick="viewProvider(${provider.id})">
            <div class="provider-card-header">
                <div class="provider-avatar">${getInitials(provider.name)}</div>
                <div class="provider-info">
                    <h3>${provider.name}</h3>
                    <span class="provider-category">${provider.category}</span>
                </div>
            </div>
            <div class="provider-card-body">
                <div class="provider-rating">
                    <span class="stars">${generateStars(provider.rating)}</span>
                    <span>${provider.rating.toFixed(1)}</span>
                    <span class="text-secondary">(${provider.reviewCount})</span>
                </div>
                <div class="provider-details">
                    <div>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${provider.location}</span>
                    </div>
                    <div>
                        <i class="fas fa-money-bill-wave"></i>
                        <span>${provider.price} RSD/h</span>
                    </div>
                </div>
                <p>${provider.description.substring(0, 100)}${provider.description.length > 100 ? '...' : ''}</p>
            </div>
            <div class="provider-card-footer">
                <button class="btn btn-primary btn-block">
                    <i class="fas fa-eye"></i> Pogledaj Profil
                </button>
            </div>
        </div>
    `).join('');
}

function viewProvider(providerId) {
    window.location.href = `usluge.html?provider=${providerId}`;
}

function updateMessageBadge() {
    if (!currentUser) return;
    
    const messages = getMessages();
    const unreadCount = messages.filter(m => 
        m.receiverId === currentUser.id && !m.read
    ).length;
    
    const msgBadge = document.getElementById('msgBadge');
    if (msgBadge) {
        msgBadge.textContent = unreadCount;
        msgBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }
}

