import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const generateFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY_HERE",
      });

      console.log("🔥 FCM Token:", token);
      return token;
    } else {
      console.log("Notification permission denied ❌");
    }
  } catch (error) {
    console.log("Token generation error ❌", error);
  }
};
