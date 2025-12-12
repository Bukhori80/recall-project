const CACHE_NAME = 'recall-v3-production-fix-v3'; // Naikkan versi
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE).catch((err) => {
        console.warn('Failed to pre-cache some files:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // --- PERBAIKAN 1: HANYA PROSES METODE GET ---
  // Request POST, PUT, DELETE tidak bisa dan tidak boleh di-cache.
  if (event.request.method !== 'GET') {
    return; 
  }

  // --- PERBAIKAN 2: FILTER SKEMA URL ---
  // Abaikan request non-HTTP (seperti chrome-extension:// atau data:)
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // 2. STRATEGI: Network First untuk HTML (Navigasi)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 3. STRATEGI: Stale-While-Revalidate untuk Aset Statis
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || 
            (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
          return networkResponse;
        }

        // Mencegah caching jika JS yang diminta ternyata mengembalikan HTML (MIME error fix)
        const contentType = networkResponse.headers.get('content-type');
        if (event.request.url.endsWith('.js') && contentType && contentType.includes('text/html')) {
           return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
            // Put hanya dieksekusi untuk request GET yang valid
            cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
          // Fallback jika network gagal dan cache tidak ada
      });

      return cachedResponse || fetchPromise;
    })
  );
});