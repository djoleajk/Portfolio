// Modul za dashboard
PeriodTracker.prototype.updateDashboard = function() {
    this.updateCycleStatus();
    this.updatePredictions();
    this.updateStatistics();
    this.updateSymptomsStatistics();
    
};

PeriodTracker.prototype.updateCycleStatus = function() {
    const cycleDay = this.getCurrentCycleDay();
    const cyclePhase = this.getCyclePhase(cycleDay);
    const activeCycle = this.getActiveCycle();
    
    const cycleDayEl = document.getElementById('currentCycleDay');
    const cyclePhaseEl = document.getElementById('currentCyclePhase');
    const progressFill = document.getElementById('cycleProgress');
    const progressLabel = document.getElementById('cycleProgressLabel');
    
    if (!activeCycle) {
        if (cycleDayEl) cycleDayEl.textContent = '-';
        if (cyclePhaseEl) cyclePhaseEl.textContent = 'Nema aktivnog ciklusa';
        if (progressFill) progressFill.style.width = '0%';
        if (progressLabel) progressLabel.textContent = '0%';
        return;
    }
    
    if (cycleDayEl) {
        cycleDayEl.textContent = cycleDay || '-';
    }
    
    if (cyclePhaseEl && cyclePhase) {
        cyclePhaseEl.textContent = cyclePhase.name;
    }
    
    // Izračunaj progress
    const avgCycleLength = this.calculateAverageCycleLength();
    const progress = cycleDay ? Math.min((cycleDay / avgCycleLength) * 100, 100) : 0;
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (progressLabel) {
        progressLabel.textContent = `${Math.round(progress)}%`;
    }
};

PeriodTracker.prototype.updatePredictions = function() {
    const nextPeriod = this.predictNextPeriod();
    const ovulation = this.predictOvulation();
    const fertileWindow = this.predictFertileWindow();
    
    const nextPeriodEl = document.getElementById('nextPeriodDate');
    const ovulationEl = document.getElementById('ovulationDate');
    const fertileEl = document.getElementById('fertileWindow');
    
    if (nextPeriodEl) {
        nextPeriodEl.textContent = nextPeriod ? this.formatDateShort(nextPeriod) : '-';
    }
    
    if (ovulationEl) {
        ovulationEl.textContent = ovulation ? this.formatDateShort(ovulation) : '-';
    }
    
    if (fertileEl) {
        if (fertileWindow) {
            fertileEl.textContent = `${this.formatDateShort(fertileWindow.start)} - ${this.formatDateShort(fertileWindow.end)}`;
        } else {
            fertileEl.textContent = '-';
        }
    }
};

PeriodTracker.prototype.updateStatistics = function() {
    const emptyState = document.getElementById('statisticsEmptyState');
    const statisticsGrid = document.getElementById('statisticsGrid');
    const chartContainer = document.querySelector('#cycleLengthChart')?.parentElement;
    
    const avgCycleLength = this.calculateAverageCycleLength();
    const avgPeriodLength = this.calculateAveragePeriodLength();
    const totalCycles = this.cycles.length;
    
    // Empty state
    if (this.cycles.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (statisticsGrid) statisticsGrid.style.display = 'none';
        if (chartContainer) chartContainer.style.display = 'none';
        return;
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (statisticsGrid) statisticsGrid.style.display = 'grid';
        if (chartContainer) chartContainer.style.display = 'block';
    }
    
    const avgCycleEl = document.getElementById('avgCycleLength');
    const avgPeriodEl = document.getElementById('avgPeriodLength');
    const totalCyclesEl = document.getElementById('totalCycles');
    
    if (avgCycleEl) {
        avgCycleEl.textContent = `${avgCycleLength} dana`;
    }
    
    if (avgPeriodEl) {
        avgPeriodEl.textContent = `${avgPeriodLength} dana`;
    }
    
    if (totalCyclesEl) {
        totalCyclesEl.textContent = totalCycles;
    }
    
    // Napredna statistika
    const completedCycles = this.cycles.filter(c => c.duration);
    if (completedCycles.length > 0) {
        const lengths = completedCycles.map(c => c.duration);
        const shortest = Math.min(...lengths);
        const longest = Math.max(...lengths);
        
        const shortestEl = document.getElementById('shortestCycle');
        const longestEl = document.getElementById('longestCycle');
        
        if (shortestEl) {
            shortestEl.textContent = `${shortest} dana`;
        }
        
        if (longestEl) {
            longestEl.textContent = `${longest} dana`;
        }
        
        // Regularnost (standardna devijacija)
        const mean = avgCycleLength;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
        const stdDev = Math.sqrt(variance);
        const regularity = stdDev < 3 ? 'Regularan' : stdDev < 7 ? 'Umereno' : 'Neregularan';
        
        const regularityEl = document.getElementById('cycleRegularity');
        if (regularityEl) {
            regularityEl.textContent = regularity;
        }
        
        // Renderuj grafikone
        if (this.renderCycleLengthChart) {
            this.renderCycleLengthChart('cycleLengthChart');
        }
    } else {
        const shortestEl = document.getElementById('shortestCycle');
        const longestEl = document.getElementById('longestCycle');
        const regularityEl = document.getElementById('cycleRegularity');
        
        if (shortestEl) shortestEl.textContent = '-';
        if (longestEl) longestEl.textContent = '-';
        if (regularityEl) regularityEl.textContent = '-';
    }
};

PeriodTracker.prototype.updateSymptomsStatistics = function() {
    if (this.symptoms.length === 0) {
        document.getElementById('avgEnergy').style.width = '0%';
        document.getElementById('avgEnergyValue').textContent = '-';
        document.getElementById('avgMood').style.width = '0%';
        document.getElementById('avgMoodValue').textContent = '-';
        document.getElementById('avgPain').style.width = '0%';
        document.getElementById('avgPainValue').textContent = '-';
        document.getElementById('avgLibido').style.width = '0%';
        document.getElementById('avgLibidoValue').textContent = '-';
        return;
    }
    
    // Izračunaj proseke
    const avgEnergy = this.symptoms.reduce((sum, s) => sum + (s.energy || 0), 0) / this.symptoms.length;
    const avgMood = this.symptoms.reduce((sum, s) => sum + (s.mood || 0), 0) / this.symptoms.length;
    const avgPain = this.symptoms.reduce((sum, s) => sum + (s.pain || 0), 0) / this.symptoms.length;
    const avgLibido = this.symptoms.reduce((sum, s) => sum + (s.libido || 0), 0) / this.symptoms.length;
    
    // Ažuriraj UI
    const energyFill = document.getElementById('avgEnergy');
    const energyValue = document.getElementById('avgEnergyValue');
    if (energyFill) energyFill.style.width = `${(avgEnergy / 10) * 100}%`;
    if (energyValue) energyValue.textContent = `${avgEnergy.toFixed(1)}/10`;
    
    const moodFill = document.getElementById('avgMood');
    const moodValue = document.getElementById('avgMoodValue');
    if (moodFill) moodFill.style.width = `${(avgMood / 10) * 100}%`;
    if (moodValue) moodValue.textContent = `${avgMood.toFixed(1)}/10`;
    
    const painFill = document.getElementById('avgPain');
    const painValue = document.getElementById('avgPainValue');
    if (painFill) painFill.style.width = `${(avgPain / 10) * 100}%`;
    if (painValue) painValue.textContent = `${avgPain.toFixed(1)}/10`;
    
    const libidoFill = document.getElementById('avgLibido');
    const libidoValue = document.getElementById('avgLibidoValue');
    if (libidoFill) libidoFill.style.width = `${(avgLibido / 10) * 100}%`;
    if (libidoValue) libidoValue.textContent = `${avgLibido.toFixed(1)}/10`;
};
