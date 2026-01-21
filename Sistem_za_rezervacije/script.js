// Initialize data structure
let currentUser = null;
let isAdmin = false;

// Initialize default data if not exists
function initializeData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('services')) {
        const defaultServices = [
            {
                id: Date.now() + 1,
                name: 'Konferencijska sala A',
                description: 'Sala sa kapacitetom 50 osoba, projektor i whiteboard',
                price: 3000,
                duration: 60
            },
            {
                id: Date.now() + 2,
                name: 'Mala sala za sastanke',
                description: 'Intimna sala za 10 osoba sa TV ekranom',
                price: 1500,
                duration: 60
            },
            {
                id: Date.now() + 3,
                name: 'Radna soba',
                description: 'Tiha soba za rad sa internetom i štampačem',
                price: 800,
                duration: 120
            }
        ];
        localStorage.setItem('services', JSON.stringify(defaultServices));
    }
    
    if (!localStorage.getItem('reservations')) {
        localStorage.setItem('reservations', JSON.stringify([]));
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notificationIcon');
    const messageEl = document.getElementById('notificationMessage');
    
    notification.className = 'notification active ' + type;
    messageEl.textContent = message;
    
    if (type === 'success') {
        icon.textContent = '✓';
    } else if (type === 'error') {
        icon.textContent = '✕';
    } else {
        icon.textContent = 'ℹ';
    }
    
    setTimeout(() => {
        hideNotification();
    }, 4000);
}

function hideNotification() {
    document.getElementById('notification').classList.remove('active');
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function openAdminLoginModal() {
    document.getElementById('adminLoginModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function switchToRegister() {
    closeModal('loginModal');
    openRegisterModal();
}

function switchToLogin() {
    closeModal('registerModal');
    openLoginModal();
}

// Authentication
function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value.trim();
    
    if (!name || !email || !password || !phone) {
        showNotification('Molimo popunite sva polja!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    if (users.find(u => u.email === email)) {
        showNotification('Korisnik sa ovim email-om već postoji!', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Uspešno ste se registrovali!', 'success');
    closeModal('registerModal');
    
    // Auto login
    currentUser = newUser;
    updateUI();
}

function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Pogrešan email ili lozinka!', 'error');
        return;
    }
    
    currentUser = user;
    isAdmin = false;
    updateUI();
    closeModal('loginModal');
    showNotification(`Dobrodošli, ${user.name}!`, 'success');
}

function adminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    // Simple admin check (in production, this should be more secure)
    if (email === 'admin@rezervacije.com' && password === 'admin123') {
        currentUser = { id: 0, name: 'Administrator', email };
        isAdmin = true;
        updateUI();
        closeModal('adminLoginModal');
        showNotification('Dobrodošli, Administratore!', 'success');
    } else {
        showNotification('Pogrešni admin kredencijali!', 'error');
    }
}

function logout() {
    currentUser = null;
    isAdmin = false;
    updateUI();
    showNotification('Uspešno ste se odjavili!', 'info');
}

// UI Update
function updateUI() {
    const landingPage = document.getElementById('landingPage');
    const userPanel = document.getElementById('userPanel');
    const adminPanel = document.getElementById('adminPanel');
    const userInfo = document.getElementById('userInfo');
    const guestButtons = document.getElementById('guestButtons');
    
    if (currentUser) {
        landingPage.classList.add('hidden');
        userInfo.classList.remove('hidden');
        guestButtons.classList.add('hidden');
        document.getElementById('userName').textContent = currentUser.name;
        
        if (isAdmin) {
            userPanel.classList.remove('active');
            adminPanel.classList.add('active');
            loadAllReservations();
        } else {
            adminPanel.classList.remove('active');
            userPanel.classList.add('active');
            loadServices();
            loadUserReservations();
        }
    } else {
        landingPage.classList.remove('hidden');
        userPanel.classList.remove('active');
        adminPanel.classList.remove('active');
        userInfo.classList.add('hidden');
        guestButtons.classList.remove('hidden');
    }
}

// Services Management
function loadServices() {
    const services = JSON.parse(localStorage.getItem('services'));
    const servicesGrid = document.getElementById('servicesGrid');
    
    if (services.length === 0) {
        servicesGrid.innerHTML = '<div class="empty-state"><h3>Nema dostupnih usluga</h3></div>';
        return;
    }
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="card">
            <h3>${service.name}</h3>
            <p class="card-info">${service.description}</p>
            <p class="card-info"><strong>Cena:</strong> ${service.price} RSD</p>
            <p class="card-info"><strong>Trajanje:</strong> ${service.duration} min</p>
            <div class="card-actions">
                <button class="btn btn-primary btn-small" onclick="openReservationModal(${service.id})">Rezerviši</button>
            </div>
        </div>
    `).join('');
}

function openReservationModal(serviceId) {
    const services = JSON.parse(localStorage.getItem('services'));
    const service = services.find(s => s.id === serviceId);
    
    document.getElementById('reservationServiceId').value = serviceId;
    document.getElementById('reservationService').value = service.name;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').min = today;
    document.getElementById('reservationDate').value = today;
    
    document.getElementById('reservationModal').classList.add('active');
}

function createReservation(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showNotification('Molimo prijavite se da biste rezervisali!', 'error');
        return;
    }
    
    const serviceId = parseInt(document.getElementById('reservationServiceId').value);
    const date = document.getElementById('reservationDate').value;
    const time = document.getElementById('reservationTime').value;
    const notes = document.getElementById('reservationNotes').value.trim();
    
    const services = JSON.parse(localStorage.getItem('services'));
    const service = services.find(s => s.id === serviceId);
    
    const reservation = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        serviceId,
        serviceName: service.name,
        date,
        time,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    closeModal('reservationModal');
    showNotification('Rezervacija uspešno kreirana! Čeka se potvrda.', 'success');
    loadUserReservations();
    
    // Clear form
    document.getElementById('reservationNotes').value = '';
}

// User Reservations
function loadUserReservations() {
    if (!currentUser) return;
    
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const userReservations = reservations.filter(r => r.userId === currentUser.id);
    const container = document.getElementById('userReservations');
    
    if (userReservations.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Nemate rezervacija</h3><p>Kliknite na "Rezerviši" da napravite novu rezervaciju</p></div>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Usluga</th>
                    <th>Datum</th>
                    <th>Vreme</th>
                    <th>Status</th>
                    <th>Akcije</th>
                </tr>
            </thead>
            <tbody>
                ${userReservations.map(res => `
                    <tr>
                        <td>${res.serviceName}</td>
                        <td>${formatDate(res.date)}</td>
                        <td>${res.time}</td>
                        <td><span class="status-badge status-${res.status}">${getStatusText(res.status)}</span></td>
                        <td>
                            ${res.status === 'pending' ? `
                                <button class="btn btn-danger btn-small" onclick="cancelReservation(${res.id})">Otkaži</button>
                            ` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function cancelReservation(reservationId) {
    if (!confirm('Da li ste sigurni da želite da otkažete rezervaciju?')) return;
    
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const index = reservations.findIndex(r => r.id === reservationId);
    
    if (index !== -1) {
        reservations[index].status = 'cancelled';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        showNotification('Rezervacija je otkazana.', 'info');
        loadUserReservations();
    }
}

// Admin Functions
function loadAllReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const container = document.getElementById('allReservations');
    
    if (reservations.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Nema rezervacija</h3></div>';
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Korisnik</th>
                    <th>Email</th>
                    <th>Usluga</th>
                    <th>Datum</th>
                    <th>Vreme</th>
                    <th>Status</th>
                    <th>Akcije</th>
                </tr>
            </thead>
            <tbody>
                ${reservations.map(res => `
                    <tr>
                        <td>${res.userName}</td>
                        <td>${res.userEmail}</td>
                        <td>${res.serviceName}</td>
                        <td>${formatDate(res.date)}</td>
                        <td>${res.time}</td>
                        <td><span class="status-badge status-${res.status}">${getStatusText(res.status)}</span></td>
                        <td>
                            <div class="action-buttons">
                                ${res.status === 'pending' ? `
                                    <button class="btn btn-secondary btn-small" onclick="confirmReservation(${res.id})">Potvrdi</button>
                                ` : ''}
                                <button class="btn btn-danger btn-small" onclick="deleteReservation(${res.id})">Obriši</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function confirmReservation(reservationId) {
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const index = reservations.findIndex(r => r.id === reservationId);
    
    if (index !== -1) {
        reservations[index].status = 'confirmed';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        showNotification('Rezervacija je potvrđena!', 'success');
        loadAllReservations();
    }
}

function deleteReservation(reservationId) {
    if (!confirm('Da li ste sigurni da želite da obrišete rezervaciju?')) return;
    
    const reservations = JSON.parse(localStorage.getItem('reservations'));
    const filtered = reservations.filter(r => r.id !== reservationId);
    localStorage.setItem('reservations', JSON.stringify(filtered));
    showNotification('Rezervacija je obrisana.', 'info');
    loadAllReservations();
}

// Services Management for Admin
function openManageServicesModal() {
    document.getElementById('manageServicesModal').classList.add('active');
    loadServicesList();
}

function loadServicesList() {
    const services = JSON.parse(localStorage.getItem('services'));
    const container = document.getElementById('servicesList');
    
    if (services.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Nema usluga</h3></div>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="card">
            <h3>${service.name}</h3>
            <p class="card-info">${service.description}</p>
            <p class="card-info"><strong>Cena:</strong> ${service.price} RSD | <strong>Trajanje:</strong> ${service.duration} min</p>
            <div class="card-actions">
                <button class="btn btn-danger btn-small" onclick="deleteService(${service.id})">Obriši</button>
            </div>
        </div>
    `).join('');
}

function addService(event) {
    event.preventDefault();
    
    const name = document.getElementById('serviceName').value.trim();
    const description = document.getElementById('serviceDescription').value.trim();
    const price = parseInt(document.getElementById('servicePrice').value);
    const duration = parseInt(document.getElementById('serviceDuration').value);
    
    if (!name || !description || !price || !duration) {
        showNotification('Molimo popunite sva polja!', 'error');
        return;
    }
    
    const service = {
        id: Date.now(),
        name,
        description,
        price,
        duration
    };
    
    const services = JSON.parse(localStorage.getItem('services'));
    services.push(service);
    localStorage.setItem('services', JSON.stringify(services));
    
    showNotification('Usluga uspešno dodata!', 'success');
    loadServicesList();
    
    // Clear form
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('serviceDuration').value = '';
}

function deleteService(serviceId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu uslugu?')) return;
    
    const services = JSON.parse(localStorage.getItem('services'));
    const filtered = services.filter(s => s.id !== serviceId);
    localStorage.setItem('services', JSON.stringify(filtered));
    
    showNotification('Usluga je obrisana!', 'info');
    loadServicesList();
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'Na čekanju',
        'confirmed': 'Potvrđeno',
        'cancelled': 'Otkazano'
    };
    return statusTexts[status] || status;
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Initialize app
initializeData();
updateUI();

