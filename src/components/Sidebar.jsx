import React from "react";
import logoo from "../assets/images/logoo.jpg";
import home from "../assets/images/icons8-home-24.png";
import search from "../assets/images/download search.png";
import explore from "../assets/images/icons8-explore-24.png";
import message from "../assets/images/icons8-send-24.png";
import notification from "../assets/images/icons8-notification-64.png";
import create from "../assets/images/icons8-create-24.png";

function Sidebar() {
  return (
    <div className="h-screen bg-black text-white flex">
      <div className="w-[260px] border-r border-gray-800 px-6 py-4 flex flex-col">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logoo}
            alt="DistriX"
            className="w-[130px] h-[110px] object-contain"
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-4 text-sm">
          <SidebarItem icon={home} text="HOME" />
          <SidebarItem icon={search} text="SEARCH" />
          <SidebarItem icon={explore}  text="EXPLORE" />
          <SidebarItem icon={message}  text="MESSAGES" />
          <SidebarItem icon={notification} text="NOTIFICATION" />
          <SidebarItem icon={create} text="CREATE" />
          <SidebarItem text="PROFILE" />
        </div>

        {/* Bottom */}
        <div className="mt-auto">
          <SidebarItem text="MORE" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

/* ========== Inline Sidebar Item ========== */
function SidebarItem({ icon, text }) {
  return (
    <button className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-900 transition">
      {icon && <img src={icon} alt={text} className="w-6 h-6" />}
      <span className="text-lg">{text}</span>
    </button>
  );
}
