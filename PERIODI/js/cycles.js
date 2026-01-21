// Modul za upravljanje ciklusima
PeriodTracker.prototype.getActiveCycle = function() {
    if (this.cycles.length === 0) return null;
    
    // Pronađi ciklus koji je aktivan (nema endDate)
    const activeCycle = this.cycles.find(cycle => !cycle.endDate);
    if (activeCycle) return activeCycle;
    
    // Ako nema aktivnog ciklusa, vrati poslednji
    return this.cycles[this.cycles.length - 1];
};

PeriodTracker.prototype.getCurrentCycleDay = function() {
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(activeCycle.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1; // Dan 1 je prvi dan
};

PeriodTracker.prototype.getCyclePhase = function(day) {
    if (!day) day = this.getCurrentCycleDay();
    if (!day) return null;
    
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) return null;
    
    const cycleLength = this.calculateAverageCycleLength();
    const periodLength = activeCycle.duration || this.settings.avgPeriodLength || 5;
    
    // Ovulacija se dešava oko 14 dana PRE početka sledeće menstruacije
    // Lutealna faza je konstantna i traje oko 14 dana
    const lutealPhaseLength = 14;
    const ovulationDay = cycleLength - lutealPhaseLength;
    
    // Menstruacija: dani 1 do periodLength
    if (day <= periodLength) {
        return {
            name: 'Menstruacija',
            description: 'Period menstruacije'
        };
    }
    
    // Plodni dani: 5 dana pre ovulacije, dan ovulacije, i 1 dan posle
    // Spermatozoidi mogu preživeti do 5 dana, jajna ćelija živi oko 24 sata
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;
    
    if (day === ovulationDay) {
        return {
            name: 'Ovulacija',
            description: 'Dan ovulacije'
        };
    } else if (day >= fertileStart && day <= fertileEnd) {
        return {
            name: 'Plodni dani',
            description: 'Plodni period'
        };
    } else if (day < ovulationDay) {
        return {
            name: 'Folikularna faza',
            description: 'Faza rasta folikula'
        };
    } else {
        return {
            name: 'Lutealna faza',
            description: 'Faza nakon ovulacije'
        };
    }
};

PeriodTracker.prototype.predictNextPeriod = function() {
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) return null;
    
    const avgCycleLength = this.calculateAverageCycleLength();
    const startDate = new Date(activeCycle.startDate);
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
    
    return nextPeriodDate;
};

PeriodTracker.prototype.predictOvulation = function() {
    const activeCycle = this.getActiveCycle();
    if (!activeCycle) return null;
    
    const avgCycleLength = this.calculateAverageCycleLength();
    // Ovulacija se dešava oko 14 dana PRE početka sledeće menstruacije
    // Lutealna faza je konstantna i traje oko 14 dana
    const lutealPhaseLength = 14;
    const ovulationDay = avgCycleLength - lutealPhaseLength;
    
    const startDate = new Date(activeCycle.startDate);
    const ovulationDate = new Date(startDate);
    ovulationDate.setDate(ovulationDate.getDate() + ovulationDay);
    
    return ovulationDate;
};

PeriodTracker.prototype.predictFertileWindow = function() {
    const ovulationDate = this.predictOvulation();
    if (!ovulationDate) return null;
    
    // Plodni dani: 5 dana pre ovulacije, dan ovulacije, i 1 dan posle
    // Spermatozoidi mogu preživeti do 5 dana u reproduktivnom traktu
    // Jajna ćelija je sposobna za oplodnju oko 24 sata nakon ovulacije
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);
    
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    
    return {
        start: fertileStart,
        end: fertileEnd
    };
};

PeriodTracker.prototype.startCycle = function(startDate, duration) {
    // Završi prethodni ciklus ako postoji
    const activeCycle = this.getActiveCycle();
    if (activeCycle && !activeCycle.endDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() - 1);
        activeCycle.endDate = endDate;
    }
    
    // Kreiraj novi ciklus
    const newCycle = {
        id: Date.now(),
        startDate: new Date(startDate),
        duration: duration || this.settings.avgPeriodLength,
        endDate: null
    };
    
    this.cycles.push(newCycle);
    this.saveData();
    
    return newCycle;
};

PeriodTracker.prototype.endCycle = function() {
    const activeCycle = this.getActiveCycle();
    if (activeCycle && !activeCycle.endDate) {
        activeCycle.endDate = new Date();
        this.saveData();
        return true;
    }
    return false;
};

PeriodTracker.prototype.calculateAverageCycleLength = function() {
    if (this.cycles.length < 2) {
        return this.settings.avgCycleLength || 28;
    }
    
    const completedCycles = this.cycles.filter(cycle => cycle.endDate);
    if (completedCycles.length < 2) {
        return this.settings.avgCycleLength || 28;
    }
    
    let totalLength = 0;
    for (let i = 1; i < completedCycles.length; i++) {
        const prevCycle = completedCycles[i - 1];
        const currCycle = completedCycles[i];
        const length = this.getDaysBetween(prevCycle.startDate, currCycle.startDate);
        totalLength += length;
    }
    
    const average = Math.round(totalLength / (completedCycles.length - 1));
    return average || this.settings.avgCycleLength || 28;
};

PeriodTracker.prototype.calculateAveragePeriodLength = function() {
    if (this.cycles.length === 0) {
        return this.settings.avgPeriodLength || 5;
    }
    
    const completedCycles = this.cycles.filter(cycle => cycle.duration);
    if (completedCycles.length === 0) {
        return this.settings.avgPeriodLength || 5;
    }
    
    const totalLength = completedCycles.reduce((sum, cycle) => sum + cycle.duration, 0);
    const average = Math.round(totalLength / completedCycles.length);
    return average || this.settings.avgPeriodLength || 5;
};

PeriodTracker.prototype.isMenstruationDay = function(date) {
    return this.isMenstruationDayForDate(date);
};

PeriodTracker.prototype.isMenstruationDayForDate = function(date) {
    if (!this.cycles || this.cycles.length === 0) return false;
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // Proveri sve cikluse (prošle, trenutne i buduće)
    for (let i = 0; i < this.cycles.length; i++) {
        const cycle = this.cycles[i];
        const startDate = new Date(cycle.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        const periodLength = cycle.duration || this.settings.avgPeriodLength || 5;
        
        // Proveri da li je datum u periodu menstruacije ovog ciklusa
        const diffDays = this.getDaysBetween(startDate, checkDate);
        const cycleDay = diffDays + 1;
        
        // Proveri da li je dan u periodu menstruacije (1 do periodLength)
        if (cycleDay >= 1 && cycleDay <= periodLength) {
            return true;
        }
        
        // Ako je aktivni ciklus, proveri i sledeću menstruaciju
        if (i === this.cycles.length - 1 && !cycle.endDate) {
            const avgCycleLength = this.calculateAverageCycleLength();
            const nextPeriodStart = new Date(startDate);
            nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);
            nextPeriodStart.setHours(0, 0, 0, 0);
            
            // Proveri da li je datum u budućoj menstruaciji
            if (checkDate >= nextPeriodStart) {
                const nextDiffDays = this.getDaysBetween(nextPeriodStart, checkDate);
                const nextCycleDay = nextDiffDays + 1;
                
                if (nextCycleDay >= 1 && nextCycleDay <= periodLength) {
                    return true;
                }
            }
        }
    }
    
    return false;
};

PeriodTracker.prototype.isOvulationDay = function(date) {
    return this.isOvulationDayForDate(date);
};

PeriodTracker.prototype.isOvulationDayForDate = function(date) {
    if (!this.cycles || this.cycles.length === 0) return false;
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const avgCycleLength = this.calculateAverageCycleLength();
    const lutealPhaseLength = 14;
    const ovulationDay = avgCycleLength - lutealPhaseLength;
    
    // Proveri sve cikluse
    for (let i = 0; i < this.cycles.length; i++) {
        const cycle = this.cycles[i];
        const startDate = new Date(cycle.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        const diffDays = this.getDaysBetween(startDate, checkDate);
        const cycleDay = diffDays + 1;
        
        // Proveri da li je dan ovulacije u ovom ciklusu
        if (cycleDay === ovulationDay) {
            // Proveri da li ovaj dan nije u periodu menstruacije
            const periodLength = cycle.duration || this.settings.avgPeriodLength || 5;
            if (cycleDay > periodLength) {
                return true;
            }
        }
        
        // Ako je aktivni ciklus, proveri i sledeću ovulaciju
        if (i === this.cycles.length - 1 && !cycle.endDate) {
            const nextPeriodStart = new Date(startDate);
            nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);
            nextPeriodStart.setHours(0, 0, 0, 0);
            
            // Proveri da li je datum u budućem ciklusu
            if (checkDate >= nextPeriodStart) {
                const nextDiffDays = this.getDaysBetween(nextPeriodStart, checkDate);
                const nextCycleDay = nextDiffDays + 1;
                
                if (nextCycleDay === ovulationDay) {
                    // Proveri da li ovaj dan nije u periodu sledeće menstruacije
                    const periodLength = cycle.duration || this.settings.avgPeriodLength || 5;
                    if (nextCycleDay > periodLength) {
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
};

PeriodTracker.prototype.isFertileDay = function(date) {
    return this.isFertileDayForDate(date);
};

PeriodTracker.prototype.isFertileDayForDate = function(date) {
    if (!this.cycles || this.cycles.length === 0) return false;
    
    // Ne prikazuj plodne dane ako je već menstruacija ili ovulacija
    if (this.isMenstruationDayForDate(date) || this.isOvulationDayForDate(date)) {
        return false;
    }
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const avgCycleLength = this.calculateAverageCycleLength();
    const lutealPhaseLength = 14;
    const ovulationDay = avgCycleLength - lutealPhaseLength;
    
    // Proveri sve cikluse
    for (let i = 0; i < this.cycles.length; i++) {
        const cycle = this.cycles[i];
        const startDate = new Date(cycle.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        const diffDays = this.getDaysBetween(startDate, checkDate);
        const cycleDay = diffDays + 1;
        
        // Plodni dani: 5 dana pre ovulacije, dan ovulacije, i 1 dan posle
        // Ali ne uključuj dan ovulacije (već je označen kao ovulacija)
        if (cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1 && cycleDay !== ovulationDay) {
            return true;
        }
        
        // Ako je aktivni ciklus, proveri i sledeće plodne dane
        if (i === this.cycles.length - 1 && !cycle.endDate) {
            const nextPeriodStart = new Date(startDate);
            nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);
            nextPeriodStart.setHours(0, 0, 0, 0);
            
            const nextDiffDays = this.getDaysBetween(nextPeriodStart, checkDate);
            const nextCycleDay = nextDiffDays + 1;
            
            if (nextCycleDay >= ovulationDay - 5 && nextCycleDay <= ovulationDay + 1 && nextCycleDay !== ovulationDay) {
                return true;
            }
        }
    }
    
    return false;
};
