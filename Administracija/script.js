// Globalne promenljive za podatke
let radnici = [];
let plate = [];
let odmori = [];
let ostale = [];
let korisnici = [];
let poruke = [];
let zahteviOdmor = [];
let zahteviAdmin = [];

// Inicijalizacija aplikacije
async function initApp() {
    try {
        // Inicijalizuj bazu podataka i sačekaj da se završi
        const dbInstance = await initDB();
        console.log('Baza podataka inicijalizovana:', dbInstance);
        
        // Sačekaj malo da se baza potpuno inicijalizuje
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Inicijalizuj default podatke
        await initDefaultData();
        
        // Verifikuj da su korisnici kreirani
        korisnici = await getAllKorisnici();
        console.log('Korisnici nakon inicijalizacije:', korisnici.map(k => ({ username: k.username, passwordLength: k.password ? k.password.length : 0 })));
        
        // Učitaj korisnike za login proveru
        korisnici = await getAllKorisnici();
        console.log('Učitani korisnici:', korisnici.length);
        
        // Učitaj sesiju ako postoji
        loadSession();
        
        // Postavi login form event listener
        setupLoginForm();
        
        // Inicijalizuj detekciju uređaja
        if (typeof initDeviceDetection !== 'undefined') {
            initDeviceDetection();
        }
        
        // Postavi mobilni interfejs
        setupMobileInterface();
        
        // Proveri da li je korisnik prijavljen
        if (isLoggedIn()) {
            showMainApp();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Greška pri inicijalizaciji:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Greška pri inicijalizaciji aplikacije: ' + error.message);
        } else {
            alert('Greška pri inicijalizaciji aplikacije: ' + error.message);
        }
    }
}

function showLogin() {
    document.getElementById('login-modal').classList.add('active');
    document.getElementById('main-container').style.display = 'none';
}

function showMainApp() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    updateUIForRole();
    loadAllData();
    
    // Postavi mobilni interfejs nakon prikazivanja aplikacije
    setTimeout(() => {
        if (typeof setupMobileInterface !== 'undefined') {
            setupMobileInterface();
        }
    }, 100);
}

// Login forma - postavi event listener kada je DOM spreman
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error('Login forma nije pronađena!');
        return;
    }
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            if (typeof toast !== 'undefined') {
                toast.warning('Molimo unesite korisničko ime i lozinku');
            } else {
                alert('Molimo unesite korisničko ime i lozinku');
            }
            return;
        }
        
        try {
            await login(username, password);
            showMainApp();
            if (typeof toast !== 'undefined') {
                toast.success('Uspešno ste prijavljeni!');
            }
        } catch (error) {
            console.error('Login greška:', error);
            if (typeof toast !== 'undefined') {
                toast.error(error.message || 'Greška pri prijavljivanju');
            } else {
                alert(error.message || 'Greška pri prijavljivanju');
            }
        }
    });
}

// Tab navigacija
function switchTab(tabName) {
    // Ukloni active klasu sa svih tabova i content-a
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mobile-bottom-nav-item').forEach(b => b.classList.remove('active'));
    
    // Dodaj active klasu na kliknuti tab i content
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    const mobileNavBtn = document.querySelector(`.mobile-nav-item[data-tab="${tabName}"]`);
    const mobileBottomNavBtn = document.querySelector(`.mobile-bottom-nav-item[data-tab="${tabName}"]`);
    
    if (tabBtn) tabBtn.classList.add('active');
    if (mobileNavBtn) mobileNavBtn.classList.add('active');
    if (mobileBottomNavBtn) mobileBottomNavBtn.classList.add('active');
    
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Ažuriraj mobilni header title
    updateMobileHeaderTitle(tabName);
    
    // Zatvori mobilni sidebar ako je otvoren
    closeMobileSidebar();
    
    // Ako je dashboard tab, renderuj ga
    if (tabName === 'dashboard' && typeof renderDashboard !== 'undefined') {
        renderDashboard();
    }
}

// Funkcija za ažuriranje mobilnog header title-a
function updateMobileHeaderTitle(tabName) {
    const titleMap = {
        'dashboard': 'Dashboard',
        'radnici': 'Radnici',
        'plate': 'Plate Liste',
        'odmori': 'Godišnji Odmori',
        'odmori-pregled': 'Pregled Odmora',
        'ostale': 'Ostale Evidencije',
        'poruke': 'Poruke',
        'zahtevi': 'Zahtevi',
        'korisnici': 'Korisnici',
        'radnik-profil': 'Moj Profil',
        'radnik-plate': 'Moje Plate',
        'radnik-odmori': 'Moji Odmori',
        'radnik-evidencije': 'Moje Evidencije',
        'radnik-poruke': 'Poruke',
        'radnik-zahtevi': 'Moji Zahtevi',
        'user-profil': 'Moj Profil',
        'user-zahtevi': 'Moji Zahtevi',
        'user-poruke': 'Poruke'
    };
    
    const mobileHeaderTitle = document.getElementById('mobile-header-title');
    if (mobileHeaderTitle) {
        mobileHeaderTitle.textContent = titleMap[tabName] || 'Administracija';
    }
}

// Mobilni sidebar funkcije
function toggleMobileSidebar() {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('mobile-sidebar-overlay');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (sidebar && overlay && menuBtn) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        menuBtn.classList.toggle('active');
        
        // Spreči scroll dok je sidebar otvoren
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('mobile-sidebar-overlay');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (sidebar && overlay && menuBtn) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Mobilni user menu funkcije
function toggleMobileUserMenu() {
    const userMenu = document.getElementById('mobile-user-menu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

// Zatvori user menu kada se klikne van njega
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('mobile-user-menu');
    const userMenuBtn = document.querySelector('.mobile-header-actions button:last-child');
    
    if (userMenu && userMenuBtn && !userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
        userMenu.classList.remove('active');
    }
});

// Zatvori sidebar kada se klikne van njega (overlay)
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('mobile-sidebar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-sidebar-overlay');
    
    if (sidebar && overlay && overlay.contains(e.target)) {
        closeMobileSidebar();
    }
});

// Funkcija za prebacivanje između desktop i mobilnog interfejsa
function setupMobileInterface() {
    if (typeof isMobileDevice === 'undefined') {
        console.warn('Device detector nije učitan');
        return;
    }
    
    const isMobile = isMobileDevice();
    const desktopHeader = document.querySelector('.desktop-header');
    const mobileHeader = document.querySelector('.mobile-header');
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileBottomNav = document.getElementById('mobile-bottom-nav');
    
    if (isMobile) {
        // Prikaži mobilni interfejs
        if (desktopHeader) desktopHeader.style.display = 'none';
        if (mobileHeader) mobileHeader.style.display = 'block';
        if (desktopNav) desktopNav.style.display = 'none';
        if (mobileBottomNav) mobileBottomNav.style.display = 'flex';
        
        // Dodaj padding za bottom nav
        document.body.style.paddingBottom = '70px';
    } else {
        // Prikaži desktop interfejs
        if (desktopHeader) desktopHeader.style.display = 'block';
        if (mobileHeader) mobileHeader.style.display = 'none';
        if (desktopNav) desktopNav.style.display = 'flex';
        if (mobileBottomNav) mobileBottomNav.style.display = 'none';
        
        // Ukloni padding
        document.body.style.paddingBottom = '';
        
        // Zatvori sidebar ako je otvoren
        closeMobileSidebar();
    }
}

// Event listener za promenu veličine prozora
window.addEventListener('deviceTypeChanged', setupMobileInterface);
window.addEventListener('resize', () => {
    setTimeout(setupMobileInterface, 100);
});

// Tab navigacija
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// Učitavanje svih podataka iz baze
async function loadAllData() {
    try {
        radnici = await getAllRadnici();
        plate = await getAllPlate();
        odmori = await getAllOdmori();
        ostale = await getAllOstale();
        korisnici = await getAllKorisnici(); // Učitaj korisnike za sve
        
        // Automatsko ažuriranje statusa odmora - označi kao "Završen" ako je prošao datum završetka
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        
        for (const odmor of odmori) {
            if (odmor.status === 'Odobren' || odmor.status === 'U toku' || odmor.status === 'Planiran') {
                const zavrsetakDate = new Date(odmor.zavrsetak + 'T00:00:00');
                if (zavrsetakDate < danas) {
                    // Automatski označi kao završen ako je prošao datum završetka
                    await updateOdmor({ ...odmor, status: 'Završen' });
                }
            }
        }
        
        // Ponovo učitaj odmore nakon ažuriranja
        odmori = await getAllOdmori();
        
        // Učitaj opcione podatke ako postoje store-ovi
        try {
            poruke = await getAllPoruke();
        } catch (e) {
            poruke = [];
        }
        
        try {
            zahteviOdmor = await getAllZahteviOdmor();
        } catch (e) {
            zahteviOdmor = [];
        }
        
        try {
            zahteviAdmin = await getAllZahteviAdmin();
        } catch (e) {
            zahteviAdmin = [];
        }
        
        renderAll();
    } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
    }
}

// Renderovanje tabela
async function renderRadnici() {
    // PRIVATNOST: Samo administrator vidi sve radnike
    if (!isAdmin()) {
        const tbody = document.getElementById('radnici-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled radnika</td></tr>';
        }
        return;
    }
    
    const tbody = document.getElementById('radnici-tbody');
    tbody.innerHTML = '';
    
    if (radnici.length === 0) {
        const colspan = isAdmin() ? 9 : 8;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align: center; padding: 30px; color: #999;">Nema unetih radnika</td></tr>`;
        return;
    }
    
    // Koristimo Promise.all za asinhrono proveravanje naloga
    const rows = await Promise.all(radnici.map(async (radnik) => {
        const actionsCell = isAdmin() ? `
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editRadnik(${radnik.id})">Izmeni</button>
                    <button class="btn btn-danger" onclick="deleteRadnikHandler(${radnik.id})">Obriši</button>
                </div>
            </td>
        ` : '';
        
        // Proveri da li radnik ima nalog
        const korisnik = await getKorisnikByRadnikId(radnik.id);
        const nalogCell = isAdmin() ? `
            <td>
                ${korisnik ? 
                    `<span style="color: green;">✓ Ima nalog</span>` : 
                    `<button class="btn btn-primary btn-sm" onclick="createAccountForRadnik(${radnik.id})">Kreiraj Nalog</button>`
                }
            </td>
        ` : '';
        
        return `
            <tr>
                <td>${radnik.id}</td>
                <td><a href="#" class="clickable-name" onclick="showKorisnikProfilByRadnikId(${radnik.id}); return false;" style="color: #667eea; text-decoration: none; cursor: pointer; font-weight: 500;">${radnik.ime}</a></td>
                <td>${radnik.jmbg}</td>
                <td>${radnik.telefon}</td>
                <td>${radnik.email}</td>
                <td>${radnik.pozicija}</td>
                <td>${formatDate(radnik.datum)}</td>
                ${actionsCell}
                ${nalogCell}
            </tr>
        `;
    }));
    
    tbody.innerHTML = rows.join('');
}

async function renderPlate() {
    // PRIVATNOST: Samo administrator vidi sve plate
    if (!isAdmin()) {
        const tbody = document.getElementById('plate-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled plata</td></tr>';
        }
        return;
    }
    
    const tbody = document.getElementById('plate-tbody');
    tbody.innerHTML = '';
    
    if (plate.length === 0) {
        const colspan = isAdmin() ? 9 : 8;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align: center; padding: 30px; color: #999;">Nema unetih plata</td></tr>`;
        return;
    }
    
    plate.forEach(plata => {
        const radnik = radnici.find(r => r.id === plata.radnikId);
        // Pronađi korisničko ime radnika ako radnik ima nalog
        let radnikKorisnickoIme = radnik ? radnik.ime : 'Nepoznat';
        if (radnik) {
            const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
            if (radnikKorisnik) {
                radnikKorisnickoIme = radnikKorisnik.username;
            }
        }
        const osnovna = parseFloat(plata.osnovna) || 0;
        const bonusi = parseFloat(plata.bonusi) || 0;
        const prekovremeni = parseFloat(plata.prekovremeni) || 0;
        const nocni = parseFloat(plata.nocni) || 0;
        const praznicki = parseFloat(plata.praznicki) || 0;
        const regres = parseFloat(plata.regres) || 0;
        const staz = parseFloat(plata.staz) || 0;
        const ukupnoDobitci = osnovna + bonusi + prekovremeni + nocni + praznicki + regres + staz;
        
        const pio = parseFloat(plata.pio) || 0;
        const zo = parseFloat(plata.zo) || 0;
        const nezaposlenost = parseFloat(plata.nezaposlenost) || 0;
        const porez = parseFloat(plata.porez) || 0;
        const doprinosi = parseFloat(plata.doprinosi) || 0;
        const dugovanja = parseFloat(plata.dugovanja) || 0;
        const ostaliOdbitci = parseFloat(plata.ostaliOdbitci) || 0;
        const ukupnoOdbitci = pio + zo + nezaposlenost + porez + doprinosi + dugovanja + ostaliOdbitci;
        
        const ukupno = ukupnoDobitci - ukupnoOdbitci;
        const mesecNaziv = getMonthName(plata.mesec);
        const actionsCell = isAdmin() ? `
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editPlata(${plata.id})">Izmeni</button>
                    <button class="btn btn-danger" onclick="deletePlataHandler(${plata.id})">Obriši</button>
                </div>
            </td>
        ` : '';
        
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.onclick = () => showPlataDetalj(plata);
        row.innerHTML = `
            <td>${plata.id}</td>
            <td><a href="#" class="clickable-name" onclick="event.stopPropagation(); showKorisnikProfilByRadnikId(${plata.radnikId}); return false;" style="color: #667eea; text-decoration: none; cursor: pointer; font-weight: 500;">${radnikKorisnickoIme}</a></td>
            <td>${mesecNaziv}</td>
            <td>${plata.godina}</td>
            <td>${formatCurrency(osnovna)}</td>
            <td>${formatCurrency(bonusi)}</td>
            <td>${formatCurrency(doprinosi)}</td>
            <td><strong>${formatCurrency(ukupno)}</strong></td>
            ${actionsCell}
        `;
        tbody.appendChild(row);
    });
}

async function renderOdmori() {
    // PRIVATNOST: Samo administrator vidi sve odmore
    if (!isAdmin()) {
        const tbody = document.getElementById('odmori-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled godišnjih odmora</td></tr>';
        }
        return;
    }
    
    const tbody = document.getElementById('odmori-tbody');
    tbody.innerHTML = '';
    
    if (odmori.length === 0) {
        const colspan = isAdmin() ? 7 : 6;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align: center; padding: 30px; color: #999;">Nema unetih godišnjih odmora</td></tr>`;
        return;
    }
    
    odmori.forEach(odmor => {
        const radnik = radnici.find(r => r.id === odmor.radnikId);
        // Pronađi korisničko ime radnika ako radnik ima nalog
        let radnikKorisnickoIme = radnik ? radnik.ime : 'Nepoznat';
        if (radnik) {
            const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
            if (radnikKorisnik) {
                radnikKorisnickoIme = radnikKorisnik.username;
            }
        }
        const brojDana = calculateDays(odmor.pocetak, odmor.zavrsetak);
        const statusClass = `status-${odmor.status.toLowerCase().replace(' ', '-')}`;
        const actionsCell = isAdmin() ? `
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editOdmor(${odmor.id})">Izmeni</button>
                    <button class="btn btn-danger" onclick="deleteOdmorHandler(${odmor.id})">Obriši</button>
                </div>
            </td>
        ` : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${odmor.id}</td>
            <td><a href="#" class="clickable-name" onclick="showKorisnikProfilByRadnikId(${odmor.radnikId}); return false;" style="color: #667eea; text-decoration: none; cursor: pointer; font-weight: 500;">${radnikKorisnickoIme}</a></td>
            <td>${formatDate(odmor.pocetak)}</td>
            <td>${formatDate(odmor.zavrsetak)}</td>
            <td>${brojDana}</td>
            <td><span class="status-badge ${statusClass}">${odmor.status}</span></td>
            ${actionsCell}
        `;
        tbody.appendChild(row);
    });
}

async function renderOstale() {
    // PRIVATNOST: Samo administrator vidi sve evidencije
    if (!isAdmin()) {
        const tbody = document.getElementById('ostale-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled evidencija</td></tr>';
        }
        return;
    }
    
    const tbody = document.getElementById('ostale-tbody');
    tbody.innerHTML = '';
    
    if (ostale.length === 0) {
        const colspan = isAdmin() ? 6 : 5;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align: center; padding: 30px; color: #999;">Nema unetih evidencija</td></tr>`;
        return;
    }
    
    ostale.forEach(evidencija => {
        const radnik = radnici.find(r => r.id === evidencija.radnikId);
        // Pronađi korisničko ime radnika ako radnik ima nalog
        let radnikKorisnickoIme = radnik ? radnik.ime : 'Nepoznat';
        if (radnik) {
            const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
            if (radnikKorisnik) {
                radnikKorisnickoIme = radnikKorisnik.username;
            }
        }
        const actionsCell = isAdmin() ? `
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editOstala(${evidencija.id})">Izmeni</button>
                    <button class="btn btn-danger" onclick="deleteOstalaHandler(${evidencija.id})">Obriši</button>
                </div>
            </td>
        ` : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evidencija.id}</td>
            <td>${evidencija.tip}</td>
            <td><a href="#" class="clickable-name" onclick="showKorisnikProfilByRadnikId(${evidencija.radnikId}); return false;" style="color: #667eea; text-decoration: none; cursor: pointer; font-weight: 500;">${radnikKorisnickoIme}</a></td>
            <td>${formatDate(evidencija.datum)}</td>
            <td>${evidencija.opis}</td>
            ${actionsCell}
        `;
        tbody.appendChild(row);
    });
}

async function renderKorisnici() {
    // PRIVATNOST: Samo administrator vidi sve korisnike
    if (!isAdmin()) {
        const tbody = document.getElementById('korisnici-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled korisnika</td></tr>';
        }
        return;
    }
    
    const tbody = document.getElementById('korisnici-tbody');
    tbody.innerHTML = '';
    
    if (korisnici.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">Nema unetih korisnika</td></tr>';
        return;
    }
    
    korisnici.forEach(korisnik => {
        const radnik = korisnik.radnikId ? radnici.find(r => r.id === korisnik.radnikId) : null;
        // Pronađi korisničko ime radnika ako radnik ima nalog
        let radnikKorisnickoIme = '-';
        if (radnik) {
            const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
            radnikKorisnickoIme = radnikKorisnik ? radnikKorisnik.username : radnik.ime;
        }
        let roleText = 'Urednik';
        if (korisnik.uloga === 'admin') roleText = 'Administrator';
        else if (korisnik.uloga === 'radnik') roleText = 'Radnik';
        else if (korisnik.uloga === 'urednik') roleText = 'Urednik';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${korisnik.id}</td>
            <td>${korisnik.username}</td>
            <td><a href="#" class="clickable-name" onclick="showKorisnikProfil(${korisnik.id}); return false;" style="color: #667eea; text-decoration: none; cursor: pointer; font-weight: 500;">${korisnik.ime}</a></td>
            <td><span class="role-badge role-${korisnik.uloga}">${roleText}</span></td>
            <td>${radnikKorisnickoIme}</td>
            <td>${korisnik.email}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editKorisnik(${korisnik.id})">Izmeni</button>
                    <button class="btn btn-danger" onclick="deleteKorisnikHandler(${korisnik.id})">Obriši</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal funkcije
function openModal(type) {
    // Korisnik može otvoriti modale za zahteve
    if (!isAdmin() && type !== 'radnik-zahtev-odmor' && type !== 'radnik-zahtev-admin' && type !== 'user-zahtev-admin') {
        if (isRadnik() && (type === 'radnik-zahtev-odmor' || type === 'radnik-zahtev-admin')) {
            // Radnik može otvoriti svoje modale - nastavi
        } else if (isUser() && type === 'user-zahtev-admin') {
            // User može otvoriti svoje modale - nastavi
        } else {
            if (typeof toast !== 'undefined') {
                toast.warning('Nemate dozvolu za ovu akciju');
            } else {
                alert('Nemate dozvolu za ovu akciju');
            }
            return;
        }
    }
    
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.style.display = 'block';
        
        // Popuni select liste sa radnicima gde je potrebno
        if (type === 'plate' || type === 'odmori' || type === 'ostale') {
            populateRadnikSelect(`select#${type}-radnik`);
            // Inicijalizuj proveru naloga za slanje dokumenta
            if (type === 'plate') {
                checkRadnikAccountAndShowSendOption('plate-radnik', 'plate-send-document-group');
            } else if (type === 'odmori') {
                checkRadnikAccountAndShowSendOption('odmori-radnik', 'odmori-send-document-group');
            } else if (type === 'ostale') {
                checkRadnikAccountAndShowSendOption('ostale-radnik', 'ostale-send-document-group');
            }
        }
        
        if (type === 'poruke') {
            populateRadnikSelect('select#poruke-radnik');
        }
        
        // Za korisnike, popuni select za radnike ako je uloga radnik
        if (type === 'korisnici') {
            const ulogaSelect = document.getElementById('korisnici-uloga');
            const radnikSelectGroup = document.getElementById('radnik-select-group');
            const radnikSelect = document.getElementById('korisnici-radnik');
            
            ulogaSelect.addEventListener('change', function() {
                if (this.value === 'radnik') {
                    radnikSelectGroup.style.display = 'block';
                    populateRadnikSelect('select#korisnici-radnik');
                } else {
                    radnikSelectGroup.style.display = 'none';
                    radnikSelect.value = '';
                }
            });
            
            // Proveri trenutnu vrednost
            if (ulogaSelect.value === 'radnik') {
                radnikSelectGroup.style.display = 'block';
                populateRadnikSelect('select#korisnici-radnik');
            }
        }
        
        // Za radnike, sakrij/create account group ako je edit
        if (type === 'radnici') {
            const idInput = document.getElementById('radnici-id');
            const createAccountGroup = document.getElementById('radnici-create-account-group');
            if (idInput && idInput.value) {
                createAccountGroup.style.display = 'none';
            } else {
                createAccountGroup.style.display = 'block';
            }
        }
        
        // Resetuj formu
        const form = document.getElementById(`form-${type}`);
        if (form) {
            form.reset();
            const idInput = document.getElementById(`${type}-id`);
            if (idInput) idInput.value = '';
        }
    }
}

// Funkcija za otvaranje restore modal-a
function openRestoreModal() {
    openModal('restore');
}

function closeModal(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.style.display = 'none';
    }
}

function populateRadnikSelect(selector) {
    const select = document.querySelector(selector);
    if (!select) return;
    
    select.innerHTML = '<option value="">Izaberi radnika</option>';
    
    radnici.forEach(radnik => {
        const option = document.createElement('option');
        option.value = radnik.id;
        option.textContent = radnik.ime;
        select.appendChild(option);
    });
}

// Radnici CRUD
async function editRadnik(id) {
    if (!isAdmin()) return;
    
    const radnik = await getRadnikById(id);
    if (!radnik) return;
    
    document.getElementById('radnici-id').value = radnik.id;
    document.getElementById('radnici-ime').value = radnik.ime;
    document.getElementById('radnici-jmbg').value = radnik.jmbg;
    document.getElementById('radnici-telefon').value = radnik.telefon;
    document.getElementById('radnici-email').value = radnik.email;
    document.getElementById('radnici-pozicija').value = radnik.pozicija;
    document.getElementById('radnici-datum').value = radnik.datum;
    
    // Sakrij create account group za edit
    document.getElementById('radnici-create-account-group').style.display = 'none';
    document.getElementById('radnici-account-fields').style.display = 'none';
    
    openModal('radnici');
}

async function deleteRadnikHandler(id) {
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za brisanje radnika iz registra');
        } else {
            alert('Nemate dozvolu za brisanje radnika iz registra');
        }
        return;
    }
    
    if (confirm('Da li ste sigurni da želite da obrišete ovog radnika?')) {
        try {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.show('Brisanje radnika...');
            }
            
            await deleteRadnik(id);
            // Obriši i sve vezane podatke
            const plateToDelete = plate.filter(p => p.radnikId === id);
            const odmoriToDelete = odmori.filter(o => o.radnikId === id);
            const ostaleToDelete = ostale.filter(e => e.radnikId === id);
            
            for (const p of plateToDelete) await deletePlata(p.id);
            for (const o of odmoriToDelete) await deleteOdmor(o.id);
            for (const e of ostaleToDelete) await deleteOstala(e.id);
            
            await loadAllData();
            
            if (typeof toast !== 'undefined') {
                toast.success('Radnik je uspešno obrisan!');
            } else {
                alert('Radnik je uspešno obrisan!');
            }
        } catch (error) {
            console.error('Greška pri brisanju:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Greška pri brisanju: ' + error.message);
            } else {
                alert('Greška pri brisanju: ' + error.message);
            }
        } finally {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.hide();
            }
        }
    }
}

// Plate CRUD
async function editPlata(id) {
    if (!isAdmin()) return;
    
    const plata = await getPlataById(id);
    if (!plata) return;
    
    document.getElementById('plate-id').value = plata.id;
    document.getElementById('plate-radnik').value = plata.radnikId;
    document.getElementById('plate-mesec').value = plata.mesec;
    document.getElementById('plate-godina').value = plata.godina;
    document.getElementById('plate-osnovna').value = plata.osnovna || 0;
    document.getElementById('plate-bonusi').value = plata.bonusi || 0;
    document.getElementById('plate-prekovremeni').value = plata.prekovremeni || 0;
    document.getElementById('plate-nocni').value = plata.nocni || 0;
    document.getElementById('plate-praznicki').value = plata.praznicki || 0;
    document.getElementById('plate-regres').value = plata.regres || 0;
    document.getElementById('plate-staz').value = plata.staz || 0;
    document.getElementById('plate-pio').value = plata.pio || 0;
    document.getElementById('plate-zo').value = plata.zo || 0;
    document.getElementById('plate-nezaposlenost').value = plata.nezaposlenost || 0;
    document.getElementById('plate-porez').value = plata.porez || 0;
    document.getElementById('plate-doprinosi').value = plata.doprinosi || 0;
    document.getElementById('plate-dugovanja').value = plata.dugovanja || 0;
    document.getElementById('plate-ostali-odbitci').value = plata.ostaliOdbitci || 0;
    document.getElementById('plate-send-document').checked = false; // Reset checkbox
    
    populateRadnikSelect('select#plate-radnik');
    await checkRadnikAccountAndShowSendOption('plate-radnik', 'plate-send-document-group');
    openModal('plate');
}

async function deletePlataHandler(id) {
    if (!isAdmin()) return;
    
    if (confirm('Da li ste sigurni da želite da obrišete ovu platu?')) {
        try {
            await deletePlata(id);
            await loadAllData();
        } catch (error) {
            alert('Greška pri brisanju: ' + error.message);
        }
    }
}

// Odmori CRUD
async function editOdmor(id) {
    if (!isAdmin()) return;
    
    const odmor = await getOdmorById(id);
    if (!odmor) return;
    
    document.getElementById('odmori-id').value = odmor.id;
    document.getElementById('odmori-radnik').value = odmor.radnikId;
    document.getElementById('odmori-pocetak').value = odmor.pocetak;
    document.getElementById('odmori-zavrsetak').value = odmor.zavrsetak;
    document.getElementById('odmori-status').value = odmor.status;
    document.getElementById('odmori-send-document').checked = false; // Reset checkbox
    
    populateRadnikSelect('select#odmori-radnik');
    await checkRadnikAccountAndShowSendOption('odmori-radnik', 'odmori-send-document-group');
    openModal('odmori');
}

async function deleteOdmorHandler(id) {
    if (!isAdmin()) return;
    
    if (confirm('Da li ste sigurni da želite da obrišete ovaj godišnji odmor?')) {
        try {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.show('Brisanje odmora...');
            }
            
            await deleteOdmor(id);
            await loadAllData();
            
            if (typeof toast !== 'undefined') {
                toast.success('Godišnji odmor je uspešno obrisan!');
            } else {
                alert('Godišnji odmor je uspešno obrisan!');
            }
        } catch (error) {
            console.error('Greška pri brisanju:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Greška pri brisanju: ' + error.message);
            } else {
                alert('Greška pri brisanju: ' + error.message);
            }
        } finally {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.hide();
            }
        }
    }
}

// Ostale evidencije CRUD
async function editOstala(id) {
    if (!isAdmin()) return;
    
    const evidencija = await getOstalaById(id);
    if (!evidencija) return;
    
    document.getElementById('ostale-id').value = evidencija.id;
    document.getElementById('ostale-tip').value = evidencija.tip;
    document.getElementById('ostale-radnik').value = evidencija.radnikId;
    document.getElementById('ostale-datum').value = evidencija.datum;
    document.getElementById('ostale-opis').value = evidencija.opis;
    document.getElementById('ostale-send-document').checked = false; // Reset checkbox
    
    populateRadnikSelect('select#ostale-radnik');
    await checkRadnikAccountAndShowSendOption('ostale-radnik', 'ostale-send-document-group');
    openModal('ostale');
}

async function deleteOstalaHandler(id) {
    if (!isAdmin()) return;
    
    if (confirm('Da li ste sigurni da želite da obrišete ovu evidenciju?')) {
        try {
            await deleteOstala(id);
            await loadAllData();
        } catch (error) {
            alert('Greška pri brisanju: ' + error.message);
        }
    }
}

// Korisnici CRUD
async function editKorisnik(id) {
    // PRIVATNOST: Samo administrator može da menja korisnike
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za izmenu korisnika');
        } else {
            alert('Nemate dozvolu za izmenu korisnika');
        }
        return;
    }
    
    const korisnik = await getKorisnikById(id);
    if (!korisnik) return;
    
    document.getElementById('korisnici-id').value = korisnik.id;
    document.getElementById('korisnici-username').value = korisnik.username;
    document.getElementById('korisnici-password').value = '';
    document.getElementById('korisnici-ime').value = korisnik.ime;
    document.getElementById('korisnici-email').value = korisnik.email;
    document.getElementById('korisnici-uloga').value = korisnik.uloga;
    
    // Ažuriraj radnik select
    const radnikSelectGroup = document.getElementById('radnik-select-group');
    const radnikSelect = document.getElementById('korisnici-radnik');
    
    if (korisnik.uloga === 'radnik') {
        radnikSelectGroup.style.display = 'block';
        await populateRadnikSelect('select#korisnici-radnik');
        if (korisnik.radnikId) {
            radnikSelect.value = korisnik.radnikId;
        }
    } else {
        radnikSelectGroup.style.display = 'none';
    }
    
    openModal('korisnici');
}

async function deleteKorisnikHandler(id) {
    // PRIVATNOST: Samo administrator može da briše korisnike
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za brisanje korisnika');
        } else {
            alert('Nemate dozvolu za brisanje korisnika');
        }
        return;
    }
    
    if (currentUser.id === id) {
        alert('Ne možete obrisati sopstveni nalog');
        return;
    }
    
    if (confirm('Da li ste sigurni da želite da obrišete ovog korisnika?')) {
        try {
            await deleteKorisnik(id);
            await loadAllData();
        } catch (error) {
            alert('Greška pri brisanju: ' + error.message);
        }
    }
}

// Form submit handlers
document.getElementById('form-radnici').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // PRIVATNOST: Samo administrator može da dodaje/izmenjuje radnike
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za dodavanje/izmenu radnika');
        } else {
            alert('Nemate dozvolu za dodavanje/izmenu radnika');
        }
        return;
    }
    
    try {
        const id = document.getElementById('radnici-id').value;
        const data = {
            id: id ? parseInt(id) : null,
            ime: document.getElementById('radnici-ime').value,
            jmbg: document.getElementById('radnici-jmbg').value,
            telefon: document.getElementById('radnici-telefon').value,
            email: document.getElementById('radnici-email').value,
            pozicija: document.getElementById('radnici-pozicija').value,
            datum: document.getElementById('radnici-datum').value
        };
        
        let radnikId;
        if (id) {
            await updateRadnik(data);
            radnikId = parseInt(id);
        } else {
            const newRadnik = await addRadnik(data);
            radnikId = newRadnik;
        }
        
        // Ako je checkbox za kreiranje naloga čekiran, kreiraj nalog
        const createAccountCheckbox = document.getElementById('radnici-create-account');
        if (createAccountCheckbox && createAccountCheckbox.checked) {
            const username = document.getElementById('radnici-username').value;
            const password = document.getElementById('radnici-password').value;
            
            if (username && password) {
                try {
                    await addKorisnik({
                        username: username,
                        password: password,
                        ime: data.ime,
                        email: data.email,
                        uloga: 'radnik',
                        radnikId: radnikId
                    });
                } catch (error) {
                    console.error('Greška pri kreiranju naloga:', error);
                    alert('Radnik je dodat, ali nalog nije kreiran: ' + error.message);
                }
            }
        }
        
        await loadAllData();
        closeModal('radnici');
    } catch (error) {
        alert('Greška: ' + error.message);
    }
});

document.getElementById('form-plate').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // PRIVATNOST: Samo administrator može da dodaje/izmenjuje plate
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za dodavanje/izmenu plata');
        } else {
            alert('Nemate dozvolu za dodavanje/izmenu plata');
        }
        return;
    }
    
    try {
        const id = document.getElementById('plate-id').value;
        const data = {
            id: id ? parseInt(id) : null,
            radnikId: parseInt(document.getElementById('plate-radnik').value),
            mesec: parseInt(document.getElementById('plate-mesec').value),
            godina: parseInt(document.getElementById('plate-godina').value),
            osnovna: parseFloat(document.getElementById('plate-osnovna').value),
            bonusi: parseFloat(document.getElementById('plate-bonusi').value) || 0,
            prekovremeni: parseFloat(document.getElementById('plate-prekovremeni').value) || 0,
            nocni: parseFloat(document.getElementById('plate-nocni').value) || 0,
            praznicki: parseFloat(document.getElementById('plate-praznicki').value) || 0,
            regres: parseFloat(document.getElementById('plate-regres').value) || 0,
            staz: parseFloat(document.getElementById('plate-staz').value) || 0,
            pio: parseFloat(document.getElementById('plate-pio').value) || 0,
            zo: parseFloat(document.getElementById('plate-zo').value) || 0,
            nezaposlenost: parseFloat(document.getElementById('plate-nezaposlenost').value) || 0,
            porez: parseFloat(document.getElementById('plate-porez').value) || 0,
            doprinosi: parseFloat(document.getElementById('plate-doprinosi').value) || 0,
            dugovanja: parseFloat(document.getElementById('plate-dugovanja').value) || 0,
            ostaliOdbitci: parseFloat(document.getElementById('plate-ostali-odbitci').value) || 0
        };
        
        if (id) {
            await updatePlata(data);
        } else {
            await addPlata(data);
        }
        
        // Proveri da li treba poslati dokument korisniku
        const sendDocument = document.getElementById('plate-send-document').checked;
        if (sendDocument) {
            await sendDocumentToUser(data.radnikId, 'plata', data);
        }
        
        await loadAllData();
        closeModal('plate');
    } catch (error) {
        alert('Greška: ' + error.message);
    }
});

document.getElementById('form-odmori').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // PRIVATNOST: Samo administrator može da dodaje/izmenjuje odmore
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za dodavanje/izmenu godišnjih odmora');
        } else {
            alert('Nemate dozvolu za dodavanje/izmenu godišnjih odmora');
        }
        return;
    }
    
    const button = e.target.querySelector('button[type="submit"]');
    
    try {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, true);
        }
        
        const id = document.getElementById('odmori-id').value;
        const pocetak = document.getElementById('odmori-pocetak').value;
        const zavrsetak = document.getElementById('odmori-zavrsetak').value;
        
        // Validacija datuma
        if (typeof validateDatum !== 'undefined') {
            const pocetakValidation = validateDatum(pocetak, true);
            if (!pocetakValidation.valid) {
                if (typeof toast !== 'undefined') {
                    toast.error(pocetakValidation.error);
                } else {
                    alert(pocetakValidation.error);
                }
                return;
            }
        }
        
        const data = {
            id: id ? parseInt(id) : null,
            radnikId: parseInt(document.getElementById('odmori-radnik').value),
            pocetak: pocetak,
            zavrsetak: zavrsetak,
            status: document.getElementById('odmori-status').value
        };
        
        // Validacija: Proveri da li radnik ima dovoljno dana odmora ako se odobriva/završava odmor
        if (data.status === 'Odobren' || data.status === 'Završen' || data.status === 'U toku') {
            const radnikOdmori = odmori.filter(o => o.radnikId === data.radnikId && o.id !== data.id);
            const danas = new Date();
            danas.setHours(0, 0, 0, 0);
            
            const iskorisceniOdmori = radnikOdmori.filter(o => {
                if (o.status === 'Završen') return true;
                if (o.status === 'U toku') return true;
                if (o.status === 'Odobren' || o.status === 'Planiran') {
                    const zavrsetakDate = new Date(o.zavrsetak + 'T00:00:00');
                    return zavrsetakDate <= danas;
                }
                return false;
            });
            
            const iskorisceno = iskorisceniOdmori.reduce((sum, o) => sum + calculateDays(o.pocetak, o.zavrsetak), 0);
            const brojDanaNovogOdmora = calculateDays(data.pocetak, data.zavrsetak);
            const ukupno = 20;
            const preostalo = ukupno - iskorisceno;
            
            if (brojDanaNovogOdmora > preostalo) {
                if (typeof toast !== 'undefined') {
                    toast.error(`Radnik ima samo ${preostalo} dana preostalog odmora, a zahteva se ${brojDanaNovogOdmora} dana!`);
                } else {
                    alert(`Radnik ima samo ${preostalo} dana preostalog odmora, a zahteva se ${brojDanaNovogOdmora} dana!`);
                }
                return;
            }
        }
        
        if (id) {
            await updateOdmor(data);
        } else {
            await addOdmor(data);
        }
        
        // Proveri da li treba poslati dokument korisniku
        const sendDocument = document.getElementById('odmori-send-document').checked;
        if (sendDocument) {
            await sendDocumentToUser(data.radnikId, 'odmor', data);
        }
        
        await loadAllData();
        closeModal('odmori');
        
        if (typeof toast !== 'undefined') {
            toast.success(id ? 'Godišnji odmor je uspešno ažuriran!' : 'Godišnji odmor je uspešno dodat!');
        } else {
            alert(id ? 'Godišnji odmor je uspešno ažuriran!' : 'Godišnji odmor je uspešno dodat!');
        }
    } catch (error) {
        console.error('Greška:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Greška: ' + error.message);
        } else {
            alert('Greška: ' + error.message);
        }
    } finally {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, false);
        }
    }
});

document.getElementById('form-ostale').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // PRIVATNOST: Samo administrator može da dodaje/izmenjuje evidencije
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za dodavanje/izmenu evidencija');
        } else {
            alert('Nemate dozvolu za dodavanje/izmenu evidencija');
        }
        return;
    }
    
    try {
        const id = document.getElementById('ostale-id').value;
        const data = {
            id: id ? parseInt(id) : null,
            tip: document.getElementById('ostale-tip').value,
            radnikId: parseInt(document.getElementById('ostale-radnik').value),
            datum: document.getElementById('ostale-datum').value,
            opis: document.getElementById('ostale-opis').value
        };
        
        if (id) {
            await updateOstala(data);
        } else {
            await addOstala(data);
        }
        
        // Proveri da li treba poslati dokument korisniku
        const sendDocument = document.getElementById('ostale-send-document').checked;
        if (sendDocument) {
            await sendDocumentToUser(data.radnikId, 'evidencija', data);
        }
        
        await loadAllData();
        closeModal('ostale');
    } catch (error) {
        alert('Greška: ' + error.message);
    }
});

document.getElementById('form-korisnici').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // PRIVATNOST: Samo administrator može da dodaje/izmenjuje korisnike
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za dodavanje/izmenu korisnika');
        } else {
            alert('Nemate dozvolu za dodavanje/izmenu korisnika');
        }
        return;
    }
    
    const button = e.target.querySelector('button[type="submit"]');
    
    try {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, true);
        }
        
        const id = document.getElementById('korisnici-id').value;
        const password = document.getElementById('korisnici-password').value;
        const radnikId = document.getElementById('korisnici-radnik').value;
        const username = document.getElementById('korisnici-username').value;
        const email = document.getElementById('korisnici-email').value;
        
        // Validacija
        if (typeof validateUsername !== 'undefined') {
            const usernameValidation = validateUsername(username);
            if (!usernameValidation.valid) {
                if (typeof toast !== 'undefined') {
                    toast.error(usernameValidation.error);
                } else {
                    alert(usernameValidation.error);
                }
                return;
            }
        }
        
        if (typeof validateEmail !== 'undefined') {
            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) {
                if (typeof toast !== 'undefined') {
                    toast.error(emailValidation.error);
                } else {
                    alert(emailValidation.error);
                }
                return;
            }
        }
        
        if (password && typeof validatePassword !== 'undefined') {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                if (typeof toast !== 'undefined') {
                    toast.error(passwordValidation.error);
                } else {
                    alert(passwordValidation.error);
                }
                return;
            }
        }
        
        const data = {
            id: id ? parseInt(id) : null,
            username: username,
            ime: document.getElementById('korisnici-ime').value,
            email: email,
            uloga: document.getElementById('korisnici-uloga').value
        };
        
        if (radnikId) {
            data.radnikId = parseInt(radnikId);
        }
        
        // Hash-uj lozinku ako je uneta
        if (password) {
            if (typeof hashPassword !== 'undefined') {
                data.password = await hashPassword(password);
            } else {
                data.password = password;
            }
        } else if (id) {
            // Ako je edit i password nije unet, zadrži postojeći password
            const existing = await getKorisnikById(parseInt(id));
            data.password = existing.password;
        }
        
        if (id) {
            await updateKorisnik(data);
        } else {
            await addKorisnik(data);
        }
        
        await loadAllData();
        closeModal('korisnici');
        renderKorisnici();
        
        if (typeof toast !== 'undefined') {
            toast.success(id ? 'Korisnik je uspešno ažuriran!' : 'Korisnik je uspešno dodat!');
        } else {
            alert(id ? 'Korisnik je uspešno ažuriran!' : 'Korisnik je uspešno dodat!');
        }
    } catch (error) {
        console.error('Greška:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Greška: ' + error.message);
        } else {
            alert('Greška: ' + error.message);
        }
    } finally {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, false);
        }
    }
});

// Pomoćne funkcije
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('sr-RS');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'RSD',
        minimumFractionDigits: 2
    }).format(amount);
}

function getMonthName(monthNum) {
    const months = ['', 'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 
                    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
    return months[monthNum] || '';
}

function calculateDays(startDate, endDate) {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}

// Funkcija za prikaz detaljne plate
async function showPlataDetalj(plata) {
    // PRIVATNOST: Samo administrator ili vlasnik plate može da vidi detalje
    if (!isAdmin()) {
        // Proveri da li je radnik vlasnik plate
        if (isRadnik() && currentUser.radnikId !== plata.radnikId) {
            if (typeof toast !== 'undefined') {
                toast.warning('Nemate dozvolu za pregled ove plate');
            } else {
                alert('Nemate dozvolu za pregled ove plate');
            }
            return;
        }
        // Ako nije ni admin ni radnik-vlasnik, zabrani pristup
        if (!isRadnik() || currentUser.radnikId !== plata.radnikId) {
            if (typeof toast !== 'undefined') {
                toast.warning('Nemate dozvolu za pregled plata');
            } else {
                alert('Nemate dozvolu za pregled plata');
            }
            return;
        }
    }
    
    const radnik = radnici.find(r => r.id === plata.radnikId);
    const mesecNaziv = getMonthName(plata.mesec);
    
    // Izračunaj dobitke
    const osnovna = parseFloat(plata.osnovna) || 0;
    const bonusi = parseFloat(plata.bonusi) || 0;
    const prekovremeni = parseFloat(plata.prekovremeni) || 0;
    const nocni = parseFloat(plata.nocni) || 0;
    const praznicki = parseFloat(plata.praznicki) || 0;
    const regres = parseFloat(plata.regres) || 0;
    const staz = parseFloat(plata.staz) || 0;
    const ukupnoDobitci = osnovna + bonusi + prekovremeni + nocni + praznicki + regres + staz;
    
    // Izračunaj odbitke
    const pio = parseFloat(plata.pio) || 0;
    const zo = parseFloat(plata.zo) || 0;
    const nezaposlenost = parseFloat(plata.nezaposlenost) || 0;
    const porez = parseFloat(plata.porez) || 0;
    const doprinosi = parseFloat(plata.doprinosi) || 0;
    const dugovanja = parseFloat(plata.dugovanja) || 0;
    const ostaliOdbitci = parseFloat(plata.ostaliOdbitci) || 0;
    const ukupnoOdbitci = pio + zo + nezaposlenost + porez + doprinosi + dugovanja + ostaliOdbitci;
    
    const ukupno = ukupnoDobitci - ukupnoOdbitci;
    
    const content = `
        <div class="plata-detalj-header">
            <h3>${radnik ? radnik.ime : 'Nepoznat Radnik'}</h3>
            <p><strong>Mesec:</strong> ${mesecNaziv} ${plata.godina}</p>
        </div>
        <div class="plata-detalj-section">
            <h4>DOBITCI</h4>
            <table class="plata-detalj-table">
                <tr>
                    <td>Osnovna plata</td>
                    <td class="text-right">${formatCurrency(osnovna)}</td>
                </tr>
                <tr>
                    <td>Bonusi</td>
                    <td class="text-right">${formatCurrency(bonusi)}</td>
                </tr>
                <tr>
                    <td>Prekovremeni rad</td>
                    <td class="text-right">${formatCurrency(prekovremeni)}</td>
                </tr>
                <tr>
                    <td>Noćni rad</td>
                    <td class="text-right">${formatCurrency(nocni)}</td>
                </tr>
                <tr>
                    <td>Praznički rad</td>
                    <td class="text-right">${formatCurrency(praznicki)}</td>
                </tr>
                <tr>
                    <td>Regres</td>
                    <td class="text-right">${formatCurrency(regres)}</td>
                </tr>
                <tr>
                    <td>Dodatak za staž</td>
                    <td class="text-right">${formatCurrency(staz)}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Ukupno dobitci</strong></td>
                    <td class="text-right"><strong>${formatCurrency(ukupnoDobitci)}</strong></td>
                </tr>
            </table>
        </div>
        <div class="plata-detalj-section">
            <h4>ODBITCI</h4>
            <table class="plata-detalj-table">
                <tr>
                    <td>PIO (Penziono)</td>
                    <td class="text-right">${formatCurrency(pio)}</td>
                </tr>
                <tr>
                    <td>ZO (Zdravstveno)</td>
                    <td class="text-right">${formatCurrency(zo)}</td>
                </tr>
                <tr>
                    <td>Nezaposlenost</td>
                    <td class="text-right">${formatCurrency(nezaposlenost)}</td>
                </tr>
                <tr>
                    <td>Porez</td>
                    <td class="text-right">${formatCurrency(porez)}</td>
                </tr>
                <tr>
                    <td>Doprinosi na teret zaposlenog</td>
                    <td class="text-right">${formatCurrency(doprinosi)}</td>
                </tr>
                <tr>
                    <td>Dugovanja</td>
                    <td class="text-right">${formatCurrency(dugovanja)}</td>
                </tr>
                <tr>
                    <td>Ostali odbitci</td>
                    <td class="text-right">${formatCurrency(ostaliOdbitci)}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>Ukupno odbitci</strong></td>
                    <td class="text-right"><strong>${formatCurrency(ukupnoOdbitci)}</strong></td>
                </tr>
            </table>
        </div>
        <div class="plata-detalj-footer">
            <h2>ZA ISPLATU: ${formatCurrency(ukupno)}</h2>
        </div>
    `;
    
    document.getElementById('plata-detalj-content').innerHTML = content;
    document.getElementById('modal-plata-detalj').style.display = 'block';
}

function renderAll() {
    renderRadnici();
    renderPlate();
    renderOdmori();
    renderOdmoriPregled();
    renderOstale();
    if (isAdmin()) {
        renderKorisnici();
        renderPoruke();
        renderZahtevi();
        // Renderuj dashboard ako postoji
        if (typeof dashboard !== 'undefined' && typeof renderDashboard !== 'undefined') {
            renderDashboard();
        }
    }
    if (isRadnik()) {
        renderRadnikData();
        renderRadnikPoruke();
        renderRadnikZahtevi();
    }
    if (isUser()) {
        renderUserData();
        renderUserPoruke();
        renderUserZahtevi();
    }
}

// Renderovanje pregleda godišnjih odmora po radniku
async function renderOdmoriPregled() {
    // PRIVATNOST: Samo administrator vidi pregled odmora svih radnika
    if (!isAdmin()) {
        const tbody = document.getElementById('odmori-pregled-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled odmora</td></tr>';
        }
        return;
    }
    
    const tbody = document.getElementById('odmori-pregled-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (radnici.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #999;">Nema unetih radnika</td></tr>';
        return;
    }
    
    radnici.forEach(radnik => {
        const radnikOdmori = odmori.filter(o => o.radnikId === radnik.id);
        // Pronađi korisničko ime radnika ako radnik ima nalog
        let radnikKorisnickoIme = radnik.ime;
        const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
        if (radnikKorisnik) {
            radnikKorisnickoIme = radnikKorisnik.username;
        }
        
        // Računaj sve odmore koji su odobreni i iskorišćeni (Završen, U toku, ili Odobren ako je prošao datum završetka)
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        
        const iskorisceniOdmori = radnikOdmori.filter(o => {
            // Uvek računaj završene odmore
            if (o.status === 'Završen') return true;
            // Računaj odmore koji su u toku
            if (o.status === 'U toku') return true;
            // Računaj odobrene odmore čiji je datum završetka prošao
            if (o.status === 'Odobren' || o.status === 'Planiran') {
                const zavrsetakDate = new Date(o.zavrsetak + 'T00:00:00');
                return zavrsetakDate <= danas;
            }
            return false;
        });
        
        const iskorisceno = iskorisceniOdmori.reduce((sum, o) => sum + calculateDays(o.pocetak, o.zavrsetak), 0);
        const ukupno = 20; // Standardno 20 dana godišnjeg odmora
        const preostalo = ukupno - iskorisceno;
        const procenat = ukupno > 0 ? Math.round((iskorisceno / ukupno) * 100) : 0;
        
        const row = document.createElement('tr');
        const procenatClass = procenat >= 80 ? 'high-usage' : procenat >= 50 ? 'medium-usage' : 'low-usage';
        
        row.innerHTML = `
            <td>${radnikKorisnickoIme}</td>
            <td><strong>${ukupno}</strong></td>
            <td>${iskorisceno}</td>
            <td><strong class="${preostalo < 5 ? 'warning' : ''}">${preostalo}</strong></td>
            <td><span class="procenat-badge ${procenatClass}">${procenat}%</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Renderovanje radničkih podataka
async function renderRadnikData() {
    if (!currentUser || !currentUser.radnikId) return;
    
    const radnik = await getRadnikById(currentUser.radnikId);
    if (!radnik) return;
    
    // Renderuj profil
    document.getElementById('radnik-profil-ime').textContent = radnik.ime;
    document.getElementById('radnik-profil-jmbg').textContent = radnik.jmbg;
    document.getElementById('radnik-profil-telefon').textContent = radnik.telefon;
    document.getElementById('radnik-profil-email').textContent = radnik.email;
    document.getElementById('radnik-profil-pozicija').textContent = radnik.pozicija;
    document.getElementById('radnik-profil-datum').textContent = formatDate(radnik.datum);
    
    // Renderuj plate
    const radnikPlate = plate.filter(p => p.radnikId === currentUser.radnikId);
    const plateTbody = document.getElementById('radnik-plate-tbody');
    plateTbody.innerHTML = '';
    
    if (radnikPlate.length === 0) {
        plateTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #999;">Nema unetih plata</td></tr>';
    } else {
        radnikPlate.forEach(plata => {
            const osnovna = parseFloat(plata.osnovna) || 0;
            const bonusi = parseFloat(plata.bonusi) || 0;
            const prekovremeni = parseFloat(plata.prekovremeni) || 0;
            const nocni = parseFloat(plata.nocni) || 0;
            const praznicki = parseFloat(plata.praznicki) || 0;
            const regres = parseFloat(plata.regres) || 0;
            const staz = parseFloat(plata.staz) || 0;
            const ukupnoDobitci = osnovna + bonusi + prekovremeni + nocni + praznicki + regres + staz;
            
            const pio = parseFloat(plata.pio) || 0;
            const zo = parseFloat(plata.zo) || 0;
            const nezaposlenost = parseFloat(plata.nezaposlenost) || 0;
            const porez = parseFloat(plata.porez) || 0;
            const doprinosi = parseFloat(plata.doprinosi) || 0;
            const dugovanja = parseFloat(plata.dugovanja) || 0;
            const ostaliOdbitci = parseFloat(plata.ostaliOdbitci) || 0;
            const ukupnoOdbitci = pio + zo + nezaposlenost + porez + doprinosi + dugovanja + ostaliOdbitci;
            
            const ukupno = ukupnoDobitci - ukupnoOdbitci;
            const mesecNaziv = getMonthName(plata.mesec);
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.onclick = () => showPlataDetalj(plata);
            row.innerHTML = `
                <td>${mesecNaziv}</td>
                <td>${plata.godina}</td>
                <td>${formatCurrency(osnovna)}</td>
                <td>${formatCurrency(bonusi)}</td>
                <td>${formatCurrency(doprinosi)}</td>
                <td><strong>${formatCurrency(ukupno)}</strong></td>
            `;
            plateTbody.appendChild(row);
        });
    }
    
    // Renderuj odmore
    const radnikOdmori = odmori.filter(o => o.radnikId === currentUser.radnikId);
    const odmoriTbody = document.getElementById('radnik-odmori-tbody');
    odmoriTbody.innerHTML = '';
    
    // Izračunaj statistiku godišnjih odmora
    // Računaj sve odmore koji su odobreni i iskorišćeni (Završen, U toku, ili Odobren ako je prošao datum završetka)
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);
    
    const iskorisceniOdmori = radnikOdmori.filter(o => {
        // Uvek računaj završene odmore
        if (o.status === 'Završen') return true;
        // Računaj odmore koji su u toku
        if (o.status === 'U toku') return true;
        // Računaj odobrene odmore čiji je datum završetka prošao
        if (o.status === 'Odobren' || o.status === 'Planiran') {
            const zavrsetakDate = new Date(o.zavrsetak + 'T00:00:00');
            return zavrsetakDate <= danas;
        }
        return false;
    });
    
    const iskorisceno = iskorisceniOdmori.reduce((sum, o) => sum + calculateDays(o.pocetak, o.zavrsetak), 0);
    const ukupno = 20; // Standardno 20 dana godišnjeg odmora
    const preostalo = ukupno - iskorisceno;
    
    // Prikaži statistiku
    const summaryDiv = document.getElementById('radnik-odmori-summary');
    if (summaryDiv) {
        summaryDiv.innerHTML = `
            <div class="summary-card">
                <h3>Ukupno dana godišnjeg odmora: <span>${ukupno}</span></h3>
                <h3>Iskorišćeno: <span>${iskorisceno}</span></h3>
                <h3>Preostalo: <span class="${preostalo < 5 ? 'warning' : ''}">${preostalo}</span></h3>
            </div>
        `;
    }
    
    if (radnikOdmori.length === 0) {
        odmoriTbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #999;">Nema unetih godišnjih odmora</td></tr>';
    } else {
        radnikOdmori.forEach(odmor => {
            const brojDana = calculateDays(odmor.pocetak, odmor.zavrsetak);
            const statusClass = `status-${odmor.status.toLowerCase().replace(' ', '-')}`;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(odmor.pocetak)}</td>
                <td>${formatDate(odmor.zavrsetak)}</td>
                <td>${brojDana}</td>
                <td><span class="status-badge ${statusClass}">${odmor.status}</span></td>
            `;
            odmoriTbody.appendChild(row);
        });
    }
    
    // Renderuj evidencije
    const radnikEvidencije = ostale.filter(e => e.radnikId === currentUser.radnikId);
    const evidencijeTbody = document.getElementById('radnik-evidencije-tbody');
    evidencijeTbody.innerHTML = '';
    
    if (radnikEvidencije.length === 0) {
        evidencijeTbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 30px; color: #999;">Nema unetih evidencija</td></tr>';
    } else {
        radnikEvidencije.forEach(evidencija => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${evidencija.tip}</td>
                <td>${formatDate(evidencija.datum)}</td>
                <td>${evidencija.opis}</td>
            `;
            evidencijeTbody.appendChild(row);
        });
    }
}

// Kreiranje naloga za radnika
async function createAccountForRadnik(radnikId) {
    // PRIVATNOST: Samo administrator može da kreira naloge za radnike
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za kreiranje naloga');
        } else {
            alert('Nemate dozvolu za kreiranje naloga');
        }
        return;
    }
    
    const radnik = await getRadnikById(radnikId);
    if (!radnik) return;
    
    const username = prompt('Unesite korisničko ime za radnika:');
    if (!username) return;
    
    const password = prompt('Unesite lozinku za radnika:');
    if (!password) return;
    
    try {
        await addKorisnik({
            username: username,
            password: password,
            ime: radnik.ime,
            email: radnik.email,
            uloga: 'radnik',
            radnikId: radnikId
        });
        
        await loadAllData();
        alert('Nalog je uspešno kreiran!');
    } catch (error) {
        alert('Greška pri kreiranju naloga: ' + error.message);
    }
}

// Toggle create account fields
function toggleCreateAccountFields() {
    const checkbox = document.getElementById('radnici-create-account');
    const fields = document.getElementById('radnici-account-fields');
    if (checkbox.checked) {
        fields.style.display = 'block';
    } else {
        fields.style.display = 'none';
    }
}

// Renderovanje poruka (Admin)
async function renderPoruke() {
    // PRIVATNOST: Samo administrator vidi sve poruke
    if (!isAdmin()) {
        const tbody = document.getElementById('poruke-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled poruka</td></tr>';
        }
        return;
    }
    
    const tbody = document.getElementById('poruke-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (poruke.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">Nema poruka</td></tr>';
        return;
    }
    
    poruke.forEach(poruka => {
        const radnik = poruka.radnikId ? radnici.find(r => r.id === poruka.radnikId) : null;
        // Pronađi korisničko ime radnika ako radnik ima nalog
        let radnikKorisnickoIme = 'Svi radnici';
        if (poruka.radnikId && poruka.radnikId !== 'svi') {
            if (radnik) {
                const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
                radnikKorisnickoIme = radnikKorisnik ? radnikKorisnik.username : radnik.ime;
            } else {
                radnikKorisnickoIme = 'Nepoznat';
            }
        }
        const procitaoText = poruka.procitao ? 'Pročitano' : 'Nepročitano';
        const procitaoClass = poruka.procitao ? 'status-procitao' : 'status-neprocitao';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${poruka.id}</td>
            <td>${radnikKorisnickoIme}</td>
            <td>${formatDate(poruka.datum)}</td>
            <td>${poruka.naslov}</td>
            <td>${poruka.poruka.substring(0, 50)}${poruka.poruka.length > 50 ? '...' : ''}</td>
            <td><span class="status-badge ${procitaoClass}">${procitaoText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-danger" onclick="deletePorukaHandler(${poruka.id})">Obriši</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Renderovanje zahteva (Admin)
async function renderZahtevi() {
    // PRIVATNOST: Samo administrator vidi sve zahteve
    if (!isAdmin()) {
        const tbodyOdmor = document.getElementById('zahtevi-odmor-tbody');
        const tbodyAdmin = document.getElementById('zahtevi-admin-tbody');
        if (tbodyOdmor) {
            tbodyOdmor.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled zahteva</td></tr>';
        }
        if (tbodyAdmin) {
            tbodyAdmin.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">Nemate dozvolu za pregled zahteva</td></tr>';
        }
        return;
    }
    
    const tbodyOdmor = document.getElementById('zahtevi-odmor-tbody');
    const tbodyAdmin = document.getElementById('zahtevi-admin-tbody');
    
    if (tbodyOdmor) {
        tbodyOdmor.innerHTML = '';
        if (zahteviOdmor.length === 0) {
            tbodyOdmor.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #999;">Nema zahteva za godišnji odmor</td></tr>';
        } else {
            zahteviOdmor.forEach(zahtev => {
                const radnik = radnici.find(r => r.id === zahtev.radnikId);
                // Pronađi korisničko ime radnika ako radnik ima nalog
                let radnikKorisnickoIme = 'Nepoznat';
                if (radnik) {
                    const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
                    radnikKorisnickoIme = radnikKorisnik ? radnikKorisnik.username : radnik.ime;
                }
                const statusClass = `status-${zahtev.status.toLowerCase().replace(' ', '-')}`;
                const brojDana = calculateDays(zahtev.pocetak, zahtev.zavrsetak);
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${zahtev.id}</td>
                    <td>${radnikKorisnickoIme}</td>
                    <td>${formatDate(zahtev.datum)}</td>
                    <td>${formatDate(zahtev.pocetak)}</td>
                    <td>${formatDate(zahtev.zavrsetak)}</td>
                    <td>${brojDana}</td>
                    <td><span class="status-badge ${statusClass}">${zahtev.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${zahtev.status === 'Čeka' ? `
                                <button class="btn btn-success" onclick="odobriZahtevOdmor(${zahtev.id})">Odobri</button>
                                <button class="btn btn-danger" onclick="odbijZahtevOdmor(${zahtev.id})">Odbij</button>
                            ` : ''}
                        </div>
                    </td>
                `;
                tbodyOdmor.appendChild(row);
            });
        }
    }
    
    if (tbodyAdmin) {
        tbodyAdmin.innerHTML = '';
        if (zahteviAdmin.length === 0) {
            tbodyAdmin.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #999;">Nema administrativnih zahteva</td></tr>';
        } else {
            zahteviAdmin.forEach(zahtev => {
                // Prikaži korisničko ime radnika ili korisnika u zavisnosti od tipa zahteva
                let korisnickoIme = 'Nepoznat';
                if (zahtev.radnikId) {
                    const radnik = radnici.find(r => r.id === zahtev.radnikId);
                    if (radnik) {
                        const radnikKorisnik = korisnici.find(k => k.radnikId === radnik.id);
                        korisnickoIme = radnikKorisnik ? radnikKorisnik.username : radnik.ime;
                    } else {
                        korisnickoIme = 'Nepoznat radnik';
                    }
                } else if (zahtev.userId) {
                    const korisnik = korisnici.find(k => k.id === zahtev.userId);
                    korisnickoIme = korisnik ? korisnik.username : 'Nepoznat korisnik';
                }
                
                const statusClass = `status-${zahtev.status.toLowerCase().replace(' ', '-')}`;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${zahtev.id}</td>
                    <td>${korisnickoIme}</td>
                    <td>${zahtev.tip}</td>
                    <td>${formatDate(zahtev.datum)}</td>
                    <td>${zahtev.opis.substring(0, 50)}${zahtev.opis.length > 50 ? '...' : ''}</td>
                    <td><span class="status-badge ${statusClass}">${zahtev.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            ${zahtev.status === 'Čeka' ? `
                                <button class="btn btn-success" onclick="odobriZahtevAdmin(${zahtev.id})">Odobri</button>
                                <button class="btn btn-danger" onclick="odbijZahtevAdmin(${zahtev.id})">Odbij</button>
                            ` : ''}
                        </div>
                    </td>
                `;
                tbodyAdmin.appendChild(row);
            });
        }
    }
}

// Renderovanje radničkih poruka
async function renderRadnikPoruke() {
    if (!currentUser || !currentUser.radnikId) return;
    const tbody = document.getElementById('radnik-poruke-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const radnikPoruke = poruke.filter(p => !p.radnikId || p.radnikId === 'svi' || p.radnikId === currentUser.radnikId);
    
    if (radnikPoruke.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #999;">Nema poruka</td></tr>';
        return;
    }
    
    radnikPoruke.forEach(poruka => {
        const procitaoText = poruka.procitao ? 'Pročitano' : 'Nepročitano';
        const procitaoClass = poruka.procitao ? 'status-procitao' : 'status-neprocitao';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(poruka.datum)}</td>
            <td>${poruka.naslov}</td>
            <td>${poruka.poruka}</td>
            <td>
                <span class="status-badge ${procitaoClass}">${procitaoText}</span>
                ${!poruka.procitao ? `<button class="btn btn-sm btn-primary" onclick="oznaciProcitanom(${poruka.id})" style="margin-left: 10px;">Označi kao pročitano</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Renderovanje radničkih zahteva
async function renderRadnikZahtevi() {
    if (!currentUser || !currentUser.radnikId) return;
    const tbody = document.getElementById('radnik-zahtevi-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const radnikZahteviOdmor = zahteviOdmor.filter(z => z.radnikId === currentUser.radnikId);
    const radnikZahteviAdmin = zahteviAdmin.filter(z => z.radnikId === currentUser.radnikId);
    
    if (radnikZahteviOdmor.length === 0 && radnikZahteviAdmin.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #999;">Nema zahteva</td></tr>';
        return;
    }
    
    radnikZahteviOdmor.forEach(zahtev => {
        const statusClass = `status-${zahtev.status.toLowerCase().replace(' ', '-')}`;
        const brojDana = calculateDays(zahtev.pocetak, zahtev.zavrsetak);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Zahtev za Godišnji Odmor</td>
            <td>${formatDate(zahtev.datum)}</td>
            <td>Period: ${formatDate(zahtev.pocetak)} - ${formatDate(zahtev.zavrsetak)} (${brojDana} dana)</td>
            <td><span class="status-badge ${statusClass}">${zahtev.status}</span></td>
        `;
        tbody.appendChild(row);
    });
    
    radnikZahteviAdmin.forEach(zahtev => {
        const statusClass = `status-${zahtev.status.toLowerCase().replace(' ', '-')}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${zahtev.tip}</td>
            <td>${formatDate(zahtev.datum)}</td>
            <td>${zahtev.opis}</td>
            <td><span class="status-badge ${statusClass}">${zahtev.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Funkcije za upravljanje zahtevima
async function odobriZahtevOdmor(id) {
    // PRIVATNOST: Samo administrator može da odobrava zahteve
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za odobravanje zahteva');
        } else {
            alert('Nemate dozvolu za odobravanje zahteva');
        }
        return;
    }
    
    const zahtev = await getZahtevOdmorById(id);
    if (!zahtev) return;
    
    try {
        // Validacija: Proveri da li radnik ima dovoljno dana odmora
        const radnikOdmori = odmori.filter(o => o.radnikId === zahtev.radnikId);
        const danas = new Date();
        danas.setHours(0, 0, 0, 0);
        
        const iskorisceniOdmori = radnikOdmori.filter(o => {
            if (o.status === 'Završen') return true;
            if (o.status === 'U toku') return true;
            if (o.status === 'Odobren' || o.status === 'Planiran') {
                const zavrsetakDate = new Date(o.zavrsetak + 'T00:00:00');
                return zavrsetakDate <= danas;
            }
            return false;
        });
        
        const iskorisceno = iskorisceniOdmori.reduce((sum, o) => sum + calculateDays(o.pocetak, o.zavrsetak), 0);
        const brojDanaZahteva = calculateDays(zahtev.pocetak, zahtev.zavrsetak);
        const ukupno = 20;
        const preostalo = ukupno - iskorisceno;
        
        if (brojDanaZahteva > preostalo) {
            if (typeof toast !== 'undefined') {
                toast.error(`Radnik ima samo ${preostalo} dana preostalog odmora, a zahteva se ${brojDanaZahteva} dana!`);
            } else {
                alert(`Radnik ima samo ${preostalo} dana preostalog odmora, a zahteva se ${brojDanaZahteva} dana!`);
            }
            return;
        }
        
        await updateZahtevOdmor({ ...zahtev, status: 'Odobren' });
        // Kreiraj odmor ako je odobren
        await addOdmor({
            id: odmori.length > 0 ? Math.max(...odmori.map(o => o.id)) + 1 : 1,
            radnikId: zahtev.radnikId,
            pocetak: zahtev.pocetak,
            zavrsetak: zahtev.zavrsetak,
            status: 'Planiran'
        });
        await loadAllData();
        alert('Zahtev je odobren i odmor je kreiran!');
    } catch (error) {
        alert('Greška: ' + error.message);
    }
}

async function odbijZahtevOdmor(id) {
    // PRIVATNOST: Samo administrator može da odbija zahteve
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za odbijanje zahteva');
        } else {
            alert('Nemate dozvolu za odbijanje zahteva');
        }
        return;
    }
    
    const zahtev = await getZahtevOdmorById(id);
    if (!zahtev) return;
    
    try {
        await updateZahtevOdmor({ ...zahtev, status: 'Odbijen' });
        await loadAllData();
        alert('Zahtev je odbijen!');
    } catch (error) {
        alert('Greška: ' + error.message);
    }
}

async function odobriZahtevAdmin(id) {
    // PRIVATNOST: Samo administrator može da odobrava zahteve
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za odobravanje zahteva');
        } else {
            alert('Nemate dozvolu za odobravanje zahteva');
        }
        return;
    }
    
    const zahtev = await getZahtevAdminById(id);
    if (!zahtev) return;
    
    try {
        await updateZahtevAdmin({ ...zahtev, status: 'Odobren' });
        await loadAllData();
        alert('Zahtev je odobren!');
    } catch (error) {
        alert('Greška: ' + error.message);
    }
}

async function odbijZahtevAdmin(id) {
    // PRIVATNOST: Samo administrator može da odbija zahteve
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za odbijanje zahteva');
        } else {
            alert('Nemate dozvolu za odbijanje zahteva');
        }
        return;
    }
    
    const zahtev = await getZahtevAdminById(id);
    if (!zahtev) return;
    
    try {
        await updateZahtevAdmin({ ...zahtev, status: 'Odbijen' });
        await loadAllData();
        alert('Zahtev je odbijen!');
    } catch (error) {
        alert('Greška: ' + error.message);
    }
}

async function oznaciProcitanom(id) {
    const poruka = await getPorukaById(id);
    if (!poruka) return;
    
    try {
        await updatePoruka({ ...poruka, procitao: true });
        await loadAllData();
    } catch (error) {
        alert('Greška: ' + error.message);
    }
}

async function deletePorukaHandler(id) {
    if (!isAdmin()) return;
    
    if (confirm('Da li ste sigurni da želite da obrišete ovu poruku?')) {
        try {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.show('Brisanje poruke...');
            }
            
            await deletePoruka(id);
            await loadAllData();
            
            if (typeof toast !== 'undefined') {
                toast.success('Poruka je uspešno obrisana!');
            } else {
                alert('Poruka je uspešno obrisana!');
            }
        } catch (error) {
            console.error('Greška pri brisanju:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Greška pri brisanju: ' + error.message);
            } else {
                alert('Greška pri brisanju: ' + error.message);
            }
        } finally {
            if (typeof loadingManager !== 'undefined') {
                loadingManager.hide();
            }
        }
    }
}

// Form submit handleri
document.getElementById('form-poruke').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // PRIVATNOST: Samo administrator može da šalje poruke
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za slanje poruka');
        } else {
            alert('Nemate dozvolu za slanje poruka');
        }
        return;
    }
    
    const button = e.target.querySelector('button[type="submit"]');
    
    try {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, true);
        }
        
        const radnikId = document.getElementById('poruke-radnik').value;
        const naslov = document.getElementById('poruke-naslov').value;
        const poruka = document.getElementById('poruke-poruka').value;
        
        if (!naslov || !poruka) {
            if (typeof toast !== 'undefined') {
                toast.warning('Naslov i poruka su obavezni!');
            } else {
                alert('Naslov i poruka su obavezni!');
            }
            return;
        }
        
        if (radnikId === 'svi') {
            // Pošalji svim radnicima i korisnicima
            const radniciSaNalogom = radnici.filter(r => {
                const korisnik = korisnici.find(k => k.radnikId === r.id);
                return korisnik && korisnik.uloga === 'radnik';
            });
            
            for (const radnik of radniciSaNalogom) {
                await addPoruka({
                    radnikId: radnik.id,
                    naslov: naslov,
                    poruka: poruka,
                    datum: new Date().toISOString().split('T')[0],
                    procitao: false
                });
            }
            
            // Pošalji svim običnim korisnicima
            const obicniKorisnici = korisnici.filter(k => k.uloga === 'urednik');
            for (const korisnik of obicniKorisnici) {
                await addPoruka({
                    userId: korisnik.id,
                    naslov: naslov,
                    poruka: poruka,
                    datum: new Date().toISOString().split('T')[0],
                    procitao: false
                });
            }
        } else {
            await addPoruka({
                radnikId: parseInt(radnikId),
                naslov: naslov,
                poruka: poruka,
                datum: new Date().toISOString().split('T')[0],
                procitao: false
            });
        }
        
        await loadAllData();
        closeModal('poruke');
        
        if (typeof toast !== 'undefined') {
            toast.success('Poruka je uspešno poslata!');
        } else {
            alert('Poruka je uspešno poslata!');
        }
    } catch (error) {
        console.error('Greška:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Greška: ' + error.message);
        } else {
            alert('Greška: ' + error.message);
        }
    } finally {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, false);
        }
    }
});

document.getElementById('form-radnik-zahtev-odmor').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser || !currentUser.radnikId) return;
    
    const button = e.target.querySelector('button[type="submit"]');
    
    try {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, true);
        }
        
        const pocetak = document.getElementById('zahtev-odmor-pocetak').value;
        const brojDana = parseInt(document.getElementById('zahtev-odmor-dana').value);
        const napomena = document.getElementById('zahtev-odmor-napomena').value;
        
        // Validacija broja dana
        if (typeof validateNumber !== 'undefined') {
            const danaValidation = validateNumber(brojDana, 1, 30);
            if (!danaValidation.valid) {
                if (typeof toast !== 'undefined') {
                    toast.error(danaValidation.error);
                } else {
                    alert(danaValidation.error);
                }
                return;
            }
        }
        
        const pocetakDate = new Date(pocetak);
        const zavrsetakDate = new Date(pocetakDate);
        zavrsetakDate.setDate(pocetakDate.getDate() + brojDana - 1);
        
        await addZahtevOdmor({
            radnikId: currentUser.radnikId,
            pocetak: pocetak,
            zavrsetak: zavrsetakDate.toISOString().split('T')[0],
            brojDana: brojDana,
            napomena: napomena,
            datum: new Date().toISOString().split('T')[0],
            status: 'Čeka'
        });
        
        await loadAllData();
        closeModal('radnik-zahtev-odmor');
        
        if (typeof toast !== 'undefined') {
            toast.success('Zahtev je uspešno poslat!');
        } else {
            alert('Zahtev je uspešno poslat!');
        }
    } catch (error) {
        console.error('Greška:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Greška: ' + error.message);
        } else {
            alert('Greška: ' + error.message);
        }
    } finally {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, false);
        }
    }
});

document.getElementById('form-radnik-zahtev-admin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser || !currentUser.radnikId) return;
    
    const button = e.target.querySelector('button[type="submit"]');
    
    try {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, true);
        }
        
        const tip = document.getElementById('zahtev-admin-tip').value;
        const opis = document.getElementById('zahtev-admin-opis').value;
        
        await addZahtevAdmin({
            radnikId: currentUser.radnikId,
            tip: tip,
            opis: opis,
            datum: new Date().toISOString().split('T')[0],
            status: 'Čeka'
        });
        
        await loadAllData();
        closeModal('radnik-zahtev-admin');
        
        if (typeof toast !== 'undefined') {
            toast.success('Zahtev je uspešno poslat!');
        } else {
            alert('Zahtev je uspešno poslat!');
        }
    } catch (error) {
        console.error('Greška:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Greška: ' + error.message);
        } else {
            alert('Greška: ' + error.message);
        }
    } finally {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, false);
        }
    }
});

// Form submit handler za user zahteve
document.getElementById('form-user-zahtev-admin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const button = e.target.querySelector('button[type="submit"]');
    
    try {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, true);
        }
        
        const tip = document.getElementById('user-zahtev-admin-tip').value;
        const opis = document.getElementById('user-zahtev-admin-opis').value;
        
        // User zahtevi se vezuju za korisnika (userId umesto radnikId)
        await addZahtevAdmin({
            userId: currentUser.id, // Koristimo userId za obične korisnike
            tip: tip,
            opis: opis,
            datum: new Date().toISOString().split('T')[0],
            status: 'Čeka'
        });
        
        await loadAllData();
        closeModal('user-zahtev-admin');
        
        if (typeof toast !== 'undefined') {
            toast.success('Zahtev je uspešno poslat!');
        } else {
            alert('Zahtev je uspešno poslat!');
        }
    } catch (error) {
        console.error('Greška:', error);
        if (typeof toast !== 'undefined') {
            toast.error('Greška: ' + error.message);
        } else {
            alert('Greška: ' + error.message);
        }
    } finally {
        if (typeof loadingManager !== 'undefined') {
            loadingManager.setButtonLoading(button, false);
        }
    }
});

// Form submit handler za restore
const restoreForm = document.getElementById('form-restore');
if (restoreForm) {
    restoreForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileInput = document.getElementById('restore-file');
        const file = fileInput.files[0];
        
        if (!file) {
            if (typeof toast !== 'undefined') {
                toast.warning('Molimo izaberite JSON fajl');
            } else {
                alert('Molimo izaberite JSON fajl');
            }
            return;
        }
        
        try {
            await BackupRestoreManager.restoreFromJSON(file);
        } catch (error) {
            console.error('Greška pri restore-u:', error);
            // Error se već prikazuje u BackupRestoreManager.restoreFromJSON
        }
    });
}

// Renderovanje user podataka
async function renderUserData() {
    if (!currentUser) return;
    
    // Renderuj profil
    document.getElementById('user-profil-ime').textContent = currentUser.ime;
    document.getElementById('user-profil-username').textContent = currentUser.username || 'N/A';
    document.getElementById('user-profil-email').textContent = currentUser.email || 'N/A';
    document.getElementById('user-profil-uloga').textContent = 'Urednik';
}

// Renderovanje user poruka
async function renderUserPoruke() {
    if (!currentUser) return;
    const tbody = document.getElementById('user-poruke-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // User vidi poruke koje su poslate svima ili specifično njemu (po userId)
    const userPoruke = poruke.filter(p => !p.radnikId || p.radnikId === 'svi' || p.userId === currentUser.id);
    
    if (userPoruke.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #999;">Nema poruka</td></tr>';
        return;
    }
    
    userPoruke.forEach(poruka => {
        const procitaoText = poruka.procitao ? 'Pročitano' : 'Nepročitano';
        const procitaoClass = poruka.procitao ? 'status-procitao' : 'status-neprocitao';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(poruka.datum)}</td>
            <td>${poruka.naslov || 'Nema naslova'}</td>
            <td>${poruka.poruka}</td>
            <td>
                <span class="status-badge ${procitaoClass}">${procitaoText}</span>
                ${!poruka.procitao ? `<button class="btn btn-sm btn-primary" onclick="oznaciProcitanom(${poruka.id})" style="margin-left: 10px;">Označi kao pročitano</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Renderovanje user zahteva
async function renderUserZahtevi() {
    if (!currentUser) return;
    const tbody = document.getElementById('user-zahtevi-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // User vidi svoje zahteve (vezane za userId)
    const userZahtevi = zahteviAdmin.filter(z => z.userId === currentUser.id);
    
    if (userZahtevi.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #999;">Nema zahteva</td></tr>';
        return;
    }
    
    userZahtevi.forEach(zahtev => {
        const statusClass = `status-${zahtev.status.toLowerCase().replace(' ', '-')}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${zahtev.tip}</td>
            <td>${formatDate(zahtev.datum)}</td>
            <td>${zahtev.opis}</td>
            <td><span class="status-badge ${statusClass}">${zahtev.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Funkcije za prikaz profila korisnika
async function showKorisnikProfil(korisnikId) {
    // PRIVATNOST: Samo administrator može da vidi profile korisnika
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za pregled profila korisnika');
        } else {
            alert('Nemate dozvolu za pregled profila korisnika');
        }
        return;
    }
    
    const korisnik = await getKorisnikById(korisnikId);
    if (!korisnik) {
        alert('Korisnik nije pronađen');
        return;
    }
    
    // Popuni osnovne informacije o korisniku
    document.getElementById('profil-korisnik-ime').textContent = korisnik.ime || 'N/A';
    document.getElementById('profil-korisnik-username').textContent = korisnik.username || 'N/A';
    document.getElementById('profil-korisnik-email').textContent = korisnik.email || 'N/A';
    
    let roleText = 'Urednik';
    if (korisnik.uloga === 'admin') roleText = 'Administrator';
    else if (korisnik.uloga === 'radnik') roleText = 'Radnik';
    else if (korisnik.uloga === 'urednik') roleText = 'Urednik';
    document.getElementById('profil-korisnik-uloga').textContent = roleText;
    
    // Ako je korisnik povezan sa radnikom, prikaži dodatne informacije
    if (korisnik.radnikId) {
        const radnik = await getRadnikById(korisnik.radnikId);
        if (radnik) {
            document.getElementById('profil-korisnik-radnik-row').style.display = 'flex';
            document.getElementById('profil-korisnik-radnik').textContent = radnik.ime;
            
            document.getElementById('profil-radnik-detalji').style.display = 'block';
            document.getElementById('profil-radnik-jmbg').textContent = radnik.jmbg || 'N/A';
            document.getElementById('profil-radnik-telefon').textContent = radnik.telefon || 'N/A';
            document.getElementById('profil-radnik-pozicija').textContent = radnik.pozicija || 'N/A';
            document.getElementById('profil-radnik-datum').textContent = formatDate(radnik.datum) || 'N/A';
        } else {
            document.getElementById('profil-korisnik-radnik-row').style.display = 'none';
            document.getElementById('profil-radnik-detalji').style.display = 'none';
        }
    } else {
        document.getElementById('profil-korisnik-radnik-row').style.display = 'none';
        document.getElementById('profil-radnik-detalji').style.display = 'none';
    }
    
    openModal('korisnik-profil');
}

async function showKorisnikProfilByRadnikId(radnikId) {
    // PRIVATNOST: Samo administrator može da vidi profile korisnika
    if (!isAdmin()) {
        if (typeof toast !== 'undefined') {
            toast.warning('Nemate dozvolu za pregled profila korisnika');
        } else {
            alert('Nemate dozvolu za pregled profila korisnika');
        }
        return;
    }
    
    // Pronađi korisnika povezanog sa ovim radnikom
    const korisnik = await getKorisnikByRadnikId(radnikId);
    if (korisnik) {
        await showKorisnikProfil(korisnik.id);
    } else {
        // Ako radnik nema nalog, prikaži samo informacije o radniku
        const radnik = await getRadnikById(radnikId);
        if (!radnik) {
            alert('Radnik nije pronađen');
            return;
        }
        
        document.getElementById('profil-korisnik-ime').textContent = radnik.ime || 'N/A';
        document.getElementById('profil-korisnik-username').textContent = 'Nema naloga';
        document.getElementById('profil-korisnik-email').textContent = radnik.email || 'N/A';
        document.getElementById('profil-korisnik-uloga').textContent = 'Radnik (bez naloga)';
        document.getElementById('profil-korisnik-radnik-row').style.display = 'none';
        
        document.getElementById('profil-radnik-detalji').style.display = 'block';
        document.getElementById('profil-radnik-jmbg').textContent = radnik.jmbg || 'N/A';
        document.getElementById('profil-radnik-telefon').textContent = radnik.telefon || 'N/A';
        document.getElementById('profil-radnik-pozicija').textContent = radnik.pozicija || 'N/A';
        document.getElementById('profil-radnik-datum').textContent = formatDate(radnik.datum) || 'N/A';
        
        openModal('korisnik-profil');
    }
}

// Funkcija za proveru da li radnik ima nalog i prikaz checkbox-a za slanje dokumenta
async function checkRadnikAccountAndShowSendOption(radnikSelectId, sendDocumentGroupId) {
    const radnikSelect = document.getElementById(radnikSelectId);
    const sendDocumentGroup = document.getElementById(sendDocumentGroupId);
    
    if (!radnikSelect || !sendDocumentGroup) return;
    
    const checkAccount = async () => {
        const radnikId = radnikSelect.value;
        if (radnikId) {
            const korisnik = await getKorisnikByRadnikId(parseInt(radnikId));
            if (korisnik) {
                sendDocumentGroup.style.display = 'block';
            } else {
                sendDocumentGroup.style.display = 'none';
                const checkbox = sendDocumentGroup.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.checked = false;
            }
        } else {
            sendDocumentGroup.style.display = 'none';
            const checkbox = sendDocumentGroup.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = false;
        }
    };
    
    radnikSelect.addEventListener('change', checkAccount);
    await checkAccount(); // Proveri i na inicijalizaciji
}

// Funkcija za slanje dokumenta korisniku
async function sendDocumentToUser(radnikId, documentType, documentData) {
    const korisnik = await getKorisnikByRadnikId(radnikId);
    if (!korisnik) {
        console.warn('Radnik nema nalog, dokument se ne može poslati');
        return;
    }
    
    let naslov = '';
    let poruka = '';
    
    if (documentType === 'plata') {
        const mesecNaziv = getMonthName(documentData.mesec);
        naslov = `Platna lista - ${mesecNaziv} ${documentData.godina}`;
        const osnovna = parseFloat(documentData.osnovna) || 0;
        const bonusi = parseFloat(documentData.bonusi) || 0;
        const prekovremeni = parseFloat(documentData.prekovremeni) || 0;
        const nocni = parseFloat(documentData.nocni) || 0;
        const praznicki = parseFloat(documentData.praznicki) || 0;
        const regres = parseFloat(documentData.regres) || 0;
        const staz = parseFloat(documentData.staz) || 0;
        const ukupnoDobitci = osnovna + bonusi + prekovremeni + nocni + praznicki + regres + staz;
        
        const pio = parseFloat(documentData.pio) || 0;
        const zo = parseFloat(documentData.zo) || 0;
        const nezaposlenost = parseFloat(documentData.nezaposlenost) || 0;
        const porez = parseFloat(documentData.porez) || 0;
        const doprinosi = parseFloat(documentData.doprinosi) || 0;
        const dugovanja = parseFloat(documentData.dugovanja) || 0;
        const ostaliOdbitci = parseFloat(documentData.ostaliOdbitci) || 0;
        const ukupnoOdbitci = pio + zo + nezaposlenost + porez + doprinosi + dugovanja + ostaliOdbitci;
        const ukupno = ukupnoDobitci - ukupnoOdbitci;
        
        poruka = `Vaša platna lista za ${mesecNaziv} ${documentData.godina}:\n\n` +
                 `Dobitci: ${formatCurrency(ukupnoDobitci)}\n` +
                 `Odbitci: ${formatCurrency(ukupnoOdbitci)}\n` +
                 `Ukupno: ${formatCurrency(ukupno)}`;
    } else if (documentType === 'odmor') {
        naslov = `Godišnji odmor - ${formatDate(documentData.pocetak)} do ${formatDate(documentData.zavrsetak)}`;
        const brojDana = calculateDays(documentData.pocetak, documentData.zavrsetak);
        poruka = `Informacije o vašem godišnjem odmoru:\n\n` +
                 `Period: ${formatDate(documentData.pocetak)} - ${formatDate(documentData.zavrsetak)}\n` +
                 `Broj dana: ${brojDana}\n` +
                 `Status: ${documentData.status}`;
    } else if (documentType === 'evidencija') {
        naslov = `Evidencija - ${documentData.tip}`;
        poruka = `Informacije o evidenciji:\n\n` +
                 `Tip: ${documentData.tip}\n` +
                 `Datum: ${formatDate(documentData.datum)}\n` +
                 `Opis: ${documentData.opis}`;
    }
    
    if (naslov && poruka) {
        await addPoruka({
            radnikId: radnikId,
            naslov: naslov,
            poruka: poruka,
            datum: new Date().toISOString().split('T')[0],
            procitao: false
        });
    }
}

// Inicijalizacija aplikacije kada se stranica učita
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
