// Formatiranje podataka za prikaz

/**
 * Formatira datum za prikaz (DD.MM.YYYY)
 * @param {string|Date} dateString - Datum za formatiranje
 * @returns {string} - Formatiran datum
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

/**
 * Formatira datum i vreme za prikaz
 * @param {string|Date} dateString - Datum za formatiranje
 * @returns {string} - Formatiran datum i vreme
 */
function formatDateTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Formatira novac za prikaz (RSD)
 * @param {number} amount - Iznos za formatiranje
 * @param {boolean} showCurrency - Da li prikazati valutu
 * @returns {string} - Formatiran iznos
 */
function formatCurrency(amount, showCurrency = true) {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return showCurrency ? '0,00 RSD' : '0,00';
    }
    
    const formatted = new Intl.NumberFormat('sr-RS', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    return showCurrency ? `${formatted} RSD` : formatted;
}

/**
 * Računa broj dana između dva datuma
 * @param {string|Date} startDate - Datum početka
 * @param {string|Date} endDate - Datum završetka
 * @returns {number} - Broj dana
 */
function calculateDays(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays;
}

/**
 * Formatira ime i prezime (prvo slovo veliko)
 * @param {string} name - Ime ili prezime
 * @returns {string} - Formatirano ime
 */
function formatName(name) {
    if (!name) return '';
    
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Skraćuje tekst na određenu dužinu
 * @param {string} text - Tekst za skraćivanje
 * @param {number} maxLength - Maksimalna dužina
 * @returns {string} - Skraćeni tekst
 */
function truncateText(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Formatira telefon za prikaz
 * @param {string} telefon - Broj telefona
 * @returns {string} - Formatiran telefon
 */
function formatTelefon(telefon) {
    if (!telefon) return '';
    
    // Ukloni sve što nije broj ili +
    const cleaned = telefon.replace(/[^\d+]/g, '');
    
    // Formatiraj kao +381 64 1234567
    if (cleaned.startsWith('+381')) {
        return cleaned.replace(/(\+381)(\d{2})(\d{6,7})/, '$1 $2 $3');
    }
    
    // Formatiraj kao 064 1234567
    if (cleaned.startsWith('0')) {
        return cleaned.replace(/(0\d{2})(\d{6,7})/, '$1 $2');
    }
    
    return telefon;
}

// Export funkcije
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatDateTime,
        formatCurrency,
        calculateDays,
        formatName,
        truncateText,
        formatTelefon
    };
}

