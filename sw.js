// Cámara de Obra: funciona sin señal guardando la app en el teléfono.
// v1.19: abre al instante con la copia guardada (antes esperaba la red y con poca señal quedaba en blanco);
// la versión nueva se descarga en segundo plano y la app avisa para actualizar.
const CACHE = "camara-obra-v21";
const CACHE_OCR = "camara-obra-ocr-v1";   // lector de texto del escáner (~6 MB): se guarda aparte y no se borra con cada versión
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icono-180.png", "icono-192.png", "icono-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== CACHE_OCR).map(k => caches.delete(k)))).then(() => self.clients.claim())));
const conTiempo = (p, ms) => Promise.race([p, new Promise((_, mal) => setTimeout(() => mal(new Error("tiempo")), ms))]);
async function avisarSiCambio(req, nueva) {
  try {
    const c = await caches.open(CACHE), vieja = await c.match(req);
    const tn = await nueva.clone().text(), tv = vieja ? await vieja.clone().text() : null;
    await c.put(req, nueva);
    if (tv !== null && tv !== tn && /text\/html/.test(nueva.headers.get("content-type") || "")) {
      await new Promise(ok => setTimeout(ok, 2500));   // que la página alcance a cargar y a escuchar
      (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).forEach(cl => cl.postMessage({ tipo: "nueva" }));
    }
  } catch (e) { }
}
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // GPS, lugar y clima van directo a internet
  if (u.pathname.includes("/ocr/")) {                  // primero lo guardado; si no está, se baja y se guarda
    e.respondWith(caches.open(CACHE_OCR).then(c => c.match(e.request).then(r => r || fetch(e.request).then(n => { if (n.ok) c.put(e.request, n.clone()); return n; }))));
    return;
  }
  const red = fetch(e.request, { cache: "no-cache" });
  e.waitUntil(red.then(r => r.ok ? avisarSiCambio(e.request, r.clone()) : null).catch(() => { }));   // actualiza la copia en segundo plano
  e.respondWith((async () => {
    const guardada = await caches.match(e.request, { ignoreSearch: true }) || (e.request.mode === "navigate" ? await caches.match("index.html") : null);
    if (guardada) return guardada;                                           // al instante, sin esperar la señal
    try { return await conTiempo(red, 8000); } catch (err) { return (await caches.match("index.html")) || Response.error(); }
  })());
});
