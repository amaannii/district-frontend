import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [deleted, setdeleted] = useState(0);
  const[confirmed,setconfirmed]=useState(0)
  const [loading, setloading] = useState(false);

  useEffect(() => {
       const stored = localStorage.getItem("recentNotifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);
   useEffect(() => {
    fetchNotifications();
  }, [deleted, confirmed]);


  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    try {
      setloading(true)
      const token = localStorage.getItem("userToken");

      const res = await axios.get("http://localhost:3001/user/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setNotifications(res.data.request);
          localStorage.setItem(
          "recentNotifications",
          JSON.stringify(res.data.request)
        );
      }
    } catch (err) {
      console.error("Fetch notifications failed:", err);
    }finally {
      setloading(false);
    }
  };

  // 🔹 Confirm request
  const handleConfirm = async (username) => {
    const token = localStorage.getItem("userToken");

    try {



      setloading(true)

      const response = await axios.post(
        `http://localhost:3001/user/confirmnotification`,
        { username },
        {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

if(response.data.success===true){
  setconfirmed(confirmed+1)
}


    } catch (err) {


      console.error(err);    
    }finally {
      setloading(false);

      console.error(err);
  }

  };


  
  // 🔹 Delete notification
  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.post(
        `http://localhost:3001/user/notificationdelete`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success == true) {
        setdeleted(deleted + 1);
        alert("deleted");
      }else{
        alert("deleted failed")
      }

       setNotifications((prev) => {
        const updated = prev.filter((item) => item._id !== id);
        localStorage.setItem(
          "recentNotifications",
          JSON.stringify(updated)
        );
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
      className="flex items-center gap-4 cursor-pointer"
      onClick={() => navigate(`/profile/${item._id}`)}
    >
      <img
        src={item.img}
        alt="profile"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
      />

      <div>
        <p className="text-sm">
          <span className="font-semibold">{item.username}</span>{" "}
          sent you a connection request
        </p>

        <p className="text-gray-400 text-xs">
          {new Date(item.Date).toLocaleString()}
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2 sm:gap-3">
      {!item.confirmed ? (
        <>
          <button
            onClick={() => handleConfirm(item.username)}
            className="px-3 sm:px-4 py-1 bg-[#879F00] text-white rounded-md text-xs sm:text-sm"
          >
            Confirm
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            className="px-3 sm:px-4 py-1 bg-white text-black rounded-md text-xs sm:text-sm"
          >
            Delete
          </button>
        </>
      ) : (
        <button
          onClick={() => handleDelete(item._id)}
          className="px-3 sm:px-4 py-1 bg-white text-black rounded-md text-xs sm:text-sm"
        >
          Delete
        </button>
      )}
    </div>
  </div>
);

return (
  <div className="min-h-screen bg-black text-white flex justify-center">

    {/* Container */}
    <div className="
        w-full 
        max-w-2xl 
        px-4 sm:px-6 md:px-8 
        pt-10 md:pt-10 
        pb-24 md:pb-10
      ">

      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No notifications
        </p>
      ) : (
        notifications.map((item) => (
          <NotificationItem key={item._id} item={item} />
        ))
      )}
    </div>

    {/* Loading Overlay */}
    {loading && (
      <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
        <div className="chaotic-orbit"></div>
      </div>
    )}
  </div>
);
}

export default Notification;
