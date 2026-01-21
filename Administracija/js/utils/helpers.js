// Helper funkcije za integraciju sa postojećim kodom
// Dark Mode Toggle
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        toggleBtn.title = isDark ? 'Light Mode' : 'Dark Mode';
    }
    
    if (typeof toast !== 'undefined') {
        toast.info(isDark ? 'Dark mode omogućen' : 'Light mode omogućen');
    }
}

// Učitaj dark mode preference pri inicijalizaciji
function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        document.body.classList.add('dark-mode');
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '☀️';
            toggleBtn.title = 'Light Mode';
        }
    }
}

// Pozovi pri učitavanju stranice
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}

// Wrapper funkcija za zamenu alert() sa toast
window.showAlert = function(message, type = 'info') {
    if (typeof toast !== 'undefined') {
        toast[type](message);
    } else {
        alert(message);
    }
};

// Wrapper za success poruke
window.showSuccess = function(message) {
    if (typeof toast !== 'undefined') {
        toast.success(message);
    } else {
        alert(message);
    }
};

// Wrapper za error poruke
window.showError = function(message) {
    if (typeof toast !== 'undefined') {
        toast.error(message);
    } else {
        alert(message);
    }
};

// Wrapper za warning poruke
window.showWarning = function(message) {
    if (typeof toast !== 'undefined') {
        toast.warning(message);
    } else {
        alert(message);
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { toggleDarkMode, initDarkMode };
}

