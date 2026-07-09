const CACHE_NAME = 'planning-jeudi-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // EXCLUSION : On ignore toutes les requêtes liées à Firebase/Firestore
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('identitytoolkit.googleapis.com')) {
    return; // Laisse la requête se faire normalement sans intervention du SW
  }

  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ─── Notifications push (Firebase Cloud Messaging) ───
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCsJACTFFdHAFlvOQNw9h5spegq7lV2-zE",
  authDomain: "planning-jeudi.firebaseapp.com",
  projectId: "planning-jeudi",
  storageBucket: "planning-jeudi.firebasestorage.app",
  messagingSenderId: "894632315552",
  appId: "1:894632315552:web:aed8853528dec823d617c5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "Le Planning des Jeudis";
  const options = {
    body: (payload.notification && payload.notification.body) || "",
    icon: 'icon-192.png',
    badge: 'icon-192.png'
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
