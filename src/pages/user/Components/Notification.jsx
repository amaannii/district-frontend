import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../API/Api";

function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [deleted, setdeleted] = useState(0);
  const [confirmed, setconfirmed] = useState(0);
  const [loading, setloading] = useState(false);

  // Check if notifications have been viewed today
  const hasViewedToday = () => {
    const lastViewed = localStorage.getItem("notificationsLastViewed");
    if (!lastViewed) return false;
    
    const today = new Date().toDateString();
    return lastViewed === today;
  };

  useEffect(() => {
    // Only load from localStorage if not viewed today
    if (!hasViewedToday()) {
      const stored = localStorage.getItem("recentNotifications");
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } else {
      // Clear notifications if already viewed today
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [deleted, confirmed]);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("userToken");

      const res = await API.get("/user/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        // Only set notifications if not viewed today
        if (!hasViewedToday()) {
          setNotifications(res.data.request);
          localStorage.setItem(
            "recentNotifications",
            JSON.stringify(res.data.request)
          );
        } else {
          setNotifications([]);
        }
      }
    } catch (err) {
      console.error("Fetch notifications failed:", err);
    } finally {
      setloading(false);
    }
  };

  // 🔹 Mark notifications as viewed
  const markAsViewed = () => {
    const today = new Date().toDateString();
    localStorage.setItem("notificationsLastViewed", today);
    setNotifications([]); // Clear notifications from state
  };

  // 🔹 Confirm request
  const handleConfirm = async (username) => {
    const token = localStorage.getItem("userToken");

    try {
      setloading(true);

      const response = await API.post(
        `/user/confirmnotification`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success === true) {
        setconfirmed(confirmed + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setloading(false);
    }
  };

  // 🔹 Delete notification
  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await API.post(
        `/user/notificationdelete`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success == true) {
        setdeleted(deleted + 1);
      } else {
        alert("deleted failed");
      }

      setNotifications((prev) => {
        const updated = prev.filter((item) => item._id !== id);
        localStorage.setItem("recentNotifications", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Notification Card
  const NotificationItem = ({ item }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-white/10">
      {/* Profile Section */}
      <div
        className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1"
        onClick={() => navigate(`/profile/${item._id}`)}
      >
        <img
          src={item.img}
          alt="profile"
          className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover"
        />

        <div>
          <p className="text-xs sm:text-sm">
            <span className="font-semibold">{item.username}</span> sent you a
            connection request
          </p>

          <p className="text-gray-400 text-[11px] sm:text-xs">
            {new Date(item.Date).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 sm:gap-3 flex-wrap">
        {!item.confirmed ? (
          <>
            <button
              onClick={() => handleConfirm(item.username)}
              className="px-3 sm:px-4 py-1.5 bg-[#879F00] text-white rounded-md text-xs sm:text-sm cursor-pointer hover:opacity-90"
            >
              Confirm
            </button>

            <button
              onClick={() => handleDelete(item._id)}
              className="px-3 sm:px-4 py-1.5 bg-white text-black rounded-md text-xs sm:text-sm cursor-pointer hover:bg-gray-200"
            >
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={() => handleDelete(item._id)}
            className="px-3 sm:px-4 py-1 bg-white text-black rounded-md text-xs sm:text-sm cursor-pointer"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex justify-center overflow-x-hidden">
      {/* Container */}
      <div className="w-full max-w-md sm:max-w-xl lg:max-w-2xl px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 pb-24 md:pb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
            Notifications
          </h1>
          
          {/* Only show "Mark as Read" button if there are notifications */}
          {notifications.length > 0 && (
            <button
              onClick={markAsViewed}
              className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              Mark as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-xs sm:text-sm">
              {hasViewedToday() 
                ? "You've already viewed today's notifications. Check back tomorrow!" 
                : "No notifications"}
            </p>
          </div>
        ) : (
          <>
            {notifications.map((item) => (
              <NotificationItem key={item._id} item={item} />
            ))}
            
            {/* Auto-mark as viewed when user has seen all notifications */}
            {notifications.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  These notifications will only be shown once today
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="chaotic-orbit"></div>
        </div>
      )}
    </div>
  );
}

export default Notification;