import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardChart({ users, messages, admins }) {
  const data = {
    labels: ["Users", "Messages", "Admins"],
    datasets: [
      {
        data: [users.length, messages.length, admins.length],
        backgroundColor: [
          "#3b82f6", // blue
          "#22c55e", // green
          "#a855f7", // purple
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e5e7eb",
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#020617",
        titleColor: "#e5e7eb",
        bodyColor: "#e5e7eb",
      },
    },
  };

  const total = users.length + messages.length + admins.length;

  return (
    <div className="bg-black border border-gray-800 rounded-2xl p-6 mb-8 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-6">
        Dashboard Overview
      </h3>

      <div className="w-72">
        <Doughnut data={data} options={options} />
      </div>

      <p className="text-gray-400 mt-4 text-sm">
        Total Records:{" "}
        <span className="text-white font-semibold">
          {total}
        </span>
      </p>
    </div>
  );
}
