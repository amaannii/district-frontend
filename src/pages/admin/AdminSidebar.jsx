import { Users, LayoutDashboard, LogOut,  AreaChart, FileText, User } from "lucide-react";


export default function AdminSidebar({ active, setActive, onLogout }) {
  const menuItems = [
    { id: "/dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "/users", name: "User Management", icon: <Users size={20} /> },
    { id: "/userlogs", name: "UserLogs", icon: <User size={20} /> },
    { id: "/chatroom", name: "Chat Rooms", icon: <AreaChart size={20} /> },
    { id: "/reports", name: "Reports", icon: <FileText size={20} /> },
    
  ];
 
  return (
    <aside className="w-64 h-[100vh] bg-black border-r border-gray-800 text-white flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-semibold tracking-wide">Admin Panel</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
              ${
                active === item.id
                  ? "bg-[#2a2a2a]"
                  : "hover:bg-[#2a2a2a]"
              }`}
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2a2a2a] transition text-sm"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
