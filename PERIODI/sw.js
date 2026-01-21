// Service Worker za PWA
const CACHE_NAME = 'periodi-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './js/storage.js',
  './js/utils.js',
  './js/dashboard.js',
  './js/calendar.js',
  './js/cycles.js',
  './js/symptoms.js',
  './js/formular-za-simptome.js',
  './js/anketa.js',
  './js/reminders.js',
  './js/notifications.js',
  './js/settings.js',
  './js/theme.js',
  './js/events.js',
  './js/toast.js',
  './js/confirm-dialog.js',
  './js/charts.js',
  './js/mobile-optimization.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Instalacija Service Workera
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

// Aktivacija Service Workera
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - Network First Strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Kloniraj response pre nego što ga keširaš
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // Ako network ne radi, vrati iz cache-a
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Ako nema u cache-u, vrati index.html za navigacione zahteve
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Push Notification Event Handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Periodi';
  const options = {
    body: data.body || 'Nova notifikacija',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" rx="20" fill="%23e91e63"/%3E%3Ctext x="50" y="70" font-size="60" text-anchor="middle" fill="white"%3E%F0%9F%A9%B8%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" rx="20" fill="%23e91e63"/%3E%3Ctext x="50" y="70" font-size="60" text-anchor="middle" fill="white"%3E%F0%9F%A9%B8%3C/text%3E%3C/svg%3E',
    tag: data.tag || 'periodi-notification',
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Event Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Ako postoji otvoren prozor, fokusiraj ga
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Ako nema otvorenog prozora, otvori novi
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
