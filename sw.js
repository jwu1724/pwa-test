const CACHE_NAME = "pwa-test-v3"; // 每次改 code 記得改版本號
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    // 如果你有放 icon 到 github，請補在這裡
    // './icon-192.png'
];

// 安裝階段：強制快取基礎檔案
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("正在快取基礎資源...");
            return cache.addAll(ASSETS);
        }),
    );
    self.skipWaiting();
});

// 啟動階段：清理舊快取
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key)),
            );
        }),
    );
});

// 攔截請求
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // 1. 如果快取有，直接給
            if (cachedResponse) return cachedResponse;

            // 2. 如果快取沒有，去網路上抓
            return fetch(event.request).catch(() => {
                // 3. 網路也斷了，回傳一個自定義的錯誤回應，避免程式崩潰
                return new Response("離線狀態且無快取資源", {
                    status: 503,
                    statusText: "Service Unavailable",
                    headers: new Headers({
                        "Content-Type": "text/plain; charset=utf-8",
                    }),
                });
            });
        }),
    );
});
