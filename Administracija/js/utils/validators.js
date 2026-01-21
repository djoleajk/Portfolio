// Validacione funkcije za različite tipove podataka

/**
 * Validira JMBG (13 cifara)
 * @param {string} jmbg - JMBG za validaciju
 * @returns {object} - {valid: boolean, error: string}
 */
function validateJMBG(jmbg) {
    if (!jmbg) {
        return { valid: false, error: 'JMBG je obavezan' };
    }
    
    // Ukloni razmake i crtice
    const cleaned = jmbg.replace(/[\s-]/g, '');
    
    // Proveri da li ima tačno 13 cifara
    if (!/^\d{13}$/.test(cleaned)) {
        return { valid: false, error: 'JMBG mora imati tačno 13 cifara' };
    }
    
    // Validacija kontrolne cifre (Luhn algoritam)
    const digits = cleaned.split('').map(Number);
    let sum = 0;
    
    for (let i = 0; i < 12; i++) {
        sum += digits[i] * (i < 7 ? (7 - i) : (15 - i));
    }
    
    const checkDigit = (11 - (sum % 11)) % 11;
    
    if (checkDigit !== digits[12]) {
        return { valid: false, error: 'JMBG kontrolna cifra nije validna' };
    }
    
    return { valid: true, error: null };
}

/**
 * Validira email adresu
 * @param {string} email - Email za validaciju
 * @returns {object} - {valid: boolean, error: string}
 */
function validateEmail(email) {
    if (!email) {
        return { valid: false, error: 'Email je obavezan' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Neispravan format email adrese' };
    }
    
    if (email.length > 255) {
        return { valid: false, error: 'Email je previše dugačak' };
    }
    
    return { valid: true, error: null };
}

/**
 * Validira broj telefona (format: +381 64 1234567 ili 064 1234567)
 * @param {string} telefon - Telefon za validaciju
 * @returns {object} - {valid: boolean, error: string}
 */
function validateTelefon(telefon) {
    if (!telefon) {
        return { valid: false, error: 'Broj telefona je obavezan' };
    }
    
    // Ukloni razmake, crtice i zagrade
    const cleaned = telefon.replace(/[\s()-]/g, '');
    
    // Proveri format: +381 ili 0 na početku, zatim 9-10 cifara
    if (!/^(\+381|0)[6-9]\d{7,8}$/.test(cleaned)) {
        return { valid: false, error: 'Neispravan format telefona (primer: +381 64 1234567 ili 064 1234567)' };
    }
    
    return { valid: true, error: null };
}

/**
 * Validira datum (proverava da li je u prošlosti za datum zaposlenja)
 * @param {string} datum - Datum za validaciju (YYYY-MM-DD)
 * @param {boolean} allowFuture - Da li dozvoljava buduće datume
 * @returns {object} - {valid: boolean, error: string}
 */
function validateDatum(datum, allowFuture = false) {
    if (!datum) {
        return { valid: false, error: 'Datum je obavezan' };
    }
    
    const date = new Date(datum);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(date.getTime())) {
        return { valid: false, error: 'Neispravan format datuma' };
    }
    
    if (!allowFuture && date > today) {
        return { valid: false, error: 'Datum ne može biti u budućnosti' };
    }
    
    return { valid: true, error: null };
}

/**
 * Validira numeričku vrednost
 * @param {string|number} value - Vrednost za validaciju
 * @param {number} min - Minimalna vrednost
 * @param {number} max - Maksimalna vrednost
 * @param {boolean} required - Da li je obavezno polje
 * @returns {object} - {valid: boolean, error: string}
 */
function validateNumber(value, min = null, max = null, required = true) {
    if (required && (value === null || value === undefined || value === '')) {
        return { valid: false, error: 'Polje je obavezno' };
    }
    
    if (!required && (value === null || value === undefined || value === '')) {
        return { valid: true, error: null };
    }
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
        return { valid: false, error: 'Morate uneti broj' };
    }
    
    if (min !== null && num < min) {
        return { valid: false, error: `Vrednost mora biti najmanje ${min}` };
    }
    
    if (max !== null && num > max) {
        return { valid: false, error: `Vrednost mora biti najviše ${max}` };
    }
    
    return { valid: true, error: null };
}

/**
 * Validira lozinku (minimalna dužina i snaga)
 * @param {string} password - Lozinka za validaciju
 * @param {number} minLength - Minimalna dužina
 * @returns {object} - {valid: boolean, error: string, strength: string}
 */
function validatePassword(password, minLength = 6) {
    if (!password) {
        return { valid: false, error: 'Lozinka je obavezna', strength: 'weak' };
    }
    
    if (password.length < minLength) {
        return { valid: false, error: `Lozinka mora imati najmanje ${minLength} karaktera`, strength: 'weak' };
    }
    
    let strength = 'weak';
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;
    
    if (score >= 3) strength = 'strong';
    else if (score >= 2) strength = 'medium';
    
    return { valid: true, error: null, strength };
}

/**
 * Sanitizuje HTML string (sprečava XSS)
 * @param {string} str - String za sanitizaciju
 * @returns {string} - Sanitizovani string
 */
function sanitizeHTML(str) {
    if (!str) return '';
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Validira username (samo slova, brojevi i underscore)
 * @param {string} username - Username za validaciju
 * @returns {object} - {valid: boolean, error: string}
 */
function validateUsername(username) {
    if (!username) {
        return { valid: false, error: 'Korisničko ime je obavezno' };
    }
    
    if (username.length < 3) {
        return { valid: false, error: 'Korisničko ime mora imati najmanje 3 karaktera' };
    }
    
    if (username.length > 20) {
        return { valid: false, error: 'Korisničko ime može imati najviše 20 karaktera' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, error: 'Korisničko ime može sadržati samo slova, brojeve i donju crtu' };
    }
    
    return { valid: true, error: null };
}

// Export funkcije
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateJMBG,
        validateEmail,
        validateTelefon,
        validateDatum,
        validateNumber,
        validatePassword,
        sanitizeHTML,
        validateUsername
    };
}

