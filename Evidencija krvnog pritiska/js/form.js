// Forma za unos merenja

import { setCurrentDateTime, showMessage } from './utils.js';
import { addMeasurement } from './storage.js';

/**
 * Inicijalizuje formu za unos merenja
 * @param {Function} onSuccess - Callback funkcija koja se poziva nakon uspešnog unosa
 */
export function initForm(onSuccess) {
    const form = document.getElementById('measurementForm');
    if (!form) return;
    
    // Postavi trenutni datum i vreme
    setCurrentDateTime('datetime');
    
    form.addEventListener('submit', (e) => handleFormSubmit(e, onSuccess));
}

/**
 * Rukuje submit događajem forme
 * @param {Event} e - Submit event
 * @param {Function} onSuccess - Callback funkcija koja se poziva nakon uspešnog unosa
 */
function handleFormSubmit(e, onSuccess) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const measurement = {
        systolic: parseInt(formData.get('systolic')),
        diastolic: parseInt(formData.get('diastolic')),
        pulse: formData.get('pulse') ? parseInt(formData.get('pulse')) : null,
        datetime: formData.get('datetime') || new Date().toISOString(),
        activity: formData.get('activity') || null,
        symptoms: formData.getAll('symptoms'),
        medication: formData.get('medication') || null,
        notes: formData.get('notes') || null
    };
    
    // Validacija
    if (!measurement.systolic || !measurement.diastolic) {
        showMessage('formMessage', 'Molimo unesite sistolički i dijastolički pritisak!', 'error');
        return;
    }
    
    if (measurement.systolic < 50 || measurement.systolic > 300) {
        showMessage('formMessage', 'Sistolički pritisak mora biti između 50 i 300 mmHg!', 'error');
        return;
    }
    
    if (measurement.diastolic < 30 || measurement.diastolic > 200) {
        showMessage('formMessage', 'Dijastolički pritisak mora biti između 30 i 200 mmHg!', 'error');
        return;
    }
    
    // Sačuvaj merenje
    console.log('Pokušavam da sačuvam merenje:', measurement);
    const result = addMeasurement(measurement);
    console.log('Rezultat addMeasurement:', result);
    
    if (result) {
        showMessage('formMessage', 'Merenje je uspešno sačuvano!', 'success');
        e.target.reset();
        setCurrentDateTime('datetime');
        
        // Pozovi callback ako postoji
        if (onSuccess) {
            onSuccess();
        }
    } else {
        console.error('Neuspešno čuvanje merenja');
        showMessage('formMessage', 'Greška pri čuvanju merenja! Proverite konzolu za detalje.', 'error');
    }
}
