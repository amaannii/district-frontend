import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.jpg";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Googlelogin from "./auth/Googlelogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateLogin = () => {
    let newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:3001/user/login",
        { email, password }
      );

      if (data.success === true) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("role", data.role);
        navigate("/home");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white">

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex lg:w-1/2">
        <img
          className="h-full w-full object-cover"
          src={login}
          alt="login"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          {/* LOGO */}
          <img
            src={logo}
            alt="DistriX"
            className="w-28 sm:w-36 mx-auto mb-8 object-contain"
          />

          <div className="space-y-6">

            {/* EMAIL */}
            <div className="relative">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className="peer w-full px-4 py-3 rounded-lg text-black border-2 border-gray-300 focus:outline-none focus:border-black transition"
              />
              <label
                className="absolute left-4 top-4 px-2 bg-white text-gray-600
                transition-all pointer-events-none
                peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm
                peer-focus:text-gray-500 peer-focus:font-semibold
                peer-[:not(:placeholder-shown)]:-top-3
                peer-[:not(:placeholder-shown)]:left-3
                peer-[:not(:placeholder-shown)]:text-sm
                peer-[:not(:placeholder-shown)]:font-semibold"
              >
                Email
              </label>
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
                placeholder=" "
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className="peer w-full px-4 py-3 pr-12 rounded-lg text-black border-2 border-gray-300 focus:outline-none focus:border-black transition"
              />
              <label
                className="absolute left-4 top-4 px-2 bg-white text-gray-600
                transition-all pointer-events-none
                peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm
                peer-focus:text-gray-500 peer-focus:font-semibold
                peer-[:not(:placeholder-shown)]:-top-3
                peer-[:not(:placeholder-shown)]:left-3
                peer-[:not(:placeholder-shown)]:text-sm
                peer-[:not(:placeholder-shown)]:font-semibold"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

          </div>

          {/* FORGOT PASSWORD */}
          <Link to="/forgetten">
            <p className="text-sm text-gray-500 mt-3 mb-6 cursor-pointer">
              Forgotten password?
            </p>
          </Link>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-black py-3 text-white text-lg hover:bg-gray-900 disabled:opacity-50 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* GOOGLE LOGIN */}
          <Googlelogin />

          {/* SIGNUP */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-[#879F00] hover:underline">
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