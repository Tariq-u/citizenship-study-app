const CACHE_NAME = 'citizenship-app-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/css/style.css',
  '/src/js/app.js',
  '/src/assets/data/questions.json',
  '/src/assets/data/translations.json',
  '/src/pages/lessons.html',
  '/src/pages/flashcards.html',
  '/src/pages/quiz.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});