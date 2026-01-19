import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";


const Notificationlist = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([  
  {
    "_id": "1",
    "userId": "101",
    "username": "_Lunr",
    "avatar": "https://i.pravatar.cc/150?img=1",
    "message": "requested to connect you.",
    "date": "4d",
    "status": "pending",
    "group": "week"
  },
  {
    "_id": "2",
    "userId": "102",
    "username": "yuv00_",
    "avatar": "https://i.pravatar.cc/150?img=2",
    "message": "Requested to connect you.",
    "date": "10 Nov",
    "status": "pending",
    "group": "month"
  },
  {
    "_id": "3",
    "userId": "103",
    "username": "_Kaw",
    "avatar": "https://i.pravatar.cc/150?img=3",
    "message": "started connected you.",
    "date": "29 Nov",
    "status": "connected",
    "group": "earlier"
  }]);

useEffect(() => {
  fetchNotifications();
}, []);


 const fetchNotifications = async () => {
  try {
    const res = await axios.get("http://localhost:3001/notifications");
    if (Array.isArray(res.data)) {
      setNotifications(res.data);
    } else {
      console.error("Backend response is not an array", res.data);
    }
  } catch (err) {
    console.error("Fetch notifications failed:", err);
  }
};


const handleConfirm = async (id) => {
  try {
    await axios.post(`http://localhost:3001/notifications/confirm/${id}`);
    
    // Update state locally
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: "connected" } : item
      )
    );
  } catch (err) {
    console.error(err);
  }
};

// 🔹 Delete connection request
const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:3001/notifications/delete/${id}`);
    
    // Remove deleted item from state
    setNotifications((prev) => prev.filter((item) => item._id !== id));
  } catch (err) {
    console.error(err);
  }
};

  // 🔹 Group notifications
  const groupByTime = (type) =>
    notifications.filter((item) => item.group === type);

  const NotificationItem = ({ item }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/10">
      {/* Profile */}
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => navigate(`/profile/${item.userId}`)}
      >
        <img
          src={item.avatar}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <p className="text-white text-sm">
            <span className="font-semibold">{item.username}</span>{" "}
            {item.message}
          </p>
          <p className="text-gray-400 text-xs">{item.date}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {item.status === "pending" && (
          <>
            <button
              onClick={() => handleConfirm(item._id)}
              className="px-4 py-1 bg-[#879F00]  text-white rounded-sm text-sm font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="px-4 py-1 bg-white text-black rounded-full text-sm"
            >
              Delete
            </button>
          </>
        )}

        {item.status === "connected" && (
          <span className="px-4 py-1 bg-white text-black rounded-full text-sm">
            Connected
          </span>
        )}
      </div>
    </div>
  );

 return (
  <div className="min-h-screen bg-black flex py-6">
    <Sidebar/>
    <div className="w-full max-w-md px-4">
      <h1 className="text-2xl font-semibold mb-6 text-white">Notification</h1>

      {/* THIS WEEK */}
      {groupByTime("week").length > 0 && (
        <>
          <p className="text-gray-400 text-sm mb-2">This week</p>
          {groupByTime("week").map((item) => (
            <NotificationItem key={item._id} item={item} />
          ))}
        </>
      )}

      {/* THIS MONTH */}
      {groupByTime("month").length > 0 && (
        <>
          <p className="text-gray-400 text-sm mt-6 mb-2">This month</p>
          {groupByTime("month").map((item) => (
            <NotificationItem key={item._id} item={item} />
          ))}
        </>
      )}

      {/* EARLIER */}
      {groupByTime("earlier").length > 0 && (
        <>
          <p className="text-gray-400 text-sm mt-6 mb-2">Earlier</p>
          {groupByTime("earlier").map((item) => (
            <NotificationItem key={item._id} item={item} />
          ))}
        </>
      )}
    </div>
  </div>
);

};

export default Notificationlist;
