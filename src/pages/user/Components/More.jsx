import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";

function More() {
      const navigate = useNavigate();
  return (
  <>
  <div className="relative h-screen w-full">
    <Home/>
        <div className="absolute inset-0 flex items-center justify-center w-[50%]">
          <div className="bg-black text-white w-[220px] h-[140px] rounded-xl shadow-lg p-4 space-y-3">
            <button
             onClick={() => navigate("/profile", { state: { tab: "saved" } })}

              className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition"
            >
               Saved Posts
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition text-red-400">
               Log out
            </button>
          </div>
        </div>
      </div>
  </>
  )
}

export default More