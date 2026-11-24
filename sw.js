importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

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

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || "みやチャット";
  const body = (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || "新着メッセージがあります";
  self.registration.showNotification(title, {
    body: body,
    icon: "./icon.png",
    badge: "./icon.png",
    tag: "miyachat-" + Date.now(),
    renotify: true
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("./"));
});
