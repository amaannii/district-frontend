import React, { useState } from "react";
import logoo from "../assets/images/logoo.jpg";
import home from "../assets/images/icons8-home-24.png";
import search from "../assets/images/download search.png";
import explore from "../assets/images/icons8-explore-48.png";
import message from "../assets/images/icons8-send-24.png";
import notification from "../assets/images/icons8-notification-64.png";
import create from "../assets/images/icons8-create-24.png";
import more from "../assets/images/icons8-more-30.png";
import profile from "../assets/images/icons8-profile-50.png";

function Sidebar({ active, setActive }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <aside
        className={`hidden md:flex h-screen bg-black text-white border-r border-gray-800 flex-col py-4 transition-all duration-300
        ${collapsed ? "w-[80px]" : "w-[250px]"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 mb-10">
          {!collapsed && (
            <img src={logoo} alt="logo" className="w-[120px]" />
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            ☰
          </button>
        </div>

        <div className="flex flex-col gap-2 px-3">
          <SidebarItem icon={home} text="HOME" {...{ collapsed, active, setActive }} />
          <SidebarItem icon={search} text="SEARCH" {...{ collapsed, active, setActive }} />
          <SidebarItem icon={explore} text="EXPLORE" {...{ collapsed, active, setActive }} />
          <SidebarItem icon={message} text="MESSAGES" {...{ collapsed, active, setActive }} />
          <SidebarItem icon={notification} text="NOTIFICATION" {...{ collapsed, active, setActive }} />
          <SidebarItem icon={create} text="CREATE" {...{ collapsed, active, setActive }} />
          <SidebarItem icon={profile} text="PROFILE" {...{ collapsed, active, setActive }} />
        </div>

        <div className="mt-auto px-3 pt-4">
          <SidebarItem icon={more} text="MORE" {...{ collapsed, active, setActive }} />
        </div>
      </aside>

      {/* ===== Mobile Top Bar ===== */}
    {/* ===== Mobile Top Bar ===== */}
{active === "HOME" && (
  <div className="md:hidden fixed top-0 left-0 right-0 bg-black border-b border-gray-800 flex justify-between items-center px-4 py-3 z-50">

    {/* District Logo */}
    <img src={logoo} alt="district logo" className="w-[110px]" />

    {/* Message Icon Top Right */}
    <button onClick={() => setActive("MESSAGES")}>
      <img src={message} alt="message" className="w-6 h-6" />
    </button>

  </div>
)}

   

      {/* ===== Mobile Bottom Navbar ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center py-2 z-50">

        <MobileItem icon={home} text="HOME" {...{ active, setActive }} />
        <MobileItem icon={search} text="SEARCH" {...{ active, setActive }} />
        <MobileItem icon={explore} text="EXPLORE" {...{ active, setActive }} />
        <MobileItem icon={create} text="CREATE" {...{ active, setActive }} />
        <MobileItem icon={notification} text="NOTIFICATION" {...{ active, setActive }} />
        <MobileItem icon={profile} text="PROFILE" {...{ active, setActive }} />

      </div>
    </>
  );
}

export default Sidebar;

/* ===== Sidebar Item ===== */
function SidebarItem({ icon, text, collapsed, active, setActive }) {
  const isActive = active === text;

  return (
    <button
      onClick={() => setActive(text)}
      className={`relative flex items-center px-4 py-3 rounded-lg transition
      ${collapsed ? "justify-center" : "gap-4"}
      ${
        isActive
          ? "bg-white/10 text-white"
          : "hover:bg-white/5 text-gray-300 hover:text-white"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-2 bottom-2 w-[4px] bg-[#879F00] rounded-full"></span>
      )}

      <img src={icon} alt={text} className="w-6 h-6" />
      {!collapsed && <span className="text-sm">{text}</span>}
    </button>
  );
}

/* ===== Mobile Item ===== */
function MobileItem({ icon, text, active, setActive }) {
  const isActive = active === text;

  return (
    <button
      onClick={() => setActive(text)}
      className="flex flex-col items-center justify-center"
    >
      <img
        src={icon}
        alt={text}
        className={`w-6 h-6 transition ${
          isActive ? "opacity-100 scale-110" : "opacity-70"
        }`}
      />
    </button>
  );
}