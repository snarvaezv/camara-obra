// Cámara de Obra: funciona sin señal guardando la app en el teléfono.
const CACHE = "camara-obra-v19";
const CACHE_OCR = "camara-obra-ocr-v1";   // lector de texto del escáner (~6 MB): se guarda aparte y no se borra con cada versión
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icono-180.png", "icono-192.png", "icono-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== CACHE_OCR).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;           // GPS, lugar y clima van directo a internet
  if (u.pathname.includes("/ocr/")) {                  // primero lo guardado; si no está, se baja y se guarda
    e.respondWith(caches.open(CACHE_OCR).then(c => c.match(e.request).then(r => r || fetch(e.request).then(n => { if (n.ok) c.put(e.request, n.clone()); return n; }))));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
