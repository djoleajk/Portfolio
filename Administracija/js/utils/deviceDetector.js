// Device Detection Utility
// Detektuje da li je uređaj mobilni ili desktop

/**
 * Proverava da li je trenutni uređaj mobilni
 * @returns {boolean} True ako je mobilni uređaj
 */
function isMobileDevice() {
    // Provera preko user agent-a
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    
    // Provera preko širine ekrana
    const isSmallScreen = window.innerWidth <= 768;
    
    // Provera touch support
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Kombinovana provera
    return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchScreen);
}

/**
 * Proverava da li je uređaj tablet
 * @returns {boolean} True ako je tablet
 */
function isTabletDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
    const isMediumScreen = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    return tabletRegex.test(userAgent) || isMediumScreen;
}

/**
 * Proverava da li je uređaj desktop
 * @returns {boolean} True ako je desktop
 */
function isDesktopDevice() {
    return !isMobileDevice() && !isTabletDevice();
}

/**
 * Dodaje klasu na body element na osnovu tipa uređaja
 */
function setDeviceClass() {
    const body = document.body;
    
    // Ukloni postojeće klase
    body.classList.remove('mobile-device', 'tablet-device', 'desktop-device');
    
    if (isMobileDevice()) {
        body.classList.add('mobile-device');
    } else if (isTabletDevice()) {
        body.classList.add('tablet-device');
    } else {
        body.classList.add('desktop-device');
    }
}

/**
 * Inicijalizuje detekciju uređaja i postavlja event listener za resize
 */
function initDeviceDetection() {
    setDeviceClass();
    
    // Ažuriraj klasu pri promeni veličine prozora
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setDeviceClass();
            // Obavesti aplikaciju o promeni
            window.dispatchEvent(new CustomEvent('deviceTypeChanged'));
        }, 250);
    });
}

// Eksportuj funkcije globalno
if (typeof window !== 'undefined') {
    window.isMobileDevice = isMobileDevice;
    window.isTabletDevice = isTabletDevice;
    window.isDesktopDevice = isDesktopDevice;
    window.setDeviceClass = setDeviceClass;
    window.initDeviceDetection = initDeviceDetection;
}

// Export za Node.js ili modul sistem
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isMobileDevice,
        isTabletDevice,
        isDesktopDevice,
        setDeviceClass,
        initDeviceDetection
    };
}

