import React from "react";

function More({ setActive }) {
  return (
    <div className="bg-black play-regular text-white w-[220px] rounded-xl shadow-lg p-4 space-y-3">
      
      {/* ✅ Settings Button */}
      <button
        onClick={() => setActive("SETTINGS")}
        className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition"
      >
        Settings
      </button>

      <button
        onClick={() => setActive("SAVED")}
        className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition"
      >
        Saved Posts
      </button>

      <button
        onClick={() => setActive("LOGOUT")}
        className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition text-red-400"
      >
        Log out
      </button>
    </div>
  );
}

export default More;
