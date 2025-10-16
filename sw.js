// A unique name for the cache
const CACHE_NAME = 'kakeibo-pwa-cache-v1';

// The list of files and resources to cache for offline use
const urlsToCache = [
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&family=Inter:wght@300;400;500&display=swap'
];

// Install event: fires when the service worker is first installed.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // waitUntil() ensures that the service worker will not install until the code inside has successfully completed.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        // addAll() takes an array of URLs, fetches them, and adds them to the given cache.
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Service Worker: Caching failed', err))
  );
});

// Activate event: fires when the service worker becomes active.
// This is a good place to manage old caches and clean up data from previous versions.
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    // If a cache's name is not the current one, we delete it.
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event: fires for every network request made by the page.
self.addEventListener('fetch', (event) => {
  // We use respondWith() to hijack the request and provide our own response.
  event.respondWith(
    // Check if the request is already in the cache.
    caches.match(event.request)
      .then((response) => {
        // If we found a match in the cache, return it (cache-first strategy).
        if (response) {
          return response;
        }
        // If the request is not in the cache, fetch it from the network.
        return fetch(event.request);
      })
  );
});