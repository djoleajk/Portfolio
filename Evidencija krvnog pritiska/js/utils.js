// Pomoćne funkcije

/**
 * Formatira datum i vreme za prikaz
 * @param {string|Date} date - Datum
 * @returns {string} Formatiran datum
 */
export function formatDateTime(date) {
    if (!date) return '-';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Formatira samo datum
 * @param {string|Date} date - Datum
 * @returns {string} Formatiran datum
 */
export function formatDate(date) {
    if (!date) return '-';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}.${month}.${year}`;
}

/**
 * Određuje status pritiska prema WHO standardima
 * @param {number} systolic - Sistolički pritisak
 * @param {number} diastolic - Dijastolički pritisak
 * @returns {Object} Objekat sa statusom i klasom
 */
export function getPressureStatus(systolic, diastolic) {
    if (systolic < 120 && diastolic < 80) {
        return {
            label: 'Optimalan',
            class: 'status-optimal'
        };
    } else if (systolic <= 129 && diastolic <= 84) {
        return {
            label: 'Normalan',
            class: 'status-normal'
        };
    } else if (systolic <= 139 && diastolic <= 89) {
        return {
            label: 'Visok normalan',
            class: 'status-high-normal'
        };
    } else if (systolic <= 159 && diastolic <= 99) {
        return {
            label: 'Hipertenzija 1',
            class: 'status-hypertension1'
        };
    } else if (systolic <= 179 && diastolic <= 109) {
        return {
            label: 'Hipertenzija 2',
            class: 'status-hypertension2'
        };
    } else {
        return {
            label: 'Hipertenzija 3',
            class: 'status-hypertension3'
        };
    }
}

/**
 * Proverava da li je datum u određenom periodu
 * @param {string|Date} date - Datum
 * @param {string} period - Period ('today', 'week', 'month', 'all', ili 'YYYY-MM' za konkretan mesec)
 * @returns {boolean}
 */
export function isInPeriod(date, period) {
    if (period === 'all') return true;
    
    const d = new Date(date);
    const now = new Date();
    
    if (period === 'today') {
        return d.toDateString() === now.toDateString();
    }
    
    if (period === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
    }
    
    if (period === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return d >= monthAgo;
    }
    
    // Provera za konkretan mesec (format: 'YYYY-MM')
    if (period.match(/^\d{4}-\d{2}$/)) {
        const [year, month] = period.split('-').map(Number);
        const dateYear = d.getFullYear();
        const dateMonth = d.getMonth() + 1; // getMonth() vraća 0-11
        
        return dateYear === year && dateMonth === month;
    }
    
    return true;
}

/**
 * Generiše opcije za prethodne mesece
 * @param {number} monthsBack - Broj meseci unazad (default: 12)
 * @returns {Array} Niz objekata sa {value, label}
 */
export function generateMonthOptions(monthsBack = 12) {
    const options = [];
    const now = new Date();
    
    for (let i = 0; i < monthsBack; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthValue = `${year}-${String(month).padStart(2, '0')}`;
        
        // Nazivi meseci na srpskom
        const monthNames = [
            'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
            'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
        ];
        
        const monthLabel = `${monthNames[date.getMonth()]} ${year}`;
        
        options.push({
            value: monthValue,
            label: monthLabel
        });
    }
    
    return options;
}

/**
 * Računa prosek sistoličkog i dijastoličkog pritiska
 * @param {Array} measurements - Niz merenja
 * @returns {Object} Objekat sa prosekom
 */
export function calculateAverage(measurements) {
    if (measurements.length === 0) {
        return { systolic: 0, diastolic: 0 };
    }
    
    const sum = measurements.reduce((acc, m) => {
        return {
            systolic: acc.systolic + (parseInt(m.systolic) || 0),
            diastolic: acc.diastolic + (parseInt(m.diastolic) || 0)
        };
    }, { systolic: 0, diastolic: 0 });
    
    return {
        systolic: Math.round(sum.systolic / measurements.length),
        diastolic: Math.round(sum.diastolic / measurements.length)
    };
}

/**
 * Računa prosek pulsa
 * @param {Array} measurements - Niz merenja sa pulsom
 * @returns {number} Prosečan puls
 */
export function calculateAveragePulse(measurements) {
    const withPulse = measurements.filter(m => m.pulse && parseInt(m.pulse) > 0);
    if (withPulse.length === 0) return 0;
    
    const sum = withPulse.reduce((acc, m) => acc + parseInt(m.pulse), 0);
    return Math.round(sum / withPulse.length);
}

/**
 * Pronalazi min i max vrednosti pritiska
 * @param {Array} measurements - Niz merenja
 * @returns {Object} Objekat sa min i max vrednostima
 */
export function findMinMax(measurements) {
    if (measurements.length === 0) {
        return { min: null, max: null };
    }
    
    let minSystolic = Infinity;
    let minDiastolic = Infinity;
    let maxSystolic = -Infinity;
    let maxDiastolic = -Infinity;
    
    measurements.forEach(m => {
        const sys = parseInt(m.systolic);
        const dia = parseInt(m.diastolic);
        
        if (sys < minSystolic) minSystolic = sys;
        if (sys > maxSystolic) maxSystolic = sys;
        if (dia < minDiastolic) minDiastolic = dia;
        if (dia > maxDiastolic) maxDiastolic = dia;
    });
    
    return {
        min: { systolic: minSystolic, diastolic: minDiastolic },
        max: { systolic: maxSystolic, diastolic: maxDiastolic }
    };
}

/**
 * Određuje trend pritiska
 * @param {Array} measurements - Niz merenja
 * @returns {string} Trend ('poboljšanje', 'pogoršanje', 'stabilno')
 */
export function calculateTrend(measurements) {
    if (measurements.length < 2) return 'stabilno';
    
    // Sortiraj po datumu
    const sorted = [...measurements].sort((a, b) => {
        return new Date(a.datetime || a.createdAt) - new Date(b.datetime || b.createdAt);
    });
    
    // Uzmi prvu i poslednju trećinu merenja
    const firstThird = Math.floor(sorted.length / 3);
    const lastThird = sorted.length - Math.floor(sorted.length / 3);
    
    const firstAvg = calculateAverage(sorted.slice(0, firstThird));
    const lastAvg = calculateAverage(sorted.slice(lastThird));
    
    const firstMean = (firstAvg.systolic + firstAvg.diastolic) / 2;
    const lastMean = (lastAvg.systolic + lastAvg.diastolic) / 2;
    
    const diff = lastMean - firstMean;
    const threshold = 5; // Prag za određivanje trenda
    
    if (diff < -threshold) {
        return 'poboljšanje';
    } else if (diff > threshold) {
        return 'pogoršanje';
    } else {
        return 'stabilno';
    }
}

/**
 * Grupiše merenja po danima
 * @param {Array} measurements - Niz merenja
 * @returns {Object} Objekat sa grupisanim merenjima
 */
export function groupByDay(measurements) {
    const grouped = {};
    
    measurements.forEach(m => {
        const date = new Date(m.datetime || m.createdAt);
        const dateKey = formatDate(date);
        
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        
        grouped[dateKey].push(m);
    });
    
    return grouped;
}

/**
 * Priprema podatke za grafikone
 * @param {Array} measurements - Niz merenja
 * @returns {Object} Objekat sa pripremljenim podacima
 */
export function prepareChartData(measurements) {
    const sorted = [...measurements].sort((a, b) => {
        return new Date(a.datetime || a.createdAt) - new Date(b.datetime || b.createdAt);
    });
    
    return {
        labels: sorted.map(m => formatDateTime(m.datetime || m.createdAt)),
        systolic: sorted.map(m => parseInt(m.systolic)),
        diastolic: sorted.map(m => parseInt(m.diastolic)),
        pulse: sorted.map(m => m.pulse ? parseInt(m.pulse) : null),
        dates: sorted.map(m => m.datetime || m.createdAt)
    };
}

/**
 * Priprema podatke za dnevni prosek
 * @param {Array} measurements - Niz merenja
 * @returns {Object} Objekat sa dnevnim prosekom
 */
export function prepareDailyAverageData(measurements) {
    const grouped = groupByDay(measurements);
    const days = Object.keys(grouped).sort();
    
    const labels = [];
    const systolicAvg = [];
    const diastolicAvg = [];
    
    days.forEach(day => {
        const dayMeasurements = grouped[day];
        const avg = calculateAverage(dayMeasurements);
        
        labels.push(day);
        systolicAvg.push(avg.systolic);
        diastolicAvg.push(avg.diastolic);
    });
    
    return { labels, systolicAvg, diastolicAvg };
}

/**
 * Postavlja trenutni datum i vreme u input polje
 * @param {string} inputId - ID input polja
 */
export function setCurrentDateTime(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    input.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Prikazuje poruku korisniku
 * @param {string} messageId - ID elementa za poruku
 * @param {string} text - Tekst poruke
 * @param {string} type - Tip poruke ('success' ili 'error')
 */
export function showMessage(messageId, text, type = 'success') {
    const messageEl = document.getElementById(messageId);
    if (!messageEl) return;
    
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    
    setTimeout(() => {
        messageEl.className = 'message';
        messageEl.textContent = '';
    }, 5000);
}

/**
 * Formatira markdown tekst u HTML (podržava bold, naslove, liste)
 * @param {string} text - Markdown tekst
 * @returns {string} HTML formatiran tekst
 */
export function formatMarkdown(text) {
    if (!text) return '';
    
    // Prvo, obradi liste pre boldovanja
    const lines = text.split('\n');
    let inList = false;
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const listMatch = line.match(/^[\s]*[•\-]\s+(.+)$/);
        
        if (listMatch) {
            if (!inList) {
                formattedLines.push('<ul class="ai-list">');
                inList = true;
            }
            // Obradi bold u listi pre dodavanja
            let listContent = listMatch[1];
            listContent = listContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            formattedLines.push(`<li class="ai-list-item">${listContent}</li>`);
        } else {
            if (inList) {
                formattedLines.push('</ul>');
                inList = false;
            }
            formattedLines.push(line);
        }
    }
    
    if (inList) {
        formattedLines.push('</ul>');
    }
    
    let html = formattedLines.join('\n');
    
    // Naslovi **NASLOV:** -> <h4>NASLOV:</h4> (pre opšteg boldovanja)
    html = html.replace(/\*\*([A-Z\s]+:)\*\*/g, '<h4 class="ai-section-title">$1</h4>');
    
    // Bold tekst **text** -> <strong>text</strong> (samo ako nije već u tagu)
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Novi redovi
    html = html.replace(/\n/g, '<br>');
    
    // Višestruki <br> -> jedan <br> (ali ne u listama)
    html = html.replace(/(<br>\s*){3,}/g, '<br><br>');
    
    return html;
}
