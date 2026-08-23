// TirthSaathi Service Worker - Network-First for Navigation & Fresh Asset Handling
const CACHE_NAME = 'tirthsaathi-v3';
const STATIC_ASSETS = [
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Static asset caching notice:', err);
      });
    })
  );
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip non-http/https schemes and cross-origin requests (e.g. CDNs, Vercel SSO, analytics)
  if (!url.protocol.startsWith('http')) return;
  if (url.origin !== self.location.origin) return;

  // 1. Navigation requests (HTML) -> Network First, fallback to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => 
          caches.match(event.request).then((cached) => 
            cached || caches.match('/index.html').then((indexCached) => 
              indexCached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
            )
          )
        )
    );
    return;
  }

  // 2. Vite hashed assets (/assets/*) -> Network First with cache fallback
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => 
          caches.match(event.request).then((cached) => 
            cached || new Response(null, { status: 404 })
          )
        )
    );
    return;
  }

  // 3. Static resources (images, icons) -> Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse || new Response(null, { status: 404 }));

      return cachedResponse || fetchPromise;
    })
  );
});
