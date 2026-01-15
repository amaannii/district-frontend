import React, { useState } from "react";
import logoo from "../assets/images/logoo.jpg"; // Your white logo image
import home from "../assets/images/icons8-home-24.png";
import search from "../assets/images/download search.png";
import explore from "../assets/images/icons8-explore-48.png";
import message from "../assets/images/icons8-send-24.png";
import notification from "../assets/images/icons8-notification-64.png";
import create from "../assets/images/icons8-create-24.png";
import more from "../assets/images/icons8-more-30.png";
import profile from "../assets/images/icons8-profile-50.png";
import topIcon from "../assets/images/icons8-stretch-uniform-to-fill-48.png"; // Black icon PNG

function Sidebar() {
  const [active, setActive] = useState("HOME");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-black text-white border-r border-gray-800 flex flex-col py-4 transition-all duration-300
        ${collapsed ? "w-[80px]" : "w-[260px]"}
      `}
    >
      {/* Logo + Toggle Row */}
      <div
        className={`flex items-center mb-10 px-4
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        {!collapsed && (
          <img
            src={logoo}
            alt="DistriX"
            className="w-[130px] object-contain"
          />
        )}

        {/* Toggle Button (Always Visible) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          {/* IMPORTANT: Use 'invert' here to make black icon white */}
          <img
            src={topIcon}
            alt="toggle"
            className="w-6 h-6  object-contain"
          />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-2 px-3">
        <SidebarItem icon={home} text="HOME" {...{ collapsed, active, setActive }} />
        <SidebarItem icon={search} text="SEARCH" {...{ collapsed, active, setActive }} />
        <SidebarItem icon={explore} text="EXPLORE" {...{ collapsed, active, setActive }} />
        <SidebarItem icon={message} text="MESSAGES" {...{ collapsed, active, setActive }} />
        <SidebarItem icon={notification} text="NOTIFICATION" {...{ collapsed, active, setActive }} />
        <SidebarItem icon={create} text="CREATE" {...{ collapsed, active, setActive }} />
        <SidebarItem icon={profile} text="PROFILE" {...{ collapsed, active, setActive }} />
      </div>

      {/* Bottom Item */}
      <div className="mt-auto px-3 pt-4">
        <SidebarItem icon={more} text="MORE" {...{ collapsed, active, setActive }} />
      </div>
    </aside>
  );
}

export default Sidebar;

/* ===== Sidebar Item Component ===== */
function SidebarItem({ icon, text, collapsed, active, setActive }) {
  const isActive = active === text;

  return (
    <button
      onClick={() => setActive(text)}
      className={`flex items-center px-4 py-3 rounded-lg transition
        ${collapsed ? "justify-center" : "gap-4"}
        ${isActive ? "bg-white/10" : "hover:bg-white/5"}
      `}
    >
      {icon && (
        <img
          src={icon}
          alt={text}
          className="w-6 h-6 object-contain"
        />
      )}

      {!collapsed && <span className="text-sm tracking-wide">{text}</span>}
    </button>
  );
}
