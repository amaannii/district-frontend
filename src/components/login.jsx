import React, { useState } from "react";

import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [email, setemail] = useState("");
  // const [password, setpassword] = useState("");


//   const handlesubmit=async()=>{
// axios.post("http://localhost:3000/",()=>{

// })
//   }

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:flex w-[990px] bg-gray-300 items-center justify-center h-full ">
        <img className="h-full w-full" src={login} alt="" />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-[360px]">
          <img
            src={logo}
            alt="DistriX"
            className="w-40 mx-auto mb-8 h-[130px]"
          />
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Username or Email
            </label>
            <input
              // onChange={(e) => setemail(e.target.value)}
              type="text"
              placeholder="Enter username or email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                // onChange={(e) => setemail(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
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
          </div>
          <div className=" text-sm text-gray-500 mb-6 cursor-pointer">
            Forgotten password?
          </div>
          <button
            // onClick={handlesubmit}
            className="w-full rounded-lg bg-black py-3 text-white text-lg hover:opacity-90 transition"
          >
            Login
          </button>
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
