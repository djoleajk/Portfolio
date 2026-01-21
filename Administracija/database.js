// IndexedDB Baza Podataka
const DB_NAME = 'AdminPreduzecaDB';
const DB_VERSION = 3;

let db = null;
let dbInitialized = false;

// Inicijalizacija baze podataka
function initDB() {
    return new Promise((resolve, reject) => {
        // Proveri da li je već inicijalizovana
        if (dbInitialized && db) {
            resolve(db);
            return;
        }
        
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Greška pri otvaranju baze:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            // Postavi db nakon što je upgrade završen
            db = request.result;
            window.db = db;
            dbInitialized = true;
            console.log('Baza podataka uspešno otvorena');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const dbUpgrade = event.target.result;
            
            // Store za radnike
            if (!dbUpgrade.objectStoreNames.contains('radnici')) {
                const radniciStore = dbUpgrade.createObjectStore('radnici', { keyPath: 'id', autoIncrement: false });
                radniciStore.createIndex('ime', 'ime', { unique: false });
                radniciStore.createIndex('jmbg', 'jmbg', { unique: true });
            }

            // Store za plate
            if (!dbUpgrade.objectStoreNames.contains('plate')) {
                const plateStore = dbUpgrade.createObjectStore('plate', { keyPath: 'id', autoIncrement: false });
                plateStore.createIndex('radnikId', 'radnikId', { unique: false });
                plateStore.createIndex('mesec', 'mesec', { unique: false });
                plateStore.createIndex('godina', 'godina', { unique: false });
            }

            // Store za godišnje odmore
            if (!dbUpgrade.objectStoreNames.contains('odmori')) {
                const odmoriStore = dbUpgrade.createObjectStore('odmori', { keyPath: 'id', autoIncrement: false });
                odmoriStore.createIndex('radnikId', 'radnikId', { unique: false });
                odmoriStore.createIndex('pocetak', 'pocetak', { unique: false });
            }

            // Store za ostale evidencije
            if (!dbUpgrade.objectStoreNames.contains('ostale')) {
                const ostaleStore = dbUpgrade.createObjectStore('ostale', { keyPath: 'id', autoIncrement: false });
                ostaleStore.createIndex('radnikId', 'radnikId', { unique: false });
                ostaleStore.createIndex('tip', 'tip', { unique: false });
            }

            // Store za korisnike
            if (!dbUpgrade.objectStoreNames.contains('korisnici')) {
                const korisniciStore = dbUpgrade.createObjectStore('korisnici', { keyPath: 'id', autoIncrement: false });
                korisniciStore.createIndex('username', 'username', { unique: true });
                korisniciStore.createIndex('email', 'email', { unique: true });
                korisniciStore.createIndex('radnikId', 'radnikId', { unique: false });
            } else {
                // Ažuriranje postojećeg store-a da doda radnikId indeks
                try {
                    const transaction = event.target.transaction || dbUpgrade.transaction(['korisnici'], 'readwrite');
                    const korisniciStore = transaction.objectStore('korisnici');
                    if (!korisniciStore.indexNames.contains('radnikId')) {
                        korisniciStore.createIndex('radnikId', 'radnikId', { unique: false });
                    }
                } catch (e) {
                    console.log('RadnikId indeks već postoji ili nije moguće kreirati');
                }
            }

            // Store za poruke/obaveštenja
            if (!dbUpgrade.objectStoreNames.contains('poruke')) {
                const porukeStore = dbUpgrade.createObjectStore('poruke', { keyPath: 'id', autoIncrement: true });
                porukeStore.createIndex('radnikId', 'radnikId', { unique: false });
                porukeStore.createIndex('datum', 'datum', { unique: false });
                porukeStore.createIndex('procitao', 'procitao', { unique: false });
            }

            // Store za zahteve za godišnji odmor
            if (!dbUpgrade.objectStoreNames.contains('zahteviOdmor')) {
                const zahteviStore = dbUpgrade.createObjectStore('zahteviOdmor', { keyPath: 'id', autoIncrement: true });
                zahteviStore.createIndex('radnikId', 'radnikId', { unique: false });
                zahteviStore.createIndex('status', 'status', { unique: false });
                zahteviStore.createIndex('datum', 'datum', { unique: false });
            }

            // Store za administrativne zahteve
            if (!dbUpgrade.objectStoreNames.contains('zahteviAdmin')) {
                const zahteviAdminStore = dbUpgrade.createObjectStore('zahteviAdmin', { keyPath: 'id', autoIncrement: true });
                zahteviAdminStore.createIndex('radnikId', 'radnikId', { unique: false });
                zahteviAdminStore.createIndex('status', 'status', { unique: false });
                zahteviAdminStore.createIndex('tip', 'tip', { unique: false });
                zahteviAdminStore.createIndex('datum', 'datum', { unique: false });
            }

            console.log('Baza podataka upgrade završen');
        };
    });
}

// Generičke CRUD operacije
async function getAll(storeName) {
    if (!db) {
        // Pokušaj da ponovo inicijalizuješ ako nije inicijalizovano
        if (!dbInitialized) {
            await initDB();
        }
        if (!db) {
            throw new Error('Baza podataka nije inicijalizovana');
        }
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getById(storeName, id) {
    if (!db) {
        throw new Error('Baza podataka nije inicijalizovana');
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function add(storeName, item) {
    if (!db) {
        throw new Error('Baza podataka nije inicijalizovana');
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function update(storeName, item) {
    if (!db) {
        throw new Error('Baza podataka nije inicijalizovana');
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function remove(storeName, id) {
    if (!db) {
        throw new Error('Baza podataka nije inicijalizovana');
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Specifične funkcije za radnike
async function getAllRadnici() {
    return getAll('radnici');
}

async function getRadnikById(id) {
    return getById('radnici', id);
}

async function addRadnik(radnik) {
    if (!radnik.id) {
        const radnici = await getAllRadnici();
        radnik.id = radnici.length > 0 ? Math.max(...radnici.map(r => r.id)) + 1 : 1;
    }
    return add('radnici', radnik);
}

async function updateRadnik(radnik) {
    return update('radnici', radnik);
}

async function deleteRadnik(id) {
    return remove('radnici', id);
}

// Specifične funkcije za plate
async function getAllPlate() {
    return getAll('plate');
}

async function getPlataById(id) {
    return getById('plate', id);
}

async function addPlata(plata) {
    if (!plata.id) {
        const plate = await getAllPlate();
        plata.id = plate.length > 0 ? Math.max(...plate.map(p => p.id)) + 1 : 1;
    }
    return add('plate', plata);
}

async function updatePlata(plata) {
    return update('plate', plata);
}

async function deletePlata(id) {
    return remove('plate', id);
}

// Specifične funkcije za godišnje odmore
async function getAllOdmori() {
    return getAll('odmori');
}

async function getOdmorById(id) {
    return getById('odmori', id);
}

async function addOdmor(odmor) {
    if (!odmor.id) {
        const odmori = await getAllOdmori();
        odmor.id = odmori.length > 0 ? Math.max(...odmori.map(o => o.id)) + 1 : 1;
    }
    return add('odmori', odmor);
}

async function updateOdmor(odmor) {
    return update('odmori', odmor);
}

async function deleteOdmor(id) {
    return remove('odmori', id);
}

// Specifične funkcije za ostale evidencije
async function getAllOstale() {
    return getAll('ostale');
}

async function getOstalaById(id) {
    return getById('ostale', id);
}

async function addOstala(evidencija) {
    if (!evidencija.id) {
        const ostale = await getAllOstale();
        evidencija.id = ostale.length > 0 ? Math.max(...ostale.map(e => e.id)) + 1 : 1;
    }
    return add('ostale', evidencija);
}

async function updateOstala(evidencija) {
    return update('ostale', evidencija);
}

async function deleteOstala(id) {
    return remove('ostale', id);
}

// Specifične funkcije za korisnike
async function getAllKorisnici() {
    return getAll('korisnici');
}

async function getKorisnikById(id) {
    return getById('korisnici', id);
}

async function getKorisnikByUsername(username) {
    if (!db) {
        // Pokušaj da ponovo inicijalizuješ ako nije inicijalizovano
        if (!dbInitialized) {
            await initDB();
        }
        if (!db) {
            throw new Error('Baza podataka nije inicijalizovana');
        }
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['korisnici'], 'readonly');
        const store = transaction.objectStore('korisnici');
        const index = store.index('username');
        const request = index.get(username);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getKorisnikByRadnikId(radnikId) {
    if (!db) {
        throw new Error('Baza podataka nije inicijalizovana');
    }
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['korisnici'], 'readonly');
        const store = transaction.objectStore('korisnici');
        const index = store.index('radnikId');
        const request = index.get(radnikId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function addKorisnik(korisnik) {
    if (!korisnik.id) {
        const korisnici = await getAllKorisnici();
        korisnik.id = korisnici.length > 0 ? Math.max(...korisnici.map(k => k.id)) + 1 : 1;
    }
    return add('korisnici', korisnik);
}

async function updateKorisnik(korisnik) {
    return update('korisnici', korisnik);
}

async function deleteKorisnik(id) {
    return remove('korisnici', id);
}

// Specifične funkcije za poruke/obaveštenja
async function getAllPoruke() {
    return getAll('poruke');
}

async function getPorukaById(id) {
    return getById('poruke', id);
}

async function addPoruka(poruka) {
    return add('poruke', poruka);
}

async function updatePoruka(poruka) {
    return update('poruke', poruka);
}

async function deletePoruka(id) {
    return remove('poruke', id);
}

// Specifične funkcije za zahteve za godišnji odmor
async function getAllZahteviOdmor() {
    return getAll('zahteviOdmor');
}

async function getZahtevOdmorById(id) {
    return getById('zahteviOdmor', id);
}

async function addZahtevOdmor(zahtev) {
    return add('zahteviOdmor', zahtev);
}

async function updateZahtevOdmor(zahtev) {
    return update('zahteviOdmor', zahtev);
}

async function deleteZahtevOdmor(id) {
    return remove('zahteviOdmor', id);
}

// Specifične funkcije za administrativne zahteve
async function getAllZahteviAdmin() {
    return getAll('zahteviAdmin');
}

async function getZahtevAdminById(id) {
    return getById('zahteviAdmin', id);
}

async function addZahtevAdmin(zahtev) {
    return add('zahteviAdmin', zahtev);
}

async function updateZahtevAdmin(zahtev) {
    return update('zahteviAdmin', zahtev);
}

async function deleteZahtevAdmin(id) {
    return remove('zahteviAdmin', id);
}

// Inicijalizacija default podataka
async function initDefaultData() {
    console.log('Inicijalizacija default podataka...');
    
    const korisnici = await getAllKorisnici();
    console.log('Pronađeno korisnika u bazi:', korisnici.length);
    
    // Proveri da li postoje admin i user korisnici
    const adminExists = korisnici.find(k => k.username === 'admin');
    const userExists = korisnici.find(k => k.username === 'user');
    
    // Hash-uj lozinke pre čuvanja
    let adminPassword = 'admin123';
    let userPassword = 'user123';
    
    if (typeof hashPassword !== 'undefined') {
        adminPassword = await hashPassword(adminPassword);
        userPassword = await hashPassword(userPassword);
        console.log('Lozinke hash-ovane');
    } else {
        console.warn('Hash funkcije nisu dostupne, koristiće se plain text');
    }
    
    // Kreiraj ili ažuriraj admin korisnika
    // Koristimo updateKorisnik (put) koji će kreirati ili ažurirati
    console.log('Kreiranje/ažuriranje admin korisnika...');
    await updateKorisnik({
        id: 1,
        username: 'admin',
        password: adminPassword,
        ime: 'Administrator',
        email: 'admin@preduzece.rs',
        uloga: 'admin'
    });
    console.log('Admin korisnik kreiran/ažuriran');

    // Kreiraj ili ažuriraj urednik korisnika
    // Koristimo updateKorisnik (put) koji će kreirati ili ažurirati
    console.log('Kreiranje/ažuriranje urednik korisnika...');
    await updateKorisnik({
        id: 2,
        username: 'user',
        password: userPassword,
        ime: 'Urednik',
        email: 'user@preduzece.rs',
        uloga: 'urednik'
    });
    console.log('Urednik korisnik kreiran/ažuriran');
    
    console.log('Default podaci inicijalizovani');
}

// Funkcija za resetovanje lozinki korisnika (za debug/testiranje)
async function resetUserPasswords() {
    console.log('Resetovanje lozinki korisnika...');
    
    let adminPassword = 'admin123';
    let userPassword = 'user123';
    
    if (typeof hashPassword !== 'undefined') {
        adminPassword = await hashPassword(adminPassword);
        userPassword = await hashPassword(userPassword);
    }
    
    const korisnici = await getAllKorisnici();
    const admin = korisnici.find(k => k.username === 'admin');
    const user = korisnici.find(k => k.username === 'user');
    
    if (admin) {
        await updateKorisnik({
            ...admin,
            password: adminPassword
        });
        console.log('Admin lozinka resetovana');
    }
    
    if (user) {
        await updateKorisnik({
            ...user,
            password: userPassword
        });
        console.log('User lozinka resetovana');
    }
    
    console.log('Lozinke resetovane');
}

// Eksportuj funkciju globalno za debug
if (typeof window !== 'undefined') {
    window.resetUserPasswords = resetUserPasswords;
}
