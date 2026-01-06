import React from "react";
import logo from "../assets/images/logo.jpg"



const Login = () => {
  return (
    <div className="flex h-screen w-full">
      
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gray-300 items-center justify-center">
        {/* <img
          src={art}
          alt="Artwork"
          className="w-4/5 max-w-lg"
        /> */}
      </div>

      {/* Right Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-[360px]">
          
          {/* Logo */}
          <img
            src={logo}
            alt="DistriX"
            className="w-28 mx-auto mb-8"
          />

          {/* Username */}
          <input
            type="text"
            placeholder="username, email"
            className="w-full mb-4 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="password"
            className="w-full mb-2 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
          />

          {/* Forgot Password */}
          <div className="text-right text-sm text-gray-500 mb-6 cursor-pointer">
            forgotten password?
          </div>

          {/* Login Button */}
          <button className="w-full rounded-lg bg-black py-3 text-white text-lg hover:opacity-90 transition">
            login
          </button>

          {/* Google Login */}
          <button className="w-full mt-4 flex items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5"
            />
            <span>Log in with google</span>
          </button>

          {/* Sign up */}
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
