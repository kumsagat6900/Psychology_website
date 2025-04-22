// app/(protected)/psychologist/assignments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

interface Assignment {
  id: string;
  type: string;
  createdAt: string;
}

export default function AssignmentsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:3000/tests/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Ошибка:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ru-RU");

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8"
        >
          Задания
        </motion.h1>

        {loading ? (
          <div className="text-gray-400 text-center">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all"
              >
                <div className="flex items-center mb-4 text-blue-400">
                  <FileText className="mr-2" />
                  <span className="font-semibold text-lg">
                    {assignment.type === "PHILLIPS"
                      ? "Тест Филлипса"
                      : assignment.type === "OLWEUS"
                      ? "Тест Олвеуса"
                      : assignment.type}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span>{formatDate(assignment.createdAt)}</span>
                </div>

                <Button
                  onClick={() =>
                    router.push(`/psychologist/test/${assignment.id}`)
                  }
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Подробнее
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
