// ============================================
// SISTEM ZA VREMENSKU PROGNOZU - VALJEVO
// Koristi Open-Meteo API (besplatan, bez ključa)
// ============================================

class WeatherForecast {
    constructor() {
        this.latitude = 44.2744;  // Valjevo koordinate
        this.longitude = 19.8908;
        this.weatherData = null;
        this.lastUpdate = null;
    }

    /**
     * Fetch vremenska prognoza sa Open-Meteo API-ja
     */
    async fetchWeather() {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe/Belgrade&forecast_days=3`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Weather API nije dostupan');
            }
            
            this.weatherData = await response.json();
            this.lastUpdate = new Date();
            
            console.log('✓ Временска прогноза ажурирана за Ваљево');
            return this.weatherData;
        } catch (error) {
            console.warn('⚠ Грешка при преузимању временске прогнозе:', error.message);
            return null;
        }
    }


    /**
     * Vraća ikonu i opis na osnovu WMO koda
     */
    getWeatherInfo(code) {
        const weatherCodes = {
            0: { icon: '☀️', desc: 'Ведро', color: '#FFD700' },
            1: { icon: '🌤️', desc: 'Претежно ведро', color: '#FDB813' },
            2: { icon: '⛅', desc: 'Делимично облачно', color: '#87CEEB' },
            3: { icon: '☁️', desc: 'Облачно', color: '#B0C4DE' },
            45: { icon: '🌫️', desc: 'Магла', color: '#D3D3D3' },
            48: { icon: '🌫️', desc: 'Иње', color: '#E0E0E0' },
            51: { icon: '🌦️', desc: 'Слаба киша', color: '#4682B4' },
            53: { icon: '🌧️', desc: 'Умерена киша', color: '#4169E1' },
            55: { icon: '🌧️', desc: 'Јака киша', color: '#0000CD' },
            61: { icon: '🌦️', desc: 'Слаба киша', color: '#4682B4' },
            63: { icon: '🌧️', desc: 'Умерена киша', color: '#4169E1' },
            65: { icon: '🌧️', desc: 'Јака киша', color: '#0000CD' },
            71: { icon: '🌨️', desc: 'Слаб снег', color: '#B0E0E6' },
            73: { icon: '❄️', desc: 'Умерен снег', color: '#87CEEB' },
            75: { icon: '❄️', desc: 'Јак снег', color: '#4682B4' },
            77: { icon: '🌨️', desc: 'Суснежица', color: '#ADD8E6' },
            80: { icon: '🌦️', desc: 'Пљусак', color: '#4682B4' },
            81: { icon: '⛈️', desc: 'Јак пљусак', color: '#4169E1' },
            82: { icon: '⛈️', desc: 'Јак пљусак', color: '#0000CD' },
            85: { icon: '🌨️', desc: 'Снежни пљусак', color: '#87CEEB' },
            86: { icon: '❄️', desc: 'Јак снег', color: '#4682B4' },
            95: { icon: '⛈️', desc: 'Грмљавина', color: '#8B0000' },
            96: { icon: '⛈️', desc: 'Грмљавина са градом', color: '#8B0000' },
            99: { icon: '⛈️', desc: 'Јака грмљавина', color: '#800000' }
        };

        return weatherCodes[code] || { icon: '🌡️', desc: 'Непознато', color: '#808080' };
    }

    /**
     * Prikazuje trenutnu vremensku prognozu
     */
    async displayCurrentWeather(containerId = 'weatherWidget') {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error('Weather container nije pronađen:', containerId);
            return;
        }

        // Prikaži loading
        container.innerHTML = '<div class="weather-loading">📡 Учитавам временску прогнозу...</div>';

        // Fetch podatke
        const data = await this.fetchWeather();
        
        if (!data || !data.current) {
            container.innerHTML = '<div class="weather-error">⚠️ Временска прогноза тренутно није доступна</div>';
            return;
        }

        const current = data.current;
        const weatherInfo = this.getWeatherInfo(current.weather_code);
        const daily = data.daily;

        // Kreiraj prikaz
        container.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <div class="weather-location">
                        📍 Ваљево
                    </div>
                    <div class="weather-time">
                        Ажурирано: ${this.lastUpdate.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                
                <div class="weather-current">
                    <div class="weather-icon-large" style="color: ${weatherInfo.color}">
                        ${weatherInfo.icon}
                    </div>
                    <div class="weather-temp-main">
                        ${Math.round(current.temperature_2m)}°C
                    </div>
                    <div class="weather-desc">
                        ${weatherInfo.desc}
                    </div>
                    <div class="weather-feels-like">
                        Осећај: ${Math.round(current.apparent_temperature)}°C
                    </div>
                </div>

                <div class="weather-details">
                    <div class="weather-detail-item">
                        <div class="weather-detail-icon">💧</div>
                        <div class="weather-detail-label">Влажност</div>
                        <div class="weather-detail-value">${current.relative_humidity_2m}%</div>
                    </div>
                    <div class="weather-detail-item">
                        <div class="weather-detail-icon">💨</div>
                        <div class="weather-detail-label">Ветар</div>
                        <div class="weather-detail-value">${Math.round(current.wind_speed_10m)} km/h</div>
                    </div>
                </div>

                <div class="weather-forecast">
                    <div class="forecast-title">Прогноза за наредна 3 дана:</div>
                    <div class="forecast-days">
                        ${this.generateForecastDays(daily)}
                    </div>
                </div>
            </div>
        `;

        // Automatsko osvežavanje svakih 30 minuta
        setTimeout(() => {
            this.displayCurrentWeather(containerId);
        }, 30 * 60 * 1000);
    }

    /**
     * Generiše prikaz za narednih nekoliko dana
     */
    generateForecastDays(daily) {
        if (!daily || !daily.time) return '';

        const days = ['Недеља', 'Понедељак', 'Уторак', 'Среда', 'Четвртак', 'Петак', 'Субота'];
        let html = '';

        for (let i = 0; i < 3; i++) {
            const date = new Date(daily.time[i]);
            const dayName = i === 0 ? 'Данас' : (i === 1 ? 'Сутра' : days[date.getDay()]);
            const weatherInfo = this.getWeatherInfo(daily.weather_code[i]);
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const precipitation = daily.precipitation_sum[i];

            html += `
                <div class="forecast-day">
                    <div class="forecast-day-name">${dayName}</div>
                    <div class="forecast-day-icon" style="color: ${weatherInfo.color}">${weatherInfo.icon}</div>
                    <div class="forecast-day-temps">
                        <span class="temp-max">${maxTemp}°</span>
                        <span class="temp-separator">/</span>
                        <span class="temp-min">${minTemp}°</span>
                    </div>
                    ${precipitation > 0 ? `<div class="forecast-precipitation">💧 ${precipitation} mm</div>` : ''}
                </div>
            `;
        }

        return html;
    }
}

// Kreiramo globalnu instancu
const weatherForecast = new WeatherForecast();

// Automatski pokreni prikaz vremena kada se strana učita
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('weatherWidget')) {
            weatherForecast.displayCurrentWeather();
        }
    });
} else {
    if (document.getElementById('weatherWidget')) {
        weatherForecast.displayCurrentWeather();
    }
}

