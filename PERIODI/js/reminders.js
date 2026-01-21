// Modul za podsetnike
PeriodTracker.prototype.showReminderModal = function() {
    const modal = document.getElementById('reminderModal');
    if (modal) {
        // Postavi datum na danas
        const dateInput = document.getElementById('reminderDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        this.openModal('reminderModal');
    }
};

PeriodTracker.prototype.updateRemindersList = function() {
    const emptyState = document.getElementById('remindersEmptyState');
    const itemsContainer = document.getElementById('remindersItems');
    
    if (!emptyState || !itemsContainer) return;
    
    const upcomingReminders = this.getUpcomingReminders();
    
    if (upcomingReminders.length === 0) {
        emptyState.style.display = 'block';
        itemsContainer.innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    itemsContainer.innerHTML = '';
    
    upcomingReminders.slice(0, 5).forEach(reminder => {
        const item = document.createElement('div');
        item.className = 'reminder-item';
        
        const reminderDateTime = new Date(reminder.date);
        const [hours, minutes] = reminder.time.split(':');
        reminderDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const isPast = reminderDateTime < new Date();
        
        item.innerHTML = `
            <div class="reminder-item-content">
                <div class="reminder-item-header">
                    <h4 class="reminder-item-title">${reminder.title}</h4>
                    ${reminder.repeat ? '<span class="badge bg-info"><i class="fas fa-repeat"></i> Ponavlja se</span>' : ''}
                </div>
                <div class="reminder-item-details">
                    <i class="fas fa-calendar"></i> ${this.formatDate(reminder.date)}
                    <span class="ms-2"><i class="fas fa-clock"></i> ${reminder.time}</span>
                </div>
            </div>
            <button class="btn btn-sm btn-danger reminder-delete-btn" data-reminder-id="${reminder.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        if (isPast) {
            item.classList.add('reminder-past');
        }
        
        itemsContainer.appendChild(item);
    });
    
    // Event listeneri za brisanje
    itemsContainer.querySelectorAll('.reminder-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const reminderId = parseInt(e.currentTarget.getAttribute('data-reminder-id'));
            const confirmed = await this.showConfirmDialog(
                'Da li si sigurna da želiš da obrišeš ovaj podsetnik?',
                'Brisanje Podsetnika',
                'Obriši',
                'Otkaži'
            );
            if (confirmed) {
                this.deleteReminder(reminderId);
                this.updateRemindersList();
                this.showSuccess('Podsetnik je obrisan.');
            }
        });
    });
};

PeriodTracker.prototype.saveReminder = function(reminderData) {
    const reminder = {
        id: Date.now(),
        title: reminderData.title,
        date: new Date(reminderData.date),
        time: reminderData.time,
        repeat: reminderData.repeat || false
    };
    
    this.reminders.push(reminder);
    this.saveData();
    this.scheduleReminderNotifications();
    
    return reminder;
};

PeriodTracker.prototype.deleteReminder = function(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveData();
    this.scheduleReminderNotifications();
};

PeriodTracker.prototype.getUpcomingReminders = function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.reminders.filter(reminder => {
        const reminderDate = new Date(reminder.date);
        reminderDate.setHours(0, 0, 0, 0);
        return reminderDate >= today;
    }).sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
};

PeriodTracker.prototype.scheduleReminderNotifications = function() {
    // Ova metoda će biti implementirana u notifications.js
    if (this.scheduleCycleNotifications) {
        // Notifikacije će biti zakazane zajedno sa ciklus notifikacijama
    }
};

PeriodTracker.prototype.updateRemindersList = function() {
    const emptyState = document.getElementById('remindersEmptyState');
    const itemsContainer = document.getElementById('remindersItems');
    
    if (!emptyState || !itemsContainer) return;
    
    const upcomingReminders = this.getUpcomingReminders();
    
    if (upcomingReminders.length === 0) {
        emptyState.style.display = 'block';
        itemsContainer.innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    itemsContainer.innerHTML = '';
    
    upcomingReminders.slice(0, 5).forEach(reminder => {
        const item = document.createElement('div');
        item.className = 'reminder-item';
        
        const reminderDateTime = new Date(reminder.date);
        const [hours, minutes] = reminder.time.split(':');
        reminderDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const isPast = reminderDateTime < new Date();
        
        item.innerHTML = `
            <div class="reminder-item-content">
                <div class="reminder-item-header">
                    <h4 class="reminder-item-title">${reminder.title}</h4>
                    ${reminder.repeat ? '<span class="badge bg-info"><i class="fas fa-repeat"></i> Ponavlja se</span>' : ''}
                </div>
                <div class="reminder-item-details">
                    <i class="fas fa-calendar"></i> ${this.formatDate(reminder.date)}
                    <span class="ms-2"><i class="fas fa-clock"></i> ${reminder.time}</span>
                </div>
            </div>
            <button class="btn btn-sm btn-danger reminder-delete-btn" data-reminder-id="${reminder.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        if (isPast) {
            item.classList.add('reminder-past');
        }
        
        itemsContainer.appendChild(item);
    });
    
    // Event listeneri za brisanje
    itemsContainer.querySelectorAll('.reminder-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const reminderId = parseInt(e.currentTarget.getAttribute('data-reminder-id'));
            const confirmed = await this.showConfirmDialog(
                'Da li si sigurna da želiš da obrišeš ovaj podsetnik?',
                'Brisanje Podsetnika',
                'Obriši',
                'Otkaži'
            );
            if (confirmed) {
                this.deleteReminder(reminderId);
                this.updateRemindersList();
                this.showSuccess('Podsetnik je obrisan.');
            }
        });
    });
};
