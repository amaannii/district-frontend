import React, { useState, useEffect } from "react";
import axios from "axios";



function Notifications() {
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState("for 2 days");
  const [open, setOpen] = useState(false);

  // ✅ Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.post(
          "http://localhost:3001/user/userdetails",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const user = res.data.user;

        setEnabled(user.notifications?.enabled ?? true);
        setDuration(user.notifications?.duration ?? "for 2 days");
      } catch (error) {
        console.log("Error fetching notification settings ❌", error);
      }
    };

    fetchSettings();
  }, []);

  // ✅ Save settings to backend
const saveNotificationSettings = async (newEnabled, newDuration) => {
  try {
    const userToken = localStorage.getItem("userToken");

    // Save enabled + duration
    await axios.post(
      "http://localhost:3001/user/updateNotifications",
      {
        enabled: newEnabled,
        duration: newDuration,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );

    // If enabled, generate FCM token
    if (newEnabled === true) {
      const fcmToken = await generateFCMToken();

      await axios.post(
        "http://localhost:3001/user/saveFCMToken",
        { token: fcmToken },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
    }

    console.log("Notification settings saved ✅");
  } catch (error) {
    console.log("Error saving notification settings ❌", error);
  }
};


  return (
    <div className="w-full text-white play-regular">
      <h1 className="text-xl font-bold mb-10">Notifications</h1>

      {/* Toggle */}
      {/* Toggle */}
      <div className="bg-white text-black rounded-xl p-5 flex items-center justify-between w-[500px] shadow-lg">
        <p className="text-sm font-medium">
          Notifications {enabled ? "On " : "Off "}
        </p>

        <button
          onClick={() => {
            const newValue = !enabled;
            setEnabled(newValue);
            setOpen(false);

            saveNotificationSettings(newValue, duration);
          }}
          className={`w-12 h-6 flex items-center rounded-full px-1 transition ${
            enabled ? "bg-[#879F00]" : "bg-gray-300"
          }`}
        >
          <span
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
              enabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Duration Dropdown */}
      {enabled && (
        <div className="mt-5 w-[350px]">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center px-5 py-3 border border-gray-700 rounded-xl text-sm bg-black"
          >
            {duration}
            <span>{open ? "▲" : "▼"}</span>
          </button>

          {open && (
            <div className="mt-2 border border-gray-700 rounded-xl overflow-hidden">
              {["for 2 days", "for a week", "until turn off"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setDuration(item);
                    setOpen(false);

                    saveNotificationSettings(enabled, item);
                  }}
                  className={`w-full flex justify-between items-center px-5 py-3 text-sm transition ${
                    duration === item
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  {item}

                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      duration === item ? "border-white" : "border-gray-500"
                    }`}
                  >
                    {duration === item && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
