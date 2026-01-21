// Modul za formular simptoma
class FormularZaSimptome {
    constructor(tracker) {
        this.tracker = tracker;
        this.init();
    }
    
    init() {
        const form = document.getElementById('symptomForm');
        if (!form) return;
        
        // Postavi datum na danas
        const dateInput = document.getElementById('symptomDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        
        // Event listeneri za range inpute
        const ranges = ['energyRange', 'moodRange', 'painRange', 'libidoRange'];
        ranges.forEach(rangeId => {
            const range = document.getElementById(rangeId);
            if (range) {
                range.addEventListener('input', (e) => {
                    this.updateRangeValue(e.target);
                });
            }
        });
        
        // Submit formulara
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSymptoms();
        });
    }
    
    updateRangeValue(range) {
        const valueId = range.id.replace('Range', 'Value');
        const valueEl = document.getElementById(valueId);
        if (valueEl) {
            valueEl.textContent = range.value;
        }
    }
    
    async saveSymptoms() {
        const dateInput = document.getElementById('symptomDate');
        const energyRange = document.getElementById('energyRange');
        const moodRange = document.getElementById('moodRange');
        const painRange = document.getElementById('painRange');
        const libidoRange = document.getElementById('libidoRange');
        const additionalCheckboxes = document.querySelectorAll('input[name="symptoms"]:checked');
        
        if (!dateInput || !dateInput.value) {
            this.tracker.showWarning('Molimo te izaberi datum.');
            return;
        }
        
        const symptomEntry = {
            id: Date.now(),
            date: new Date(dateInput.value),
            energy: parseInt(energyRange.value),
            mood: parseInt(moodRange.value),
            pain: parseInt(painRange.value),
            libido: parseInt(libidoRange.value),
            additionalSymptoms: Array.from(additionalCheckboxes).map(cb => {
                return this.tracker.getSymptomNameInSerbian(cb.value);
            })
        };
        
        // Proveri da li već postoji unos za taj datum
        const existingIndex = this.tracker.symptoms.findIndex(s => {
            const sDate = new Date(s.date).toISOString().split('T')[0];
            const entryDate = new Date(symptomEntry.date).toISOString().split('T')[0];
            return sDate === entryDate;
        });
        
        if (existingIndex !== -1) {
            const confirmed = await this.tracker.showConfirmDialog(
                'Već postoji unos za ovaj datum. Da li želiš da ga zameniš?',
                'Zameni Unos',
                'Zameni',
                'Otkaži'
            );
            if (confirmed) {
                this.tracker.symptoms[existingIndex] = symptomEntry;
            } else {
                return;
            }
        } else {
            this.tracker.symptoms.push(symptomEntry);
        }
        
        this.tracker.saveData();
        this.tracker.updateSymptomsDisplay();
        this.tracker.updateDashboard();
        
        // Resetuj formular
        document.getElementById('symptomForm').reset();
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        
        // Resetuj range vrednosti
        document.getElementById('energyValue').textContent = '5';
        document.getElementById('moodValue').textContent = '5';
        document.getElementById('painValue').textContent = '1';
        document.getElementById('libidoValue').textContent = '5';
        
        this.tracker.showSuccess('Simptomi su uspešno sačuvani!');
    }
}
