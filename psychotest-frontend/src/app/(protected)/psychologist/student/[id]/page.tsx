"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { withAuth } from "@/lib/withAuth";
import { useAuth } from "@/context/AuthContext";
import { Clock, BarChart3, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TestResult {
  id: string;
  type: string;
  score: number;
  category: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

function StudentDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/tests/all", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: id },
        });
        setTests(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке тестов студента:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchTests();
  }, [token, id]);

  const studentName = tests[0]?.user?.name || 'Студент';
  const studentEmail = tests[0]?.user?.email || id;

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/psychologist"
            className="text-blue-400 hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Назад
          </Link>

          <div className="text-right text-sm text-white/80">
            <div className="font-semibold">{studentName}</div>
            <div className="text-white/60">{studentEmail}</div>
          </div>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : tests.length === 0 ? (
          <p>Нет результатов.</p>
        ) : (
          <div className="space-y-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-zinc-800 p-5 rounded-lg border border-zinc-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium uppercase">
                    {test.type}
                  </span>
                </div>
                <p className="text-white font-semibold">Категория: {test.category}</p>
                <div className="flex items-center gap-2 mt-2">
                  <BarChart3 size={16} />
                  <div className="bg-zinc-700 w-full h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${Math.min(100, test.score)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{test.score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(StudentDetailsPage);
