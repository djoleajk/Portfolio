// Modul za event listeners
PeriodTracker.prototype.setupEventListeners = function() {
    // Tab navigacija
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.currentTarget.getAttribute('data-tab');
            this.switchTab(tabName);
        });
    });
    
    // Dashboard akcije
    const startCycleBtn = document.getElementById('startCycleBtn');
    if (startCycleBtn) {
        startCycleBtn.addEventListener('click', () => {
            this.openModal('startCycleModal');
        });
    }
    
    const recordSymptomsBtn = document.getElementById('recordSymptomsBtn');
    if (recordSymptomsBtn) {
        recordSymptomsBtn.addEventListener('click', () => {
            this.switchTab('symptoms');
        });
    }
    
    const addReminderBtn = document.getElementById('addReminderBtn');
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', () => {
            this.showReminderModal();
        });
    }
    
    const startSurveyBtn = document.getElementById('startSurveyBtn');
    if (startSurveyBtn) {
        startSurveyBtn.addEventListener('click', () => {
            this.surveyModule.startDailySurvey(true);
        });
    }
    
    // Kalendar navigacija
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            this.changeMonth('prev');
        });
    }
    
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            this.changeMonth('next');
        });
    }
    
    // Modal zatvaranje
    const closeStartCycleModal = document.getElementById('closeStartCycleModal');
    if (closeStartCycleModal) {
        closeStartCycleModal.addEventListener('click', () => {
            this.closeModal('startCycleModal');
        });
    }
    
    const closeReminderModal = document.getElementById('closeReminderModal');
    if (closeReminderModal) {
        closeReminderModal.addEventListener('click', () => {
            this.closeModal('reminderModal');
        });
    }
    
    const cancelReminderBtn = document.getElementById('cancelReminderBtn');
    if (cancelReminderBtn) {
        cancelReminderBtn.addEventListener('click', () => {
            const reminderForm = document.getElementById('reminderForm');
            if (reminderForm) {
                reminderForm.reset();
            }
            this.closeModal('reminderModal');
        });
    }
    
    const closeSurveyModal = document.getElementById('closeSurveyModal');
    if (closeSurveyModal) {
        closeSurveyModal.addEventListener('click', () => {
            this.closeModal('surveyModal');
        });
    }
    
    // Zatvori modal klikom van njega
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Start Cycle Form
    const startCycleForm = document.getElementById('startCycleForm');
    if (startCycleForm) {
        startCycleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const dateInput = document.getElementById('cycleStartDate');
            const durationInput = document.getElementById('cycleDuration');
            
            if (dateInput && durationInput) {
                this.startCycle(dateInput.value, parseInt(durationInput.value));
                this.closeModal('startCycleModal');
                this.updateDashboard();
                this.renderCalendar();
                this.showSuccess('Ciklus je uspešno započet!');
            }
        });
    }
    
    // Reminder Form
    const reminderForm = document.getElementById('reminderForm');
    if (reminderForm) {
        reminderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('reminderTitle');
            const dateInput = document.getElementById('reminderDate');
            const timeInput = document.getElementById('reminderTime');
            const repeatInput = document.getElementById('reminderRepeat');
            
            if (titleInput && dateInput && timeInput) {
                this.saveReminder({
                    title: titleInput.value,
                    date: dateInput.value,
                    time: timeInput.value,
                    repeat: repeatInput ? repeatInput.checked : false
                });
                this.closeModal('reminderModal');
                reminderForm.reset();
                this.showSuccess('Podsetnik je uspešno dodat!');
            }
        });
    }
    
    // Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }
    
    // Export Data
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const formatSelect = document.getElementById('exportFormat');
            const format = formatSelect ? formatSelect.value : 'json';
            this.exportData(format);
        });
    }
    
    // Clear Data
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            this.clearAllData();
        });
    }
    
    // Request Notification Permission
    const requestNotificationPermissionBtn = document.getElementById('requestNotificationPermission');
    if (requestNotificationPermissionBtn) {
        requestNotificationPermissionBtn.addEventListener('click', () => {
            this.requestNotificationPermission();
        });
    }
    
    // Survey Navigation
    const nextSurveyQuestion = document.getElementById('nextSurveyQuestion');
    if (nextSurveyQuestion) {
        nextSurveyQuestion.addEventListener('click', () => {
            this.surveyModule.nextSurveyQuestion();
        });
    }
    
    const prevSurveyQuestion = document.getElementById('prevSurveyQuestion');
    if (prevSurveyQuestion) {
        prevSurveyQuestion.addEventListener('click', () => {
            this.surveyModule.prevSurveyQuestion();
        });
    }
    
    // Event listener za submitSurvey se postavlja direktno u anketa.js
    // kada se prikaže poslednje pitanje
    
    // Toggle Cycle Info
    const toggleCycleInfo = document.getElementById('toggleCycleInfo');
    if (toggleCycleInfo) {
        toggleCycleInfo.addEventListener('click', (e) => {
            e.preventDefault();
            const content = document.getElementById('cycleInfoContent');
            const icon = document.getElementById('cycleInfoIcon');
            if (content && icon) {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    icon.className = 'fas fa-chevron-up';
                } else {
                    content.style.display = 'none';
                    icon.className = 'fas fa-chevron-down';
                }
            }
        });
    }
    
    // Initialize Bootstrap tooltips
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
};
