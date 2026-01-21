// Autentifikacija i autorizacija
let currentUser = null;

// Provera da li je korisnik prijavljen
function isLoggedIn() {
    return currentUser !== null;
}

// Provera da li je korisnik admin
function isAdmin() {
    return currentUser && currentUser.uloga === 'admin';
}

// Provera da li je korisnik radnik
function isRadnik() {
    return currentUser && currentUser.uloga === 'radnik';
}

// Provera da li je korisnik user (običan korisnik)
function isUser() {
    return currentUser && currentUser.uloga === 'urednik';
}

// Prijava korisnika
async function login(username, password) {
    try {
        console.log('Pokušaj login-a za:', username);
        
        const korisnik = await getKorisnikByUsername(username);
        console.log('Pronađen korisnik:', korisnik ? korisnik.username : 'null');
        
        if (!korisnik) {
            console.error('Korisnik nije pronađen:', username);
            throw new Error('Neispravno korisničko ime ili lozinka');
        }

        console.log('Provera lozinke...');
        console.log('Hash funkcije dostupne:', typeof hashPassword !== 'undefined' && typeof verifyPassword !== 'undefined');
        console.log('Dužina lozinke u bazi:', korisnik.password ? korisnik.password.length : 'undefined');

        // Proveri lozinku (hash-ovanu ili plain text za retroaktivnu kompatibilnost)
        let passwordMatch = false;
        
        if (typeof hashPassword !== 'undefined' && typeof verifyPassword !== 'undefined') {
            // Nova verzija sa hash-ovanjem
            if (korisnik.password && korisnik.password.length === 64) {
                // Hash-ovana lozinka (SHA-256 = 64 karaktera)
                console.log('Koristi hash-ovanu lozinku za proveru');
                passwordMatch = await verifyPassword(password, korisnik.password);
                console.log('Provera hash-ovane lozinke:', passwordMatch);
            } else {
                // Stara plain text lozinka - hash-uj i uporedi
                console.log('Koristi plain text lozinku za proveru');
                const hashedPassword = await hashPassword(password);
                passwordMatch = hashedPassword === korisnik.password || korisnik.password === password;
                console.log('Provera plain text lozinke:', passwordMatch);
                
                // Ako se poklapa, ažuriraj na hash-ovanu verziju
                if (passwordMatch) {
                    const newHashedPassword = await hashPassword(password);
                    await updateKorisnik({ ...korisnik, password: newHashedPassword });
                    console.log('Lozinka ažurirana na hash-ovanu verziju');
                }
            }
        } else {
            // Fallback na plain text ako hash funkcije nisu dostupne
            console.log('Fallback na plain text proveru');
            passwordMatch = korisnik.password === password;
        }

        if (!passwordMatch) {
            console.error('Lozinka se ne poklapa');
            throw new Error('Neispravno korisničko ime ili lozinka');
        }

        console.log('Login uspešan!');
        
        // Ukloni password iz objekta korisnika pre čuvanja
        const { password: _, ...userWithoutPassword } = korisnik;
        currentUser = userWithoutPassword;
        
        // Sačuvaj sesiju u sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        return currentUser;
    } catch (error) {
        console.error('Login greška:', error);
        throw error;
    }
}

// Odjava korisnika
function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    location.reload();
}

// Učitaj sesiju ako postoji
function loadSession() {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Ažuriranje UI-a na osnovu uloge
function updateUIForRole() {
    const adminElements = document.querySelectorAll('.admin-only');
    const adminUserElements = document.querySelectorAll('.admin-user-only');
    const radnikElements = document.querySelectorAll('.radnik-only');
    const userElements = document.querySelectorAll('.user-only');
    
    if (isAdmin()) {
        adminElements.forEach(el => {
            el.style.display = '';
        });
        adminUserElements.forEach(el => {
            el.style.display = '';
        });
        radnikElements.forEach(el => {
            el.style.display = 'none';
        });
        userElements.forEach(el => {
            el.style.display = 'none';
        });
    } else if (isRadnik()) {
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        adminUserElements.forEach(el => {
            el.style.display = 'none';
        });
        radnikElements.forEach(el => {
            el.style.display = '';
        });
        userElements.forEach(el => {
            el.style.display = 'none';
        });
        // Aktiviraj prvi radnik tab
        const firstRadnikTab = document.querySelector('.radnik-only.tab-btn');
        if (firstRadnikTab) {
            firstRadnikTab.click();
        }
    } else if (isUser()) {
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        adminUserElements.forEach(el => {
            el.style.display = 'none';
        });
        radnikElements.forEach(el => {
            el.style.display = 'none';
        });
        userElements.forEach(el => {
            el.style.display = '';
        });
        // Aktiviraj prvi user tab
        const firstUserTab = document.querySelector('.user-only.tab-btn');
        if (firstUserTab) {
            firstUserTab.click();
        }
    } else {
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        adminUserElements.forEach(el => {
            el.style.display = 'none';
        });
        radnikElements.forEach(el => {
            el.style.display = 'none';
        });
        userElements.forEach(el => {
            el.style.display = 'none';
        });
    }

    // Ažuriraj ime i ulogu korisnika
    if (currentUser) {
        // Desktop elementi
        const desktopUserName = document.getElementById('current-user-name');
        const desktopRoleBadge = document.getElementById('current-user-role');
        
        // Mobilni elementi
        const mobileUserName = document.getElementById('mobile-current-user-name');
        const mobileRoleBadge = document.getElementById('mobile-current-user-role');
        const mobileSidebarUserName = document.getElementById('mobile-sidebar-user-name');
        const mobileSidebarRoleBadge = document.getElementById('mobile-sidebar-user-role');
        
        let roleText = 'Urednik';
        if (currentUser.uloga === 'admin') roleText = 'Administrator';
        else if (currentUser.uloga === 'radnik') roleText = 'Radnik';
        else if (currentUser.uloga === 'urednik') roleText = 'Urednik';
        
        // Ažuriraj desktop
        if (desktopUserName) desktopUserName.textContent = currentUser.ime;
        if (desktopRoleBadge) {
            desktopRoleBadge.textContent = roleText;
            desktopRoleBadge.className = `role-badge role-${currentUser.uloga}`;
        }
        
        // Ažuriraj mobilni header
        if (mobileUserName) mobileUserName.textContent = currentUser.ime;
        if (mobileRoleBadge) {
            mobileRoleBadge.textContent = roleText;
            mobileRoleBadge.className = `role-badge role-${currentUser.uloga}`;
        }
        
        // Ažuriraj mobilni sidebar footer
        if (mobileSidebarUserName) mobileSidebarUserName.textContent = currentUser.ime;
        if (mobileSidebarRoleBadge) {
            mobileSidebarRoleBadge.textContent = roleText;
            mobileSidebarRoleBadge.className = `role-badge role-${currentUser.uloga}`;
        }
    }
    
    // Postavi aktivni tab na osnovu uloge
    if (isAdmin()) {
        const firstAdminTab = document.querySelector('.admin-only.tab-btn.active') || 
                             document.querySelector('.admin-only.tab-btn');
        if (firstAdminTab) {
            const tabName = firstAdminTab.getAttribute('data-tab');
            if (tabName && typeof switchTab !== 'undefined') {
                switchTab(tabName);
            }
        }
    } else if (isRadnik()) {
        const firstRadnikTab = document.querySelector('.radnik-only.tab-btn.active') || 
                               document.querySelector('.radnik-only.tab-btn');
        if (firstRadnikTab) {
            const tabName = firstRadnikTab.getAttribute('data-tab');
            if (tabName && typeof switchTab !== 'undefined') {
                switchTab(tabName);
            }
        }
    } else if (isUser()) {
        const firstUserTab = document.querySelector('.user-only.tab-btn.active') || 
                            document.querySelector('.user-only.tab-btn');
        if (firstUserTab) {
            const tabName = firstUserTab.getAttribute('data-tab');
            if (tabName && typeof switchTab !== 'undefined') {
                switchTab(tabName);
            }
        }
    }
    
    // Ponovo postavi mobilni interfejs nakon promene uloge
    if (typeof setupMobileInterface !== 'undefined') {
        setupMobileInterface();
    }
}

