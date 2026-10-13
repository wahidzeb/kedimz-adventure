/* Kedimz Adventure service worker, scope /kedimz-adventure/ only (keeps the hub's "/" worker off this game).
   Network-first for the game page (fresh builds win online, cached copy offline); cache-first for own icons. */
const C = "kedimz-adventure-v1";
self.addEventListener("install", (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(["./", "manifest.webmanifest", "icons/icon-192.png"])).catch(() => {}).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("kedimz-adventure-") && k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin || !u.pathname.startsWith("/kedimz-adventure/")) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(C).then((c) => c.put("./", cp)); } return res; })
      .catch(() => caches.match("./").then((h) => h || Response.error())));
  } else if (u.pathname.startsWith("/kedimz-adventure/icons/") || u.pathname === "/kedimz-adventure/manifest.webmanifest") {
    e.respondWith(caches.match(r).then((h) => h || fetch(r)));
  }
});
