// Prikaz merenja i statistike

import { loadMeasurements } from './storage.js';
import { 
    formatDateTime, 
    getPressureStatus, 
    isInPeriod, 
    calculateAverage, 
    calculateAveragePulse, 
    findMinMax, 
    calculateTrend 
} from './utils.js';
import { updateAllCharts } from './charts.js';

// Globalne varijable za trenutni filter i merenja
let currentFilter = 'today'; // Default: prikazuj samo današnja merenja
let measurements = [];

/**
 * Učitava i prikazuje sve podatke
 */
export function loadAndDisplayData() {
    measurements = loadMeasurements();
    displayMeasurements();
    displayStatistics();
    updateAllCharts(measurements);
}

/**
 * Postavlja trenutni filter
 * @param {string} filter - Vrednost filtera
 */
export function setFilter(filter) {
    currentFilter = filter;
    // Ažuriraj select element da odražava trenutni filter
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
        periodFilter.value = filter;
    }
    displayMeasurements();
}

/**
 * Vraća trenutni filter
 * @returns {string} Trenutni filter
 */
export function getCurrentFilter() {
    return currentFilter;
}

/**
 * Vraća trenutna merenja
 * @returns {Array} Niz merenja
 */
export function getMeasurements() {
    return measurements;
}

/**
 * Prikazuje merenja u tabeli
 */
export function displayMeasurements() {
    const tbody = document.getElementById('measurementsTableBody');
    const cardsContainer = document.getElementById('measurementsCardsContainer');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('measurementsTable');
    
    if (!tbody || !cardsContainer) return;
    
    // Filtriraj merenja
    const filtered = measurements.filter(m => isInPeriod(m.datetime || m.createdAt, currentFilter));
    
    // Sortiraj po datumu (najnovije prvo)
    filtered.sort((a, b) => {
        const dateA = new Date(a.datetime || a.createdAt);
        const dateB = new Date(b.datetime || b.createdAt);
        return dateB - dateA;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (cardsContainer) cardsContainer.innerHTML = '';
        if (emptyState) emptyState.classList.add('active');
        if (table) table.style.display = 'none';
        if (cardsContainer) cardsContainer.style.display = 'none';
        return;
    }
    
    if (emptyState) emptyState.classList.remove('active');
    if (table) table.style.display = 'table';
    if (cardsContainer) cardsContainer.style.display = 'grid';
    
    // Generiši tabelu (za desktop)
    tbody.innerHTML = filtered.map(m => {
        const status = getPressureStatus(m.systolic, m.diastolic);
        const symptoms = Array.isArray(m.symptoms) ? m.symptoms.join(', ') : (m.symptoms || '-');
        const activity = m.activity ? m.activity.replace(/-/g, ' ') : '-';
        
        return `
            <tr>
                <td>${formatDateTime(m.datetime || m.createdAt)}</td>
                <td><strong>${m.systolic}/${m.diastolic}</strong> mmHg</td>
                <td><span class="status-badge ${status.class}">${status.label}</span></td>
                <td>${m.pulse || '-'}</td>
                <td>${activity}</td>
                <td>${symptoms}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon ai-analyze" data-ai-id="${m.id}" title="AI Analiza">
                            <i class="fas fa-robot"></i>
                        </button>
                        <button class="btn-icon edit" data-edit-id="${m.id}" title="Izmeni">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" data-delete-id="${m.id}" title="Obriši">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Generiši kartice (za mobilne)
    cardsContainer.innerHTML = filtered.map(m => {
        const status = getPressureStatus(m.systolic, m.diastolic);
        const symptoms = Array.isArray(m.symptoms) && m.symptoms.length > 0 ? m.symptoms.join(', ') : 'Bez simptoma';
        const activity = m.activity ? m.activity.replace(/-/g, ' ') : 'N/A';
        
        return `
            <div class="measurement-card">
                <div class="card-header">
                    <div class="card-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formatDateTime(m.datetime || m.createdAt)}
                    </div>
                    <span class="status-badge ${status.class}">${status.label}</span>
                </div>
                <div class="card-body">
                    <div class="card-main-value">
                        <strong>${m.systolic}/${m.diastolic}</strong>
                        <span class="unit">mmHg</span>
                    </div>
                    <div class="card-details">
                        <div class="card-detail-item">
                            <i class="fas fa-heartbeat"></i>
                            <span class="detail-label">Puls:</span>
                            <span class="detail-value">${m.pulse || '-'}</span>
                        </div>
                        <div class="card-detail-item">
                            <i class="fas fa-running"></i>
                            <span class="detail-label">Aktivnost:</span>
                            <span class="detail-value">${activity}</span>
                        </div>
                        <div class="card-detail-item">
                            <i class="fas fa-exclamation-circle"></i>
                            <span class="detail-label">Simptomi:</span>
                            <span class="detail-value">${symptoms}</span>
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-icon ai-analyze" data-ai-id="${m.id}" title="AI Analiza">
                        <i class="fas fa-robot"></i>
                        <span>AI</span>
                    </button>
                    <button class="btn-icon edit" data-edit-id="${m.id}" title="Izmeni">
                        <i class="fas fa-edit"></i>
                        <span>Izmeni</span>
                    </button>
                    <button class="btn-icon delete" data-delete-id="${m.id}" title="Obriši">
                        <i class="fas fa-trash"></i>
                        <span>Obriši</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Dodaj event listenere za dugmad u tabeli
    tbody.querySelectorAll('[data-ai-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-ai-id');
            if (window.analyzeSingleMeasurement) {
                window.analyzeSingleMeasurement(id);
            }
        });
    });
    
    tbody.querySelectorAll('[data-edit-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-edit-id');
            if (window.editMeasurement) {
                window.editMeasurement(id);
            }
        });
    });
    
    tbody.querySelectorAll('[data-delete-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-delete-id');
            if (window.deleteMeasurement) {
                window.deleteMeasurement(id);
            }
        });
    });
    
    // Dodaj event listenere za dugmad u karticama
    cardsContainer.querySelectorAll('[data-ai-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-ai-id');
            if (window.analyzeSingleMeasurement) {
                window.analyzeSingleMeasurement(id);
            }
        });
    });
    
    cardsContainer.querySelectorAll('[data-edit-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-edit-id');
            if (window.editMeasurement) {
                window.editMeasurement(id);
            }
        });
    });
    
    cardsContainer.querySelectorAll('[data-delete-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-delete-id');
            if (window.deleteMeasurement) {
                window.deleteMeasurement(id);
            }
        });
    });
}

/**
 * Prikazuje statistiku
 */
export function displayStatistics() {
    const statsEmptyState = document.getElementById('statsEmptyState');
    const statsContainer = document.getElementById('statsContainer');
    
    if (measurements.length === 0) {
        if (statsEmptyState) statsEmptyState.classList.add('active');
        if (statsContainer) statsContainer.style.display = 'none';
        return;
    }
    
    if (statsEmptyState) statsEmptyState.classList.remove('active');
    if (statsContainer) statsContainer.style.display = 'block';
    
    // Ukupno merenja
    const totalEl = document.getElementById('totalMeasurements');
    if (totalEl) totalEl.textContent = measurements.length;
    
    // Prosek sveukupno
    const avgOverall = calculateAverage(measurements);
    const avgOverallEl = document.getElementById('avgOverall');
    if (avgOverallEl) avgOverallEl.textContent = `${avgOverall.systolic} / ${avgOverall.diastolic}`;
    
    // Prosek ova nedelja
    const weekMeasurements = measurements.filter(m => isInPeriod(m.datetime || m.createdAt, 'week'));
    const avgWeek = calculateAverage(weekMeasurements);
    const avgWeekEl = document.getElementById('avgWeek');
    if (avgWeekEl) {
        avgWeekEl.textContent = weekMeasurements.length > 0 
            ? `${avgWeek.systolic} / ${avgWeek.diastolic}` 
            : '- / -';
    }
    
    // Prosek ovaj mesec
    const monthMeasurements = measurements.filter(m => isInPeriod(m.datetime || m.createdAt, 'month'));
    const avgMonth = calculateAverage(monthMeasurements);
    const avgMonthEl = document.getElementById('avgMonth');
    if (avgMonthEl) {
        avgMonthEl.textContent = monthMeasurements.length > 0 
            ? `${avgMonth.systolic} / ${avgMonth.diastolic}` 
            : '- / -';
    }
    
    // Min i Max
    const minMax = findMinMax(measurements);
    const maxEl = document.getElementById('maxPressure');
    const minEl = document.getElementById('minPressure');
    if (maxEl) maxEl.textContent = minMax.max ? `${minMax.max.systolic} / ${minMax.max.diastolic}` : '- / -';
    if (minEl) minEl.textContent = minMax.min ? `${minMax.min.systolic} / ${minMax.min.diastolic}` : '- / -';
    
    // Prosečan puls
    const avgPulse = calculateAveragePulse(measurements);
    const avgPulseEl = document.getElementById('avgPulse');
    if (avgPulseEl) avgPulseEl.textContent = avgPulse > 0 ? `${avgPulse}` : '-';
    
    // Trend
    const trend = calculateTrend(measurements);
    const trendEl = document.getElementById('trend');
    if (trendEl) {
        trendEl.textContent = trend;
        trendEl.className = `stat-value trend-${trend}`;
    }
}
