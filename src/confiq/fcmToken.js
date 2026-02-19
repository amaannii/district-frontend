import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const generateFCMToken = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "YOUR_REAL_VAPID_KEY",
    });

    console.log("🔥 FCM Token:", token);
    return token;
  }

  console.log("Permission denied ❌");
};
