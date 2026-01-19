import DashboardHome from "./DashboardHome";
import UserManagement from "./UserManagement";

export default function MainContent({ active }) {
  return (
    <main className="flex-1 p-8 overflow-y-auto text-white">
      {active === "/dashboard" && <DashboardHome />}
      {active === "/users" && <UserManagement/>}
      {/* {active === "/messages" && <MessageAlerts/>} */}
    </main>
  );
}
  