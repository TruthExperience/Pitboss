// -------------------------------
// PITBOSSOS SERVICE WORKER v1
// Offline caching + request queue
// -------------------------------

const CACHE_NAME = "pitboss-cache-v1";
const API_QUEUE = "pitboss-api-queue";

// Shell files to cache
const SHELL = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install — cache shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

// Activate — cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only intercept POST requests to API
  const isAPI =
    req.method === "POST" &&
    req.url.startsWith("http://localhost:4000");

  if (isAPI) {
    event.respondWith(handleAPIRequest(req));
    return;
  }

  // For GET requests → cache-first
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
    // Try sending to API normally
    const res = await fetch(req.clone());
    return res;
  } catch (err) {
    // If offline → queue request
    const body = await req.clone().json();
    const db = await openQueueDB();
    const tx = db.transaction(API_QUEUE, "readwrite");
    tx.store.add({
      url: req.url,
      body,
      timestamp: Date.now()
    });

    // Register background sync
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

// Background sync handler
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

      // Remove from queue
      await cursor.delete();
    } catch (err) {
      // Stop if still offline
      return;
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
