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
  <div className="bg-black play-regular border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col items-center w-full">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">
        Dashboard Overview
      </h3>

      <div className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] h-[220px] sm:h-[260px] md:h-[300px]">
        <Doughnut data={data} options={options} />
      </div>

      <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm text-center">
        Total Records:{" "}
        <span className="text-white font-semibold">
          {total}
        </span>
      </p>
    </div>
  );
}
