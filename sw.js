// Service worker : hors ligne. Code et données précachés à l'installation ; données en « cache d'abord, rafraîchi en arrière-plan ».
// La page (navigation), le manifeste et les icônes passent par le réseau d'abord : l'iPhone lit ainsi la bonne icône
// quand on ajoute l'app à l'écran d'accueil (le cache ne sert qu'hors ligne).
// Les PDF de imprimer/ ne sont jamais précachés. Toute modification du code impose d'incrémenter VERSION.
const VERSION = 'dec2-v14';
const CORE = [
  './', './index.html', './manifest.webmanifest', './css/app.css',
  './js/app.js', './js/core.js', './js/store.js', './js/icons.js', './js/claude.js', './js/reader.js',
  './data/parcours.json', './data/items.json', './data/notions.json', './data/stats.json',
  './data/methode.json', './data/materiel.json', './data/phases.json', './data/index_seed.json', './data/index_prerempli.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/ue2-touch-180.png',
];
const FRESH = (u) => new Request(u, { cache: 'reload' });

self.addEventListener('install', (e) => {
  e.waitUntil((async () => { const c = await caches.open(VERSION); await c.addAll(CORE.map(FRESH)); self.skipWaiting(); })());
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => { const ks = await caches.keys(); await Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))); await self.clients.claim(); })());
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.includes('/imprimer/')) return;
  if (url.pathname.includes('/data/')) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION); const hit = await c.match(e.request);
      const net = fetch(FRESH(e.request.url)).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || new Response('{}', { status: 503 });
    })());
    return;
  }
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.webmanifest') || url.pathname.includes('/icons/')) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      try {
        const r = await fetch(FRESH(e.request.url));
        if (r.ok) c.put(e.request.mode === 'navigate' ? './index.html' : e.request, r.clone());
        return r;
      } catch {
        return (await c.match(e.request, { ignoreSearch: true })) || (await c.match('./index.html'));
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    return (await c.match(e.request, { ignoreSearch: true })) || (e.request.mode === 'navigate' ? await c.match('./index.html') : null) || fetch(e.request);
  })());
});
