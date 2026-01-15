import { useState } from "react";
import { Users, Bell, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "users", name: "User Management", icon: <Users size={20} /> },
    { id: "messages", name: "Message Alerts", icon: <Bell size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black border-r border-gray-800 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-semibold tracking-wide">Admin Panel</h1>
        </div>

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

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#2a2a2a] transition text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {active === "dashboard" && <DashboardHome />}
        {active === "users" && <UserManagement />}
        {active === "messages" && <MessageAlerts />}
      </main>
    </div>
  );
}

/* ===================== SECTIONS ===================== */

function DashboardHome() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="1,248" />
        <StatCard title="Active Messages" value="87" />
        <StatCard title="Admins" value="5" />
      </div>
    </>
  );
}

function UserManagement() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>

      <div className="bg-black rounded-2xl border border-gray-800 p-6">
        <p className="text-gray-400">
          User list will be displayed here (connect backend later).
        </p>
      </div>
    </>
  );
}

function MessageAlerts() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Message Alerts</h2>

      <div className="bg-black rounded-2xl border border-gray-800 p-6">
        <p className="text-gray-400">
          Admin messages & notifications will appear here.
        </p>
      </div>
    </>
  );
}

/* ===================== COMPONENTS ===================== */

function StatCard({ title, value }) {
  return (
    <div className="bg-black border border-gray-800 rounded-2xl p-6">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
    </div>
  );
}
