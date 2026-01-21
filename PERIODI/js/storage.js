// Modul za čuvanje podataka
PeriodTracker.prototype.loadData = function() {
    try {
        const savedCycles = localStorage.getItem('periodi_cycles');
        const savedSymptoms = localStorage.getItem('periodi_symptoms');
        const savedSettings = localStorage.getItem('periodi_settings');
        const savedReminders = localStorage.getItem('periodi_reminders');
        
        if (savedCycles) {
            this.cycles = JSON.parse(savedCycles);
            // Konvertuj string datume u Date objekte
            this.cycles = this.cycles.map(cycle => ({
                ...cycle,
                startDate: new Date(cycle.startDate),
                endDate: cycle.endDate ? new Date(cycle.endDate) : null
            }));
        }
        
        if (savedSymptoms) {
            this.symptoms = JSON.parse(savedSymptoms);
            // Konvertuj string datume u Date objekte
            this.symptoms = this.symptoms.map(symptom => ({
                ...symptom,
                date: new Date(symptom.date)
            }));
        }
        
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        if (savedReminders) {
            this.reminders = JSON.parse(savedReminders);
            // Konvertuj string datume u Date objekte
            this.reminders = this.reminders.map(reminder => ({
                ...reminder,
                date: new Date(reminder.date)
            }));
        }
    } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
    }
};

PeriodTracker.prototype.saveData = function() {
    try {
        localStorage.setItem('periodi_cycles', JSON.stringify(this.cycles));
        localStorage.setItem('periodi_symptoms', JSON.stringify(this.symptoms));
        localStorage.setItem('periodi_settings', JSON.stringify(this.settings));
        localStorage.setItem('periodi_reminders', JSON.stringify(this.reminders));
    } catch (error) {
        console.error('Greška pri čuvanju podataka:', error);
    }
};

PeriodTracker.prototype.exportData = function(format = 'json') {
    try {
        if (format === 'json') {
            const data = {
                cycles: this.cycles,
                symptoms: this.symptoms,
                settings: this.settings,
                reminders: this.reminders,
                exportDate: new Date().toISOString()
            };
            
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `periodi-podaci-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showSuccess('Podaci su uspešno izveženi u JSON format.');
        } else if (format === 'csv') {
            this.exportToCSV();
        }
    } catch (error) {
        console.error('Greška pri izvozu:', error);
        this.showError('Došlo je do greške pri izvozu podataka.');
    }
};

PeriodTracker.prototype.exportToCSV = function() {
    // CSV za cikluse
    let csv = 'Tip,ID,Datum Početka,Datum Kraja,Dužina\n';
    this.cycles.forEach(cycle => {
        const start = this.formatDateShort(cycle.startDate);
        const end = cycle.endDate ? this.formatDateShort(cycle.endDate) : 'Aktivan';
        const length = cycle.duration || '-';
        csv += `Ciklus,${cycle.id},${start},${end},${length}\n`;
    });
    
    csv += '\nSimptomi\n';
    csv += 'Datum,Energija,Raspoloženje,Bol,Libido,Dodatni Simptomi\n';
    this.symptoms.forEach(symptom => {
        const date = this.formatDateShort(symptom.date);
        const energy = symptom.energy || '-';
        const mood = symptom.mood || '-';
        const pain = symptom.pain || '-';
        const libido = symptom.libido || '-';
        const additional = symptom.additionalSymptoms ? symptom.additionalSymptoms.join('; ') : '-';
        csv += `${date},${energy},${mood},${pain},${libido},"${additional}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `periodi-podaci-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showSuccess('Podaci su uspešno izveženi u CSV format.');
};

PeriodTracker.prototype.clearAllData = async function() {
    const confirmed = await this.showConfirmDialog(
        'Da li si sigurna da želiš da obrišeš sve podatke? Ova akcija se ne može poništiti.',
        'Brisanje Podataka',
        'Obriši',
        'Otkaži'
    );
    
    if (confirmed) {
        localStorage.removeItem('periodi_cycles');
        localStorage.removeItem('periodi_symptoms');
        localStorage.removeItem('periodi_settings');
        localStorage.removeItem('periodi_reminders');
        localStorage.removeItem('periodi_scheduledNotifications');
        localStorage.removeItem('periodi_lastSurveyDate');
        
        this.cycles = [];
        this.symptoms = [];
        this.settings = {
            avgCycleLength: 28,
            avgPeriodLength: 5,
            notifications: {
                periodStart: true,
                ovulation: true,
                fertileWindow: true
            }
        };
        this.reminders = [];
        
        this.saveData();
        this.updateDashboard();
        this.renderCalendar();
        this.updateSymptomsDisplay();
        
        this.showSuccess('Svi podaci su uspešno obrisani.');
    }
};
