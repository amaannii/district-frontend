import { useEffect, useState } from "react";
import axios from "axios";
import DashboardChart from "./DashboardChart";
import ChatRoom from "./Chatroom";

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
        axios.get("http://localhost:3001/admin/users"),
        axios.get("http://localhost:3001/admin/messages"),
        axios.get("http://localhost:3001/admin/admins"),
      ]);

      setUsers(usersRes.data.users || []);
      setMessages(messagesRes.data.messages || []);
      setAdmins(adminsRes.data.admins || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2  onClick={()=>setActiveCard("dashboard")} className="text-2xl cursor-pointer font-semibold mb-6">Dashboard Overview</h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={users.length}
          active={activeCard === "users"}
          onClick={() => setActiveCard(activeCard === "users" ? null : "users")}
        />

        <StatCard
          title="Active Messages"
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
      {activeCard === "dashboard" && (  <DashboardChart users={users} messages={messages} admins={admins} />  )}
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
      className={`bg-black border rounded-2xl p-6 cursor-pointer transition
        ${active ? "border-blue-500" : "border-gray-800"}
        hover:bg-gray-900`}
    >
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
    </div>
  );
}

/* =======================
   USERS TABLE
======================= */
function UsersTable({ users }) {
  return (
    <div className="bg-black border border-gray-800 rounded-2xl p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Users</h3>

      <table className="w-full text-sm">
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
  );
}

/* =======================
   MESSAGES TABLE
======================= */
function MessagesTable({ messages }) {
  return (
    <div className="bg-black border border-gray-800 rounded-2xl p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Messages</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-400">
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Message</th>
            <th className="p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id} className="border-b border-gray-800">
              <td className="p-2">{m.username}</td>
              <td className="p-2">{m.text}</td>
              <td className="p-2">{new Date(m.createdAt).toLocaleString()}</td>
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
    <div className="bg-black border border-gray-800 rounded-2xl p-6 mt-6">
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
