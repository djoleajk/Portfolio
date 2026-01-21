// ===========================
// DASHBOARD FUNCTIONALITY
// ===========================

let currentSection = 'profile';

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Handle URL hash
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        switchSection(hash);
    }
    
    // Sidebar navigation
    document.querySelectorAll('.dashboard-sidebar .sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Show/hide services menu for providers
    if (currentUser.type === 'provider') {
        const sidebarServices = document.getElementById('sidebarServices');
        if (sidebarServices) {
            sidebarServices.style.display = 'flex';
        }
    }
    
    // Load initial data
    loadProfile();
    loadBookings();
    loadMessages();
    loadReviews();
    if (currentUser.type === 'provider') {
        loadMyServices();
    }
    
    // Edit profile button
    const btnEditProfile = document.getElementById('btnEditProfile');
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => openModal('editProfileModal'));
    }
    
    // Edit profile form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleEditProfile);
    }
    
    // Add service button
    const btnAddService = document.getElementById('btnAddService');
    if (btnAddService) {
        btnAddService.addEventListener('click', () => openModal('addServiceModal'));
    }
    
    // Add service form
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', handleAddService);
    }
    
    // Booking filters
    document.querySelectorAll('.bookings-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.bookings-filter .filter-btn').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            const status = this.getAttribute('data-status');
            filterBookings(status);
        });
    });
    
    // Star rating
    const starRating = document.getElementById('starRating');
    if (starRating) {
        starRating.querySelectorAll('i').forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                document.getElementById('ratingValue').value = rating;
                
                starRating.querySelectorAll('i').forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas', 'active');
                    } else {
                        s.classList.remove('fas', 'active');
                        s.classList.add('far');
                    }
                });
            });
        });
    }
    
    // Add review form
    const addReviewForm = document.getElementById('addReviewForm');
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', handleAddReview);
    }
    
    // Reply message form
    const replyMessageForm = document.getElementById('replyMessageForm');
    if (replyMessageForm) {
        replyMessageForm.addEventListener('submit', handleReplyMessage);
    }
});

function switchSection(section) {
    currentSection = section;
    
    // Update sidebar
    document.querySelectorAll('.dashboard-sidebar .sidebar-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.dashboard-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const sectionElement = document.getElementById(`section-${section}`);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    // Load section-specific data
    switch (section) {
        case 'messages':
            loadMessages();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'reviews':
            loadReviews();
            break;
        case 'services':
            if (currentUser.type === 'provider') {
                loadMyServices();
            }
            break;
    }
}

function loadProfile() {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileType = document.getElementById('profileType');
    const profileBody = document.getElementById('profileBody');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileType) {
        profileType.textContent = currentUser.type === 'provider' ? 'Pružalac Usluga' : 'Klijent';
        profileType.className = 'badge';
        profileType.style.background = currentUser.type === 'provider' ? '#10B981' : '#3B82F6';
    }
    
    if (profileBody && currentUser.type === 'provider') {
        const providers = getProviders();
        const provider = providers.find(p => p.userId === currentUser.id);
        
        if (provider) {
            profileBody.innerHTML = `
                <div class="profile-details">
                    <div class="detail-row">
                        <span class="detail-label">Kategorija:</span>
                        <span class="detail-value">${provider.category}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Lokacija:</span>
                        <span class="detail-value">${provider.location || 'Nije navedeno'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Cena po satu:</span>
                        <span class="detail-value">${provider.price} RSD</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Telefon:</span>
                        <span class="detail-value">${provider.phone || 'Nije navedeno'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Ocena:</span>
                        <span class="detail-value">
                            <span class="stars">${generateStars(provider.rating)}</span>
                            ${provider.rating > 0 ? provider.rating.toFixed(1) : 'Novi'}
                            (${provider.reviewCount} recenzija)
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Opis:</span>
                        <span class="detail-value">${provider.description || 'Nema opisa'}</span>
                    </div>
                </div>
            `;
        }
    } else if (profileBody) {
        profileBody.innerHTML = `
            <div class="profile-details">
                <div class="detail-row">
                    <span class="detail-label">Tip naloga:</span>
                    <span class="detail-value">Klijent</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Datum registracije:</span>
                    <span class="detail-value">${formatDate(currentUser.createdAt)}</span>
                </div>
            </div>
        `;
    }
    
    // Pre-fill edit form
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const providerEditFields = document.getElementById('providerEditFields');
    
    if (editName) editName.value = currentUser.name;
    if (editEmail) editEmail.value = currentUser.email;
    
    if (currentUser.type === 'provider' && providerEditFields) {
        providerEditFields.style.display = 'block';
        const providers = getProviders();
        const provider = providers.find(p => p.userId === currentUser.id);
        
        if (provider) {
            document.getElementById('editDescription').value = provider.description || '';
            document.getElementById('editLocation').value = provider.location || '';
            document.getElementById('editPrice').value = provider.price || 0;
            document.getElementById('editCategory').value = provider.category || 'Popravke';
            document.getElementById('editPhone').value = provider.phone || '';
        }
    }
}

function handleEditProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    
    // Update user
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        setUsers(users);
        
        currentUser.name = name;
        currentUser.email = email;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Update provider if applicable
    if (currentUser.type === 'provider') {
        const description = document.getElementById('editDescription').value;
        const location = document.getElementById('editLocation').value;
        const price = parseFloat(document.getElementById('editPrice').value);
        const category = document.getElementById('editCategory').value;
        
        const providers = getProviders();
        const providerIndex = providers.findIndex(p => p.userId === currentUser.id);
        if (providerIndex !== -1) {
            providers[providerIndex].name = name;
            providers[providerIndex].email = email;
            providers[providerIndex].description = description;
            providers[providerIndex].location = location;
            providers[providerIndex].price = price;
            providers[providerIndex].category = category;
            providers[providerIndex].phone = phone;
            setProviders(providers);
        }
    }
    
    showNotification('Profil je uspešno ažuriran!', 'success');
    closeModal('editProfileModal');
    loadProfile();
    updateNavigation();
}

function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;
    
    let bookings = getBookings();
    
    if (currentUser.type === 'provider') {
        const providers = getProviders();
        const provider = providers.find(p => p.userId === currentUser.id);
        if (provider) {
            bookings = bookings.filter(b => b.providerId === provider.id);
        }
    } else {
        bookings = bookings.filter(b => b.clientId === currentUser.id);
    }
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="text-secondary text-center">Nemate termina.</p>';
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <div class="booking-header">
                <div>
                    <h4>${currentUser.type === 'provider' ? booking.clientName : booking.providerName}</h4>
                    <p class="text-secondary">${formatDate(booking.date)} u ${booking.time}</p>
                </div>
                <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
            </div>
            <p><strong>Opis:</strong> ${booking.description}</p>
            <p><strong>Telefon:</strong> ${booking.phone}</p>
            <div class="booking-actions mt-2">
                ${booking.status === 'pending' && currentUser.type === 'provider' ? `
                    <button class="btn btn-success" onclick="updateBookingStatus(${booking.id}, 'confirmed')">
                        <i class="fas fa-check"></i> Potvrdi
                    </button>
                    <button class="btn btn-danger" onclick="updateBookingStatus(${booking.id}, 'cancelled')">
                        <i class="fas fa-times"></i> Odbij
                    </button>
                ` : ''}
                ${booking.status === 'confirmed' && currentUser.type === 'provider' ? `
                    <button class="btn btn-primary" onclick="updateBookingStatus(${booking.id}, 'completed')">
                        <i class="fas fa-check-double"></i> Označi kao Završeno
                    </button>
                ` : ''}
                ${booking.status === 'completed' && currentUser.type === 'client' ? `
                    <button class="btn btn-primary" onclick="openReviewModal(${booking.providerId}, ${booking.id})">
                        <i class="fas fa-star"></i> Ostavi Recenziju
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function filterBookings(status) {
    let bookings = getBookings();
    
    if (currentUser.type === 'provider') {
        const providers = getProviders();
        const provider = providers.find(p => p.userId === currentUser.id);
        if (provider) {
            bookings = bookings.filter(b => b.providerId === provider.id);
        }
    } else {
        bookings = bookings.filter(b => b.clientId === currentUser.id);
    }
    
    if (status !== 'all') {
        bookings = bookings.filter(b => b.status === status);
    }
    
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="text-secondary text-center">Nema termina sa ovim statusom.</p>';
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-item">
            <div class="booking-header">
                <div>
                    <h4>${currentUser.type === 'provider' ? booking.clientName : booking.providerName}</h4>
                    <p class="text-secondary">${formatDate(booking.date)} u ${booking.time}</p>
                </div>
                <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
            </div>
            <p><strong>Opis:</strong> ${booking.description}</p>
            <p><strong>Telefon:</strong> ${booking.phone}</p>
            <div class="booking-actions mt-2">
                ${booking.status === 'pending' && currentUser.type === 'provider' ? `
                    <button class="btn btn-success" onclick="updateBookingStatus(${booking.id}, 'confirmed')">
                        <i class="fas fa-check"></i> Potvrdi
                    </button>
                    <button class="btn btn-danger" onclick="updateBookingStatus(${booking.id}, 'cancelled')">
                        <i class="fas fa-times"></i> Odbij
                    </button>
                ` : ''}
                ${booking.status === 'confirmed' && currentUser.type === 'provider' ? `
                    <button class="btn btn-primary" onclick="updateBookingStatus(${booking.id}, 'completed')">
                        <i class="fas fa-check-double"></i> Označi kao Završeno
                    </button>
                ` : ''}
                ${booking.status === 'completed' && currentUser.type === 'client' ? `
                    <button class="btn btn-primary" onclick="openReviewModal(${booking.providerId}, ${booking.id})">
                        <i class="fas fa-star"></i> Ostavi Recenziju
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function updateBookingStatus(bookingId, newStatus) {
    const bookings = getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = newStatus;
        setBookings(bookings);
        showNotification('Status termina je ažuriran!', 'success');
        loadBookings();
    }
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Na čekanju',
        'confirmed': 'Potvrđen',
        'completed': 'Završen',
        'cancelled': 'Otkazan'
    };
    return statusMap[status] || status;
}

function loadMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;
    
    let messages = getMessages().filter(m => 
        m.receiverId === currentUser.id || m.senderId === currentUser.id
    );
    
    // Sort by date, newest first
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p class="text-secondary text-center">Nemate poruka.</p>';
        return;
    }
    
    messagesList.innerHTML = messages.map(message => {
        const isReceiver = message.receiverId === currentUser.id;
        const otherPerson = isReceiver ? message.senderName : message.receiverName;
        const unreadClass = isReceiver && !message.read ? 'unread' : '';
        
        return `
            <div class="message-item ${unreadClass}" onclick="viewMessage(${message.id})">
                <div class="message-from">
                    <strong>${isReceiver ? 'Od: ' : 'Za: '}${otherPerson}</strong>
                </div>
                <div class="message-subject">${message.subject}</div>
                <div class="message-date text-secondary">${formatDateTime(message.createdAt)}</div>
            </div>
        `;
    }).join('');
    
    // Update message count badge
    updateMessageBadge();
}

function viewMessage(messageId) {
    const messages = getMessages();
    const message = messages.find(m => m.id === messageId);
    
    if (!message) return;
    
    // Mark as read if receiver
    if (message.receiverId === currentUser.id && !message.read) {
        const messageIndex = messages.findIndex(m => m.id === messageId);
        messages[messageIndex].read = true;
        setMessages(messages);
        updateMessageBadge();
    }
    
    const messageDetail = document.getElementById('messageDetail');
    if (!messageDetail) return;
    
    const isReceiver = message.receiverId === currentUser.id;
    
    messageDetail.innerHTML = `
        <div class="message-view">
            <h3>${message.subject}</h3>
            <div class="message-meta">
                <div><strong>${isReceiver ? 'Od:' : 'Za:'}</strong> ${isReceiver ? message.senderName : message.receiverName}</div>
                <div class="text-secondary">${formatDateTime(message.createdAt)}</div>
            </div>
            <div class="message-body">
                ${message.content.replace(/\n/g, '<br>')}
            </div>
            ${isReceiver ? `
                <button class="btn btn-primary mt-2" onclick="openReplyModal(${message.id})">
                    <i class="fas fa-reply"></i> Odgovori
                </button>
            ` : ''}
        </div>
    `;
    
    // Highlight selected message
    document.querySelectorAll('.message-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

function openReplyModal(messageId) {
    document.getElementById('replyMessageId').value = messageId;
    openModal('replyMessageModal');
}

function handleReplyMessage(e) {
    e.preventDefault();
    
    const messageId = parseInt(document.getElementById('replyMessageId').value);
    const replyContent = document.getElementById('replyContent').value;
    
    const originalMessage = getMessages().find(m => m.id === messageId);
    if (!originalMessage) return;
    
    const messages = getMessages();
    const newMessage = {
        id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        senderId: currentUser.id,
        senderName: currentUser.name,
        receiverId: originalMessage.senderId,
        receiverName: originalMessage.senderName,
        subject: 'Re: ' + originalMessage.subject,
        content: replyContent,
        read: false,
        createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    setMessages(messages);
    
    showNotification('Odgovor je poslat!', 'success');
    closeModal('replyMessageModal');
    document.getElementById('replyMessageForm').reset();
    loadMessages();
}

function loadReviews() {
    const reviewsStats = document.getElementById('reviewsStats');
    const userReviewsList = document.getElementById('userReviewsList');
    
    if (!reviewsStats || !userReviewsList) return;
    
    let reviews = [];
    
    if (currentUser.type === 'provider') {
        const providers = getProviders();
        const provider = providers.find(p => p.userId === currentUser.id);
        
        if (provider) {
            reviews = getReviews().filter(r => r.providerId === provider.id);
            
            const avgRating = reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : 0;
            
            reviewsStats.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon bg-orange">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${avgRating}</h3>
                            <p>Prosečna Ocena</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon bg-blue">
                            <i class="fas fa-comment"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${reviews.length}</h3>
                            <p>Ukupno Recenzija</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        reviews = getReviews().filter(r => r.clientId === currentUser.id);
        reviewsStats.innerHTML = `<h3>Moje Recenzije (${reviews.length})</h3>`;
    }
    
    if (reviews.length === 0) {
        userReviewsList.innerHTML = '<p class="text-secondary text-center">Nema recenzija.</p>';
        return;
    }
    
    userReviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <div class="review-author">${currentUser.type === 'provider' ? review.clientName : review.providerName}</div>
                    <div class="stars">${generateStars(review.rating)}</div>
                </div>
                <div class="review-date">${formatDate(review.createdAt)}</div>
            </div>
            <p>${review.comment}</p>
        </div>
    `).join('');
}

function openReviewModal(providerId, bookingId) {
    // Check if already reviewed
    const reviews = getReviews();
    const existingReview = reviews.find(r => r.bookingId === bookingId);
    
    if (existingReview) {
        showNotification('Već ste ostavili recenziju za ovaj termin!', 'error');
        return;
    }
    
    document.getElementById('reviewProviderId').value = providerId;
    document.getElementById('reviewBookingId').value = bookingId;
    document.getElementById('ratingValue').value = '';
    
    // Reset stars
    document.querySelectorAll('#starRating i').forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
    });
    
    openModal('addReviewModal');
}

function handleAddReview(e) {
    e.preventDefault();
    
    const providerId = parseInt(document.getElementById('reviewProviderId').value);
    const bookingId = parseInt(document.getElementById('reviewBookingId').value);
    const rating = parseInt(document.getElementById('ratingValue').value);
    const comment = document.getElementById('reviewComment').value;
    
    if (!rating) {
        showNotification('Molimo odaberite ocenu!', 'error');
        return;
    }
    
    const providers = getProviders();
    const provider = providers.find(p => p.id === providerId);
    
    if (!provider) return;
    
    const reviews = getReviews();
    const newReview = {
        id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
        providerId: providerId,
        providerName: provider.name,
        clientId: currentUser.id,
        clientName: currentUser.name,
        bookingId: bookingId,
        rating: rating,
        comment: comment,
        status: 'approved',
        createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    setReviews(reviews);
    
    // Update provider rating
    const providerReviews = reviews.filter(r => r.providerId === providerId);
    const avgRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
    
    const providerIndex = providers.findIndex(p => p.id === providerId);
    providers[providerIndex].rating = Math.round(avgRating * 10) / 10;
    providers[providerIndex].reviewCount = providerReviews.length;
    setProviders(providers);
    
    showNotification('Recenzija je uspešno objavljena!', 'success');
    closeModal('addReviewModal');
    document.getElementById('addReviewForm').reset();
    loadBookings();
    loadReviews();
}

function loadMyServices() {
    const myServicesList = document.getElementById('myServicesList');
    if (!myServicesList) return;
    
    const providers = getProviders();
    const provider = providers.find(p => p.userId === currentUser.id);
    
    if (!provider) return;
    
    myServicesList.innerHTML = `
        <div class="profile-card">
            <div class="profile-body">
                <h3>Informacije o Usluzi</h3>
                <div class="detail-row">
                    <span class="detail-label">Kategorija:</span>
                    <span class="detail-value">${provider.category}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Lokacija:</span>
                    <span class="detail-value">${provider.location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cena po satu:</span>
                    <span class="detail-value">${provider.price} RSD</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Opis:</span>
                    <span class="detail-value">${provider.description}</span>
                </div>
                <button class="btn btn-primary mt-2" onclick="document.getElementById('btnEditProfile').click()">
                    <i class="fas fa-edit"></i> Uredi Informacije
                </button>
            </div>
        </div>
    `;
}

function handleAddService(e) {
    e.preventDefault();
    // This is a placeholder for future service management functionality
    showNotification('Ova funkcionalnost će biti dostupna uskoro!', 'info');
    closeModal('addServiceModal');
}

