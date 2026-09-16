/* Перехватывает fetch и отдаёт файлы из window.__ASSETS__ вместо сети. */
(function () {
    const assets = window.__ASSETS__ || {};

    function findAsset(url) {
        if (!url) return null;
        let clean = String(url).split("#")[0].split("?")[0];
        // Убираем протокол/host, если пришёл абсолютный URL
        try {
            if (clean.includes("://")) clean = new URL(clean).pathname;
        } catch (_) {}
        clean = clean.replace(/^\/+/, "");

        if (assets[clean]) return assets[clean];

        // Пробуем по basename — на случай разных относительных путей
        const base = clean.split("/").pop();
        for (const key of Object.keys(assets)) {
            if (key.split("/").pop() === base) return assets[key];
        }
        return null;
    }

    function b64ToBytes(b64) {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
    }

    function buildResponse(asset) {
        let body, size;
        if (asset.b64 !== undefined) {
            body = b64ToBytes(asset.b64);
            size = body.byteLength;
        } else {
            body = asset.text;
            size = new TextEncoder().encode(body).byteLength;
        }
        return new Response(body, {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": asset.type || "application/octet-stream",
                "Content-Length": String(size),
            },
        });
    }

    const originalFetch = window.fetch ? window.fetch.bind(window) : null;

    window.fetch = function (input, init) {
        let url;
        if (typeof input === "string") url = input;
        else if (input instanceof URL) url = input.href;
        else if (input instanceof Request) url = input.url;
        else url = String(input);

        const method =
            (init && init.method) ||
            (input instanceof Request ? input.method : "GET");

        if (method.toUpperCase() === "GET") {
            const asset = findAsset(url);
            if (asset) {
                console.log(`[inline-assets] ${url} → из памяти`);
                return Promise.resolve(buildResponse(asset));
            }
        }
        if (!originalFetch) {
            return Promise.reject(new Error("fetch недоступен и файл не найден в inline-assets: " + url));
        }
        return originalFetch(input, init);
    };
})();