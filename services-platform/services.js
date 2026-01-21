// ===========================
// SERVICES PAGE FUNCTIONALITY
// ===========================

let currentFilters = {
    search: '',
    category: '',
    location: '',
    priceMin: null,
    priceMax: null,
    rating: null,
    sortBy: 'rating'
};

let allProviders = [];
let selectedProviderId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Load all providers
    allProviders = getProviders().filter(p => p.status === 'active');
    
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');
    const locationParam = urlParams.get('location');
    const providerParam = urlParams.get('provider');
    
    // Set filters from URL
    if (categoryParam) {
        currentFilters.category = categoryParam;
        const filterCategory = document.getElementById('filterCategory');
        if (filterCategory) filterCategory.value = categoryParam;
    }
    
    if (searchParam) {
        currentFilters.search = searchParam;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = searchParam;
    }
    
    if (locationParam) {
        currentFilters.location = locationParam;
        const filterLocation = document.getElementById('filterLocation');
        if (filterLocation) filterLocation.value = locationParam;
    }
    
    // Toggle filters panel
    const toggleFilters = document.getElementById('toggleFilters');
    const filtersPanel = document.getElementById('filtersPanel');
    if (toggleFilters && filtersPanel) {
        toggleFilters.addEventListener('click', function() {
            filtersPanel.classList.toggle('active');
        });
    }
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value;
            applyFiltersAndDisplay();
        });
    }
    
    // Apply filters button
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            currentFilters.category = document.getElementById('filterCategory').value;
            currentFilters.location = document.getElementById('filterLocation').value;
            currentFilters.priceMin = parseFloat(document.getElementById('filterPriceMin').value) || null;
            currentFilters.priceMax = parseFloat(document.getElementById('filterPriceMax').value) || null;
            currentFilters.rating = parseFloat(document.getElementById('filterRating').value) || null;
            currentFilters.sortBy = document.getElementById('sortBy').value;
            
            applyFiltersAndDisplay();
        });
    }
    
    // Clear filters button
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            currentFilters = {
                search: '',
                category: '',
                location: '',
                priceMin: null,
                priceMax: null,
                rating: null,
                sortBy: 'rating'
            };
            
            document.getElementById('searchInput').value = '';
            document.getElementById('filterCategory').value = '';
            document.getElementById('filterLocation').value = '';
            document.getElementById('filterPriceMin').value = '';
            document.getElementById('filterPriceMax').value = '';
            document.getElementById('filterRating').value = '';
            document.getElementById('sortBy').value = 'rating';
            
            applyFiltersAndDisplay();
        });
    }
    
    // Sort by select
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            currentFilters.sortBy = this.value;
            applyFiltersAndDisplay();
        });
    }
    
    // Display providers
    applyFiltersAndDisplay();
    
    // If provider ID in URL, open provider modal
    if (providerParam) {
        setTimeout(() => {
            viewProviderDetail(parseInt(providerParam));
        }, 100);
    }
    
    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBooking();
        });
    }
    
    // Message form
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleMessage();
        });
    }
});

function applyFiltersAndDisplay() {
    let filtered = [...allProviders];
    
    // Apply search filter
    if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }
    
    // Apply category filter
    if (currentFilters.category) {
        filtered = filtered.filter(p => p.category === currentFilters.category);
    }
    
    // Apply location filter
    if (currentFilters.location) {
        const locationLower = currentFilters.location.toLowerCase();
        filtered = filtered.filter(p => 
            p.location.toLowerCase().includes(locationLower)
        );
    }
    
    // Apply price filters
    if (currentFilters.priceMin !== null) {
        filtered = filtered.filter(p => p.price >= currentFilters.priceMin);
    }
    if (currentFilters.priceMax !== null) {
        filtered = filtered.filter(p => p.price <= currentFilters.priceMax);
    }
    
    // Apply rating filter
    if (currentFilters.rating !== null) {
        filtered = filtered.filter(p => p.rating >= currentFilters.rating);
    }
    
    // Apply sorting
    switch (currentFilters.sortBy) {
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'reviews':
            filtered.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
    }
    
    displayProviders(filtered);
}

function displayProviders(providers) {
    const container = document.getElementById('servicesGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (resultsCount) {
        resultsCount.textContent = providers.length;
    }
    
    if (providers.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    if (noResults) noResults.style.display = 'none';
    
    container.innerHTML = providers.map(provider => `
        <div class="provider-card" onclick="viewProviderDetail(${provider.id})">
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
                    <span>${provider.rating > 0 ? provider.rating.toFixed(1) : 'Novi'}</span>
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

function viewProviderDetail(providerId) {
    const provider = allProviders.find(p => p.id === providerId);
    if (!provider) return;
    
    selectedProviderId = providerId;
    
    const reviews = getReviews().filter(r => r.providerId === providerId);
    const providerDetail = document.getElementById('providerDetail');
    
    if (!providerDetail) return;
    
    providerDetail.innerHTML = `
        <div class="provider-detail">
            <div class="provider-main">
                <div class="provider-detail-header">
                    <div class="provider-detail-avatar">${getInitials(provider.name)}</div>
                    <div class="provider-detail-info">
                        <h2>${provider.name}</h2>
                        <span class="provider-category">${provider.category}</span>
                        <div class="provider-rating">
                            <span class="stars">${generateStars(provider.rating)}</span>
                            <span>${provider.rating > 0 ? provider.rating.toFixed(1) : 'Novi'}</span>
                            <span class="text-secondary">(${provider.reviewCount} recenzija)</span>
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
                            ${provider.phone ? `
                            <div>
                                <i class="fas fa-phone"></i>
                                <span>${provider.phone}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <h3>O meni</h3>
                    <p>${provider.description || 'Nema opisa.'}</p>
                </div>
                
                <div>
                    <h3>Recenzije (${reviews.length})</h3>
                    ${reviews.length > 0 ? reviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <div>
                                    <div class="review-author">${review.clientName}</div>
                                    <div class="stars">${generateStars(review.rating)}</div>
                                </div>
                                <div class="review-date">${formatDate(review.createdAt)}</div>
                            </div>
                            <p>${review.comment}</p>
                        </div>
                    `).join('') : '<p class="text-secondary">Još nema recenzija.</p>'}
                </div>
            </div>
            
            <div class="provider-sidebar">
                <div class="provider-actions">
                    <button class="btn btn-primary btn-block" onclick="openBookingModal(${provider.id})">
                        <i class="fas fa-calendar-check"></i> Zakaži Termin
                    </button>
                    <button class="btn btn-outline btn-block" onclick="openMessageModal(${provider.id})">
                        <i class="fas fa-envelope"></i> Pošalji Poruku
                    </button>
                </div>
            </div>
        </div>
    `;
    
    openModal('providerModal');
}

function openBookingModal(providerId) {
    if (!currentUser) {
        showNotification('Morate biti prijavljeni da biste zakazali termin!', 'error');
        closeModal('providerModal');
        openModal('loginModal');
        return;
    }
    
    if (currentUser.type === 'provider') {
        showNotification('Pružaoci usluga ne mogu zakazivati termine!', 'error');
        return;
    }
    
    selectedProviderId = providerId;
    document.getElementById('bookingProviderId').value = providerId;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    
    closeModal('providerModal');
    openModal('bookingModal');
}

function openMessageModal(providerId) {
    if (!currentUser) {
        showNotification('Morate biti prijavljeni da biste slali poruke!', 'error');
        closeModal('providerModal');
        openModal('loginModal');
        return;
    }
    
    selectedProviderId = providerId;
    document.getElementById('messageProviderId').value = providerId;
    
    closeModal('providerModal');
    openModal('messageModal');
}

function handleBooking() {
    const providerId = parseInt(document.getElementById('bookingProviderId').value);
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const description = document.getElementById('bookingDescription').value;
    const phone = document.getElementById('bookingPhone').value;
    
    const provider = getProviders().find(p => p.id === providerId);
    if (!provider) return;
    
    const bookings = getBookings();
    const newBooking = {
        id: bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1,
        clientId: currentUser.id,
        clientName: currentUser.name,
        providerId: providerId,
        providerName: provider.name,
        date: date,
        time: time,
        description: description,
        phone: phone,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    setBookings(bookings);
    
    // Send notification message to provider
    const messages = getMessages();
    const newMessage = {
        id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: provider.userId,
        receiverName: provider.name,
        subject: 'Novi zahtev za termin',
        content: `${currentUser.name} je poslao/la zahtev za termin.\nDatum: ${date}\nVreme: ${time}\nOpis: ${description}`,
        read: false,
        bookingId: newBooking.id,
        createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    setMessages(messages);
    
    showNotification('Zahtev za termin je uspešno poslat!', 'success');
    closeModal('bookingModal');
    document.getElementById('bookingForm').reset();
}

function handleMessage() {
    const providerId = parseInt(document.getElementById('messageProviderId').value);
    const subject = document.getElementById('messageSubject').value;
    const content = document.getElementById('messageContent').value;
    
    const provider = getProviders().find(p => p.id === providerId);
    if (!provider) return;
    
    const messages = getMessages();
    const newMessage = {
        id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: provider.userId,
        receiverName: provider.name,
        subject: subject,
        content: content,
        read: false,
        createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    setMessages(messages);
    
    showNotification('Poruka je uspešno poslata!', 'success');
    closeModal('messageModal');
    document.getElementById('messageForm').reset();
}

