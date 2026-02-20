import axios from "axios";
import { useRef } from "react";
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
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const otpRefs = useRef([]);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showSuccess, timer]);

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
        setUserimage(res.data.user.img);
        console.log(userdetails.img);
      } catch (error) {
        console.log("Error fetching user details ❌", error);
      }
    };

    fetchUser();
  }, []);

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 5) {
      setMessage("Enter complete OTP");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");

      await axios.post(
        "http://localhost:3001/user/verify-otp",
        {
          email: userdetails.email,
          otp: otpValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShowSuccess(false);
      setIsOtpVerified(true);
      handleChangePassword(); // 🔥 CALL PASSWORD UPDATE HERE
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        "http://localhost:3001/user/changePassword",
        {
          currentPassword,
          newPassword,
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setShowSuccessPopup(true);
        setIsOtpVerified(false);
        setOpenPasswordModal(false);

        setIsOtpSent(false); // 🔥 RESET HERE

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOtp(["", "", "", "", ""]);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const sendOtpToEmail = async () => {
    if (isOtpSent) return; // 🔥 HARD STOP (prevents multiple clicks)

    try {
      setIsOtpSent(true); // 🔥 Disable immediately (before API call)
      setMessage("");

      if (!userdetails?.email) {
        setMessage("User email not found");
        setIsOtpSent(false);
        return;
      }

      await axios.post("http://localhost:3001/user/send-otp", {
        email: userdetails.email,
      });

      setOtp(["", "", "", "", ""]);
      setShowSuccess(true);
    } catch (error) {
      setIsOtpSent(false); // 🔥 Re-enable only if error
      setMessage(error.response?.data?.message || "Failed to send OTP");
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

            <div className="flex flex-col gap-5">
              {/* ================= Current Password ================= */}
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 text-white focus:outline-none pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrent ? (
                    // Eye Off
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 9 4 9 8a8.96 8.96 0 01-1.56 3.88M6.12 6.12A8.96 8.96 0 003 12c0 4 4 8 9 8 1.2 0 2.34-.24 3.36-.68"
                      />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* ================= New Password ================= */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 text-white focus:outline-none pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNew ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 9 4 9 8a8.96 8.96 0 01-1.56 3.88M6.12 6.12A8.96 8.96 0 003 12c0 4 4 8 9 8 1.2 0 2.34-.24 3.36-.68"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* ================= Confirm Password ================= */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 text-white focus:outline-none pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirm ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 4.24A10.94 10.94 0 0112 4c5 0 9 4 9 8a8.96 8.96 0 01-1.56 3.88M6.12 6.12A8.96 8.96 0 003 12c0 4 4 8 9 8 1.2 0 2.34-.24 3.36-.68"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Message */}
              {message && (
                <p className="text-sm text-center text-red-400">{message}</p>
              )}

              {/* Save Button */}
              <button
                onClick={() => {
                  if (isOtpSent) return; // 🔥 Extra safety

                  setMessage("");

                  if (!currentPassword) {
                    setMessage("Enter current password");
                    return;
                  }

                  if (newPassword !== confirmPassword) {
                    setMessage("Passwords do not match");
                    return;
                  }

                  sendOtpToEmail();
                }}
                disabled={isOtpSent}
                className={`w-full text-black font-semibold py-3 rounded-xl transition ${
                  isOtpSent
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-[#879F00] hover:opacity-90"
                }`}
              >
                {isOtpSent ? "OTP Sent" : "Change Password"}
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
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#879F00] text-white text-3xl">
              ✓
            </div>

            {/* Message */}
            <h2 className="text-xl font-bold text-white text-center">
              Password Changed Successfully!
            </h2>

            <p className="text-gray-400 text-sm text-center flex items-center justify-center gap-2">
              Your password has been updated securely
              <span className="text-[#879F00] text-lg font-bold">✓</span>
            </p>

            {/* OK Button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="mt-4 w-full bg-[#879F00] text-black font-semibold py-2 rounded-xl hover:bg-[#a6c400] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* ================= CONFIRMATION MODAL ================= */}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
          <div className="bg-black text-white w-full max-w-[420px] rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">
              OTP Verification
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              We’ve sent OTP to{" "}
              <span className="text-white">{userdetails.email}</span>
            </p>

            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d?$/.test(val)) return;
                    const newOtp = [...otp];
                    newOtp[index] = val;
                    setOtp(newOtp);
                    if (val && index < otp.length - 1) {
                      otpRefs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg rounded-lg bg-white text-black"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#879F00] py-3 rounded-lg mb-4"
            >
              Verify OTP
            </button>

            <p className="text-sm text-gray-400">
              Didn’t receive OTP?
              <span
                onClick={() => {
                  if (canResend) sendOtpToEmail();
                }}
                className={`ml-1 ${
                  canResend
                    ? "text-[#879F00] cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                {canResend ? "Resend" : `Resend in ${timer}s`}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Security;
