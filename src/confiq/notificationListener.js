import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const listenNotifications = () => {
  onMessage(messaging, (payload) => {
    console.log("🔥 Foreground Notification:", payload);

    // ✅ Manual popup
    new Notification(payload.notification.title, {
      body: payload.notification.body,
    });
  });
};
