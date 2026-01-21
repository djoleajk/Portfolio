// Real-time Data from Analytics Tracker
let analyticsData = null;
let visitsChart = null;
let trafficChart = null;

function loadAnalyticsData() {
    if (!window.analyticsTracker) {
        console.error('Analytics Tracker nije učitan!');
        return null;
    }

    const metrics = window.analyticsTracker.getMetrics();
    const dailyVisits = window.analyticsTracker.getDailyVisits();
    const trafficSources = window.analyticsTracker.getTrafficSources();
    const recentActivity = window.analyticsTracker.getRecentActivity();

    return {
        metrics: metrics,
        visitsPerDay: dailyVisits,
        trafficSources: {
            labels: trafficSources.labels,
            data: trafficSources.data,
            colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280']
        },
        recentActivity: recentActivity
    };
}

// Chart.js Configuration
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#4b5563';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Čekaj da se tracker učita
    const initDashboard = () => {
        if (!window.analyticsTracker) {
            setTimeout(initDashboard, 100);
            return;
        }

        analyticsData = loadAnalyticsData();
        
        if (analyticsData) {
            animateMetrics();
            initializeCharts();
            populateActivityTable();
            setupNavigation();
            setupQuickActions();
            startAutoRefresh();
        }
    };

    initDashboard();
});

// Animate Metric Values
function animateMetrics() {
    const metrics = [
        { id: 'totalVisits', value: analyticsData.metrics.totalVisits, suffix: '' },
        { id: 'uniqueUsers', value: analyticsData.metrics.uniqueUsers, suffix: '' },
        { id: 'avgTime', value: analyticsData.metrics.avgTime, isText: true },
        { id: 'bounceRate', value: analyticsData.metrics.bounceRate, isText: true }
    ];

    metrics.forEach(metric => {
        const element = document.getElementById(metric.id);
        if (metric.isText) {
            // For text values, just fade in
            setTimeout(() => {
                element.textContent = metric.value;
            }, 300);
        } else {
            // For numeric values, animate counting
            animateValue(element, 0, metric.value, 1500);
        }
    });
}

// Animate Number Counting
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end.toLocaleString('sr-RS');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('sr-RS');
        }
    }, 16);
}

// Initialize Charts
function initializeCharts() {
    initVisitsChart();
    initTrafficChart();
}

// Line Chart - Visits per Day
function initVisitsChart() {
    const ctx = document.getElementById('visitsChart');
    
    visitsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: analyticsData.visitsPerDay.labels,
            datasets: [{
                label: 'Broj poseta',
                data: analyticsData.visitsPerDay.data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#2563eb',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Posete: ' + context.parsed.y.toLocaleString('sr-RS');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('sr-RS');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Pie Chart - Traffic Sources
function initTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    
    trafficChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: analyticsData.trafficSources.labels,
            datasets: [{
                data: analyticsData.trafficSources.data,
                backgroundColor: analyticsData.trafficSources.colors,
                borderColor: '#fff',
                borderWidth: 3,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 13,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + value + '%';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Populate Activity Table
function populateActivityTable() {
    const tbody = document.getElementById('activityTableBody');
    
    analyticsData.recentActivity.forEach((activity, index) => {
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
        
        row.innerHTML = `
            <td><code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">${activity.ip}</code></td>
            <td><span class="location-flag">${activity.location}</span></td>
            <td><strong>${activity.page}</strong></td>
            <td style="color: #6b7280;">${activity.time}</td>
            <td><span class="duration-badge">${activity.duration}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Setup Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        '#dashboard': document.querySelector('.dashboard-section'),
        '#stats': document.querySelector('.stats-section'),
        '#settings': document.querySelector('.settings-section')
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            Object.values(sections).forEach(section => {
                if (section) section.style.display = 'none';
            });
            
            // Show target section
            const targetId = this.getAttribute('href');
            const targetSection = sections[targetId];
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Load section-specific data
                if (targetId === '#stats') {
                    loadStatisticsData();
                } else if (targetId === '#settings') {
                    loadSettingsData();
                }
            }
            
            // Add ripple effect
            addRippleEffect(this, e);
        });
    });
}

// Add Ripple Effect on Click
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-refresh dashboard
function startAutoRefresh() {
    setInterval(() => {
        refreshDashboard();
    }, 10000); // Refresh svakih 10 sekundi
}

function refreshDashboard() {
    const newData = loadAnalyticsData();
    
    if (!newData) return;

    // Proveri da li ima novih podataka
    if (JSON.stringify(newData) === JSON.stringify(analyticsData)) {
        return; // Nema promena
    }

    analyticsData = newData;

    // Ažuriraj metrike
    updateMetrics();

    // Ažuriraj grafikone
    updateCharts();

    // Ažuriraj tabelu
    updateActivityTable();
}

function updateMetrics() {
    document.getElementById('totalVisits').textContent = analyticsData.metrics.totalVisits.toLocaleString('sr-RS');
    document.getElementById('uniqueUsers').textContent = analyticsData.metrics.uniqueUsers.toLocaleString('sr-RS');
    document.getElementById('avgTime').textContent = analyticsData.metrics.avgTime;
    document.getElementById('bounceRate').textContent = analyticsData.metrics.bounceRate;

    // Dodaj animation na ažuriranje
    ['totalVisits', 'uniqueUsers'].forEach(id => {
        const element = document.getElementById(id);
        element.style.transform = 'scale(1.1)';
        element.style.color = '#10b981';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    });
}

function updateCharts() {
    // Ažuriraj linijski grafik
    if (visitsChart) {
        visitsChart.data.labels = analyticsData.visitsPerDay.labels;
        visitsChart.data.datasets[0].data = analyticsData.visitsPerDay.data;
        visitsChart.update('none'); // Update bez animacije
    }

    // Ažuriraj kružni grafik
    if (trafficChart) {
        trafficChart.data.datasets[0].data = analyticsData.trafficSources.data;
        trafficChart.update('none');
    }
}

function updateActivityTable() {
    const tbody = document.getElementById('activityTableBody');
    tbody.innerHTML = '';
    
    analyticsData.recentActivity.forEach((activity, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem;">${activity.ip}</code></td>
            <td><span class="location-flag">${activity.location}</span></td>
            <td><strong>${activity.page}</strong></td>
            <td style="color: #6b7280;">${activity.time}</td>
            <td><span class="duration-badge">${activity.duration}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Quick actions u headeru
function setupQuickActions() {
    // Dodaj dugmad za brz pristup u header
    const nav = document.querySelector('.header .nav');
    
    // Proveri da li već postoje
    if (document.querySelector('.quick-actions')) return;
    
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-actions';
    quickActions.style.cssText = 'display: flex; gap: 0.5rem; margin-left: 1rem;';
    
    quickActions.innerHTML = `
        <button id="refreshBtn" class="admin-btn" title="Osveži podatke">
            🔄
        </button>
        <button id="exportBtn" class="admin-btn" title="Eksportuj podatke">
            📥
        </button>
    `;
    
    nav.parentElement.appendChild(quickActions);

    // Event listeneri
    document.getElementById('refreshBtn').addEventListener('click', () => {
        refreshDashboard();
        showNotification('Dashboard osvežen!');
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
        window.analyticsTracker.exportData();
        showNotification('Podaci eksportovani!');
    });

    // Dodaj stilove za admin dugmad
    const style = document.createElement('style');
    style.textContent = `
        .admin-btn {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        .admin-btn:hover {
            background: #f3f4f6;
            border-color: #3b82f6;
            transform: translateY(-2px);
        }
        .admin-btn:active {
            transform: translateY(0);
        }
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            z-index: 10000;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(400px);
            }
        }
    `;
    document.head.appendChild(style);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// STATISTIKA SEKCIJA
// ============================================

let hourlyChart = null;

function loadStatisticsData() {
    if (!window.analyticsTracker) return;
    
    const data = window.analyticsTracker.getData();
    
    // Izračunaj naprednu statistiku
    calculateAdvancedStats(data);
    
    // Kreiraj hourly chart
    createHourlyChart(data);
    
    // Popuni tabelu stranica
    populatePagesTable(data);
}

function calculateAdvancedStats(data) {
    // Rast poseta (simulirano)
    const growth = data.totalVisits > 10 ? '+' + Math.round((data.totalVisits - 10) / 10 * 100) + '%' : '+0%';
    document.getElementById('visitGrowth').textContent = growth;
    
    // Najduža sesija
    const longestSession = data.sessions.reduce((max, s) => Math.max(max, s.duration || 0), 0);
    document.getElementById('longestSession').textContent = formatDuration(longestSession);
    
    // Najpopularnija stranica
    const pageStats = {};
    data.pageViews.forEach(pv => {
        pageStats[pv.page] = (pageStats[pv.page] || 0) + 1;
    });
    const topPage = Object.entries(pageStats).sort((a, b) => b[1] - a[1])[0] || ['/', 0];
    document.getElementById('topPage').textContent = topPage[0];
    document.getElementById('topPageViews').textContent = topPage[1] + ' pregleda';
    
    // Top lokacija
    const locationStats = {};
    data.recentActivity.forEach(act => {
        locationStats[act.location] = (locationStats[act.location] || 0) + 1;
    });
    const topLocation = Object.entries(locationStats).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];
    document.getElementById('topLocation').textContent = topLocation[0];
    document.getElementById('topLocationCount').textContent = topLocation[1] + ' poseta';
}

function createHourlyChart(data) {
    const ctx = document.getElementById('hourlyChart');
    if (!ctx) return;
    
    // Pripremi podatke po satima
    const hourlyData = new Array(24).fill(0);
    data.pageViews.forEach(pv => {
        const hour = new Date(pv.timestamp).getHours();
        hourlyData[hour]++;
    });
    
    // Uništi prethodni chart ako postoji
    if (hourlyChart) {
        hourlyChart.destroy();
    }
    
    hourlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({length: 24}, (_, i) => i + 'h'),
            datasets: [{
                label: 'Posete po satima',
                data: hourlyData,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function populatePagesTable(data) {
    const tbody = document.getElementById('pagesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Grupiši po stranicama
    const pageStats = {};
    data.pageViews.forEach(pv => {
        if (!pageStats[pv.page]) {
            pageStats[pv.page] = {
                views: 0,
                visitors: new Set(),
                totalTime: 0,
                bounces: 0
            };
        }
        pageStats[pv.page].views++;
        pageStats[pv.page].visitors.add(pv.visitorId);
    });
    
    // Konvertuj u array i sortiraj
    const pagesArray = Object.entries(pageStats).map(([page, stats]) => ({
        page,
        views: stats.views,
        unique: stats.visitors.size,
        avgTime: '1:30', // Simulirano
        bounceRate: Math.round(Math.random() * 50) + '%'
    })).sort((a, b) => b.views - a.views).slice(0, 10);
    
    // Popuni tabelu
    pagesArray.forEach(page => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${page.page}</strong></td>
            <td>${page.views}</td>
            <td>${page.unique}</td>
            <td>${page.avgTime}</td>
            <td>${page.bounceRate}</td>
        `;
        tbody.appendChild(row);
    });
    
    if (pagesArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #9ca3af;">Nema podataka</td></tr>';
    }
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Period selector
document.addEventListener('DOMContentLoaded', () => {
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            periodBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadStatisticsData();
        });
    });
});

// ============================================
// PODEŠAVANJA SEKCIJA
// ============================================

function loadSettingsData() {
    // Učitaj trenutne postavke
    loadCurrentSettings();
    
    // Izračunaj veličinu podataka
    calculateDataSize();
    
    // Prikaži informacije
    displaySystemInfo();
    
    // Setup event listeners
    setupSettingsListeners();
}

function loadCurrentSettings() {
    // Učitaj iz localStorage ili koristi default
    const settings = JSON.parse(localStorage.getItem('analyticsSettings') || '{}');
    
    document.getElementById('trackingEnabled').checked = settings.trackingEnabled !== false;
    document.getElementById('trackClicks').checked = settings.trackClicks !== false;
    document.getElementById('trackScrollDepth').checked = settings.trackScrollDepth || false;
    document.getElementById('showNotifications').checked = settings.showNotifications !== false;
    document.getElementById('refreshInterval').value = settings.refreshInterval || '10000';
    document.getElementById('activityLimit').value = settings.activityLimit || '10';
}

function saveSettings() {
    const settings = {
        trackingEnabled: document.getElementById('trackingEnabled').checked,
        trackClicks: document.getElementById('trackClicks').checked,
        trackScrollDepth: document.getElementById('trackScrollDepth').checked,
        showNotifications: document.getElementById('showNotifications').checked,
        refreshInterval: document.getElementById('refreshInterval').value,
        activityLimit: document.getElementById('activityLimit').value
    };
    
    localStorage.setItem('analyticsSettings', JSON.stringify(settings));
    showNotification('Postavke sačuvane!');
}

function calculateDataSize() {
    const data = localStorage.getItem('siteAnalyticsData') || '{}';
    const sizeInBytes = new Blob([data]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    
    document.getElementById('dataSize').textContent = sizeInKB + ' KB';
    
    const parsedData = JSON.parse(data);
    const recordCount = (parsedData.pageViews?.length || 0) + (parsedData.sessions?.length || 0);
    document.getElementById('recordCount').textContent = recordCount;
    
    const oldestRecord = parsedData.pageViews?.[0]?.timestamp;
    if (oldestRecord) {
        const date = new Date(oldestRecord);
        document.getElementById('oldestRecord').textContent = date.toLocaleString('sr-RS');
    }
}

function displaySystemInfo() {
    // Browser info
    document.getElementById('browserInfo').textContent = navigator.userAgent.split(' ').slice(-1)[0];
    
    // Visitor ID
    const visitorId = localStorage.getItem('visitorId') || 'N/A';
    document.getElementById('visitorIdInfo').textContent = visitorId.substring(0, 20) + '...';
    
    // Session ID
    const sessionId = sessionStorage.getItem('currentSession') || 'N/A';
    document.getElementById('sessionIdInfo').textContent = sessionId.substring(0, 20) + '...';
}

function setupSettingsListeners() {
    // Export data
    document.getElementById('exportDataBtn').addEventListener('click', () => {
        if (window.analyticsTracker) {
            window.analyticsTracker.exportData();
            showNotification('Podaci eksportovani!');
        }
    });
    
    // Import data
    document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('importFileInput').click();
    });
    
    document.getElementById('importFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    localStorage.setItem('siteAnalyticsData', JSON.stringify(data));
                    showNotification('Podaci uspešno importovani!');
                    setTimeout(() => location.reload(), 1000);
                } catch (error) {
                    alert('Greška pri učitavanju fajla!');
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Clear data
    document.getElementById('clearDataBtn').addEventListener('click', () => {
        if (window.analyticsTracker) {
            window.analyticsTracker.clearAllData();
        }
    });
    
    // View raw data
    document.getElementById('viewRawDataBtn').addEventListener('click', () => {
        const data = localStorage.getItem('siteAnalyticsData');
        const win = window.open('', '_blank');
        win.document.write('<pre>' + JSON.stringify(JSON.parse(data), null, 2) + '</pre>');
    });
    
    // Save settings on change
    ['trackingEnabled', 'trackClicks', 'trackScrollDepth', 'showNotifications'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveSettings);
    });
    
    ['refreshInterval', 'activityLimit'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveSettings);
    });
}

// Console message
console.log('%c🚀 Site Analytics Dashboard Loaded!', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
console.log('%cDeveloped with ❤️ using HTML, CSS, and JavaScript', 'color: #6b7280; font-size: 12px;');

