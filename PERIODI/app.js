// Glavna klasa PeriodTracker
class PeriodTracker {
    constructor() {
        // Inicijalizacija podataka
        this.cycles = [];
        this.symptoms = [];
        this.settings = {
            avgCycleLength: 28,
            avgPeriodLength: 5,
            notifications: {
                periodStart: true,
                ovulation: true,
                fertileWindow: true
            }
        };
        this.reminders = [];
        this.currentDate = new Date();
        this.calendarDate = new Date();
        
        // Inicijalizuj module
        this.surveyModule = new Anketa(this);
        this.symptomFormModule = new FormularZaSimptome(this);
        
        // Inicijalizuj aplikaciju
        this.init();
    }
    
    init() {
        // Učitaj podatke iz localStorage
        this.loadData();
        
        // Postavi event listenere
        this.setupEventListeners();
        
        // Ažuriraj UI
        this.updateDashboard();
        this.renderCalendar();
        this.updateSymptomsDisplay();
        this.loadSettings();
        this.initTheme();
        
        // Zakazi notifikacije
        this.scheduleCycleNotifications();
        
        // Ažuriraj status notifikacija
        if (this.updateNotificationStatus) {
            this.updateNotificationStatus();
        }
        
        // Mobile optimizacije
        if (this.initMobileOptimizations) {
            this.initMobileOptimizations();
        }
        
        // Anketa se ne pokreće automatski - korisnik može da je pokrene klikom na dugme
    }
    
    // Metode će biti dodate preko prototype-a u modulima
}

// Registruj Service Worker za PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
                
                // Proveri za update
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Novi service worker je spreman
                            console.log('New service worker available');
                        }
                    });
                });
                
                // Za Android, proveri dozvolu za notifikacije nakon registracije
                if ('Notification' in window && Notification.permission === 'default') {
                    // Ne traži automatski, već čekaj da korisnik klikne na dugme
                    console.log('Notification permission is default, waiting for user action');
                }
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

// Zatraži dozvolu za notifikacije pri učitavanju (samo ako je default)
if ('Notification' in window && Notification.permission === 'default') {
    // Ne traži automatski - korisnik mora eksplicitno da klikne na dugme
    // Ovo je bolje za Android jer ne blokira notifikacije
}

// Pokreni aplikaciju kada se DOM učita
document.addEventListener('DOMContentLoaded', () => {
    window.tracker = new PeriodTracker();
});
