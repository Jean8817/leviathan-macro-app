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

pages/_document.js

javascript
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/favicon-32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#0A0E14" />
        {/* iOS-specific "Add to Home Screen" hints */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Leviathan Macro" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
