/* Service worker telefonu: zpráva od stolu přijde šifrovaně (RFC 8291), prohlížeč ji rozšifruje a tady se jen ukáže. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let m = { nadpis: 'Pracovní stůl', text: 'Něco vyžaduje pozornost.' };
  try{ if(e.data) m = Object.assign(m, e.data.json()); }catch(err){ /* nečitelný obsah: obecná zpráva */ }
  e.waitUntil(self.registration.showNotification(m.nadpis, {
    body: m.text, icon: 'ikona-192.png', badge: 'ikona-192.png', tag: 'stul', renotify: true,
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const okna = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if(okna.length) await okna[0].focus(); else await self.clients.openWindow('./');
  })());
});
