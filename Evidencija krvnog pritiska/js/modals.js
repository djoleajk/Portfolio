// Modal prozori za izmenu i brisanje

import { updateMeasurement, deleteMeasurement as deleteMeasurementStorage, loadMeasurements, saveMeasurements } from './storage.js';
import { showMessage } from './utils.js';

let deleteId = null;

/**
 * Inicijalizuje modal prozore
 * @param {Function} onDataChange - Callback funkcija koja se poziva kada se podaci promene
 */
export function initModals(onDataChange) {
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.getElementById('closeModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (editModal) editModal.classList.remove('active');
        });
    }
    
    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', () => {
            if (deleteModal) deleteModal.classList.remove('active');
        });
    }
    
    if (cancelDelete) {
        cancelDelete.addEventListener('click', () => {
            if (deleteModal) deleteModal.classList.remove('active');
        });
    }
    
    // Zatvori modal klikom van njega
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.classList.remove('active');
            }
        });
    }
    
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                deleteModal.classList.remove('active');
            }
        });
    }
    
    // Potvrda brisanja
    const confirmDelete = document.getElementById('confirmDelete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            if (deleteId) {
                if (deleteMeasurementById(deleteId)) {
                    if (deleteModal) deleteModal.classList.remove('active');
                    if (onDataChange) onDataChange();
                    showMessage('formMessage', 'Merenje je uspešno obrisano!', 'success');
                } else {
                    alert('Greška pri brisanju merenja!');
                }
                deleteId = null;
            }
        });
    }
}

/**
 * Otvara modal za izmenu merenja
 * @param {string} id - ID merenja
 * @param {Function} onDataChange - Callback funkcija koja se poziva kada se podaci promene
 */
export function editMeasurement(id, onDataChange) {
    const measurements = loadMeasurements();
    const measurement = measurements.find(m => m.id === id);
    if (!measurement) return;
    
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editId = document.getElementById('editId');
    
    if (!editModal || !editForm || !editId) return;
    
    // Popuni formu
    editId.value = id;
    
    // Konvertuj datetime za input
    const date = new Date(measurement.datetime || measurement.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const datetimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    editForm.innerHTML = `
        <div class="modal-body">
            <div class="form-grid">
                <div class="form-group">
                    <label for="editSystolic">Sistolički pritisak <span class="required">*</span></label>
                    <input type="number" id="editSystolic" name="systolic" min="50" max="300" value="${measurement.systolic}" required>
                </div>
                <div class="form-group">
                    <label for="editDiastolic">Dijastolički pritisak <span class="required">*</span></label>
                    <input type="number" id="editDiastolic" name="diastolic" min="30" max="200" value="${measurement.diastolic}" required>
                </div>
                <div class="form-group">
                    <label for="editPulse">Puls</label>
                    <input type="number" id="editPulse" name="pulse" min="30" max="200" value="${measurement.pulse || ''}">
                </div>
                <div class="form-group">
                    <label for="editDatetime">Datum i vreme</label>
                    <input type="datetime-local" id="editDatetime" name="datetime" value="${datetimeValue}">
                </div>
                <div class="form-group full-width">
                    <label for="editActivity">Aktivnost pre merenja</label>
                    <select id="editActivity" name="activity">
                        <option value="">Izaberite aktivnost</option>
                        <option value="mirno-sedenje" ${measurement.activity === 'mirno-sedenje' ? 'selected' : ''}>Mirno sedenje</option>
                        <option value="posle-fizicke-aktivnosti" ${measurement.activity === 'posle-fizicke-aktivnosti' ? 'selected' : ''}>Posle fizičke aktivnosti</option>
                        <option value="posle-jela" ${measurement.activity === 'posle-jela' ? 'selected' : ''}>Posle jela</option>
                        <option value="ujutru" ${measurement.activity === 'ujutru' ? 'selected' : ''}>Ujutru</option>
                        <option value="uvece" ${measurement.activity === 'uvece' ? 'selected' : ''}>Uveče</option>
                        <option value="drugo" ${measurement.activity === 'drugo' ? 'selected' : ''}>Drugo</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label>Simptomi</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="symptoms" value="glavobolja" ${Array.isArray(measurement.symptoms) && measurement.symptoms.includes('glavobolja') ? 'checked' : ''}>
                            <span>Glavobolja</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="symptoms" value="vrtoglavica" ${Array.isArray(measurement.symptoms) && measurement.symptoms.includes('vrtoglavica') ? 'checked' : ''}>
                            <span>Vrtoglavica</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="symptoms" value="mucnina" ${Array.isArray(measurement.symptoms) && measurement.symptoms.includes('mucnina') ? 'checked' : ''}>
                            <span>Mučnina</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="symptoms" value="umor" ${Array.isArray(measurement.symptoms) && measurement.symptoms.includes('umor') ? 'checked' : ''}>
                            <span>Umor</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="symptoms" value="bez-simptoma" ${Array.isArray(measurement.symptoms) && measurement.symptoms.includes('bez-simptoma') ? 'checked' : ''}>
                            <span>Bez simptoma</span>
                        </label>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label for="editMedication">Lekovi</label>
                    <input type="text" id="editMedication" name="medication" value="${measurement.medication || ''}" placeholder="Unesite nazive lekova (opciono)">
                </div>
                <div class="form-group full-width">
                    <label for="editNotes">Napomene</label>
                    <textarea id="editNotes" name="notes" rows="3" placeholder="Dodatne napomene...">${measurement.notes || ''}</textarea>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Sačuvaj izmene</button>
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('editModal').classList.remove('active')">Otkaži</button>
        </div>
    `;
    
    // Dodaj event listener za submit
    editForm.onsubmit = (e) => {
        e.preventDefault();
        handleEditSubmit(id, onDataChange);
    };
    
    editModal.classList.add('active');
}

/**
 * Rukuje submit događajem forme za izmenu
 * @param {string} id - ID merenja
 * @param {Function} onDataChange - Callback funkcija koja se poziva kada se podaci promene
 */
function handleEditSubmit(id, onDataChange) {
    const form = document.getElementById('editForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const updatedData = {
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
    if (!updatedData.systolic || !updatedData.diastolic) {
        alert('Molimo unesite sistolički i dijastolički pritisak!');
        return;
    }
    
    if (updateMeasurement(id, updatedData)) {
        const editModal = document.getElementById('editModal');
        if (editModal) editModal.classList.remove('active');
        if (onDataChange) onDataChange();
        showMessage('formMessage', 'Merenje je uspešno ažurirano!', 'success');
    } else {
        alert('Greška pri ažuriranju merenja!');
    }
}

/**
 * Otvara modal za potvrdu brisanja
 * @param {string} id - ID merenja
 */
export function deleteMeasurement(id) {
    deleteId = id;
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.classList.add('active');
    }
}

/**
 * Briše merenje po ID-u
 * @param {string} id - ID merenja
 * @returns {boolean} Uspešnost operacije
 */
function deleteMeasurementById(id) {
    const measurements = loadMeasurements();
    const filtered = measurements.filter(m => m.id !== id);
    return saveMeasurements(filtered);
}
