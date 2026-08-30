javascript
// Minimal service worker — just enough to satisfy PWA "installability"
// requirements (a manifest + a registered service worker + HTTPS) and give
// basic offline caching for pages people have already visited.
//
// This is intentionally simple. If you want real offline support later
// (e.g. viewing reports with no connection), this is the file to expand —
// consider a library like Workbox once your caching needs grow.

const CACHE_NAME = "leviathan-macro-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const response = await fetch(event.request);
        if (event.request.method === "GET" && response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        const cached = await cache.match(event.request);
        return cached || Response.error();
      }
    })
  );
});
