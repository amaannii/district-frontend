import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoo from "../assets/images/logoo.jpg";
import axios from "axios";

const Signup = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
const [otp, setOtp] = useState(null);
  const otpRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(60);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!showOtpModal || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtpModal, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");


  /* ================= OTP HANDLERS ================= */
  const handleOtpChange = (e, index) => {
    if (!/^\d?$/.test(e.target.value)) return;
=======
const handleOtpChange = (e, index) => {
  const value = e.target.value;


  if (!/^\d?$/.test(value)) return;

  // create array of digits
  const otpArray = String(otp ?? "")
    .padEnd(5, "")
    .split("");

  otpArray[index] = value;

  const joinedOtp = otpArray.join("");

  // convert to number ONLY if full length
  if (joinedOtp.length === 5 && !joinedOtp.includes("")) {
    setOtp(Number(joinedOtp));
  } else {
    setOtp(joinedOtp ? Number(joinedOtp) : null);
  }

  if (value && index < otpRefs.current.length - 1) {
    otpRefs.current[index + 1].focus();
  }
};

const handleOtpKeyDown = (e, index) => {
  if (e.key === "Backspace" && !e.target.value && index > 0) {
    otpRefs.current[index - 1].focus();
  }
};

  const sendotp = async () => {
    console.log("ahsgcahs");
    try {
      const res = await axios.post(
        "http://localhost:3001/user/send-otp",
        { email } // ✅ MUST be object
      );
      console.log(res.data);
      setShowOtpModal(true); // ✅ open OTP modal after success
    } catch (error) {
      console.error(error);
    }
  };


  /* ================= SEND OTP ================= */
  const sendotp = async () => {
    if (!email || !password || !name || !username) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post("http://localhost:3001/user/send-otp", { email });
      setTimeLeft(60);
      setShowOtpModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }
  };



const verifyotp = async () => {
  console.log(otpRefs);
  
  try {
    const res = await axios.post(
      "http://localhost:3001/user/verify-otp",
      {
        email,
        otp, // ✅ send OTP
      }
    );

    console.log(res.data.message);
    setShowOtpModal(false); // close OTP modal
  } catch (error) {
    console.error(error.response?.data?.message);
  }
};






  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-white play-regular">
      {/* ================= SIGNUP CARD ================= */}
      <div className="w-[440px] z-10">
        <div className="bg-black rounded-md px-16 py-6 text-white h-[85vh] max-h-[640px] flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex justify-center">
              <img
                src={logoo}
                alt="DistriX"
                className="w-[130px] h-[110px] object-contain"
              />
            </div>

            <p className="text-center text-xs text-gray-300 mb-4">
              Sign up to see videos and photos from your friends
            </p>

            {/* Inputs */}
            <div className="space-y-3 w-full">
              <input
                type="text"
                placeholder="Number or email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="w-full h-10 rounded-md bg-white px-3 text-xs text-black outline-none placeholder-gray-400"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="w-full h-10 rounded-md bg-white px-3 text-xs text-black outline-none placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-full h-10 rounded-md bg-white px-3 text-xs text-black outline-none placeholder-gray-400"
              />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                className="w-full h-10 rounded-md bg-white px-3 text-xs text-black outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="border-t border-gray-700 my-4" />

            <button
              type="button"
              onClick={sendotp}
              className="w-full h-9 bg-lime-600 rounded-md text-xs font-semibold text-black hover:bg-lime-400 transition"
            >
              Sign up
            </button>

            <button className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-gray-300">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-4"
              />
              Log in with Google
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-3 bg-black rounded-md py-2 text-center text-xs text-gray-300 h-[60px] flex items-center justify-center">
          Have an account?
          <Link to="/">
            <span className="text-lime-500 ml-1 cursor-pointer">Log in</span>
          </Link>
        </div>
      </div>

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
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
                  className="h-12 w-12 rounded-md border border-gray-500 bg-transparent text-center text-lg outline-none focus:border-lime-500"
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                />
              ))}
            </div>

            <div className="flex justify-between text-sm mb-6">
              <span>
                Remaining time :
                <span className="text-lime-500 ml-1">
                  {minutes}:{seconds}s
                </span>
              </span>

              <span
                onClick={sendotp}
                className="text-lime-500 cursor-pointer"
              >
                Resend
              </span>
            </div>

            <button className="w-full rounded-full bg-lime-600 py-3 text-lg font-medium text-white cursor-pointer">
              Verify

              <span className="text-lime-500 cursor-pointer">
                Didn’t get the code ? Resend
              </span>
            </div>

            {/* Buttons */}
            <button
              onClick={verifyotp}
              className="w-full rounded-full bg-lime-600 py-3 text-lg font-medium text-white"
            >
              verify

            </button>

            <button
              onClick={() => setShowOtpModal(false)}
              className="mt-4 w-full rounded-full border border-gray-600 py-3 text-lime-500 cursor-pointer"
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
