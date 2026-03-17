const CACHE_NAME = 'lexipro-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/data/engineering.json',
  '/data/pmgmt.json',
  '/data/finance.json',
  '/data/corporate.json',
  '/data/planning.json',
  '/data/portfolio.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86Mmw.ttf',
  'https://fonts.gstatic.com/s/dmsans/v11/rP2Hp2ywxg089UriCZOIHQ.woff2',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          fetch(event.request).then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          });
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});
