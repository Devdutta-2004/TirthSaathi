// TirthSaathi Service Worker for Offline PWA Caching
const CACHE_NAME = 'tirthsaathi-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/images/hero_pilgrimage.jpg',
  '/images/varanasi_kashi.jpg',
  '/images/ayodhya_ram_mandir.jpg',
  '/images/tirupati_balaji.jpg',
  '/images/haridwar_pauri.jpg',
  '/images/family_pilgrimage.jpg',
  '/images/elderly_pilgrim.jpg',
  '/images/ganga_aarti.jpg',
  '/images/bhandara_prasad.jpg',
  '/images/final_cta_yatra.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW cache add error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(() => {
        // Fallback to cache index for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
