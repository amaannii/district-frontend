import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Ban, CheckCircle, X } from "lucide-react";

function Reports() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3001/admin/reports");
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const blockUser = async (id) => {
    await axios.patch(
      `http://localhost:3001/admin/reports/${id}/block`
    );
    setSelectedReport(null);
    fetchReports();
  };

  const dismissReport = async (id) => {
    await axios.patch(
      `http://localhost:3001/admin/reports/${id}/dismiss`
    );
    setSelectedReport(null);
    fetchReports();
  };

  if (loading) {
    return <p className="text-gray-400">Loading reports...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Reported Users</h2>

      <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4">Reported User</th>
              <th className="px-6 py-4">Reported By</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={report._id}
                className="border-t border-gray-800 hover:bg-gray-900"
              >
                <td className="px-6 py-4 font-medium">
                  {report.reportedUser.name}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {report.reportedBy.name}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {report.reason}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(report.createdAt).toDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => blockUser(report._id)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                    >
                      <Ban size={18} />
                    </button>

                    <button
                      onClick={() => dismissReport(report._id)}
                      className="p-2 bg-green-500/10 text-green-400 rounded-lg"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4">Report Details</h3>

            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Reported User:</span> {selectedReport.reportedUser.name}</p>
              <p><span className="text-gray-400">Email:</span> {selectedReport.reportedUser.email}</p>
              <p><span className="text-gray-400">Reported By:</span> {selectedReport.reportedBy.name}</p>
              <p><span className="text-gray-400">Reason:</span> {selectedReport.reason}</p>
              <p className="text-gray-300">{selectedReport.description}</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => dismissReport(selectedReport._id)}
                className="px-4 py-2 bg-green-600 rounded-lg"
              >
                Dismiss
              </button>
              <button
                onClick={() => blockUser(selectedReport._id)}
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                Block User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
