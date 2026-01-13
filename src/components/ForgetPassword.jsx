import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import lock from "../assets/images/Vector.png";
import { useRef, useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setemail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const maskEmail = (email) => {
    if (!email.includes("@")) return email;
    const [name, domain] = email.split("@");
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  const handleSendotp = async () => {
    try {
      await axios.post("http://localhost:3001/user/send-otp", { email });
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== otp.length) {
      alert("Enter complete OTP");
      return;
    }

    try {
      await axios.post("http://localhost:3001/user/verify-otp", {
        email,
        otp: otpValue,
      });
      setShowSuccess(false);
      setShowChangePassword(true);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:3001/user/reset-password", {
        email,
        password: newPassword,
      });
      navigate("/");
      setShowChangePassword(false);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white play-regular">
      {/* Header */}
      <header className="flex flex-col flex-row items-center justify-between px-4 sm:px-10  gap-4">
        <img className="w-[140px] sm:w-[170px]" src={logo} alt="logo" />

        <div className="flex items-center gap-6">
          <Link to="/">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm sm:text-base">
              Login
            </button>
          </Link>
          <Link to="/signup" className="text-[#879F00] font-medium text-sm sm:text-base">
            Sign up
          </Link>
        </div>
      </header>

      {/* Card */}
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] px-4">
        <div className="w-full max-w-[420px] bg-black text-white rounded-xl overflow-hidden">
          <div className="px-6 sm:px-8 py-8 sm:py-10 text-center">
            <img className="mx-auto h-[90px] mb-5" src={lock} alt="lock" />

            <p className="text-sm text-gray-300 mb-5">
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </p>

            <input
              type="text"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full h-[44px] px-4 rounded-lg bg-white text-black mb-4 outline-none"
            />

            <button
              onClick={handleSendotp}
              disabled={!email}
              className={`w-full h-[44px] bg-[#879F00] rounded-lg mb-6 ${
                email ? "opacity-100" : "opacity-50"
              }`}
            >
              Send OTP
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            <p className="text-sm mb-6">Create new account</p>
          </div>

          <Link to="/">
            <div className="bg-gray-300 text-black text-center py-3 cursor-pointer">
              Back to login
            </div>
          </Link>
        </div>
      </div>

      {/* OTP Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
          <div className="bg-black text-white w-full max-w-[420px] rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">
              OTP Verification
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              We’ve sent OTP to <span className="text-white">{maskEmail(email)}</span>
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
              <span className="text-[#879F00] cursor-pointer ml-1">Resend</span>
            </p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
          <div className="bg-black text-white w-full max-w-[420px] rounded-xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">
              Change Password
            </h2>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-[44px] px-4 mb-4 bg-white rounded-lg text-black"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[44px] bg-white px-4 mb-6 rounded-lg text-black"
            />

            <button
              onClick={handleChangePassword}
              className="w-full bg-[#879F00] py-3 rounded-lg mb-3"
            >
              Update Password
            </button>

            <button
              onClick={() => setShowChangePassword(false)}
              className="w-full text-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
