const CACHE_NAME = "pitboss-cache-v1";
const API_QUEUE = "pitboss-api-queue";

const SHELL = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install: cache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Offline queue for POST API calls
  const isAPI =
    req.method === "POST" &&
    req.url.startsWith("http://localhost:4000");

  if (isAPI) {
    event.respondWith(handleAPIRequest(req));
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).catch(() => caches.match("/"))
      );
    })
  );
});

// Handle POST requests offline
async function handleAPIRequest(req) {
  try {
    const res = await fetch(req.clone());
    return res;
  } catch (err) {
    const body = await req.clone().json();
    const db = await openQueueDB();
    const tx = db.transaction(API_QUEUE, "readwrite");
    tx.store.add({
      url: req.url,
      body,
      timestamp: Date.now()
    });

    if ("sync" in self.registration) {
      self.registration.sync.register("pitboss-sync");
    }

    return new Response(
      JSON.stringify({
        queued: true,
        offline: true,
        message: "Request saved and will sync when online."
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}

// Background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "pitboss-sync") {
    event.waitUntil(flushQueue());
  }
});

// Flush queued API requests
async function flushQueue() {
  const db = await openQueueDB();
  const tx = db.transaction(API_QUEUE, "readwrite");
  const store = tx.store;

  let cursor = await store.openCursor();
  while (cursor) {
    const { url, body } = cursor.value;

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      await cursor.delete();
    } catch (err) {
      return; // stop if still offline
    }

    cursor = await cursor.continue();
  }
}

// IndexedDB for queue
function openQueueDB() {
  return new Promise((resolve) => {
    const req = indexedDB.open("pitboss-db", 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(API_QUEUE, {
        keyPath: "timestamp"
      });
    };

    req.onsuccess = () => resolve(req.result);
  });
}
