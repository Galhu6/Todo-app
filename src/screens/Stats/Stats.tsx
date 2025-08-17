import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

interface StatsData {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { tasksRefreshToken } = useAppContext();

  useEffect(() => {
    const url =
      import.meta.env.VITE_STATS_SERVICE_URL || "http://localhost:8000/stats";
    const userId = localStorage.getItem("userId") ?? "";
    setError(null);
    fetch(url, { headers: { "X-User-ID": userId } })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, [tasksRefreshToken]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div>Loading...</div>;
  }

  const data = {
    lables: ["Completed", "Pending"],
    datasets: [
      {
        data: [stats.completed_tasks, stats.pending_tasks],
        backgroundColor: ["#4ade80", "#f87171"],
        borderColor: ["#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#374151",
        },
      },
    },
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-center">Statistics</h2>
      <Pie data={data} options={options} />
      <div className="text-center text-sm text-gray-600 dark:text-gray-300 space-x-2">
        <span>Total Tasks: {stats.total_tasks}</span>
        <span>Completed Tasks: {stats.completed_tasks}</span>
        <span>Pending Tasks: {stats.pending_tasks}</span>
      </div>
    </div>
  );
};

export default Stats;
