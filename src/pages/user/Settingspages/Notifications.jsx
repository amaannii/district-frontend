import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../../API/Api";





function Notifications({goBack}) {
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState("for 2 days");
  const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

  // ✅ Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("userToken");
  setLoading(true);
        const res = await API.post(
          "/user/userdetails",
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
      }finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ✅ Save settings to backend
const saveNotificationSettings = async (newEnabled, newDuration) => {
  try {
    const userToken = localStorage.getItem("userToken");
  setLoading(true);
    // Save enabled + duration
    await API.post(
      "/user/updateNotifications",
      {
        enabled: newEnabled,
        duration: newDuration,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );

    // If enabled → Generate token and test notification
    if (newEnabled === true) {
      const fcmToken = await generateFCMToken();

      // Save token
      await API.post(
        "/user/saveFCMToken",
        { token: fcmToken },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      // ✅ Send test popup immediately
      await API.post("/user/testNotification", {
        token: fcmToken,
      });

      console.log("🔥 Test notification sent!");
    }

    console.log("Notification settings saved ✅");
  } catch (error) {
    console.log("Error saving notification settings ❌", error);
  }finally {
        setLoading(false);
      }
};



  return (
   <div className="w-full max-w-2xl xl:max-w-3xl mx-auto text-white play-regular px-4 sm:px-6">
       {/* Back Button (Mobile Only) */}
  <button
    onClick={goBack}
    className="md:hidden mb-4 flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"
  >
    ← Back
  </button>

     <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-8">Notifications</h1>

      {/* Toggle Card */}
    <div className="w-full bg-white text-black rounded-xl p-5 flex items-center justify-between gap-4 shadow-lg">
        <p className="text-sm font-medium min-w-0 truncate">
  Notifications {enabled ? "On" : "Off"}
</p>

        <button
          onClick={() => {
            const newValue = !enabled;
            setEnabled(newValue);
            setOpen(false);
            saveNotificationSettings(newValue, duration);
          }}
         className={`flex-shrink-0 w-12 h-6 flex items-center rounded-full px-1 transition ${
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
       <div className="mt-6 w-full sm:max-w-sm">

          <button
            onClick={() => setOpen(!open)}
           className="w-full flex justify-between items-center px-5 py-3 border border-gray-700 rounded-xl text-sm bg-black min-w-0"
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

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
