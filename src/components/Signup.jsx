import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoo from "../assets/images/logoo.jpg";

const Signup = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const otpRefs = useRef([]);

  const handleOtpChange = (e, index) => {
    if (!/^\d?$/.test(e.target.value)) return;

    if (e.target.value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpRefs.current[index - 1].focus();
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
            <div className="space-y-2">
              <Input label="email" placeholder="email" />
              <Input label="password" type="password" placeholder="Enter password" />
              <Input label="full name" placeholder="Enter full name" />
              <Input label="username" placeholder="Enter username" />
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="border-t border-gray-700 my-3" />

            <button
              onClick={() => setShowOtpModal(true)}
              className="w-full h-9 bg-lime-600 rounded-md text-xs font-semibold text-black hover:bg-lime-300 transition"
            >
              Sign up
            </button>

            <button className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-gray-300">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-4"
              />
              Log in with google
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
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="w-[420px] bg-black rounded-xl p-8 text-white shadow-xl">
            
            <h2 className="text-center text-2xl font-semibold mb-6">
              otp verification
            </h2>

            {/* OTP Inputs */}
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

            {/* Timer */}
            <div className="flex justify-between text-sm mb-6">
              <span>
                Remaining time :
                <span className="text-lime-500 ml-1">00:55s</span>
              </span>
              <span className="text-lime-500 cursor-pointer">
                Didn’t get the code ? Resend
              </span>
            </div>

            {/* Buttons */}
            <button className="w-full rounded-full bg-lime-600 py-3 text-lg font-medium text-white">
              verify
            </button>

            <button
              onClick={() => setShowOtpModal(false)}
              className="mt-4 w-full rounded-full border border-gray-600 py-3 text-lime-500"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= REUSABLE INPUT ================= */
const Input = ({ label, type = "text", placeholder }) => (
  <div>
    <label className="text-[11px] text-gray-400">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full mt-1 h-9 rounded-md bg-white px-3 text-xs text-black outline-none"
    />
  </div>
);

export default Signup;
