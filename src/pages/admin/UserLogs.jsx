import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import axios from "axios";

function UserLogs() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  // Fetch logged persons details
  useEffect(() => {
    const fetchLoginLogs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/admin/login-logs"
        );
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to fetch login logs", error);
      }
    };

    fetchLoginLogs();
  }, []);

  
  return (
    <div className="p-6 h-[100vh] overflow-scroll">
      <h2 className="text-2xl font-semibold mb-6">
        Login Activity Logs
      </h2>

      <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4">SI NO</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr
                key={log._id}
                className="border-t border-gray-800 hover:bg-gray-900"
              >
                <td className="px-6 py-4 text-gray-400">
                  {index + 1}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      log.role === "Admin"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {log.role}
                  </span>
                </td>

                <td className="px-6 py-4 font-medium">
                  {log.userName}
                </td>

                <td className="px-6 py-4 text-gray-300">
                  {log.email}
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(log.time).toLocaleString()}
                </td>

                <td className="px-6 py-4 flex justify-center">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              Login Details
            </h3>

            <div className="space-y-3 text-sm">
              <p><span className="text-gray-400">Role:</span> {selectedLog.role}</p>
              <p><span className="text-gray-400">Name:</span> {selectedLog.userName}</p>
              <p><span className="text-gray-400">Email:</span> {selectedLog.email}</p>
              <p><span className="text-gray-400">Time:</span> {new Date(selectedLog.time).toLocaleString()}</p>
              <p><span className="text-gray-400">IP:</span> {selectedLog.ip}</p>
              <p><span className="text-gray-400">Device:</span> {selectedLog.device}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserLogs;
