"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { withAuth } from "@/lib/withAuth";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  RefreshCw,
  Calendar,
  BarChart3,
  User,
  Clock,
} from "lucide-react";
import CategoryStats from "@/components/CategoryStats";
import { useRouter } from "next/navigation";

interface TestWithUser {
  id: string;
  type: string;
  score: number;
  category: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

function PsychologistPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [tests, setTests] = useState<TestWithUser[]>([]);
  const [type, setType] = useState("ALL");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/tests/all", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          type: type === "ALL" ? undefined : type,
          category: category || undefined,
          sort,
        },
      });
      setTests(res.data);
      setError("");
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
      setError("Не удалось загрузить данные. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token, type, category, sort]);

  if (!token) {
    return <div className="p-12 text-center text-gray-400">Загрузка...</div>;
  }

  const filteredTests = tests.filter(
    (test) =>
      test.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueCategories = [...new Set(tests.map((test) => test.category))];

  const getCategoryColorClass = (category: string) => {
    const categories = {
      высокая: "bg-red-500/80",
      повышенная: "bg-orange-500/80",
      средняя: "bg-yellow-500/80",
      низкая: "bg-green-500/80",
      "очень низкая": "bg-blue-500/80",
    };
    // @ts-ignore
    return categories[category.toLowerCase()] || "bg-purple-500/80";
  };

  return (
    <div className="min-h-screen bg-black text-white">

      <section className="relative py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">Панель психолога</h1>
            <p className="text-gray-300 mt-2">
              Анализ и управление результатами тестирования
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-12 -mt-6">
        <CategoryStats />

        {/* Ошибка */}
        {error && (
          <div className="bg-red-700 text-white p-3 rounded mb-4">{error}</div>
        )}

        {/* Панель фильтров */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Поиск по имени, email или категории..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-800 border-gray-700"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="whitespace-nowrap"
            >
              <Filter size={16} className="mr-2" />
              {isFiltersVisible ? "Скрыть фильтры" : "Показать фильтры"}
            </Button>

            <Button
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw size={16} className="mr-2" />
              Обновить
            </Button>
          </div>

          {isFiltersVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
            >
              <Select value={type} onValueChange={(val) => setType(val)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Тип теста" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все тесты</SelectItem>
                  <SelectItem value="PHILLIPS">Тест Филлипса</SelectItem>
                  <SelectItem value="OLWEUS">Тест Олвеуса</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Категория (например: высокая)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />

              <Select
                value={sort}
                onValueChange={(val) => setSort(val as "asc" | "desc")}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Сначала новые</SelectItem>
                  <SelectItem value="asc">Сначала старые</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </motion.div>

        {/* Легенда категорий */}
        <div className="mb-6 flex flex-wrap gap-2">
          {uniqueCategories.map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColorClass(
                category
              )}`}
            >
              {category}
            </motion.div>
          ))}
        </div>

        {/* Список тестов */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-400 mb-4">
              Найдено результатов: {filteredTests.length}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-gray-700 transition-all"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`text-xs rounded-full px-3 py-1 font-medium ${getCategoryColorClass(
                          test.category
                        )}`}
                      >
                        {test.category}
                      </span>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock size={12} className="mr-1" />
                        {new Date(test.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 flex items-center">
                      {test.type === "PHILLIPS" ? (
                        <span className="bg-red-900/30 p-1.5 rounded-lg mr-2">
                          🧠
                        </span>
                      ) : (
                        <span className="bg-blue-900/30 p-1.5 rounded-lg mr-2">
                          🛡
                        </span>
                      )}
                      {test.type === "PHILLIPS"
                        ? "Тест Филлипса"
                        : "Тест Олвеуса"}
                    </h3>

                    <div className="flex items-center mb-3">
                      <BarChart3 size={18} className="text-blue-400 mr-2" />
                      <div className="bg-gray-800 w-full rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            test.score > 75
                              ? "bg-red-500"
                              : test.score > 50
                              ? "bg-orange-500"
                              : test.score > 25
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(100, test.score)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-bold">
                        {test.score.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-300 mb-1">
                      <User size={14} className="mr-2 text-gray-400" />
                      <span>{test.user.name}</span>
                    </div>

                    <div className="text-xs text-gray-400">
                      {test.user.email}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800"
                        onClick={() =>
                          router.push(`/psychologist/test/${test.id}`)
                        }
                      >
                        Тест
                      </Button>
                      <Button
                        variant="secondary"
                        className="border-gray-700 hover:bg-gray-800"
                        onClick={() =>
                          router.push(
                            `/psychologist/student/${test.user.email}`
                          )
                        }
                      >
                        Студент
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xl text-gray-400">Результаты не найдены</p>
                  <p className="text-gray-500 mt-2">
                    Попробуйте изменить параметры поиска
                  </p>
                </motion.div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default withAuth(PsychologistPage);
