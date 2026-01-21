/**
 * Site Analytics Tracker
 * Automatski prati posete, korisnike i njihovo ponašanje
 */

class AnalyticsTracker {
    constructor() {
        this.storageKey = 'siteAnalyticsData';
        this.sessionKey = 'currentSession';
        this.visitorKey = 'visitorId';
        this.init();
    }

    init() {
        // Inicijalizuj storage ako ne postoji
        if (!localStorage.getItem(this.storageKey)) {
            this.resetData();
        }

        // Generiši ili učitaj visitor ID
        if (!localStorage.getItem(this.visitorKey)) {
            localStorage.setItem(this.visitorKey, this.generateId());
        }

        // Pokreni tracking
        this.trackPageView();
        this.trackSession();
        this.trackUserBehavior();
    }

    generateId() {
        return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    resetData() {
        const initialData = {
            totalVisits: 0,
            uniqueVisitors: [],
            sessions: [],
            pageViews: [],
            trafficSources: {
                direct: 0,
                google: 0,
                social: 0,
                email: 0,
                other: 0
            },
            dailyVisits: this.initializeDailyVisits(),
            recentActivity: []
        };
        localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }

    initializeDailyVisits() {
        const days = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
        const dailyData = {};
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = { name: dayName, count: 0 };
        }
        
        return dailyData;
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    trackPageView() {
        const data = this.getData();
        const visitorId = localStorage.getItem(this.visitorKey);
        const currentPage = window.location.pathname || '/';
        const referrer = document.referrer || 'direct';
        const timestamp = new Date().toISOString();

        // Povećaj ukupan broj poseta
        data.totalVisits++;

        // Dodaj jedinstvenog posetioca
        if (!data.uniqueVisitors.includes(visitorId)) {
            data.uniqueVisitors.push(visitorId);
        }

        // Evidentiraj posetu za danas
        const today = new Date().toISOString().split('T')[0];
        if (!data.dailyVisits[today]) {
            // Resetuj ako je nova nedelja
            data.dailyVisits = this.initializeDailyVisits();
        }
        if (data.dailyVisits[today]) {
            data.dailyVisits[today].count++;
        }

        // Analiziraj izvor saobraćaja
        const source = this.identifyTrafficSource(referrer);
        data.trafficSources[source]++;

        // Evidentiraj page view
        const pageView = {
            visitorId,
            page: currentPage,
            referrer,
            timestamp,
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language
        };
        data.pageViews.push(pageView);

        // Dodaj u Recent Activity
        this.addRecentActivity(data, pageView);

        this.saveData(data);
    }

    identifyTrafficSource(referrer) {
        if (!referrer || referrer === 'direct') return 'direct';
        
        const url = referrer.toLowerCase();
        
        if (url.includes('google.com') || url.includes('bing.com') || url.includes('yahoo.com')) {
            return 'google';
        }
        if (url.includes('facebook.com') || url.includes('twitter.com') || 
            url.includes('instagram.com') || url.includes('linkedin.com') || 
            url.includes('t.co') || url.includes('youtube.com')) {
            return 'social';
        }
        if (url.includes('mail.') || url.includes('webmail') || url.includes('outlook')) {
            return 'email';
        }
        
        return 'other';
    }

    addRecentActivity(data, pageView) {
        const location = this.getLocation();
        const ip = this.generateMockIP();
        
        const activity = {
            ip: ip,
            location: location,
            page: pageView.page,
            time: this.getRelativeTime(new Date(pageView.timestamp)),
            timestamp: pageView.timestamp,
            duration: '0:00',
            sessionId: sessionStorage.getItem(this.sessionKey)
        };

        data.recentActivity.unshift(activity);
        
        // Zadrži samo poslednjih 50
        if (data.recentActivity.length > 50) {
            data.recentActivity = data.recentActivity.slice(0, 50);
        }
    }

    generateMockIP() {
        // Generiši consistent IP za ovog posetioca
        const visitorId = localStorage.getItem(this.visitorKey);
        const hash = this.simpleHash(visitorId);
        const parts = [
            (hash % 256),
            ((hash >> 8) % 256),
            ((hash >> 16) % 256),
            ((hash >> 24) % 256)
        ];
        return parts.join('.');
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    getLocation() {
        // Dohvati lokaciju iz browsera ili koristi default
        const lang = navigator.language || 'sr-RS';
        const locations = {
            'sr': '🇷🇸 Beograd',
            'sr-RS': '🇷🇸 Beograd',
            'hr': '🇭🇷 Zagreb',
            'bs': '🇧🇦 Sarajevo',
            'en': '🇬🇧 London',
            'en-US': '🇺🇸 New York',
            'de': '🇩🇪 Berlin',
            'fr': '🇫🇷 Paris',
            'es': '🇪🇸 Madrid',
            'it': '🇮🇹 Rome'
        };
        
        return locations[lang] || locations[lang.split('-')[0]] || '🌍 Unknown';
    }

    getRelativeTime(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000); // u sekundama

        if (diff < 60) return `${diff} sek ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
        return `${Math.floor(diff / 86400)} dana ago`;
    }

    trackSession() {
        let sessionId = sessionStorage.getItem(this.sessionKey);
        
        if (!sessionId) {
            // Nova sesija
            sessionId = this.generateId();
            sessionStorage.setItem(this.sessionKey, sessionId);
            
            const sessionData = {
                sessionId,
                visitorId: localStorage.getItem(this.visitorKey),
                startTime: new Date().toISOString(),
                endTime: null,
                pages: [window.location.pathname],
                duration: 0
            };
            
            const data = this.getData();
            data.sessions.push(sessionData);
            this.saveData(data);
        }

        // Update session pri svakom page view
        this.updateSession(sessionId);

        // Prati kada korisnik napušta stranicu
        window.addEventListener('beforeunload', () => {
            this.endSession(sessionId);
        });

        // Prati neaktivnost
        this.trackInactivity(sessionId);
    }

    updateSession(sessionId) {
        const data = this.getData();
        const session = data.sessions.find(s => s.sessionId === sessionId);
        
        if (session) {
            const currentPage = window.location.pathname;
            if (!session.pages.includes(currentPage)) {
                session.pages.push(currentPage);
            }
            
            const startTime = new Date(session.startTime);
            const now = new Date();
            session.duration = Math.floor((now - startTime) / 1000);
            
            this.saveData(data);
        }
    }

    endSession(sessionId) {
        const data = this.getData();
        const session = data.sessions.find(s => s.sessionId === sessionId);
        
        if (session && !session.endTime) {
            session.endTime = new Date().toISOString();
            
            // Ažuriraj trajanje u Recent Activity
            data.recentActivity.forEach(activity => {
                if (activity.sessionId === sessionId && activity.duration === '0:00') {
                    activity.duration = this.formatDuration(session.duration);
                }
            });
            
            this.saveData(data);
        }
    }

    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    trackInactivity(sessionId) {
        let inactivityTimer;
        const inactivityLimit = 30 * 60 * 1000; // 30 minuta

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                this.endSession(sessionId);
            }, inactivityLimit);
        };

        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    trackUserBehavior() {
        // Prati klikove
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'A') {
                this.trackEvent('link_click', {
                    href: target.href,
                    text: target.textContent
                });
            }
        });

        // Prati vreme na stranici
        let pageLoadTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000);
            this.trackEvent('time_on_page', { duration: timeOnPage });
        });
    }

    trackEvent(eventName, eventData) {
        const data = this.getData();
        if (!data.events) data.events = [];
        
        data.events.push({
            name: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        });
        
        // Zadrži samo poslednjih 500 eventa
        if (data.events.length > 500) {
            data.events = data.events.slice(-500);
        }
        
        this.saveData(data);
    }

    // Javne metode za dobijanje statistike
    getMetrics() {
        const data = this.getData();
        
        return {
            totalVisits: data.totalVisits,
            uniqueUsers: data.uniqueVisitors.length,
            avgTime: this.calculateAverageTime(data.sessions),
            bounceRate: this.calculateBounceRate(data.sessions)
        };
    }

    calculateAverageTime(sessions) {
        if (sessions.length === 0) return '0:00';
        
        const totalSeconds = sessions.reduce((sum, session) => sum + session.duration, 0);
        const avgSeconds = Math.floor(totalSeconds / sessions.length);
        
        const mins = Math.floor(avgSeconds / 60);
        const secs = avgSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    calculateBounceRate(sessions) {
        if (sessions.length === 0) return '0%';
        
        const bounces = sessions.filter(s => s.pages.length === 1 && s.duration < 10).length;
        const rate = (bounces / sessions.length * 100).toFixed(1);
        return `${rate}%`;
    }

    getDailyVisits() {
        const data = this.getData();
        const dailyVisits = data.dailyVisits;
        
        return {
            labels: Object.values(dailyVisits).map(d => d.name),
            data: Object.values(dailyVisits).map(d => d.count)
        };
    }

    getTrafficSources() {
        const data = this.getData();
        const sources = data.trafficSources;
        const total = Object.values(sources).reduce((sum, val) => sum + val, 0);
        
        if (total === 0) {
            return {
                labels: ['Google', 'Društvene mreže', 'Direktno', 'Email', 'Ostalo'],
                data: [0, 0, 0, 0, 0]
            };
        }
        
        return {
            labels: ['Google', 'Društvene mreže', 'Direktno', 'Email', 'Ostalo'],
            data: [
                Math.round((sources.google / total) * 100),
                Math.round((sources.social / total) * 100),
                Math.round((sources.direct / total) * 100),
                Math.round((sources.email / total) * 100),
                Math.round((sources.other / total) * 100)
            ]
        };
    }

    getRecentActivity() {
        const data = this.getData();
        return data.recentActivity.slice(0, 10);
    }

    // Admin metode
    clearAllData() {
        if (confirm('Da li ste sigurni da želite da obrišete sve podatke?')) {
            this.resetData();
            alert('Svi podaci su obrisani!');
            window.location.reload();
        }
    }

    exportData() {
        const data = this.getData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Automatski inicijalizuj tracker
window.analyticsTracker = new AnalyticsTracker();

console.log('✅ Analytics Tracker aktiviran - Praćenje u toku!');

