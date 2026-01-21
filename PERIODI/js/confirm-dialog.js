// Modul za konfirmacione dijaloge
PeriodTracker.prototype.showConfirmDialog = function(message, title = 'Potvrda', confirmText = 'Potvrdi', cancelText = 'Otkaži') {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-action="cancel">${cancelText}</button>
                        <button type="button" class="btn btn-primary" data-action="confirm">${confirmText}</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };
        
        modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
            closeModal();
            resolve(true);
        });
        
        modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            closeModal();
            resolve(false);
        });
        
        modal.querySelector('.btn-close').addEventListener('click', () => {
            closeModal();
            resolve(false);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                resolve(false);
            }
        });
    });
};
