// Toast Notification System
// Zamena za alert() sa lepim toast notifikacijama

class Toast {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Kreiraj container ako ne postoji
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    /**
     * Prikazuje toast notifikaciju
     * @param {string} message - Poruka za prikaz
     * @param {string} type - Tip (success, error, warning, info)
     * @param {number} duration - Trajanje u milisekundama
     */
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        this.container.appendChild(toast);
        
        // Animirani prikaz
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Automatsko sklanjanje
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    error(message, duration = 4000) {
        this.show(message, 'error', duration);
    }

    warning(message, duration = 3500) {
        this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Globalna instanca
const toast = new Toast();

// Export za Node.js ili modul sistem
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Toast, toast };
}

