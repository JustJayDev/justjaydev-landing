// sw.js — v12 services site. Cache jj-v12-7bedc4f8 (content-derived; do not hand-edit).
// Strategy: network-first for navigations (content stays fresh),
// cache-first for static assets (instant repeat loads), offline fallback.
var CACHE = 'jj-v12-7bedc4f8';
var STATIC = [
  './',
  './index.html',
  './404.html',
  './css/style.css',
  './js/main.js',
  './fonts/space-grotesk-var.woff2',
  './fonts/jetbrains-mono-var.woff2',
  './fonts/noto-sans-devanagari.woff2',
  './assets/jay.webp',
  './assets/icon-32.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/share.jpg',
  './manifest.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // per-file so one missing asset never kills the whole precache
      return Promise.all(STATIC.map(function (url) {
        return cache.add(url).catch(function () {});
      }));
    }).then(function () { self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  // leave cross-origin alone (github, wa.me, mailto, fonts CDNs)
  if (url.origin !== self.location.origin) return;

  // navigations: network-first, fall back to cached shell, then 404
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var clone = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', clone); });
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (r) {
          return r || caches.match('./404.html');
        });
      })
    );
    return;
  }

  // static assets: cache-first
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res.ok && res.type === 'basic') {
          var clone = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, clone); });
        }
        return res;
      }).catch(function () {
        return caches.match('./404.html');
      });
    })
  );
});