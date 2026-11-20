// Firebase Cloud Messaging (FCM) バックグラウンド受信対応 Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBDVBM72ZS8AVQv3GNF4ddgkPW8Vs15liM",
  authDomain: "miyachat-e5fd8.firebaseapp.com",
  databaseURL: "https://miyachat-e5fd8-default-rtdb.firebaseio.com",
  projectId: "miyachat-e5fd8",
  storageBucket: "miyachat-e5fd8.firebasestorage.app",
  messagingSenderId: "499800465396",
  appId: "1:499800465396:web:222415c67701b11b0223a1"
});

const messaging = firebase.messaging();

// アプリを閉じているときにプッシュ通知を受信した際のロック画面・通知バー表示
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'みやチャット';
  const body = (payload.notification && payload.notification.body) || '新着メッセージが届きました';
  const targetRoom = (payload.data && payload.data.roomId) || '';

  return self.registration.showNotification(title, {
    body: body,
    icon: './icon.png',
    badge: './icon.png',
    tag: 'miyachat-push-' + Date.now(),
    renotify: true,
    vibrate: [200, 100, 200],
    data: { roomId: targetRoom }
  });
});

// 通知バナーをタップしたときに「みやチャット」を開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const roomId = event.notification.data && event.notification.data.roomId;
  const targetUrl = roomId ? `./index.html?room=${encodeURIComponent(roomId)}` : './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
