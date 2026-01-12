import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});

  /* ================= VALIDATION ================= */
  const validateLogin = () => {
    let newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!validateLogin()) return;

    // 🔗 API call here
    console.log("Login success");
  };

  return (
    <div className="flex min-h-screen w-full play-regular">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-[990px] bg-gray-300 items-center justify-center">
        <img className="h-full w-full object-cover" src={login} alt="login" />
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-[360px]">
          <img
            src={logo}
            alt="DistriX"
            className="w-40 mx-auto mb-8 h-[130px]"
          />

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-14 outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <Link to="/forgetten">
            <div className="text-sm text-gray-500 mb-6 cursor-pointer">
              Forgotten password?
            </div>
          </Link>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleSubmit}
            className="w-full rounded-lg bg-black py-3 text-white text-lg hover:opacity-90 transition"
          >
            Login
          </button>

          {/* GOOGLE */}
          <button className="w-full mt-4 flex items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5"
            />
            <span>Log in with Google</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-green-500 cursor-pointer hover:underline">
                Sign up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
