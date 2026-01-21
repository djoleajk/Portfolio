// Pomoćne funkcije
PeriodTracker.prototype.switchTab = function(tabName) {
    // Sakrij sve tabove
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Ukloni active klasu sa svih dugmadi
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Prikaži odabrani tab
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Aktiviraj odgovarajuće dugme
    const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    // Ažuriraj UI u zavisnosti od taba
    if (tabName === 'dashboard') {
        this.updateDashboard();
    } else if (tabName === 'calendar') {
        this.renderCalendar();
    } else if (tabName === 'symptoms') {
        this.updateSymptomsDisplay();
    }
};

PeriodTracker.prototype.closeModal = function(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        // Koristi Bootstrap modal API ako je dostupan
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                // Fallback na custom implementaciju
                modalElement.classList.remove('show');
                modalElement.style.display = 'none';
                document.body.classList.remove('modal-open');
                const backdrop = document.getElementById('customModalBackdrop') || document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }
        } else {
            // Fallback na custom implementaciju
            modalElement.classList.remove('show', 'active');
            modalElement.style.display = 'none';
            document.body.classList.remove('modal-open');
            const backdrop = document.getElementById('customModalBackdrop') || document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }
    }
};

PeriodTracker.prototype.openModal = function(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        // Koristi Bootstrap modal API ako je dostupan
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            // Proveri da li modal već postoji
            let modal = bootstrap.Modal.getInstance(modalElement);
            if (!modal) {
                modal = new bootstrap.Modal(modalElement, {
                    backdrop: true,
                    keyboard: true,
                    focus: true
                });
            }
            modal.show();
        } else {
            // Fallback na custom implementaciju
            modalElement.classList.add('show', 'active');
            modalElement.style.display = 'block';
            // Dodaj backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'customModalBackdrop';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
        }
    }
};

PeriodTracker.prototype.fixGrammarErrors = function(text) {
    // Ispravljanje čestih gramatičkih grešaka
    let fixed = text;
    
    // Ispravljanje ijekavice u ekavicu
    fixed = fixed.replace(/lijepo/gi, 'lepo');
    fixed = fixed.replace(/dio/gi, 'deo');
    fixed = fixed.replace(/mlijeko/gi, 'mleko');
    fixed = fixed.replace(/sretan/gi, 'srećan');
    fixed = fixed.replace(/želio/gi, 'želeo');
    fixed = fixed.replace(/htio/gi, 'hteo');
    fixed = fixed.replace(/lijep/gi, 'lep');
    fixed = fixed.replace(/lijepa/gi, 'lepa');
    fixed = fixed.replace(/lijepi/gi, 'lepi');
    
    // Ispravljanje trećeg lica množine u drugo lice jednine
    fixed = fixed.replace(/ocenjujete/gi, 'ocenjuješ');
    fixed = fixed.replace(/ste/gi, 'si');
    fixed = fixed.replace(/biste/gi, 'bi');
    fixed = fixed.replace(/imate/gi, 'imaš');
    fixed = fixed.replace(/osećate/gi, 'osećaš');
    
    return fixed;
};

PeriodTracker.prototype.formatDate = function(date) {
    if (!date) return '-';
    
    const d = new Date(date);
    const months = [
        'januar', 'februar', 'mart', 'april', 'maj', 'jun',
        'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'
    ];
    
    const days = [
        'nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'
    ];
    
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const dayName = days[d.getDay()];
    
    return `${dayName}, ${day}. ${month} ${year}.`;
};

PeriodTracker.prototype.formatDateShort = function(date) {
    if (!date) return '-';
    
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    
    return `${day}.${month}.${year}.`;
};

PeriodTracker.prototype.getDaysBetween = function(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffTime = Math.abs(secondDate - firstDate);
    return Math.round(diffTime / oneDay);
};
