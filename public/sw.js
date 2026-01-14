const CACHE_NAME = 'maison-dorient-v1';
const OFFLINE_URL = '/offline';

// Resources to cache immediately
const PRECACHE_RESOURCES = [
  '/',
  '/offline',
  '/manifest.json',
];

// Cache strategies
const CACHE_STRATEGIES = {
  cacheFirst: [
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/,
    /\.(?:woff|woff2|ttf|otf)$/,
    /\/icons\//,
  ],
  networkFirst: [
    /\/api\//,
    /\/properties/,
    /\/neighborhoods/,
  ],
  staleWhileRevalidate: [
    /\.(?:js|css)$/,
    /\/_next\/static\//,
  ],
};

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching resources');
      return cache.addAll(PRECACHE_RESOURCES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== self.location.origin) return;

  // Skip admin routes
  if (url.pathname.startsWith('/admin')) return;

  // Determine cache strategy
  const strategy = getStrategy(url.pathname);

  if (strategy === 'cacheFirst') {
    event.respondWith(cacheFirst(request));
  } else if (strategy === 'networkFirst') {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network request failed:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }

    return new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
        });
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

// Determine strategy based on URL
function getStrategy(pathname) {
  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (pattern.test(pathname)) return 'cacheFirst';
  }
  for (const pattern of CACHE_STRATEGIES.networkFirst) {
    if (pattern.test(pathname)) return 'networkFirst';
  }
  return 'staleWhileRevalidate';
}

// Handle push notifications (future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    data: data.url,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'close', title: 'Close' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' && event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
