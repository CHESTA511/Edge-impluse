// Service Worker for VoxSilva Forest Surveillance App
const CACHE_NAME = 'voxsilva-forest-surveillance-v5-icons-improved';
const urlsToCache = [
  '/',
  '/index.html',
  '/monitoring.html',
  '/history.html',
  '/device.html',
  '/maps.html',
  '/chatbot.html',
  '/account.html',
  '/style.css',
  '/account.css',
  '/styleMaps.css',
  '/app.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Cache addAll failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim all clients to use new service worker immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip caching for non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If cached, return it
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the new response
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, return offline page if available
        return caches.match('/index.html');
      })
  );
});

