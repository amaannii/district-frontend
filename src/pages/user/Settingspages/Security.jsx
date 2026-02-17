import axios from "axios";
import { useEffect, useState } from "react";

function Security() {
  const [openModal, setOpenModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [userdetails, setUserdetails] = useState({});
  const [userimage, setUserimage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [message, setMessage] = useState("");

  


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.post(
          "http://localhost:3001/user/userdetails",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUserdetails(res.data.user);
        setUserimage(res.data.user.img)
        console.log(userdetails.img);
        
      } catch (error) {
        console.log("Error fetching user details ❌", error);
      }
    };

    fetchUser();
  }, []);

  const handleChangePassword = async () => {
  setMessage("");

  // ✅ Confirm password check
  if (newPassword !== confirmPassword) {
    setMessage("❌ New password and confirm password do not match");
    return;
  }

  try {
    const token = localStorage.getItem("userToken");

    const res = await axios.post(
      "http://localhost:3001/user/changePassword",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setMessage("✅ Password updated successfully");

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close modal after 1 sec
      setTimeout(() => {
        setOpenPasswordModal(false);
      }, 1000);
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "❌ Something went wrong");
  }
};


  return (
    <div className="play-regular text-white">
      {/* Page Title */}
      <h1 className="text-xl font-bold mb-10">Password and security</h1>

      {/* Section */}
      <div>
        <h2 className="text-lg font-semibold mb-1">Login</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage your passwords and login preferences
        </p>

        {/* Change Password Option */}
        <div
          onClick={() => setOpenModal(true)}
          className="w-[520px] border border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between  transition cursor-pointer"
        >
          <span className="text-gray-300 text-sm">Change password</span>

          {/* Arrow */}
          <span className="text-gray-400 text-xl">{">"}</span>
        </div>
      </div>

      {/* ================= MODAL 1 (Choose Account) ================= */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-black border border-gray-700 rounded-2xl w-[650px] p-10 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-5 text-gray-400 text-xl hover:text-white"
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-bold mb-3">Change password</h2>

            <p className="text-gray-500 mb-10">
              Choose an account to make changes.
            </p>

            {/* Account Option */}
            <div
              onClick={() => {
                setOpenModal(false); // close first modal
                setOpenPasswordModal(true); // open second modal
              }}
              className="flex items-center justify-between bg-white rounded-xl px-5 py-2 cursor-pointer hover:bg-gray-200 transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-4">
                <img
                  src={userimage}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover"
                />

                <p className="text-black font-semibold">
                  {userdetails.username}
                </p>
              </div>

              {/* Arrow */}
              <span className="text-black text-2xl">{">"}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2 (Password Form) ================= */}
 {openPasswordModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div className="bg-black border border-gray-700 rounded-2xl w-[650px] p-10 relative">

      {/* Close Button */}
      <button
        onClick={() => setOpenPasswordModal(false)}
        className="absolute top-4 right-5 text-gray-400 text-xl hover:text-white"
      >
        ✕
      </button>

      {/* Modal Title */}
      <h2 className="text-2xl font-bold mb-6">Update Password</h2>

      {/* Password Inputs */}
      <div className="flex flex-col gap-5">

        {/* Current Password */}
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="w-full px-4 py-3 rounded-xl border border-gray-700 text-white focus:outline-none"
        />

        {/* New Password */}
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-3 rounded-xl border border-gray-700 text-white focus:outline-none"
        />

        {/* Confirm Password */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-4 py-3 rounded-xl border border-gray-700 text-white focus:outline-none"
        />

        {/* Message */}
        {message && (
          <p className="text-sm text-center text-red-400">{message}</p>
        )}

        {/* Save Button */}
        <button
          onClick={handleChangePassword}
          className="w-full bg-[#879F00] text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
        >
          Save Password
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Security;
