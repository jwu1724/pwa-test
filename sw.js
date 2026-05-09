const CACHE_NAME = "pwa-test-v1";
const ASSETS = ["index.html", "manifest.json"];

// 安裝並快取資源
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }),
    );
});

// 攔截請求，優先使用快取
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }),
    );
});
