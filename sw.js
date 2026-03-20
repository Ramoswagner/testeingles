const CACHE_NAME = 'wagner-english-v1';

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
  '/data/pmbok.json',
  '/data/phrases.json',
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Outfit:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
  // Força a ativação imediata sem esperar tabs fecharem
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('Cache parcial — alguns recursos podem não estar disponíveis offline:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        // Retorna do cache imediatamente e atualiza em background
        if (cached) {
          fetch(event.request)
            .then(fresh => {
              if (fresh && fresh.ok) {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, fresh));
              }
            })
            .catch(() => {}); // Silencia erros offline
          return cached;
        }
        // Não está no cache: busca na rede
        return fetch(event.request);
      })
      .catch(() => caches.match('/index.html')) // Fallback offline
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Assume controle imediato de todas as tabs abertas
      self.clients.claim(),
      // Remove caches antigos (lexipro-v1, lexipro-v2, etc.)
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
    ])
  );
});
