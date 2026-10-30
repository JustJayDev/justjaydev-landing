// Service Worker — v10 "Forge Station" (cache jj-v15).
// Network-first for data JSON, cache-first for static assets.
var CACHE = "jj-v15";
var STATIC = [
  "./",
  "./index.html",
  "./404.html",
  "./css/main.css",
  "./js/main.js",
  "./js/data.js",
  "./js/i18n.js",
  "./js/render.js",
  "./js/motion.js",
  "./js/palette.js",
  "./js/extras.js",
  "./js/types.js",
  "./data/projects.json",
  "./data/links.json",
  "./data/shiplog.json",
  "./data/status.json",
  "./fonts/space-grotesk-var.woff2",
  "./fonts/jetbrains-mono-var.woff2",
  "./fonts/noto-sans-devanagari.woff2",
  "./assets/jay.webp",
  "./assets/icon-32.png",
  "./assets/icon-512.png",
  "./manifest.json",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        return Promise.all(
          STATIC.map(function (url) {
            return cache.add(url).catch(function () {
              /* per-file, non-fatal */
            });
          }),
        );
      })
      .then(function () {
        self.skipWaiting();
      }),
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  // Data JSON: network-first with cache fallback
  if (url.pathname.indexOf("/data/") !== -1) {
    e.respondWith(
      fetch(e.request, { cache: "no-cache" })
        .then(function (res) {
          var clone = res.clone();
          caches.open(CACHE).then(function (c) {
            c.put(e.request, clone);
          });
          return res;
        })
        .catch(function () {
          return caches.match(e.request);
        }),
    );
    return;
  }

  // GitHub API: network only, never cache
  if (url.hostname === "api.github.com") return;

  // Static: cache-first with network fallback
  e.respondWith(
    caches
      .match(e.request)
      .then(function (cached) {
        return (
          cached ||
          fetch(e.request).then(function (res) {
            if (res.ok && url.origin === self.location.origin) {
              var clone = res.clone();
              caches.open(CACHE).then(function (c) {
                c.put(e.request, clone);
              });
            }
            return res;
          })
        );
      })
      .catch(function () {
        if (e.request.mode === "navigate") return caches.match("./404.html");
      }),
  );
});