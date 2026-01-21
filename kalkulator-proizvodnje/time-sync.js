// ============================================
// SISTEM ZA SINHRONIZACIJU SA ATOMSKIM SATOM
// Koristi WorldTimeAPI za precizno vreme
// ============================================

class AtomicTimeSynchronizer {
    constructor() {
        this.timeOffset = 0; // Razlika između lokalnog i server vremena
        this.lastSync = null;
        this.syncInProgress = false;
        this.updateInterval = null;
    }

    /**
     * Sinhronizuje vreme sa WorldTimeAPI serverom
     */
    async synchronizeTime() {
        if (this.syncInProgress) return;
        
        this.syncInProgress = true;
        
        try {
            const response = await fetch('https://worldtimeapi.org/api/timezone/Europe/Belgrade');
            
            if (!response.ok) {
                throw new Error('API nije dostupan');
            }
            
            const data = await response.json();
            
            // Dobijamo tačno vreme sa servera (u milisekundama)
            const serverTime = new Date(data.datetime).getTime();
            const localTime = Date.now();
            
            // Izračunavamo offset
            this.timeOffset = serverTime - localTime;
            this.lastSync = new Date();
            
            console.log('✓ Време синхронизовано са атомским сатом');
            console.log(`Офсет: ${this.timeOffset}ms`);
            
            return true;
        } catch (error) {
            console.warn('⚠ Грешка при синхронизацији:', error.message);
            console.log('Користи се локално време');
            return false;
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Vraća tačno trenutno vreme (sinhronizovano sa atomskim satom)
     */
    getCurrentTime() {
        return new Date(Date.now() + this.timeOffset);
    }

    /**
     * Pokreće prikaz sata i sinhronizaciju
     */
    async startClock(elementId = 'currentTime', options = {}) {
        const clockElement = document.getElementById(elementId);
        
        if (!clockElement) {
            console.error('Елемент за сат није пронађен:', elementId);
            return;
        }

        // Prva sinhronizacija
        await this.synchronizeTime();
        
        // Re-sinhronizacija svakih 30 minuta
        setInterval(() => {
            this.synchronizeTime();
        }, 30 * 60 * 1000);

        // Ažuriranje prikaza svake sekunde
        const updateDisplay = () => {
            const now = this.getCurrentTime();
            
            const timeString = now.toLocaleTimeString('sr-RS', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                timeZone: 'Europe/Belgrade'
            });
            
            clockElement.textContent = timeString;
            
            // Dodaj datum ako je opcija aktivna
            if (options.showDate) {
                const dateString = now.toLocaleDateString('sr-RS', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'Europe/Belgrade'
                });
                
                const dateElement = document.getElementById(options.dateElementId || 'currentDate');
                if (dateElement) {
                    dateElement.textContent = dateString;
                }
            }
        };

        // Prvo ažuriranje odmah
        updateDisplay();
        
        // Zatim svakih 1000ms
        this.updateInterval = setInterval(updateDisplay, 1000);
    }

    /**
     * Zaustavlja sat
     */
    stopClock() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Kreiramo globalnu instancu
const atomicClock = new AtomicTimeSynchronizer();

// Automatski pokreni sat kada se strana učita
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        atomicClock.startClock();
    });
} else {
    atomicClock.startClock();
}

