import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoo from "../assets/images/logoo.jpg";
import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.jpg";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleprovider } from "../confiq/firebase";
import Googlelogin from "./auth/Googlelogin";

const Signup = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const [otp, setOtp] = useState(null);
  const otpRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  /* ================= TIMER ================= */
  useEffect(() => {
    if (!showOtpModal || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtpModal, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:3001/user/send-otp", { email });

      setTimeLeft(60); // ⏱ reset timer
      resetOtpInputs(); // 🔢 clear inputs
      otpRefs.current[0]?.focus();
    } catch (error) {
      console.error(error);
    }
  };

  const resetOtpInputs = () => {
    setOtp("");
    otpRefs.current.forEach((input) => {
      if (input) input.value = "";
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Username validation
    if (!username) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      newErrors.username =
        "Username must be 3-20 characters and contain only letters, numbers, or _";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
    ) {
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number & special char";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= OTP HANDLERS ================= */

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    const otpArray = (otp || "").padEnd(5, "").split("");
    otpArray[index] = value;

    const joinedOtp = otpArray.join("");
    setOtp(joinedOtp);

    if (value && index < 4) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const sendotp = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:3001/user/send-otp", {
        email,
      });
      setShowOtpModal(true);
      setTimeLeft(60);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyotp = async () => {
    if (!otp || otp.length !== 5) {
      alert("Enter valid OTP");
      return;
    }

    if (timeLeft === 0) {
      alert("OTP expired. Please resend.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/user/verify-otp", {
        email,
        otp,
        password,
        name,
        username,
      });

      if (res.data.status == true) {
        const response = await axios.post("http://localhost:3001/user/signup", {
          email,
          password,
          username,
          name,
        });

        if (response.data.success == true) {
          navigate("/");
        }
      }

      alert(res.data.message);
      setShowOtpModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const deleteotp = () => {
    axios.post("http://localhost:3001/user/delete-otp", { email }).then(() => {
      setShowOtpModal(false);
    });
  };

  return (
    <div className="relative min-h-screen  flex  bg-white play-regular overflow-hidden">
      <div className="hidden lg:flex w-1/2 h-screen relative">
        <img className="h-full w-full object-cover" src={login} alt="" />
      </div>

      {/* ================= SIGNUP CARD ================= */}
      <div className="w-1/2 flex justify-center">
        <div className="w-full px-6 text-black flex flex-col items-center min-h-[83vh] sm:min-h-[610px] overflow-hidden">
          <div>
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src={logo}
                alt="DistriX"
                className="w-[130px] h-[110px] object-contain"
              />
            </div>

            <p className="text-center text-xs text-black mb-4">
              Sign up to see videos and photos from your friends
            </p>

            {/* Inputs */}
            {/* Inputs */}
            <div className="space-y-3 w-[360px] mx-auto">
              <div>
                <label className="block text-[11px] text-black mb-1">
                  Email or Phone
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setemail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  className="w-full h-10 rounded-md bg-gray-200 px-3 text-xs text-black"
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-black mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setpassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className="w-full h-10 rounded-md bg-gray-200 px-3 text-xs text-black"
                />
                {errors.password && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="w-full h-10 rounded-md bg-gray-200 px-3 text-xs text-black outline-none placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-black mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setusername(e.target.value);
                    setErrors({ ...errors, username: "" });
                  }}
                  className="w-full h-10 rounded-md bg-gray-200 px-3 text-xs text-black"
                />
                {errors.username && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="border-t border-gray-700 my-4 w-[360px]" />

            <button
              type="button"
              onClick={sendotp}
              className="w-[360px] h-9 bg-black rounded-md text-xs font-semibold text-white hover:bg-gray-900 transition"
            >
              Sign up
            </button>

            {/* <button onClick={handleGoogleLogin} className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-black">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-4"
              />
              Log in with Google
            </button> */}
            <div className="w-[360px] mt-3 mb-6 flex justify-center">
              <Googlelogin />
            </div>
          </div>
          <div className="border w-[360px]  border-gray-700 rounded-md py-3 text-center text-xs text-black flex justify-center mx-auto">
            Have an account?
            <Link to="/">
              <span className="text-[#879F00]  ml-1 cursor-pointer">
                Log in
              </span>
            </Link>
          </div>
        </div>

        {/* Login Link */}
      </div>

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-[420px] bg-black rounded-xl p-8 text-white shadow-xl">
            <h2 className="text-center text-2xl font-semibold mb-6">
              OTP Verification
            </h2>

            <div className="flex justify-center gap-4 mb-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  className="h-12 w-12 rounded-md border border-gray-500 bg-transparent text-center text-lg outline-none focus:border-[#879F00] "
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>

            <div className="flex justify-between text-sm mb-6">
              <span>
                Remaining time :
                <span className="text-[#879F00]  ml-1">
                  {minutes}:{seconds}s
                </span>
              </span>

              <span onClick={resendOtp} className="text-white cursor-pointer">
                Didn’t get the code?{" "}
                <span
                  onClick={timeLeft === 0 ? resendOtp : null}
                  className={`cursor-pointer ${
                    timeLeft === 0
                      ? "text-[#879F00]  hover:underline"
                      : "text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Resend
                </span>
              </span>
            </div>

            {/* <button className="w-full rounded-full bg-lime-600 py-3 text-lg font-medium text-white cursor-pointer">
                Verify
                <span className="text-lime-500 cursor-pointer">
                  Didn’t get the code ? Resend
                </span>
              </button> */}

            {/* Buttons */}
            <button
              onClick={verifyotp}
              className="w-full rounded-full bg-[#879F00]  py-3 text-lg font-medium text-white"
            >
              verify
            </button>

            <button
              onClick={() => {
                deleteotp();
                setShowOtpModal(false);
              }}
              className="mt-4 w-full rounded-full border border-gray-600 py-3 text-[#879F00]  cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
