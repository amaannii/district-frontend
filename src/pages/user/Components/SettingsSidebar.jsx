import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SettingsSidebar({ activeSetting, setActiveSetting }) {

  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Edit Profile", key: "EditProfile" },
    { name: "Notifications", key: "Notifications" },
    { name: "Password & Security", key: "Security" },
    { name: "Your Information and Permission", key: "Informations" },
    { name: "Comments", key: "Comments" },
    { name: "Logout", key: "Logout" },
  ];

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <aside className="h-screen bg-black text-white border-r border-gray-800 flex flex-col py-6 md:py-9 w-full md:w-[260px]">

        {/* Title */}
        <div className="mb-6 md:mb-10 px-6">
          <h2 className="text-lg md:text-xl font-semibold tracking-wide">
            Settings
          </h2>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 px-2">
          {menuItems.map((item) => {

            const isActive = activeSetting === item.key;

            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key === "Logout") {
                    setShowLogoutModal(true);
                  } else {
                    setActiveSetting(item.key);
                  }
                }}
                  className={`
                  relative flex items-center py-3 rounded-lg text-sm transition
                  ${isActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"}
                  
                  ${item.key === "Logout" ? "md:hidden" : ""}
                `}
              >

                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-[4px] bg-[#879F00] rounded-full"></span>
                )}

                <span className="ml-3">{item.name}</span>
              </button>
            );
          })}
        </div>

      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111] text-white rounded-xl p-6 w-80 shadow-lg">

            <h2 className="text-lg font-semibold mb-3">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-[#879F00] text-white hover:bg-[#879F00] transition cursor-pointer text-sm"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsSidebar;