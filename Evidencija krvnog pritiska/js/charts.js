// Chart.js integracija za grafikone

import { prepareChartData, prepareDailyAverageData } from './utils.js';
import { loadMeasurements } from './storage.js';

let pressureChart = null;
let dailyAvgChart = null;
let pulseChart = null;

/**
 * Inicijalizuje grafikone
 */
export function initCharts() {
    // Grafikoni će biti kreirani kada budu potrebni
}

/**
 * Kreira ili ažurira grafikon pritiska kroz vreme
 * @param {Array} measurements - Niz merenja
 */
export function updatePressureChart(measurements) {
    if (measurements.length === 0) {
        if (pressureChart) {
            pressureChart.destroy();
            pressureChart = null;
        }
        return;
    }
    
    const chartData = prepareChartData(measurements);
    const ctx = document.getElementById('pressureChart');
    
    if (!ctx) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#4a5568';
    const gridColor = isDark ? '#4a5568' : '#e2e8f0';
    
    if (pressureChart) {
        pressureChart.destroy();
    }
    
    pressureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Sistolički pritisak',
                    data: chartData.systolic,
                    borderColor: '#f56565',
                    backgroundColor: 'rgba(245, 101, 101, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Dijastolički pritisak',
                    data: chartData.diastolic,
                    borderColor: '#4299e1',
                    backgroundColor: 'rgba(66, 153, 225, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDark ? '#2d3748' : '#ffffff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: gridColor,
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    },
                    title: {
                        display: true,
                        text: 'mmHg',
                        color: textColor
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

/**
 * Kreira ili ažurira grafikon dnevnog proseka
 * @param {Array} measurements - Niz merenja
 */
export function updateDailyAverageChart(measurements) {
    if (measurements.length === 0) {
        if (dailyAvgChart) {
            dailyAvgChart.destroy();
            dailyAvgChart = null;
        }
        return;
    }
    
    const chartData = prepareDailyAverageData(measurements);
    const ctx = document.getElementById('dailyAvgChart');
    
    if (!ctx) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#4a5568';
    const gridColor = isDark ? '#4a5568' : '#e2e8f0';
    
    if (dailyAvgChart) {
        dailyAvgChart.destroy();
    }
    
    dailyAvgChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Prosek sistoličkog',
                    data: chartData.systolicAvg,
                    backgroundColor: 'rgba(245, 101, 101, 0.7)',
                    borderColor: '#f56565',
                    borderWidth: 2
                },
                {
                    label: 'Prosek dijastoličkog',
                    data: chartData.diastolicAvg,
                    backgroundColor: 'rgba(66, 153, 225, 0.7)',
                    borderColor: '#4299e1',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDark ? '#2d3748' : '#ffffff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: gridColor,
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    },
                    title: {
                        display: true,
                        text: 'mmHg',
                        color: textColor
                    }
                }
            }
        }
    });
}

/**
 * Kreira ili ažurira grafikon pulsa
 * @param {Array} measurements - Niz merenja
 */
export function updatePulseChart(measurements) {
    const withPulse = measurements.filter(m => m.pulse && parseInt(m.pulse) > 0);
    
    if (withPulse.length === 0) {
        const pulseCard = document.getElementById('pulseChartCard');
        if (pulseCard) {
            pulseCard.style.display = 'none';
        }
        if (pulseChart) {
            pulseChart.destroy();
            pulseChart = null;
        }
        return;
    }
    
    const pulseCard = document.getElementById('pulseChartCard');
    if (pulseCard) {
        pulseCard.style.display = 'block';
    }
    
    const chartData = prepareChartData(withPulse);
    const ctx = document.getElementById('pulseChart');
    
    if (!ctx) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#4a5568';
    const gridColor = isDark ? '#4a5568' : '#e2e8f0';
    
    if (pulseChart) {
        pulseChart.destroy();
    }
    
    pulseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Puls',
                    data: chartData.pulse,
                    borderColor: '#48bb78',
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDark ? '#2d3748' : '#ffffff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: gridColor,
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    },
                    title: {
                        display: true,
                        text: 'otkucaja/min',
                        color: textColor
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

/**
 * Ažurira sve grafikone
 * @param {Array} measurements - Niz merenja
 */
export function updateAllCharts(measurements) {
    updatePressureChart(measurements);
    updateDailyAverageChart(measurements);
    updatePulseChart(measurements);
}

/**
 * Uništava sve grafikone
 */
export function destroyAllCharts() {
    if (pressureChart) {
        pressureChart.destroy();
        pressureChart = null;
    }
    if (dailyAvgChart) {
        dailyAvgChart.destroy();
        dailyAvgChart = null;
    }
    if (pulseChart) {
        pulseChart.destroy();
        pulseChart = null;
    }
}

/**
 * Ažurira boje grafikona kada se promeni tema
 */
export function updateChartsTheme() {
    const measurements = loadMeasurements();
    if (measurements.length > 0) {
        updateAllCharts(measurements);
    }
}
