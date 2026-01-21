// LocalStorage Keys
const STORAGE_KEYS = {
    contacts: 'crm_contacts',
    meetings: 'crm_meetings',
    sales: 'crm_sales',
    users: 'crm_users',
    activities: 'crm_activities',
    currentUser: 'crm_current_user'
};

// Initialize App
function initApp() {
    // Initialize default data if not exists
    if (!localStorage.getItem(STORAGE_KEYS.users)) {
        const defaultUser = {
            id: generateId(),
            name: 'Admin',
            email: 'admin@crm.com',
            role: 'admin',
            status: 'aktivan',
            createdAt: new Date().toISOString()
        };
        saveToStorage(STORAGE_KEYS.users, [defaultUser]);
        saveToStorage(STORAGE_KEYS.currentUser, defaultUser);
    }

    // Load current user
    const currentUser = loadFromStorage(STORAGE_KEYS.currentUser);
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    }

    // Setup navigation
    setupNavigation();

    // Load dashboard data
    updateDashboard();
    loadContacts();
    loadMeetings();
    loadSales();
    loadUsers();
    loadActivities();
}

// Helper Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('sr-RS').format(amount) + ' RSD';
}

function addActivity(type, description) {
    const activities = loadFromStorage(STORAGE_KEYS.activities);
    const activity = {
        id: generateId(),
        type,
        description,
        timestamp: new Date().toISOString()
    };
    activities.unshift(activity);
    // Keep only last 50 activities
    if (activities.length > 50) {
        activities.pop();
    }
    saveToStorage(STORAGE_KEYS.activities, activities);
    updateDashboard();
    loadActivities();
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(sectionName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');

    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        contacts: 'Kontakti',
        meetings: 'Sastanci',
        sales: 'Prodaja',
        admin: 'Admin Panel'
    };
    document.getElementById('page-title').textContent = titles[sectionName];

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Dashboard
function updateDashboard() {
    const contacts = loadFromStorage(STORAGE_KEYS.contacts);
    const meetings = loadFromStorage(STORAGE_KEYS.meetings);
    const sales = loadFromStorage(STORAGE_KEYS.sales);

    // Update stats
    document.getElementById('total-contacts').textContent = contacts.length;

    // Meetings this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const meetingsThisMonth = meetings.filter(m => {
        const meetingDate = new Date(m.date);
        return meetingDate.getMonth() === currentMonth && meetingDate.getFullYear() === currentYear;
    });
    document.getElementById('total-meetings').textContent = meetingsThisMonth.length;

    // Active opportunities
    const activeOpportunities = sales.filter(s => s.stage !== 'završeno');
    document.getElementById('active-opportunities').textContent = activeOpportunities.length;

    // Total value
    const totalValue = sales.reduce((sum, s) => sum + parseFloat(s.value || 0), 0);
    document.getElementById('total-value').textContent = formatCurrency(totalValue);

    // Load recent activities
    loadRecentActivities();
}

function loadRecentActivities() {
    const activities = loadFromStorage(STORAGE_KEYS.activities);
    const container = document.getElementById('recent-activities');

    if (activities.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nema nedavnih aktivnosti</p></div>';
        return;
    }

    container.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-date">${formatDate(activity.timestamp)} - ${new Date(activity.timestamp).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}</div>
                <div>${activity.description}</div>
            </div>
        </div>
    `).join('');
}

// Contacts
function openContactModal(contactId = null) {
    const modal = document.getElementById('contact-modal');
    const form = document.getElementById('contact-form');
    form.reset();

    if (contactId) {
        const contacts = loadFromStorage(STORAGE_KEYS.contacts);
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
            document.getElementById('contact-modal-title').textContent = 'Izmeni Kontakt';
            document.getElementById('contact-id').value = contact.id;
            document.getElementById('contact-name').value = contact.name;
            document.getElementById('contact-email').value = contact.email;
            document.getElementById('contact-phone').value = contact.phone;
            document.getElementById('contact-status').value = contact.status;
            document.getElementById('contact-company').value = contact.company || '';
            document.getElementById('contact-notes').value = contact.notes || '';
        }
    } else {
        document.getElementById('contact-modal-title').textContent = 'Dodaj Novi Kontakt';
        document.getElementById('contact-id').value = '';
    }

    modal.classList.add('active');
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('active');
}

function saveContact(event) {
    event.preventDefault();

    const contacts = loadFromStorage(STORAGE_KEYS.contacts);
    const contactId = document.getElementById('contact-id').value;

    const contact = {
        id: contactId || generateId(),
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        status: document.getElementById('contact-status').value,
        company: document.getElementById('contact-company').value,
        notes: document.getElementById('contact-notes').value,
        createdAt: contactId ? contacts.find(c => c.id === contactId).createdAt : new Date().toISOString()
    };

    if (contactId) {
        const index = contacts.findIndex(c => c.id === contactId);
        contacts[index] = contact;
        addActivity('update', `Ažuriran kontakt: ${contact.name}`);
    } else {
        contacts.push(contact);
        addActivity('create', `Dodat novi kontakt: ${contact.name}`);
    }

    saveToStorage(STORAGE_KEYS.contacts, contacts);
    loadContacts();
    updateContactDropdowns();
    closeContactModal();
    updateDashboard();
}

function deleteContact(contactId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj kontakt?')) {
        return;
    }

    const contacts = loadFromStorage(STORAGE_KEYS.contacts);
    const contact = contacts.find(c => c.id === contactId);
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    saveToStorage(STORAGE_KEYS.contacts, filteredContacts);
    
    if (contact) {
        addActivity('delete', `Obrisan kontakt: ${contact.name}`);
    }
    
    loadContacts();
    updateContactDropdowns();
    updateDashboard();
}

function loadContacts() {
    const contacts = loadFromStorage(STORAGE_KEYS.contacts);
    const tbody = document.getElementById('contacts-table-body');

    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nema kontakata. Dodajte prvi kontakt!</td></tr>';
        return;
    }

    tbody.innerHTML = contacts.map(contact => `
        <tr>
            <td><strong>${contact.name}</strong></td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td><span class="badge badge-${getStatusBadgeClass(contact.status)}">${contact.status}</span></td>
            <td>${formatDate(contact.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openContactModal('${contact.id}')">Izmeni</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteContact('${contact.id}')">Obriši</button>
                </div>
            </td>
        </tr>
    `).join('');

    updateContactDropdowns();
}

function filterContacts() {
    const searchTerm = document.getElementById('contact-search').value.toLowerCase();
    const statusFilter = document.getElementById('contact-status-filter').value;
    const contacts = loadFromStorage(STORAGE_KEYS.contacts);

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm) ||
                            contact.email.toLowerCase().includes(searchTerm) ||
                            contact.phone.includes(searchTerm);
        const matchesStatus = !statusFilter || contact.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const tbody = document.getElementById('contacts-table-body');

    if (filteredContacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nema rezultata pretrage.</td></tr>';
        return;
    }

    tbody.innerHTML = filteredContacts.map(contact => `
        <tr>
            <td><strong>${contact.name}</strong></td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td><span class="badge badge-${getStatusBadgeClass(contact.status)}">${contact.status}</span></td>
            <td>${formatDate(contact.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openContactModal('${contact.id}')">Izmeni</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteContact('${contact.id}')">Obriši</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateContactDropdowns() {
    const contacts = loadFromStorage(STORAGE_KEYS.contacts);
    const meetingSelect = document.getElementById('meeting-contact');
    const salesSelect = document.getElementById('sales-contact');

    const options = contacts.map(contact => 
        `<option value="${contact.id}">${contact.name}</option>`
    ).join('');

    meetingSelect.innerHTML = '<option value="">Izaberite klijenta</option>' + options;
    salesSelect.innerHTML = '<option value="">Izaberite klijenta</option>' + options;
}

// Meetings
function openMeetingModal(meetingId = null) {
    const modal = document.getElementById('meeting-modal');
    const form = document.getElementById('meeting-form');
    form.reset();

    if (meetingId) {
        const meetings = loadFromStorage(STORAGE_KEYS.meetings);
        const meeting = meetings.find(m => m.id === meetingId);
        if (meeting) {
            document.getElementById('meeting-modal-title').textContent = 'Izmeni Sastanak';
            document.getElementById('meeting-id').value = meeting.id;
            document.getElementById('meeting-contact').value = meeting.contactId;
            document.getElementById('meeting-date').value = meeting.date;
            document.getElementById('meeting-time').value = meeting.time;
            document.getElementById('meeting-location').value = meeting.location;
            document.getElementById('meeting-status').value = meeting.status;
            document.getElementById('meeting-notes').value = meeting.notes || '';
        }
    } else {
        document.getElementById('meeting-modal-title').textContent = 'Zakaži Novi Sastanak';
        document.getElementById('meeting-id').value = '';
    }

    modal.classList.add('active');
}

function closeMeetingModal() {
    document.getElementById('meeting-modal').classList.remove('active');
}

function saveMeeting(event) {
    event.preventDefault();

    const meetings = loadFromStorage(STORAGE_KEYS.meetings);
    const contacts = loadFromStorage(STORAGE_KEYS.contacts);
    const meetingId = document.getElementById('meeting-id').value;
    const contactId = document.getElementById('meeting-contact').value;
    const contact = contacts.find(c => c.id === contactId);

    const meeting = {
        id: meetingId || generateId(),
        contactId: contactId,
        contactName: contact ? contact.name : '',
        date: document.getElementById('meeting-date').value,
        time: document.getElementById('meeting-time').value,
        location: document.getElementById('meeting-location').value,
        status: document.getElementById('meeting-status').value,
        notes: document.getElementById('meeting-notes').value,
        createdAt: meetingId ? meetings.find(m => m.id === meetingId).createdAt : new Date().toISOString()
    };

    if (meetingId) {
        const index = meetings.findIndex(m => m.id === meetingId);
        meetings[index] = meeting;
        addActivity('update', `Ažuriran sastanak sa ${meeting.contactName}`);
    } else {
        meetings.push(meeting);
        addActivity('create', `Zakazan novi sastanak sa ${meeting.contactName}`);
    }

    saveToStorage(STORAGE_KEYS.meetings, meetings);
    loadMeetings();
    closeMeetingModal();
    updateDashboard();
}

function deleteMeeting(meetingId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj sastanak?')) {
        return;
    }

    const meetings = loadFromStorage(STORAGE_KEYS.meetings);
    const meeting = meetings.find(m => m.id === meetingId);
    const filteredMeetings = meetings.filter(m => m.id !== meetingId);
    saveToStorage(STORAGE_KEYS.meetings, filteredMeetings);
    
    if (meeting) {
        addActivity('delete', `Obrisan sastanak sa ${meeting.contactName}`);
    }
    
    loadMeetings();
    updateDashboard();
}

function loadMeetings() {
    const meetings = loadFromStorage(STORAGE_KEYS.meetings);
    const tbody = document.getElementById('meetings-table-body');

    if (meetings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nema zakazanih sastanaka.</td></tr>';
        return;
    }

    // Sort meetings by date and time
    meetings.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
    });

    tbody.innerHTML = meetings.map(meeting => `
        <tr>
            <td><strong>${meeting.contactName}</strong></td>
            <td>${formatDate(meeting.date)}</td>
            <td>${meeting.time}</td>
            <td>${meeting.location}</td>
            <td><span class="badge badge-${getMeetingStatusBadgeClass(meeting.status)}">${meeting.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openMeetingModal('${meeting.id}')">Izmeni</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMeeting('${meeting.id}')">Obriši</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterMeetings() {
    const searchTerm = document.getElementById('meeting-search').value.toLowerCase();
    const statusFilter = document.getElementById('meeting-status-filter').value;
    const meetings = loadFromStorage(STORAGE_KEYS.meetings);

    const filteredMeetings = meetings.filter(meeting => {
        const matchesSearch = meeting.contactName.toLowerCase().includes(searchTerm) ||
                            meeting.location.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || meeting.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const tbody = document.getElementById('meetings-table-body');

    if (filteredMeetings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nema rezultata pretrage.</td></tr>';
        return;
    }

    filteredMeetings.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
    });

    tbody.innerHTML = filteredMeetings.map(meeting => `
        <tr>
            <td><strong>${meeting.contactName}</strong></td>
            <td>${formatDate(meeting.date)}</td>
            <td>${meeting.time}</td>
            <td>${meeting.location}</td>
            <td><span class="badge badge-${getMeetingStatusBadgeClass(meeting.status)}">${meeting.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openMeetingModal('${meeting.id}')">Izmeni</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMeeting('${meeting.id}')">Obriši</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Sales
function openSalesModal(salesId = null) {
    const modal = document.getElementById('sales-modal');
    const form = document.getElementById('sales-form');
    form.reset();

    if (salesId) {
        const salesList = loadFromStorage(STORAGE_KEYS.sales);
        const sales = salesList.find(s => s.id === salesId);
        if (sales) {
            document.getElementById('sales-modal-title').textContent = 'Izmeni Priliku';
            document.getElementById('sales-id').value = sales.id;
            document.getElementById('sales-name').value = sales.name;
            document.getElementById('sales-contact').value = sales.contactId;
            document.getElementById('sales-value').value = sales.value;
            document.getElementById('sales-stage').value = sales.stage;
            document.getElementById('sales-description').value = sales.description || '';
        }
    } else {
        document.getElementById('sales-modal-title').textContent = 'Nova Prodajna Prilika';
        document.getElementById('sales-id').value = '';
    }

    modal.classList.add('active');
}

function closeSalesModal() {
    document.getElementById('sales-modal').classList.remove('active');
}

function saveSales(event) {
    event.preventDefault();

    const salesList = loadFromStorage(STORAGE_KEYS.sales);
    const contacts = loadFromStorage(STORAGE_KEYS.contacts);
    const salesId = document.getElementById('sales-id').value;
    const contactId = document.getElementById('sales-contact').value;
    const contact = contacts.find(c => c.id === contactId);

    const sales = {
        id: salesId || generateId(),
        name: document.getElementById('sales-name').value,
        contactId: contactId,
        contactName: contact ? contact.name : '',
        value: parseFloat(document.getElementById('sales-value').value),
        stage: document.getElementById('sales-stage').value,
        description: document.getElementById('sales-description').value,
        createdAt: salesId ? salesList.find(s => s.id === salesId).createdAt : new Date().toISOString()
    };

    if (salesId) {
        const index = salesList.findIndex(s => s.id === salesId);
        salesList[index] = sales;
        addActivity('update', `Ažurirana prilika: ${sales.name}`);
    } else {
        salesList.push(sales);
        addActivity('create', `Kreirana nova prilika: ${sales.name}`);
    }

    saveToStorage(STORAGE_KEYS.sales, salesList);
    loadSales();
    closeSalesModal();
    updateDashboard();
}

function deleteSales(salesId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu priliku?')) {
        return;
    }

    const salesList = loadFromStorage(STORAGE_KEYS.sales);
    const sales = salesList.find(s => s.id === salesId);
    const filteredSales = salesList.filter(s => s.id !== salesId);
    saveToStorage(STORAGE_KEYS.sales, filteredSales);
    
    if (sales) {
        addActivity('delete', `Obrisana prilika: ${sales.name}`);
    }
    
    loadSales();
    updateDashboard();
}

function loadSales() {
    const salesList = loadFromStorage(STORAGE_KEYS.sales);

    // Load pipeline
    loadSalesPipeline(salesList);

    // Load sales chart
    loadSalesChart(salesList);

    // Load sales table
    const tbody = document.getElementById('sales-table-body');

    if (salesList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nema prodajnih prilika.</td></tr>';
        return;
    }

    tbody.innerHTML = salesList.map(sales => `
        <tr>
            <td><strong>${sales.name}</strong></td>
            <td>${sales.contactName}</td>
            <td>${formatCurrency(sales.value)}</td>
            <td><span class="badge badge-${getStageBadgeClass(sales.stage)}">${getStageName(sales.stage)}</span></td>
            <td>${formatDate(sales.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openSalesModal('${sales.id}')">Izmeni</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSales('${sales.id}')">Obriši</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadSalesPipeline(salesList) {
    const stages = {
        lead: { name: 'Lead', items: [], total: 0 },
        ponuda: { name: 'Ponuda', items: [], total: 0 },
        ugovoreno: { name: 'Ugovoreno', items: [], total: 0 },
        završeno: { name: 'Završeno', items: [], total: 0 }
    };

    salesList.forEach(sales => {
        if (stages[sales.stage]) {
            stages[sales.stage].items.push(sales);
            stages[sales.stage].total += sales.value;
        }
    });

    // Update counts
    document.getElementById('lead-count').textContent = stages.lead.items.length;
    document.getElementById('ponuda-count').textContent = stages.ponuda.items.length;
    document.getElementById('ugovoreno-count').textContent = stages.ugovoreno.items.length;
    document.getElementById('zavrseno-count').textContent = stages.završeno.items.length;

    // Update pipeline cards
    Object.keys(stages).forEach(stageKey => {
        const container = document.getElementById(`${stageKey}-stage`);
        const stage = stages[stageKey];

        if (stage.items.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); font-size: 0.875rem; padding: 1rem;">Nema prilika</div>';
            return;
        }

        container.innerHTML = stage.items.map(sales => `
            <div class="pipeline-card" onclick="openSalesModal('${sales.id}')">
                <div class="pipeline-card-title">${sales.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${sales.contactName}</div>
                <div class="pipeline-card-value">${formatCurrency(sales.value)}</div>
            </div>
        `).join('');
    });
}

function loadSalesChart(salesList) {
    const chartContainer = document.getElementById('sales-chart');

    // Group by month
    const monthlyData = {};
    const currentYear = new Date().getFullYear();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = { value: 0, count: 0 };
    }

    salesList.forEach(sales => {
        const date = new Date(sales.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData[key]) {
            monthlyData[key].value += sales.value;
            monthlyData[key].count++;
        }
    });

    const maxValue = Math.max(...Object.values(monthlyData).map(d => d.value), 1);

    chartContainer.innerHTML = Object.keys(monthlyData).map(key => {
        const [year, month] = key.split('-');
        const monthName = new Date(year, parseInt(month) - 1).toLocaleDateString('sr-RS', { month: 'short', year: 'numeric' });
        const data = monthlyData[key];
        const percentage = (data.value / maxValue) * 100;

        return `
            <div class="chart-bar">
                <div class="chart-label">${monthName}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${percentage}%">
                        ${formatCurrency(data.value)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Users & Admin
function openUserModal(userId = null) {
    const modal = document.getElementById('user-modal');
    const form = document.getElementById('user-form');
    form.reset();

    if (userId) {
        const users = loadFromStorage(STORAGE_KEYS.users);
        const user = users.find(u => u.id === userId);
        if (user) {
            document.getElementById('user-modal-title').textContent = 'Izmeni Korisnika';
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-status').value = user.status;
        }
    } else {
        document.getElementById('user-modal-title').textContent = 'Dodaj Novog Korisnika';
        document.getElementById('user-id').value = '';
    }

    modal.classList.add('active');
}

function closeUserModal() {
    document.getElementById('user-modal').classList.remove('active');
}

function saveUser(event) {
    event.preventDefault();

    const users = loadFromStorage(STORAGE_KEYS.users);
    const userId = document.getElementById('user-id').value;

    const user = {
        id: userId || generateId(),
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        role: document.getElementById('user-role').value,
        status: document.getElementById('user-status').value,
        createdAt: userId ? users.find(u => u.id === userId).createdAt : new Date().toISOString()
    };

    if (userId) {
        const index = users.findIndex(u => u.id === userId);
        users[index] = user;
        addActivity('update', `Ažuriran korisnik: ${user.name}`);
    } else {
        users.push(user);
        addActivity('create', `Dodat novi korisnik: ${user.name}`);
    }

    saveToStorage(STORAGE_KEYS.users, users);
    loadUsers();
    closeUserModal();
}

function deleteUser(userId) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
        return;
    }

    const users = loadFromStorage(STORAGE_KEYS.users);
    const user = users.find(u => u.id === userId);
    
    if (users.length === 1) {
        alert('Ne možete obrisati poslednjeg korisnika!');
        return;
    }

    const filteredUsers = users.filter(u => u.id !== userId);
    saveToStorage(STORAGE_KEYS.users, filteredUsers);
    
    if (user) {
        addActivity('delete', `Obrisan korisnik: ${user.name}`);
    }
    
    loadUsers();
}

function loadUsers() {
    const users = loadFromStorage(STORAGE_KEYS.users);
    const tbody = document.getElementById('users-table-body');

    // Update stats
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('active-users').textContent = users.filter(u => u.status === 'aktivan').length;

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nema korisnika.</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td><span class="badge badge-info">${getRoleName(user.role)}</span></td>
            <td><span class="badge badge-${getStatusBadgeClass(user.status)}">${user.status}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openUserModal('${user.id}')">Izmeni</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Obriši</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadActivities() {
    const activities = loadFromStorage(STORAGE_KEYS.activities);
    const container = document.getElementById('activity-history');

    if (activities.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nema zabeleženih aktivnosti</p></div>';
        return;
    }

    container.innerHTML = activities.slice(0, 20).map(activity => `
        <div class="timeline-item">
            <div class="timeline-content">
                <div class="timeline-date">${formatDate(activity.timestamp)} - ${new Date(activity.timestamp).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}</div>
                <div>${activity.description}</div>
            </div>
        </div>
    `).join('');
}

// Helper Functions for Badges
function getStatusBadgeClass(status) {
    const classes = {
        'aktivan': 'success',
        'neaktivan': 'secondary',
        'potencijalan': 'info'
    };
    return classes[status] || 'secondary';
}

function getMeetingStatusBadgeClass(status) {
    const classes = {
        'zakazan': 'warning',
        'održan': 'success',
        'otkazan': 'danger'
    };
    return classes[status] || 'secondary';
}

function getStageBadgeClass(stage) {
    const classes = {
        'lead': 'secondary',
        'ponuda': 'info',
        'ugovoreno': 'warning',
        'završeno': 'success'
    };
    return classes[stage] || 'secondary';
}

function getStageName(stage) {
    const names = {
        'lead': 'Lead',
        'ponuda': 'Ponuda',
        'ugovoreno': 'Ugovoreno',
        'završeno': 'Završeno'
    };
    return names[stage] || stage;
}

function getRoleName(role) {
    const names = {
        'admin': 'Administrator',
        'agent': 'Agent',
        'manager': 'Menadžer'
    };
    return names[role] || role;
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', initApp);

