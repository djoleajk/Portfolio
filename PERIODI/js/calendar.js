// Modul za kalendar
PeriodTracker.prototype.renderCalendar = function() {
    if (!this.calendarDate) {
        this.calendarDate = new Date();
    }
    
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    
    // Ažuriraj zaglavlje
    this.updateCalendarHeader();
    
    // Kreiraj grid
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Dodaj dane u nedelji
    const dayNames = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
    dayNames.forEach(dayName => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = dayName;
        grid.appendChild(dayHeader);
    });
    
    // Prvi dan meseca
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Ponedeljak = 0
    
    // Poslednji dan meseca
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Prethodni mesec - poslednji dani
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Dodaj prazne ćelije za dane pre početka meseca
    for (let i = 0; i < firstDayOfWeek; i++) {
        const day = prevMonthLastDay - firstDayOfWeek + i + 1;
        const date = new Date(year, month - 1, day);
        const dayEl = this.createCalendarDay(date, true);
        grid.appendChild(dayEl);
    }
    
    // Dodaj dane trenutnog meseca
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEl = this.createCalendarDay(date, false);
        grid.appendChild(dayEl);
    }
    
    // Dodaj prazne ćelije za dane posle kraja meseca
    const totalCells = firstDayOfWeek + daysInMonth;
    const remainingCells = 7 - (totalCells % 7);
    if (remainingCells < 7) {
        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(year, month + 1, day);
            const dayEl = this.createCalendarDay(date, true);
            grid.appendChild(dayEl);
        }
    }
};

PeriodTracker.prototype.createCalendarDay = function(date, isOtherMonth) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = date.getDate();
    dayEl.setAttribute('data-date', date.toISOString().split('T')[0]);
    
    if (isOtherMonth) {
        dayEl.classList.add('other-month');
    }
    
    // Proveri da li je danas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === today.getTime()) {
        dayEl.classList.add('today');
    }
    
    // Dodaj klase za ciklus
    const dayClass = this.getDayClass(date);
    if (dayClass) {
        dayEl.classList.add(dayClass);
    }
    
    // Dodaj event listener za klik
    dayEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDayOptions(date);
    });
    
    return dayEl;
};

PeriodTracker.prototype.showDayOptions = function(date) {
    const dateStr = this.formatDateShort(date);
    const isMenstruationDay = this.isMenstruationDayForDate(date);
    const activeCycle = this.getActiveCycle();
    const hasSymptoms = this.symptoms.some(s => {
        const sDate = new Date(s.date);
        sDate.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return sDate.getTime() === checkDate.getTime();
    });
    
    // Kreiraj modal sa opcijama
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'flex';
    modal.id = 'dayOptionsModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-calendar-day"></i> Opcije za ${dateStr}
                    </h5>
                    <button type="button" class="btn-close" data-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="day-options-list">
                        ${!activeCycle || !isMenstruationDay ? `
                            <button class="day-option-btn" data-action="start-cycle">
                                <i class="fas fa-play"></i>
                                <span>Počni Menstruaciju</span>
                            </button>
                        ` : ''}
                        ${isMenstruationDay && activeCycle ? `
                            <button class="day-option-btn" data-action="end-cycle">
                                <i class="fas fa-stop"></i>
                                <span>Prekini Menstruaciju</span>
                            </button>
                            <button class="day-option-btn" data-action="continue-cycle">
                                <i class="fas fa-clock"></i>
                                <span>Menstruacija Još Traje</span>
                            </button>
                        ` : ''}
                        <button class="day-option-btn" data-action="add-symptoms">
                            <i class="fas fa-edit"></i>
                            <span>${hasSymptoms ? 'Izmeni Simptome' : 'Dodaj Simptome'}</span>
                        </button>
                        <button class="day-option-btn" data-action="start-survey">
                            <i class="fas fa-clipboard-list"></i>
                            <span>Popuni Anketu</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeneri
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };
    
    modal.querySelector('.btn-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Opcije
    modal.querySelectorAll('.day-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            closeModal();
            this.handleDayOption(action, date);
        });
    });
};

PeriodTracker.prototype.handleDayOption = function(action, date) {
    switch(action) {
        case 'start-cycle':
            this.startCycleFromDate(date);
            break;
        case 'end-cycle':
            this.endCycleFromDate(date);
            break;
        case 'continue-cycle':
            this.continueCycleFromDate(date);
            break;
        case 'add-symptoms':
            this.addSymptomsForDate(date);
            break;
        case 'start-survey':
            this.startSurveyForDate(date);
            break;
    }
};

PeriodTracker.prototype.startCycleFromDate = function(date) {
    const dateInput = document.getElementById('startCycleDate');
    const durationInput = document.getElementById('startCycleDuration');
    
    if (dateInput) {
        dateInput.value = date.toISOString().split('T')[0];
    }
    
    if (durationInput) {
        durationInput.value = this.settings.avgPeriodLength || 5;
    }
    
    this.openModal('startCycleModal');
};

PeriodTracker.prototype.endCycleFromDate = async function(date) {
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) {
        this.showWarning('Nema aktivnog ciklusa.');
        return;
    }
    
    const confirmed = await this.showConfirmDialog(
        `Da li želiš da prekineš menstruaciju na dan ${this.formatDateShort(date)}?`,
        'Prekini Menstruaciju',
        'Prekini',
        'Otkaži'
    );
    
    if (confirmed) {
        const startDate = new Date(activeCycle.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(0, 0, 0, 0);
        
        const diffDays = this.getDaysBetween(startDate, endDate);
        
        if (diffDays < 0) {
            this.showError('Datum prekida ne može biti pre početka ciklusa.');
            return;
        }
        
        activeCycle.duration = diffDays + 1;
        activeCycle.endDate = date;
        
        this.saveData();
        this.updateDashboard();
        this.renderCalendar();
        this.showSuccess(`Menstruacija je prekinuta na dan ${this.formatDateShort(date)}.`);
    }
};

PeriodTracker.prototype.continueCycleFromDate = function(date) {
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) {
        this.showWarning('Nema aktivnog ciklusa.');
        return;
    }
    
    const startDate = new Date(activeCycle.startDate);
    startDate.setHours(0, 0, 0, 0);
    const continueDate = new Date(date);
    continueDate.setHours(0, 0, 0, 0);
    
    const diffDays = this.getDaysBetween(startDate, continueDate);
    
    if (diffDays < 0) {
        this.showError('Datum ne može biti pre početka ciklusa.');
        return;
    }
    
    // Ažuriraj dužinu menstruacije
    activeCycle.duration = diffDays + 1;
    
    this.saveData();
    this.updateDashboard();
    this.renderCalendar();
    this.showInfo(`Menstruacija je označena da traje do ${this.formatDateShort(date)}.`);
};

PeriodTracker.prototype.addSymptomsForDate = function(date) {
    const dateInput = document.getElementById('symptomDate');
    if (dateInput) {
        dateInput.value = date.toISOString().split('T')[0];
    }
    
    // Proveri da li već postoji unos
    const existingSymptom = this.symptoms.find(s => {
        const sDate = new Date(s.date);
        sDate.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return sDate.getTime() === checkDate.getTime();
    });
    
    if (existingSymptom) {
        // Popuni formu sa postojećim podacima
        document.getElementById('energyRange').value = existingSymptom.energy || 5;
        document.getElementById('moodRange').value = existingSymptom.mood || 5;
        document.getElementById('painRange').value = existingSymptom.pain || 1;
        document.getElementById('libidoRange').value = existingSymptom.libido || 5;
        
        // Ažuriraj vrednosti
        document.getElementById('energyValue').textContent = existingSymptom.energy || 5;
        document.getElementById('moodValue').textContent = existingSymptom.mood || 5;
        document.getElementById('painValue').textContent = existingSymptom.pain || 1;
        document.getElementById('libidoValue').textContent = existingSymptom.libido || 5;
        
        // Checkboxe
        if (existingSymptom.additionalSymptoms) {
            existingSymptom.additionalSymptoms.forEach(symptom => {
                const checkbox = document.querySelector(`input[name="symptoms"][value="${symptom}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }
    
    // Prebaci na Symptoms tab
    const symptomsTab = document.querySelector('[data-tab="symptoms"]');
    if (symptomsTab) {
        symptomsTab.click();
    }
    
    // Scrolluj do forme
    setTimeout(() => {
        const form = document.getElementById('symptomForm');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 300);
};

PeriodTracker.prototype.startSurveyForDate = function(date) {
    // Prebaci na Dashboard tab
    const dashboardTab = document.querySelector('[data-tab="dashboard"]');
    if (dashboardTab) {
        dashboardTab.click();
    }
    
    // Pokreni anketu
    setTimeout(() => {
        if (this.surveyModule) {
            this.surveyModule.startSurvey();
        }
    }, 300);
};

PeriodTracker.prototype.getDayClass = function(date) {
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) return null;
    
    const startDate = new Date(activeCycle.startDate);
    startDate.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const diffDays = this.getDaysBetween(startDate, checkDate);
    const cycleDay = diffDays + 1;
    
    // Proveri da li je dan u ovom ciklusu
    const cycleLength = this.calculateAverageCycleLength();
    if (cycleDay < 1 || cycleDay > cycleLength) {
        // Proveri da li je dan u budućem ciklusu
        const nextPeriodStart = new Date(startDate);
        nextPeriodStart.setDate(nextPeriodStart.getDate() + cycleLength);
        nextPeriodStart.setHours(0, 0, 0, 0);
        
        if (checkDate >= nextPeriodStart) {
            const nextDiffDays = this.getDaysBetween(nextPeriodStart, checkDate);
            const nextCycleDay = nextDiffDays + 1;
            
            if (nextCycleDay <= cycleLength) {
                return this.getPhaseClassForDay(nextCycleDay, activeCycle, cycleLength);
            }
        }
        return null;
    }
    
    return this.getPhaseClassForDay(cycleDay, activeCycle, cycleLength);
};

PeriodTracker.prototype.getPhaseClassForDay = function(day, activeCycle, cycleLength) {
    const periodLength = activeCycle.duration || this.settings.avgPeriodLength || 5;
    const lutealPhaseLength = 14;
    const ovulationDay = cycleLength - lutealPhaseLength;
    
    // Menstruacija: dani 1 do periodLength
    if (day <= periodLength) {
        return 'menstruation';
    }
    
    // Ovulacija: tačan dan ovulacije
    if (day === ovulationDay) {
        return 'ovulation';
    }
    
    // Plodni dani: 5 dana pre ovulacije, dan ovulacije, i 1 dan posle (ali ne uključuj dan ovulacije jer je već označen)
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;
    if (day >= fertileStart && day <= fertileEnd && day !== ovulationDay) {
        return 'fertile';
    }
    
    // Folikularna faza: od kraja menstruacije do početka plodnih dana
    if (day > periodLength && day < fertileStart) {
        return 'follicular';
    }
    
    // Lutealna faza: od kraja plodnih dana do kraja ciklusa
    if (day > fertileEnd) {
        return 'luteal';
    }
    
    return null;
};

PeriodTracker.prototype.changeMonth = function(direction) {
    if (!this.calendarDate) {
        this.calendarDate = new Date();
    }
    
    if (direction === 'prev') {
        this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
    } else if (direction === 'next') {
        this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
    }
    
    this.renderCalendar();
};

PeriodTracker.prototype.updateCalendarHeader = function() {
    if (!this.calendarDate) {
        this.calendarDate = new Date();
    }
    
    const months = [
        'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
        'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];
    
    const monthYear = document.getElementById('calendarMonthYear');
    if (monthYear) {
        monthYear.textContent = `${months[this.calendarDate.getMonth()]} ${this.calendarDate.getFullYear()}`;
    }
};
