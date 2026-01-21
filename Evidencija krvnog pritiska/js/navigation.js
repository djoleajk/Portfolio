// Navigacija i sekcije

/**
 * Inicijalizuje navigaciju
 * @param {Function} onSectionChange - Callback funkcija koja se poziva kada se promeni sekcija
 */
export function initNavigation(onSectionChange) {
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Zatvori mobilni meni
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            
            // Pozovi callback ako postoji
            if (onSectionChange) {
                onSectionChange(targetId);
            }
        });
    });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Prikaži prvu sekciju
    showSection('unos');
}

/**
 * Prikazuje odabranu sekciju
 * @param {string} sectionId - ID sekcije
 */
export function showSection(sectionId) {
    // Sakrij sve sekcije
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Ukloni active klasu sa svih linkova
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Prikaži odabranu sekciju
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Aktiviraj odgovarajući link
    const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
}
