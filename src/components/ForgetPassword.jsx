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
      const res = await axios.post("http://localhost:3001/user/send-otp", {
        email,
      });
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
        email: email,
        otp: otpValue,
      });

      setShowSuccess(false);
      setShowChangePassword(true);

      // 👉 Redirect to reset password page
      // navigate(`/reset-password?email=${value}`);
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

    navigate("/")

    setShowChangePassword(false);
  } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
  }
};


  return (
    <div className="min-h-screen bg-white play-regular ">
      {/* Header */}
      <header className="flex items-center  justify-between px-10 h-[70px]">
        <div className="flex items-center gap-2 font-bold text-lg">
          <img className="w-[170px] h-[79px]" src={logo} alt="" />
        </div>

        <div className="flex items-center gap-10 ">
          <Link to="/">
            <button className="bg-black play-regular  text-white px-5 py-2 rounded-lg w-[120px] h-[30px] items-center flex justify-center">
              login
            </button>
          </Link>
          <Link to="/signup">
            <a href="#" className="text-[#879F00] font-medium">
              Sign up
            </a>
          </Link>
        </div>
      </header>

      {/* Card */}
      <div className="flex justify-center items-center h-[600px]">
        <div className="w-[420px] bg-black text-white rounded-xl overflow-hidden">
          <div className="px-8 py-10 text-center">
            <div className="h-[110px] w-full mb-5 justify-center flex items-center">
              <img className="h-[100px] w-[80px] mb-5" src={lock} alt="" />
            </div>
            {/*lock icon*/}

            <p className="text-sm text-gray-300 mb-5 play-regular ">
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </p>

            <input
              type="text"
              placeholder="Email, Phone, or Username"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full play-regular text-sm px-4 py-3 rounded-lg text-black mb-4 outline-none bg-white h-[44px]"
            />

            <button
              onClick={handleSendotp}
              className={`w-full bg-[#879F00] transition py-3 rounded-lg mb-6 play-regular h-[44px]
    ${email ? "opacity-100" : "opacity-50"}
  `}
              disabled={!email}
            >
              Send otp
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            <div href="#" className="block text-sm mb-8">
              Create new account
            </div>
          </div>

          {/* Bottom */}
          <Link to ="/">
          <div className="bg-gray-300 text-black text-center py-3 cursor-pointer">
            Back to login
          </div>
          </Link>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-black text-white w-[420px] rounded-xl p-8 text-center shadow-xl">
            <h2 className="text-2xl font-semibold mb-3">OTP Verification</h2>

            <p className="text-gray-400 text-sm mb-6">
              We’ve sent a 6-digit OTP to
              <span className="text-white font-medium">
                {" "}
                {maskEmail(email)}
              </span>
            </p>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 mb-6">
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
                  className="w-12 h-12 text-center text-lg rounded-lg bg-amber-50 text-black outline-none"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#879F00] py-3 rounded-lg font-medium mb-4"
            >
              Verify OTP
            </button>

            {/* Resend */}
            <p className="text-sm text-gray-400">
              Didn’t receive the OTP?
              <span className="text-[#879F00] cursor-pointer ml-1">Resend</span>
            </p>
          </div>
        </div>
      )}

      {showChangePassword && (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    <div className="bg-black text-white w-[420px] rounded-xl p-8 shadow-xl">

      <h2 className="text-2xl font-semibold text-center mb-4">
        Change Password
      </h2>

      <p className="text-sm text-gray-400 text-center mb-6">
        Enter a new password for your account
      </p>

      {/* New Password */}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-4 py-3 mb-4 rounded-lg bg-white text-black outline-none"
      />

      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-3 mb-6 rounded-lg bg-white text-black outline-none"
      />

      {/* Buttons */}
      <button
        onClick={handleChangePassword}
        className="w-full bg-[#879F00] py-3 rounded-lg font-medium mb-3"
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
