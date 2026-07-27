// La Cuenta del Asado — service worker
// Guarda una copia de la app para que funcione sin internet.
const CACHE = 'cuenta-asado-v3';
const ARCHIVOS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ARCHIVOS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

// Estrategia: red primero, cache si no hay señal
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(res){
      var copia = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copia); });
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(r){
        return r || caches.match('/index.html');
      });
    })
  );
});
