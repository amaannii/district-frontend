import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.jpg";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Googlelogin from "./auth/Googlelogin";

const Signup = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const [otp, setOtp] = useState("");
  const otpRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
      setTimeLeft(60);
      setOtp("");
      otpRefs.current.forEach((input) => {
        if (input) input.value = "";
      });
      otpRefs.current[0]?.focus();
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email";

    if (!username) newErrors.username = "Username is required";
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
      newErrors.username =
        "3-20 characters, letters, numbers or underscore";

    if (!password) newErrors.password = "Password is required";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)
    )
      newErrors.password =
        "8+ chars with uppercase, lowercase, number & special char";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendotp = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:3001/user/send-otp", { email });
      setShowOtpModal(true);
      setTimeLeft(60);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyotp = async () => {
    if (!otp || otp.length !== 5) return alert("Enter valid OTP");
    if (timeLeft === 0) return alert("OTP expired");

    try {
      const res = await axios.post(
        "http://localhost:3001/user/verify-otp",
        { email, otp, password, name, username }
      );

      if (res.data.status === true) {
        const response = await axios.post(
          "http://localhost:3001/user/signup",
          { email, password, username, name }
        );

        if (response.data.success === true) navigate("/");
      }

      alert(res.data.message);
      setShowOtpModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const otpArray = otp.padEnd(5, "").split("");
    otpArray[index] = value;
    const joinedOtp = otpArray.join("");
    setOtp(joinedOtp);

    if (value && index < 4) otpRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0)
      otpRefs.current[index - 1].focus();
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 h-screen">
        <img
          className="h-full w-full object-cover"
          src={login}
          alt="signup"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex justify-center items-center py-10 px-4">

        <div className="w-full max-w-md text-black flex flex-col items-center">

          {/* Logo */}
          <img
            src={logo}
            alt="DistriX"
            className="w-24 sm:w-32 mb-6 object-contain"
          />

          <p className="text-center text-xs mb-8">
            Sign up to see videos and photos from your friends
          </p>

          {/* INPUTS */}
          <div className="space-y-5 w-full">

            {/* EMAIL */}
            <div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:border-black outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* NAME */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black outline-none"
            />

            {/* USERNAME */}
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setusername(e.target.value);
                  setErrors({ ...errors, username: "" });
                }}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-black outline-none"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username}
                </p>
              )}
            </div>

          </div>

          {/* BUTTONS */}
          <div className="w-full mt-6 space-y-4">
            <button
              onClick={sendotp}
              className="w-full h-12 bg-black text-white rounded-lg hover:bg-gray-900 transition"
            >
              Sign up
            </button>

            <Googlelogin />

            <p className="text-center text-sm">
              Have an account?{" "}
              <Link to="/" className="text-[#879F00] font-semibold">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-black rounded-2xl p-6 sm:p-8 text-white shadow-xl">

            <h2 className="text-center text-xl font-semibold mb-6">
              OTP Verification
            </h2>

            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className="h-12 w-10 sm:w-12 rounded-md border border-gray-500 bg-transparent text-center text-lg outline-none focus:border-[#879F00]"
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>

            <p className="text-center text-sm mb-6">
              Remaining time:{" "}
              <span className="text-[#879F00]">
                {minutes}:{seconds}s
              </span>
            </p>

            <button
              onClick={verifyotp}
              className="w-full rounded-full bg-[#879F00] py-3 text-white"
            >
              Verify
            </button>

            <button
              onClick={() => setShowOtpModal(false)}
              className="mt-4 w-full rounded-full border border-gray-600 py-3 text-[#879F00]"
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