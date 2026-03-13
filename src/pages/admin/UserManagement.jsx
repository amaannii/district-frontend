import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../API/Api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      await API.patch(
        `/admin/users/${id}/block`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchUsers();
    } catch (error) {
      console.error("Failed to block/unblock user");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        User Management
      </h2>

    <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden w-full">

        {/* HEADER - Desktop Only */}
        <div className="hidden md:grid grid-cols-4 px-6 py-4 text-sm text-gray-400 border-b border-gray-800">
          <span>User</span>
          <span>Email</span>
          <span className="flex justify-end">Status</span>
          <span className="text-center">Action</span>
        </div>

        {users.map((user) => (
          <div
            key={user._id}
            className="border-b border-gray-800 hover:bg-[#1f1f1f]"
          >

            {/* MOBILE VIEW */}
            <div className="flex flex-col gap-2 p-4 md:hidden">
              <span className="font-medium text-white">
                {user.name || "No Name"}
              </span>

              <span className="text-gray-400 text-sm">{user.email}</span>

              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    user.isBlocked
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>

                <button
                  onClick={() => toggleBlockUser(user._id)}
                  className={`px-4 py-2 text-xs rounded-lg ${
                    user.isBlocked ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden md:grid grid-cols-4 items-center px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="font-medium">{user.name || "No Name"}</span>
              </div>

              <span className="text-gray-400">{user.email}</span>

              <span className="flex justify-end">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    user.isBlocked
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </span>

              <div className="text-center">
                <button
                  onClick={() => toggleBlockUser(user._id)}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    user.isBlocked ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
            </div>

          </div>
        ))}

        {loading && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="chaotic-orbit"></div>
          </div>
        )}
      </div>
    </div>
  );
}
