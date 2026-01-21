// Utility funkcije za hash-ovanje lozinki
// Koristi Web Crypto API za SHA-256 hash-ovanje

/**
 * Hash-uje lozinku koristeći SHA-256 algoritam
 * @param {string} password - Plain text lozinka
 * @returns {Promise<string>} - Hash-ovana lozinka
 */
async function hashPassword(password) {
    if (!password) {
        throw new Error('Lozinka je obavezna');
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

/**
 * Poredi plain text lozinku sa hash-ovanom lozinkom
 * @param {string} password - Plain text lozinka
 * @param {string} hash - Hash-ovana lozinka
 * @returns {Promise<boolean>} - True ako se lozinke poklapaju
 */
async function verifyPassword(password, hash) {
    if (!password || !hash) {
        return false;
    }
    
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

// Export za Node.js ili modul sistem
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hashPassword, verifyPassword };
}

