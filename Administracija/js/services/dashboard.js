// Dashboard Statistics and Charts
// Koristi Canvas API za grafikone (bez eksternih biblioteka)

class Dashboard {
    constructor() {
        this.charts = {};
    }

    /**
     * Renderuje sve statistike i grafikone
     */
    async render() {
        this.updateStats();
        await this.renderCharts();
        this.renderDetailedStats();
    }

    /**
     * Ažurira statističke kartice
     */
    updateStats() {
        document.getElementById('stat-radnici').textContent = radnici.length;
        document.getElementById('stat-plate').textContent = plate.length;
        
        const aktivniOdmori = odmori.filter(o => o.status === 'U toku' || o.status === 'Planiran');
        document.getElementById('stat-odmori').textContent = aktivniOdmori.length;
        
        const cekajuciZahtevi = [...zahteviOdmor, ...zahteviAdmin].filter(z => z.status === 'Čeka');
        document.getElementById('stat-zahtevi').textContent = cekajuciZahtevi.length;
    }

    /**
     * Renderuje grafikone
     */
    async renderCharts() {
        this.renderPlateByMonth();
        this.renderOdmoriByStatus();
        this.renderZahteviByStatus();
        this.renderTopPlata();
    }

    /**
     * Grafikona plate po mesecu
     */
    renderPlateByMonth() {
        const canvas = document.getElementById('chart-plate-mesec');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        const mesecNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const plateThisYear = plate.filter(p => p.godina === currentYear);

        const plateByMonth = Array(12).fill(0);
        plateThisYear.forEach(p => {
            if (p.mesec >= 1 && p.mesec <= 12) {
                plateByMonth[p.mesec - 1]++;
            }
        });

        const maxValue = Math.max(...plateByMonth, 1);
        const barWidth = canvas.width / 14;
        const barMaxHeight = canvas.height - 60;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bars
        plateByMonth.forEach((count, index) => {
            const x = barWidth * (index + 1);
            const barHeight = (count / maxValue) * barMaxHeight;
            const y = canvas.height - barHeight - 40;

            // Bar
            ctx.fillStyle = '#667eea';
            ctx.fillRect(x, y, barWidth - 10, barHeight);

            // Label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(mesecNames[index], x + (barWidth - 10) / 2, canvas.height - 20);
            ctx.fillText(count.toString(), x + (barWidth - 10) / 2, y - 5);
        });
    }

    /**
     * Grafikona godišnjih odmora po statusu
     */
    renderOdmoriByStatus() {
        const canvas = document.getElementById('chart-odmori-status');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        const statusCounts = {};
        odmori.forEach(o => {
            statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        });

        const labels = Object.keys(statusCounts);
        const values = Object.values(statusCounts);
        const colors = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2 - 40;

        let currentAngle = -Math.PI / 2;
        const total = values.reduce((a, b) => a + b, 0);

        if (total === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Nema podataka', centerX, centerY);
            return;
        }

        values.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            // Label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${labels[index]}: ${value}`, labelX, labelY);

            currentAngle += sliceAngle;
        });
    }

    /**
     * Grafikona zahteva po statusu
     */
    renderZahteviByStatus() {
        const canvas = document.getElementById('chart-zahtevi-status');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        const statusCounts = {};
        [...zahteviOdmor, ...zahteviAdmin].forEach(z => {
            statusCounts[z.status] = (statusCounts[z.status] || 0) + 1;
        });

        const labels = Object.keys(statusCounts);
        const values = Object.values(statusCounts);
        const colors = ['#f59e0b', '#10b981', '#ef4444'];

        if (values.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Nema podataka', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxValue = Math.max(...values);
        const barWidth = canvas.width / (labels.length + 1);
        const barMaxHeight = canvas.height - 60;

        labels.forEach((label, index) => {
            const x = barWidth * (index + 1);
            const barHeight = (values[index] / maxValue) * barMaxHeight;
            const y = canvas.height - barHeight - 40;

            // Bar
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth - 20, barHeight);

            // Label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + (barWidth - 20) / 2, canvas.height - 20);
            ctx.fillText(values[index].toString(), x + (barWidth - 20) / 2, y - 5);
        });
    }

    /**
     * Grafikona top 5 radnika po plati
     */
    renderTopPlata() {
        const canvas = document.getElementById('chart-top-plate');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = 300;

        // Izračunaj ukupnu platu za svakog radnika
        const radnikPlate = {};
        plate.forEach(p => {
            if (!radnikPlate[p.radnikId]) {
                radnikPlate[p.radnikId] = 0;
            }
            const ukupno = (p.osnovna || 0) + (p.bonusi || 0) - (p.doprinosi || 0);
            radnikPlate[p.radnikId] += ukupno;
        });

        // Sortiraj i uzmi top 5
        const topRadnici = Object.entries(radnikPlate)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([radnikId, ukupno]) => {
                const radnik = radnici.find(r => r.id === parseInt(radnikId));
                return {
                    ime: radnik ? radnik.ime : 'Nepoznat',
                    ukupno: ukupno
                };
            });

        if (topRadnici.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Nema podataka', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxValue = Math.max(...topRadnici.map(r => r.ukupno));
        const barWidth = canvas.width / (topRadnici.length + 1);
        const barMaxHeight = canvas.height - 80;

        topRadnici.forEach((radnik, index) => {
            const x = barWidth * (index + 1);
            const barHeight = (radnik.ukupno / maxValue) * barMaxHeight;
            const y = canvas.height - barHeight - 60;

            // Bar
            ctx.fillStyle = '#667eea';
            ctx.fillRect(x, y, barWidth - 20, barHeight);

            // Ime
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(radnik.ime.substring(0, 10), x + (barWidth - 20) / 2, canvas.height - 40);
            
            // Iznos
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(this.formatCurrencyShort(radnik.ukupno), x + (barWidth - 20) / 2, y - 5);
        });
    }

    /**
     * Formatira novac za prikaz (skraćeno)
     */
    formatCurrencyShort(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'k';
        }
        return Math.round(amount).toString();
    }

    /**
     * Renderuje detaljne statistike u tabeli
     */
    renderDetailedStats() {
        const tbody = document.getElementById('stats-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        const stats = [
            {
                kategorija: 'Ukupno Radnika',
                vrednost: radnici.length,
                procenat: '100%'
            },
            {
                kategorija: 'Radnici sa Nalogom',
                vrednost: korisnici.filter(k => k.uloga === 'radnik').length,
                procenat: radnici.length > 0 
                    ? Math.round((korisnici.filter(k => k.uloga === 'radnik').length / radnici.length) * 100) + '%'
                    : '0%'
            },
            {
                kategorija: 'Ukupno Plata',
                vrednost: plate.length,
                procenat: '100%'
            },
            {
                kategorija: 'Aktivni Odmori',
                vrednost: odmori.filter(o => o.status === 'U toku' || o.status === 'Planiran').length,
                procenat: odmori.length > 0
                    ? Math.round((odmori.filter(o => o.status === 'U toku' || o.status === 'Planiran').length / odmori.length) * 100) + '%'
                    : '0%'
            },
            {
                kategorija: 'Čekajući Zahtevi',
                vrednost: [...zahteviOdmor, ...zahteviAdmin].filter(z => z.status === 'Čeka').length,
                procenat: [...zahteviOdmor, ...zahteviAdmin].length > 0
                    ? Math.round(([...zahteviOdmor, ...zahteviAdmin].filter(z => z.status === 'Čeka').length / [...zahteviOdmor, ...zahteviAdmin].length) * 100) + '%'
                    : '0%'
            },
            {
                kategorija: 'Nepročitane Poruke',
                vrednost: poruke.filter(p => !p.procitao).length,
                procenat: poruke.length > 0
                    ? Math.round((poruke.filter(p => !p.procitao).length / poruke.length) * 100) + '%'
                    : '0%'
            }
        ];

        stats.forEach(stat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stat.kategorija}</td>
                <td><strong>${stat.vrednost}</strong></td>
                <td>${stat.procenat}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Globalna instanca
const dashboard = new Dashboard();

// Funkcija za renderovanje dashboard-a
async function renderDashboard() {
    if (document.getElementById('dashboard')) {
        await dashboard.render();
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Dashboard, dashboard };
}

