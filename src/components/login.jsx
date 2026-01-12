import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.jpg";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validateLogin = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validateLogin()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/user/login",
        {
          email,
          password,
        }
      );

      if (response.data.success === true) {
        console.log("Login success");
      } else {
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden play-regular">
      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-1/2 h-full bg-gray-300">
        <img
          className="h-full w-full object-cover"
          src={login}
          alt="login"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full lg:w-1/2 h-full items-center justify-center bg-white px-4">
        <div className="w-full max-w-[360px]">
          {/* LOGO */}
          <img
            src={logo}
            alt="DistriX"
            className="w-36 mx-auto mb-8 h-[120px] object-contain"
          />

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
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
              <p className="text-red-500 text-[10px] mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
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

          {/* FORGOT */}
          <Link to="/forgetten">
            <p className="text-sm text-gray-500 mb-6 cursor-pointer">
              Forgotten password?
            </p>
          </Link>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white text-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
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

          {/* SIGNUP */}
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
