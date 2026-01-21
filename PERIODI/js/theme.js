// Modul za temu
PeriodTracker.prototype.initTheme = function() {
    const savedTheme = localStorage.getItem('periodi_theme') || 'light';
    this.setTheme(savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
};

PeriodTracker.prototype.toggleTheme = function() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
};

PeriodTracker.prototype.getTheme = function() {
    return document.documentElement.getAttribute('data-theme') || 'light';
};

PeriodTracker.prototype.setTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('periodi_theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        if (theme === 'light') {
            themeIcon.className = 'fas fa-moon theme-icon';
        } else {
            themeIcon.className = 'fas fa-sun theme-icon';
        }
    }
};
