"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444", "#3b82f6", "#a855f7"];

export default function CategoryStats() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'all' | '7d' | '30d'>('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/tests/stats", {
          headers: { Authorization: `Bearer ${token}` },
          params: { range },
        });
        setData(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке статистики:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token, range]);

  if (loading) return <p>Загрузка диаграммы...</p>;
  if (!data) return <p>Нет данных.</p>;

  return (
    <div className="bg-zinc-900 p-6 rounded-lg mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📊 Статистика по категориям</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setRange('all')}
            className={`px-3 py-1 text-sm rounded ${range === 'all' ? 'bg-blue-600' : 'bg-zinc-800'}`}
          >
            Все
          </button>
          <button
            onClick={() => setRange('7d')}
            className={`px-3 py-1 text-sm rounded ${range === '7d' ? 'bg-blue-600' : 'bg-zinc-800'}`}
          >
            7 дней
          </button>
          <button
            onClick={() => setRange('30d')}
            className={`px-3 py-1 text-sm rounded ${range === '30d' ? 'bg-blue-600' : 'bg-zinc-800'}`}
          >
            30 дней
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(data).map(([testType, categories]: any, idx) => (
          <div key={idx}>
            <h3 className="font-bold mb-2">
              {testType === "PHILLIPS" ? "🧠 Филлипс" : "🛡 Олвеус"}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={Object.entries(categories).map(
                    ([name, value]: any) => ({ name, value })
                  )}
                  outerRadius={100}
                  label
                >
                  {Object.entries(categories).map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}