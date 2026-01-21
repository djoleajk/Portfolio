// ============================================
// SERVICE WORKER ZA PWA FUNKCIONALNOST
// Cache strategija + Offline podrška
// ============================================

const CACHE_NAME = 'production-calculator-v2';
const urlsToCache = [
    './',
    './index.html',
    './bem.html',
    './italijanka.html',
    './robot.html',
    './ubadanje.html',
    './zatvaranje-mine.html',
    './peskarenje.html',
    './history.html',
    './vreme-po-komadu.html',
    './koliko-komada.html',
    './styles.css',
    './favicon.svg',
    './time-sync.js',
    './weather.js',
    './bem.js',
    './italijanka.js',
    './robot.js',
    './ubadanje.js',
    './zatvaranje-mine.js',
    './peskarenje.js',
    './vreme-po-komadu.js',
    './koliko-komada.js',
    './history-manager.js',
    './normativi.js'
];

// Instalacija Service Worker-a
self.addEventListener('install', (event) => {
    console.log('Service Worker: Инсталирање...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Кеширање фајлова');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✓ Service Worker: Успешно инсталиран');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Грешка при инсталацији:', error);
            })
    );
});

// Aktivacija Service Worker-a
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Активација...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Брисање старог кеша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✓ Service Worker: Активиран');
            return self.clients.claim();
        })
    );
});

// Fetch strategija: Cache First, then Network
self.addEventListener('fetch', (event) => {
    // Preskoči cross-origin zahteve (API pozive)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Pronađeno u cache-u
                    return cachedResponse;
                }

                // Nije u cache-u, preuzmi sa mreže
                return fetch(event.request)
                    .then((response) => {
                        // Proveri da li je validan odgovor
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Kloniraj odgovor jer može biti konzumiran samo jednom
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Offline fallback
                        console.log('Service Worker: Offline režim');
                        return caches.match('./index.html');
                    });
            })
    );
});

// Push notifikacije
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push примљен');
    
    const options = {
        body: event.data ? event.data.text() : 'Нова нотификација',
        icon: '🔔',
        badge: '🏭',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Калкулатор времена', options)
    );
});

// Klik na notifikaciju
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Клик на нотификацију');
    
    event.notification.close();

    event.waitUntil(
        clients.openWindow('./')
    );
});

// Background sync (opciono, za buduće proširenje)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background синхронизација');
    
    if (event.tag === 'sync-calculations') {
        event.waitUntil(syncCalculations());
    }
});

async function syncCalculations() {
    // Ovde možete dodati logiku za sinhronizaciju sa serverom
    console.log('Синхронизација калкулација...');
}

