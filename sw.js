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

// アプリを閉じている（バックグラウンド）状態のプッシュ通知受信処理
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'みやチャット';
  const body = (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || '新着メッセージが届きました';
  const roomId = (payload.data && payload.data.roomId) || '';

  return self.registration.showNotification(title, {
    body: body,
    icon: './icon.png',
    badge: './icon.png',
    tag: 'miyachat-bg-' + Date.now(),
    renotify: true,
    vibrate: [200, 100, 200],
    data: { roomId: roomId }
  });
});

// 通知バナーをタップしたら該当のトークルームを開く
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
