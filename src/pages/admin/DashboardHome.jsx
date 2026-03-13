import { useEffect, useState } from "react";
import axios from "axios";
import DashboardChart from "./DashboardChart";
import API from "../../API/Api";

export default function DashboardHome() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeCard, setActiveCard] = useState("dashboard");


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {

      const [usersRes, messagesRes, adminsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/messages"),
        API.get("/admin/admins"),
      ]);

      setUsers(usersRes.data.users || []);
      setMessages(messagesRes.data.messages || []);
      setAdmins(adminsRes.data.admins || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <h2
        onClick={() => setActiveCard("dashboard")}
        className="text-xl sm:text-2xl play-regular cursor-pointer font-semibold mb-4 sm:mb-6"
      >
        Dashboard Overview
      </h2>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 play-regular gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          active={activeCard === "users"}
          onClick={() => setActiveCard(activeCard === "users" ? null : "users")}
        />

        <StatCard
          title="Active Users"
          value={messages.length}
          active={activeCard === "messages"}
          onClick={() =>
            setActiveCard(activeCard === "messages" ? null : "messages")
          }
        />

        <StatCard
          title="Chatroom"
          value={14}
          active={activeCard === "chatroom"}
        />
      </div>

      {/* GRAPH */}

      {/* TABLES */}
      {activeCard === "users" && <UsersTable users={users} />}
      {activeCard === "messages" && <MessagesTable messages={messages} />}
      {activeCard === "dashboard" && (
        <DashboardChart users={users} messages={messages} admins={admins} />
      )}
    </div>
  );
}

/* =======================
   STAT CARD
======================= */
function StatCard({ title, value, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`bg-black border play-regular rounded-2xl p-4 sm:p-6 cursor-pointer transition
      ${active ? "border-blue-500" : "border-gray-800"}
      hover:bg-gray-900`}
    >
      <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">{title}</p>
      <h3 className="text-xl sm:text-2xl font-semibold">{value}</h3>
    </div>
  );
}

/* =======================
   USERS TABLE
======================= */
function UsersTable({ users }) {
  return (
    <div className="bg-black border play-regular border-gray-800 rounded-2xl p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Users</h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-800">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
    </div>
  );
}

/* =======================
   MESSAGES TABLE
======================= */
function MessagesTable({ messages }) {
  return (
    <div className="bg-black border play-regular border-gray-800 rounded-2xl p-4 sm:p-6 mt-4 sm:mt-6">
      <h3 className="text-xl font-semibold mb-4">Active Users</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400">
            <th className="p-2 text-left whitespace-nowrap">User</th>
            <th className="p-2 text-left whitespace-nowrap">Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id} className="border-b border-gray-800">
              <td className="p-2 break-words max-w-[250px]">{m.username}</td>
              <td className="p-2 break-words max-w-[250px]">
                {new Date(m.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
   
    </div>
  );
}

/* =======================
   ADMINS TABLE
======================= */
function AdminsTable({ admins }) {
  return (
    <div className="bg-black border play-regular border-gray-800 rounded-2xl p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Admins</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400">
            <th className="p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a._id} className="border-b border-gray-800">
              <td className="p-2">{a.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
 
    </div>
  );
}
