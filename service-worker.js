// Service Worker for Invitation 15 Años (Cache-First Strategy)

const CACHE_NAME = 'invitation-cache-v2'; // version updated
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/general.css',
  '/css/hero.css',
  '/css/welcome.css',
  '/css/countdown.css',
  '/css/gallery.css',
  '/css/dresscode.css',
  '/css/gifts.css',
  '/css/finalinfo.css',
  '/css/footer.css',
  '/css/header.css',
  '/script.js',
  '/service-worker.js',
  '/source/video.mp4',
  '/source/img1.jpg',
  '/source/img2.jpg',
  '/source/img3.jpg',
  '/source/img4.jpg',
  '/source/backgorund-welcome.png',
  '/source/corazon.png',
  '/source/corazon-izquierdo.png',
  '/source/corazon-derecho.png',
  '/source/gancho.png',
  '/source/regalo.png',
  '/source/sobre.png'
];

// Install event: precache assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: respond from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          // Optionally cache new resource
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
  );
});
