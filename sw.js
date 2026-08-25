// 台灣行事曆 Service Worker v2 — 含 Web Push 支援
const CACHE_NAME = 'tw-calendar-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './apple-touch-icon.png',
  'https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.js'
];

// ── 安裝：預快取 ──────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── 啟動：清除舊快取 ──────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch：快取優先 ───────────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.url.includes('TaiwanCalendar')) {
    // 節日資料：網路優先，失敗用快取
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  // App 本體頁面：一律先嘗試連網抓最新版，離線才退回快取
  // （避免 index.html 改版後，只有 sw.js 沒變就完全抓不到新版的問題）
  const isAppShell = event.request.mode === 'navigate' || event.request.url.endsWith('/index.html');
  if (isAppShell) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }
  // 其他資源：快取優先
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// ── Web Push：收到推播 ────────────────────────────────
self.addEventListener('push', event => {
  let data = { title: '行事曆提醒', body: '' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    if (event.data) data.body = event.data.text();
  }

  // 圖示一律用完整網址，避免 iOS Safari 因圖示路徑錯誤（404）而整個通知不顯示
  const iconUrl = new URL('icon-192.png', self.registration.scope).href;
  const options = {
    body: data.body || '',
    icon: data.icon || iconUrl,
    badge: iconUrl,
    vibrate: [200, 100, 200],
    tag: data.tag || 'cal-reminder',
    requireInteraction: true,   // 通知停留到使用者互動（不自動消失）
    data: { url: data.url || self.registration.scope }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '行事曆提醒', options)
      .then(()=>self.clients.matchAll({type:'window',includeUncontrolled:true}))
      .then(clients=>clients.forEach(c=>c.postMessage({type:'push-fired',tag:options.tag})))
  );
});

// ── 點擊通知：開啟正確的 App 網址 ───────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  // 使用 Service Worker 的 scope 作為 App 網址（自動對應 GitHub Pages 子路徑）
  const appUrl = self.registration.scope;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // 如果 App 已經開著，直接 focus
      for (const client of clientList) {
        if (client.url.startsWith(appUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // App 沒開著，開啟新視窗
      if (clients.openWindow) return clients.openWindow(appUrl);
    })
  );
});
