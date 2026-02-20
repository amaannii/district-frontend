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
const [showSuccessPopup, setShowSuccessPopup] = useState(false);
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [otp, setOtp] = useState("");
const [showOtpModal, setShowOtpModal] = useState(false);



  


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
  setShowSuccessPopup(true);

  // Clear fields
  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  // Close popup + modal after 2 sec
  setTimeout(() => {
    setShowSuccessPopup(false);
    setOpenPasswordModal(false);
  }, 2000);
}

  } catch (error) {
    setMessage(error.response?.data?.message || "❌ Something went wrong");
  }
};

const sendOtpToEmail = async () => {
  try {
    const token = localStorage.getItem("userToken");

    await axios.post(
      "http://localhost:3001/user/sendPasswordOtp",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setShowOtpModal(true); // Open OTP input modal
  } catch (error) {
    setMessage("Failed to send OTP");
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
            onClick={() => {
    setMessage("");

    // Confirm password check first
    if (newPassword !== confirmPassword) {
      setMessage("❌ New password and confirm password do not match");
      return;
    }

    // Open confirmation modal instead of direct API call
    setShowConfirmModal(true);
  }}
          className="w-full bg-[#879F00] text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
        >
          Save Password
        </button>
      </div>
    </div>
  </div>
)}
{/* ================= SUCCESS POPUP ================= */}
{showSuccessPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[100]">
    <div className="bg-black border border-gray-700 rounded-2xl w-[400px] p-8 flex flex-col items-center gap-4 shadow-xl">

      {/* Tick Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600 text-white text-3xl">
        ✓
      </div>

      {/* Message */}
      <h2 className="text-xl font-bold text-white">
        Password Changed Successfully!
      </h2>

      <p className="text-gray-400 text-sm text-center">
        Your password has been updated securely ✅
      </p>
    </div>
  </div>
)}
{/* ================= CONFIRMATION MODAL ================= */}
{showConfirmModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[90]">
    <div className="bg-black border border-gray-700 rounded-2xl w-[500px] p-8">

      <h2 className="text-xl font-bold mb-3 text-white">
        Confirm Password Change
      </h2>

      <p className="text-gray-400 mb-6 text-sm">
        Are you sure you want to change the password for this account?
      </p>

      <div className="bg-gray-900 p-3 rounded-xl mb-6">
        <p className="text-white font-semibold">
          {userdetails.email}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {/* Cancel */}
        <button
          onClick={() => setShowConfirmModal(false)}
          className="w-full py-3 rounded-xl border border-gray-600 text-white hover:bg-gray-800 transition"
        >
          Cancel
        </button>

        {/* Confirm */}
        <button
          onClick={() => {
            setShowConfirmModal(false);
           sendOtpToEmail();

          }}
          className="w-full py-3 rounded-xl bg-[#879F00] text-black font-semibold hover:bg-lime-400 transition"
        >
          Yes, Change
        </button>
      </div>
    </div>
  </div>
)}

{showOtpModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[100]">
    <div className="bg-black border border-gray-700 rounded-2xl w-[450px] p-8">

      <h2 className="text-xl font-bold mb-4 text-white">
        Enter Verification Code
      </h2>

      <p className="text-gray-400 mb-5 text-sm">
        We sent a 6-digit code to your email:
        <span className="text-white font-semibold"> {userdetails.email}</span>
      </p>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full px-4 py-3 rounded-xl border border-gray-700 text-white bg-transparent mb-5"
      />

      <button
        onClick={() => handleChangePassword()}
        className="w-full py-3 rounded-xl bg-[#879F00] text-black font-semibold"
      >
        Verify & Change Password
      </button>

      <button
        onClick={() => setShowOtpModal(false)}
        className="w-full mt-3 py-3 rounded-xl border border-gray-600 text-white"
      >
        Cancel
      </button>
    </div>
  </div>
)}



    </div>
  );
}

export default Security;
