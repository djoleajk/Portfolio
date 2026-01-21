// Modul za grafikone (Canvas API)
PeriodTracker.prototype.renderSymptomChart = function(canvasId, symptomType) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const symptoms = this.symptoms.slice(-30).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (symptoms.length === 0) {
        this.showEmptyChart(canvas, 'Nema podataka za prikaz');
        return;
    }
    
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 200;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Chart area
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Get values
    const values = symptoms.map(s => s[symptomType] || 0);
    const dates = symptoms.map(s => new Date(s.date));
    
    const minValue = 0;
    const maxValue = 10;
    const valueRange = maxValue - minValue;
    
    // Draw grid
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = 'var(--text-secondary)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText((10 - i * 2).toString(), padding.left - 5, y + 3);
    }
    
    // Draw line
    ctx.strokeStyle = 'var(--accent-primary)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    values.forEach((value, index) => {
        const x = padding.left + (chartWidth / (values.length - 1 || 1)) * index;
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = 'var(--accent-primary)';
    values.forEach((value, index) => {
        const x = padding.left + (chartWidth / (values.length - 1 || 1)) * index;
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw area under line
    ctx.fillStyle = 'rgba(233, 30, 99, 0.1)';
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    values.forEach((value, index) => {
        const x = padding.left + (chartWidth / (values.length - 1 || 1)) * index;
        const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();
};

PeriodTracker.prototype.showEmptyChart = function(canvas, message) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 200;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'var(--text-secondary)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, width / 2, height / 2);
};

PeriodTracker.prototype.renderCycleLengthChart = function(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const completedCycles = this.cycles.filter(c => c.duration).slice(-12);
    
    if (completedCycles.length === 0) {
        this.showEmptyChart(canvas, 'Nema podataka za prikaz');
        return;
    }
    
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 200;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const lengths = completedCycles.map(c => c.duration);
    const minLength = Math.min(...lengths, 21);
    const maxLength = Math.max(...lengths, 35);
    const range = maxLength - minLength || 1;
    
    // Grid
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        
        ctx.fillStyle = 'var(--text-secondary)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        const value = Math.round(maxLength - (range / 4) * i);
        ctx.fillText(value.toString(), padding.left - 5, y + 3);
    }
    
    // Bars
    const barWidth = chartWidth / lengths.length * 0.7;
    const barSpacing = chartWidth / lengths.length;
    
    lengths.forEach((length, index) => {
        const x = padding.left + barSpacing * index + (barSpacing - barWidth) / 2;
        const barHeight = ((length - minLength) / range) * chartHeight;
        const y = padding.top + chartHeight - barHeight;
        
        // Bar
        ctx.fillStyle = 'var(--accent-primary)';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Value label
        ctx.fillStyle = 'var(--text-primary)';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(length.toString(), x + barWidth / 2, y - 5);
    });
};
