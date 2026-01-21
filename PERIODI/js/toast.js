// Modul za Toast notifikacije
class Toast {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Kreiraj toast container ako ne postoji
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
            this.container = container;
        } else {
            this.container = document.getElementById('toastContainer');
        }
    }
    
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        const toastContent = `
            <div class="toast-content">
                <i class="${icon}"></i>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" aria-label="Zatvori">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toast.innerHTML = toastContent;
        this.container.appendChild(toast);
        
        // Animacija pojavljivanja
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Zatvori dugme
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });
        
        // Automatsko zatvaranje
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }
        
        return toast;
    }
    
    hide(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// Globalna instanca
let toastInstance = null;

// Helper funkcije za PeriodTracker
PeriodTracker.prototype.showToast = function(message, type = 'info', duration = 3000) {
    if (!toastInstance) {
        toastInstance = new Toast();
    }
    return toastInstance.show(message, type, duration);
};

PeriodTracker.prototype.showSuccess = function(message, duration = 3000) {
    if (!toastInstance) {
        toastInstance = new Toast();
    }
    return toastInstance.success(message, duration);
};

PeriodTracker.prototype.showError = function(message, duration = 4000) {
    if (!toastInstance) {
        toastInstance = new Toast();
    }
    return toastInstance.error(message, duration);
};

PeriodTracker.prototype.showWarning = function(message, duration = 3500) {
    if (!toastInstance) {
        toastInstance = new Toast();
    }
    return toastInstance.warning(message, duration);
};

PeriodTracker.prototype.showInfo = function(message, duration = 3000) {
    if (!toastInstance) {
        toastInstance = new Toast();
    }
    return toastInstance.info(message, duration);
};
