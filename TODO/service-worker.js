// Service Worker za PWA funkcionalnost
const CACHE_NAME = 'todo-lista-pro-v1';
const urlsToCache = [
  './Index.html',
  './Style.css',
  './script.js',
  './manifest.json'
];

// Instalacija Service Worker-a
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache otvorena');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivacija i čišćenje starih cache-ova
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Brisanje starog cache-a:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - vraćanje iz cache-a ili mreže
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Vraća iz cache-a ako postoji, inače fetch sa mreže
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Proverava da li je validan odgovor
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Klonira odgovor
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Background Sync za offline podrsku
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  // Sinhronizacija zadataka kada se uspostavi konekcija
  console.log('Sinhronizacija zadataka...');
}

// Push notifikacije
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notifikacija',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📝</text></svg>',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Todo Lista Pro', options)
  );
});

// Klik na notifikaciju
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('./')
  );
});

