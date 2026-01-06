import React, { useState } from "react";
import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:flex w-[800px] bg-gray-300 items-center justify-center h-full opacity-30">
        <img className="h-full w-full" src={login} alt="" />
      </div>
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-[360px]">
          <img
            src={logo}
            alt="DistriX"
            className="w-36 mx-auto mb-8 object-contain"
          />

          <input
            type="text"
            placeholder="username, email"
            className="w-full mb-4 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
          />

          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
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

          <div className="text-right text-sm text-gray-500 mb-6 cursor-pointer">
            forgotten password?
          </div>

          <button className="w-full rounded-lg bg-black py-3 text-white text-lg hover:opacity-90 transition">
            login
          </button>

          <button className="w-full mt-4 flex items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5"
            />
            <span>Log in with google</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span className="text-green-500 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
