import React from "react";
import logoo from "../assets/images/logoo.jpg";

const Signup = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-[380px]">
        
        {/* Main Card */}
        <div className="bg-black rounded-md px-8 py-8 text-white h-[700px] ">
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={logoo}
              alt="DistriX"
              className="w-32 object-contain "
            />
          </div>

          <p className="text-center text-sm text-gray-300 mb-6">
            Sign up to see videos and photos from your friends
          </p>

          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">number or email</label>
              <input
                type="text"
                placeholder="number or email"
                className="w-full mt-1 h-10 rounded-md bg-white px-3 text-sm text-black outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">password</label>
              <input
                type="password"
                placeholder="password"
                className="w-full mt-1 h-10 rounded-md bg-white px-3 text-sm text-black outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">full name</label>
              <input
                type="text"
                placeholder="full name"
                className="w-full mt-1 h-10 rounded-md bg-white px-3 text-sm text-black outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">username</label>
              <input
                type="text"
                placeholder="username"
                className="w-full mt-1 h-10 rounded-md bg-white px-3 text-sm text-black outline-none"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-5" />

          {/* Sign up button */}
          <button className="w-full h-10 bg-lime-600 hover:bg-lime-500 transition rounded-md text-sm font-semibold text-black">
            Sign up
          </button>

          {/* Google login */}
          <button className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-4"
            />
            Log in with google
          </button>
        </div>

        {/* Footer */}
        <div className="mt-4 bg-black rounded-md py-3 text-center text-sm text-gray-300">
          Have an account?{" "}
          <span className="text-lime-500 cursor-pointer hover:underline">
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
