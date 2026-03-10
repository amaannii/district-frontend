import { Users, LayoutDashboard, LogOut, AreaChart, User } from "lucide-react";

export default function AdminSidebar({ active, setActive, onLogout }) {
  const menuItems = [
    { id: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "/users", name: "Users", icon: <Users size={20} /> },
    { id: "/userlogs", name: "UserLogs", icon: <User size={20} /> },
    { id: "/chatroom", name: "Chat Rooms", icon: <AreaChart size={20} /> },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 h-screen bg-black border-r border-gray-800 text-white flex-col">
        
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-semibold tracking-wide">Admin</h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
                ${active === item.id ? "bg-[#2a2a2a]" : "hover:bg-[#2a2a2a]"}`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2a2a2a] text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around py-2 z-50">
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center text-xs p-2 transition
              ${active === item.id ? "text-white" : "text-gray-400"}`}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.name}</span>
          </button>
        ))}

        <button
          onClick={onLogout}
          className="flex flex-col items-center text-gray-400 text-xs p-2"
        >
          <LogOut size={20} />
          <span className="text-[10px] mt-1">Logout</span>
        </button>

      </div>
    </>
  );
}