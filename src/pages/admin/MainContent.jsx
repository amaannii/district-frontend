import Chatroom from "./Chatroom";
import DashboardHome from "./DashboardHome";
import Reports from "./Reports";
import UserLogs from "./UserLogs";
import UserManagement from "./UserManagement";

export default function MainContent({ active }) {
  return (
    <main className="flex-1 p-8 h-[100vh] overflow-scroll  text-white">
      {active === "/dashboard" && <DashboardHome />}
      {active === "/users" && <UserManagement/>}
      {active === "/chatroom" && <Chatroom/>}
      {active === "/reports" && <Reports/>}
      {active === "/userlogs" && <UserLogs/>}
    </main>
  );
}
  