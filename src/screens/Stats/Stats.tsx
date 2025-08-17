import { useEffect, useState } from "react";

interface StatsData {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url =
      import.meta.env.VITE_STATS_SERVICE_URL || "http://localhost:8000/stats";
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Statistics</h2>
      <p>Total Tasks: {stats.total_tasks}</p>
      <p>Completed Tasks: {stats.completed_tasks}</p>
      <p>Pending Tasks: {stats.pending_tasks}</p>
    </div>
  );
};

export default Stats;
