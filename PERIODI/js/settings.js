// Modul za podešavanja
PeriodTracker.prototype.loadSettings = function() {
    const avgCycleLengthInput = document.getElementById('avgCycleLength');
    const avgPeriodLengthInput = document.getElementById('avgPeriodLength');
    const notifyPeriodStart = document.getElementById('notifyPeriodStart');
    const notifyOvulation = document.getElementById('notifyOvulation');
    const notifyFertileWindow = document.getElementById('notifyFertileWindow');
    
    if (avgCycleLengthInput) {
        avgCycleLengthInput.value = this.settings.avgCycleLength || 28;
    }
    
    if (avgPeriodLengthInput) {
        avgPeriodLengthInput.value = this.settings.avgPeriodLength || 5;
    }
    
    if (notifyPeriodStart) {
        notifyPeriodStart.checked = this.settings.notifications.periodStart !== false;
    }
    
    if (notifyOvulation) {
        notifyOvulation.checked = this.settings.notifications.ovulation !== false;
    }
    
    if (notifyFertileWindow) {
        notifyFertileWindow.checked = this.settings.notifications.fertileWindow !== false;
    }
    
    // Ažuriraj status notifikacija
    if (this.updateNotificationStatus) {
        this.updateNotificationStatus();
    }
};

PeriodTracker.prototype.saveSettings = function() {
    const avgCycleLengthInput = document.getElementById('avgCycleLength');
    const avgPeriodLengthInput = document.getElementById('avgPeriodLength');
    const notifyPeriodStart = document.getElementById('notifyPeriodStart');
    const notifyOvulation = document.getElementById('notifyOvulation');
    const notifyFertileWindow = document.getElementById('notifyFertileWindow');
    
    if (avgCycleLengthInput) {
        this.settings.avgCycleLength = parseInt(avgCycleLengthInput.value);
    }
    
    if (avgPeriodLengthInput) {
        this.settings.avgPeriodLength = parseInt(avgPeriodLengthInput.value);
    }
    
    if (notifyPeriodStart) {
        this.settings.notifications.periodStart = notifyPeriodStart.checked;
    }
    
    if (notifyOvulation) {
        this.settings.notifications.ovulation = notifyOvulation.checked;
    }
    
    if (notifyFertileWindow) {
        this.settings.notifications.fertileWindow = notifyFertileWindow.checked;
    }
    
    this.saveData();
    this.scheduleCycleNotifications();
    
    this.showSuccess('Podešavanja su uspešno sačuvana!');
};
