importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDbPEHDiU1dtbOj-vQqfDtX1ihsFqnEbtE",
  messagingSenderId: "106602278526",
  projectId: "distrix-5f2de",
  appId: "1:106602278526:web:f4fb48614d00d7c000f22f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("🔥 Background Notification Received:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
