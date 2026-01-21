import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainContent from "./MainContent";
import AdminSidebar from "./AdminSidebar";

export default function Admindashboard() {
  const [active, setActive] = useState("/dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex">
      {/* Left Sidebar */}
      <AdminSidebar
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
      />

      {/* Right Content */}
      
      <MainContent active={active} />
    </div>
  );
}
