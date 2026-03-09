
import ChatRoom from "./ChatRoom";
import DashboardHome from "./DashboardHome";

import UserLogs from "./UserLogs";
import UserManagement from "./UserManagement";

export default function MainContent({ active }) {
  return (
    <main className="flex-1 p-8 h-[100vh] overflow-scroll play-regular  text-white">
      {active === "/dashboard" && <DashboardHome />}
      {active === "/users" && <UserManagement/>}
      {active === "/chatroom" && <ChatRoom/>}
   
      {active === "/userlogs" && <UserLogs/>}
    </main>
  );
}
  