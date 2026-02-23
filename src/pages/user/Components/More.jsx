import React from "react";
import { useNavigate } from "react-router-dom";


function More({ setActive }) {
  const navigate = useNavigate();

  return (
    <div className="bg-black play-regular text-white w-[220px] rounded-xl shadow-lg p-4 space-y-3">
      
      {/* ✅ Settings Button */}
      <button
        onClick={() => setActive("SETTINGS")}
        className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition"
      >
        Settings
      </button>

      {/* SAVED POSTS */}
<button
  onClick={() => {
    setActive("PROFILE");
    localStorage.setItem("openSaved", "true");
  }}
>
  Saved Posts
</button>

     <button
  onClick={() => {
    localStorage.removeItem("userToken"); // remove token
    navigate("/login"); // go to login page
  }}
  className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition text-red-400"
>
  Log out
</button>

    </div>
  );
}

export default More;
