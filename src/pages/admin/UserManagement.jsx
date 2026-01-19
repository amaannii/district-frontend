import { useEffect, useState } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/admin/users"
      );
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };

const toggleBlockUser = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");

    await axios.patch(
      `http://localhost:3001/admin/users/${id}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchUsers();
  } catch (error) {
    console.error("Failed to block/unblock user");
  }
};


  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>

      <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-4 text-sm text-gray-400 border-b border-gray-800">
          <span>User</span>
          <span>Email</span>
          <span>Status</span>
          <span className="text-center">Action</span>
          <span></span>
        </div>

        {users.map((user) => (
          <div
            key={user._id}
            className="grid grid-cols-5 items-center px-6 py-4 border-b border-gray-800 hover:bg-[#1f1f1f]"
          >
            {/* USER NAME */}
            <div className="flex items-center gap-3">
              {/* <img
                src={user.avatar || "https://i.pravatar.cc/150"}
                className="w-10 h-10 rounded-full"
              /> */}
              <span className="font-medium">
                {user.name || "No Name"}
              </span>
            </div>

            <span className="text-gray-400">{user.email}</span>

            <span
              className={`text-xs px-3 py-1 rounded-full w-fit ${
                user.isBlocked
                  ? "bg-red-500/20 text-red-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {user.isBlocked ? "Blocked" : "Active"}
            </span>

            <div className="text-center">
              <button
                onClick={() => toggleBlockUser(user._id)}
                className={`px-4 py-2 text-sm rounded-lg ${
                  user.isBlocked
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
