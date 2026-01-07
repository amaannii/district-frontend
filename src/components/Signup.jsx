import React from "react";
import logoo from "../assets/images/logoo.jpg";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white play-regular ">
      <div className="w-[440px]">
        <div className="bg-black rounded-md px-16 py-6 text-white h-[85vh] max-h-[640px] flex flex-col justify-between">
          <div>
            <div className="flex justify-center">
              <img
                src={logoo}
                alt="DistriX"
                className="w-[130px] object-contain h-[110px]"
              />
            </div>
            <p className="text-center text-xs text-gray-300 mb-4">
              Sign up to see videos and photos from your friends
            </p>
            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-gray-400">
                 email
                </label>
                <input
                  type="text"
                  placeholder="email"
                  className="w-full mt-1 h-9 rounded-md bg-white px-3 text-xs text-black outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400">
                  password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full mt-1 h-9 rounded-md bg-white px-3 text-xs text-black outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400">
                  full name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full mt-1 h-9 rounded-md bg-white px-3 text-xs text-black outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400">
                  username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full mt-1 h-9 rounded-md bg-white px-3 text-xs text-black outline-none"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="border-t border-gray-700 my-3 " />

            <button className="w-full h-9 bg-lime-600 rounded-md text-xs font-semibold text-black cursor-pointer hover:bg-lime-300">
              Sign up
            </button>

            <button className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-gray-300 cursor-pointer">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-4"
              />
              Log in with google
            </button>
          </div>
        </div>
        <div className="mt-3 bg-black rounded-md py-2 text-center text-xs text-gray-300 h-[60px] flex items-center justify-center">
          Have an account?   {" "}
          <Link to='/'>
           <span className="text-lime-500 cursor-pointer">
            Log in
          </span>
          </Link>
         
        </div>

      </div>
    </div>
  );
};

export default Signup;
