// Storage utility za localStorage operacije

const STORAGE_KEY = 'bloodPressureMeasurements';

/**
 * Učitava sva merenja iz localStorage
 * @returns {Array} Niz merenja
 */
export function loadMeasurements() {
    try {
        // Proveri da li localStorage postoji
        if (typeof(Storage) === "undefined" || !localStorage) {
            console.warn('localStorage nije dostupan');
            return [];
        }
        
        const data = localStorage.getItem(STORAGE_KEY);
        console.log('Učitavanje podataka iz localStorage:', data);
        if (data) {
            const parsed = JSON.parse(data);
            console.log('Parsirani podaci:', parsed);
            return parsed;
        }
        console.log('Nema podataka u localStorage');
        return [];
    } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        return [];
    }
}

/**
 * Čuva merenja u localStorage
 * @param {Array} measurements - Niz merenja za čuvanje
 */
export function saveMeasurements(measurements) {
    try {
        // Proveri da li localStorage postoji i radi
        if (typeof(Storage) === "undefined") {
            console.error('localStorage nije podržan u ovom browseru');
            return false;
        }
        
        const jsonData = JSON.stringify(measurements);
        console.log('Čuvanje podataka:', jsonData);
        localStorage.setItem(STORAGE_KEY, jsonData);
        
        // Proveri da li je podatak zaista sačuvan
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === jsonData) {
            console.log('Podaci uspešno sačuvani u localStorage');
            return true;
        } else {
            console.error('Podaci nisu sačuvani - verifikacija neuspešna');
            return false;
        }
    } catch (error) {
        console.error('Greška pri čuvanju podataka:', error);
        // Ako je greška zbog kvote, pokušaj da obrišeš stara merenja
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage kvota prekoračena');
        }
        return false;
    }
}

/**
 * Dodaje novo merenje
 * @param {Object} measurement - Objekat merenja
 * @returns {boolean} Uspešnost operacije
 */
export function addMeasurement(measurement) {
    try {
        console.log('addMeasurement pozvan sa:', measurement);
        const measurements = loadMeasurements();
        console.log('Trenutna merenja:', measurements);
        const newMeasurement = {
            id: Date.now().toString(),
            ...measurement,
            createdAt: new Date().toISOString()
        };
        console.log('Novo merenje:', newMeasurement);
        measurements.push(newMeasurement);
        const result = saveMeasurements(measurements);
        console.log('Rezultat čuvanja:', result);
        console.log('Merenja nakon čuvanja:', loadMeasurements());
        return result;
    } catch (error) {
        console.error('Greška u addMeasurement:', error);
        return false;
    }
}

/**
 * Ažurira postojeće merenje
 * @param {string} id - ID merenja
 * @param {Object} updatedData - Ažurirani podaci
 * @returns {boolean} Uspešnost operacije
 */
export function updateMeasurement(id, updatedData) {
    const measurements = loadMeasurements();
    const index = measurements.findIndex(m => m.id === id);
    
    if (index === -1) {
        return false;
    }
    
    measurements[index] = {
        ...measurements[index],
        ...updatedData,
        updatedAt: new Date().toISOString()
    };
    
    return saveMeasurements(measurements);
}

/**
 * Briše merenje
 * @param {string} id - ID merenja
 * @returns {boolean} Uspešnost operacije
 */
export function deleteMeasurement(id) {
    const measurements = loadMeasurements();
    const filtered = measurements.filter(m => m.id !== id);
    return saveMeasurements(filtered);
}

/**
 * Eksportuje sva merenja kao JSON
 * @returns {string} JSON string
 */
export function exportMeasurements() {
    const measurements = loadMeasurements();
    return JSON.stringify(measurements, null, 2);
}

/**
 * Importuje merenja iz JSON stringa
 * @param {string} jsonString - JSON string sa merenjima
 * @returns {boolean} Uspešnost operacije
 */
export function importMeasurements(jsonString) {
    try {
        const measurements = JSON.parse(jsonString);
        if (Array.isArray(measurements)) {
            return saveMeasurements(measurements);
        }
        return false;
    } catch (error) {
        console.error('Greška pri importovanju podataka:', error);
        return false;
    }
}

/**
 * Briše sva merenja
 * @returns {boolean} Uspešnost operacije
 */
export function clearAllMeasurements() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Greška pri brisanju podataka:', error);
        return false;
    }
}
