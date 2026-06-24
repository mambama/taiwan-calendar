// 台灣行事曆 Service Worker
const CACHE_NAME = 'tw-calendar-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.js'
];

// 安裝：預先快取所有資源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// 啟動：清除舊快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 攔截請求：優先使用快取，失敗再走網路
self.addEventListener('fetch', event => {
  // 節日資料每次都走網路（保持最新），失敗才用快取
  if (event.request.url.includes('TaiwanCalendar')) {
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
  // 其他資源：快取優先
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
