const CACHE_NAME = "pwa-test-v2"; // 更新版本號
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }),
    );
    self.skipWaiting(); // 強制更新
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // 優先使用快取，失敗則發送網路請求
            return (
                response ||
                fetch(event.request).catch(() => {
                    console.log("網路斷線且無快取資源");
                })
            );
        }),
    );
});
