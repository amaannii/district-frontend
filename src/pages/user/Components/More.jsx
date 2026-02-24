import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function More({ setActive }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <>
      <div className="bg-black play-regular text-white w-[220px] rounded-xl shadow-lg p-4 space-y-3">
        
        {/* Settings */}
        <button
          onClick={() => setActive("SETTINGS")}
          className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition"
        >
          Settings
        </button>

        {/* Saved Posts */}
        <button
          onClick={() => {
            setActive("PROFILE");
            localStorage.setItem("openSaved", "true");
          }}
          className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition"
        >
          Saved Posts
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full text-left px-3 py-2 rounded hover:bg-[#879F00] transition text-red-400"
        >
          Log out
        </button>
      </div>

      {/* ✅ Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-60 z-50">
          <div className="bg-white text-black rounded-xl p-6 w-[300px] shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to log out?
            </h2>

            <div className="flex justify-end space-x-3">
              {/* Cancel */}
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>

              {/* Confirm Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-[#879F00] text-white hover:bg-[#879F00] transition"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default More;