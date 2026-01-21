// Modul za simptome
PeriodTracker.prototype.updateSymptomsDisplay = function() {
    const historyContainer = document.getElementById('symptomsHistory');
    if (!historyContainer) return;
    
    if (this.symptoms.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list empty-icon"></i>
                <p class="empty-message">Nema zabeleženih simptoma</p>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('recordSymptomsBtn').click()">
                    <i class="fas fa-plus"></i> Zabeleži Prvi Simptom
                </button>
            </div>
        `;
        return;
    }
    
    // Sortiraj simptome po datumu (najnoviji prvi)
    const sortedSymptoms = [...this.symptoms].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    historyContainer.innerHTML = '';
    
    sortedSymptoms.forEach(symptom => {
        const entry = document.createElement('div');
        entry.className = 'symptom-entry';
        
        const header = document.createElement('div');
        header.className = 'symptom-entry-header';
        
        const date = document.createElement('div');
        date.className = 'symptom-entry-date';
        date.textContent = this.formatDate(symptom.date);
        header.appendChild(date);
        
        entry.appendChild(header);
        
        // Vrednosti simptoma
        const values = document.createElement('div');
        values.className = 'symptom-entry-values';
        
        if (symptom.energy !== undefined) {
            const energy = document.createElement('div');
            energy.className = 'symptom-entry-value';
            energy.textContent = `Energija: ${symptom.energy}/10`;
            values.appendChild(energy);
        }
        
        if (symptom.mood !== undefined) {
            const mood = document.createElement('div');
            mood.className = 'symptom-entry-value';
            mood.textContent = `Raspoloženje: ${symptom.mood}/10`;
            values.appendChild(mood);
        }
        
        if (symptom.pain !== undefined) {
            const pain = document.createElement('div');
            pain.className = 'symptom-entry-value';
            pain.textContent = `Bol: ${symptom.pain}/10`;
            values.appendChild(pain);
        }
        
        if (symptom.libido !== undefined) {
            const libido = document.createElement('div');
            libido.className = 'symptom-entry-value';
            libido.textContent = `Libido: ${symptom.libido}/10`;
            values.appendChild(libido);
        }
        
        if (symptom.additionalSymptoms && symptom.additionalSymptoms.length > 0) {
            const additional = document.createElement('div');
            additional.className = 'symptom-entry-value';
            additional.textContent = `Dodatni: ${symptom.additionalSymptoms.join(', ')}`;
            values.appendChild(additional);
        }
        
        entry.appendChild(values);
        
        // AI sažetak ako postoji
        if (symptom.aiSummary) {
            const summary = document.createElement('div');
            summary.className = 'symptom-entry-summary';
            summary.textContent = symptom.aiSummary;
            entry.appendChild(summary);
        }
        
        historyContainer.appendChild(entry);
    });
};

// updateSymptomsStatistics je implementirana u dashboard.js
// Ne treba duplikat ovde jer bi to stvorilo beskonačnu rekurziju

PeriodTracker.prototype.getSymptomNameInSerbian = function(symptomKey) {
    const translations = {
        'glavobolja': 'Glavobolja',
        'grčevi': 'Grčevi',
        'nadutost': 'Nadutost',
        'osetljivost_grudi': 'Osetljivost grudi',
        'umor': 'Umor',
        'akne': 'Akne'
    };
    
    return translations[symptomKey] || symptomKey;
};

PeriodTracker.prototype.generateSurveySummary = async function(symptomEntry) {
    // Ova metoda će biti pozvana iz anketa.js kada se anketa završi
    // Za sada vraćamo prazan string, ali će se implementirati sa Groq API-jem
    return '';
};
