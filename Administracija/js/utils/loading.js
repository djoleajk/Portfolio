// Loading Helper Functions
class LoadingManager {
    constructor() {
        this.overlay = null;
        this.activeRequests = 0;
    }

    show(message = 'Učitavanje...') {
        this.activeRequests++;
        
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay';
            this.overlay.innerHTML = `
                <div>
                    <div class="spinner"></div>
                    <p style="color: white; margin-top: 20px; text-align: center;">${message}</p>
                </div>
            `;
            document.body.appendChild(this.overlay);
        }
    }

    hide() {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        
        if (this.activeRequests === 0 && this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    setButtonLoading(button, loading = true) {
        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }
}

// Globalna instanca
const loadingManager = new LoadingManager();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoadingManager, loadingManager };
}

