'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/lib/withAuth';
import Header from '@/components/Header';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, FileText, Activity, AlertTriangle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TestResult {
  id: string;
  type: string;
  score: number;
  category: string;
  createdAt: string;
  answers: string[] | number[];
  result?: Record<string, number>; // для Олвеуса
}

function getCategoryColor(category: string) {
  if (category.includes('высок')) return 'text-red-500';
  if (category.includes('умерен')) return 'text-yellow-500';
  if (category.includes('норма')) return 'text-green-500';
  return 'text-white';
}

function getCategoryBg(category: string) {
  if (category.includes('высок')) return 'bg-red-900/20 border-red-800';
  if (category.includes('умерен')) return 'bg-yellow-900/20 border-yellow-800';
  if (category.includes('норма')) return 'bg-green-900/20 border-green-800';
  return 'bg-gray-800/20 border-gray-800';
}

function TestDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();

  const [test, setTest] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке теста:', error);
        router.push('/student');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchTest();
  }, [token, id, router]);

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get test type in Russian
  const getTestTypeName = (type: string) => {
    if (type === 'PHILLIPS') return 'Тест тревожности Филлипса';
    if (type === 'OLWEUS') return 'Опросник Олвеуса';
    return type;
  };

  // Get recommendation based on category
  const getRecommendation = (type: string, category: string) => {
    if (type === 'PHILLIPS') {
      if (category.includes('высок')) {
        return 'Рекомендуется обратиться к психологу для более глубокого анализа причин тревожности и разработки индивидуальной программы поддержки.';
      }
      if (category.includes('умерен')) {
        return 'Рекомендуется обратить внимание на факторы, вызывающие тревогу, и практиковать техники релаксации.';
      }
      return 'Показатели в пределах нормы. Рекомендуется поддерживать текущее психоэмоциональное состояние.';
    }
    
    if (type === 'OLWEUS') {
      if (category.includes('высок')) {
        return 'Рекомендуется обратиться к школьному психологу для разработки стратегии противодействия буллингу.';
      }
      if (category.includes('умерен')) {
        return 'Рекомендуется обсудить ситуацию с доверенным взрослым и развивать навыки коммуникации.';
      }
      return 'Показатели в пределах нормы. Рекомендуется поддерживать здоровые социальные отношения.';
    }
    
    return 'Для получения конкретных рекомендаций обратитесь к школьному психологу.';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background with subtle pattern */}
      <div className="fixed inset-0 bg-[url('/bg-pattern.png')] opacity-5 z-0"></div>
      
      <Header />
      
      <main className="relative z-10 max-w-4xl mx-auto p-6 pb-24">
        <Link href="/student" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          <span>Назад к списку тестов</span>
        </Link>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-3 bg-red-600 rounded-full"></div>
              <div className="h-3 w-3 bg-red-600 rounded-full"></div>
              <div className="h-3 w-3 bg-red-600 rounded-full"></div>
            </div>
          </div>
        ) : test ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-800 shadow-lg">
              <div className="flex items-center mb-2">
                <span className={`text-xs px-3 py-1 rounded-full ${getCategoryBg(test.category)} border`}>
                  {test.category}
                </span>
                <span className="ml-auto flex items-center text-sm text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(test.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {getTestTypeName(test.type)}
              </h1>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Итоговый результат</div>
                  <div className="text-5xl font-bold">
                    {test.score.toFixed(1)}
                    <span className="text-gray-500 text-xl ml-1">/10</span>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${getCategoryColor(test.category)}`}>
                  {test.category}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 relative ${activeTab === 'overview' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Обзор
                  {activeTab === 'overview' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" 
                      layoutId="activeTab"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('visualize')}
                  className={`py-3 relative ${activeTab === 'visualize' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Визуализация
                  {activeTab === 'visualize' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" 
                      layoutId="activeTab"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('answers')}
                  className={`py-3 relative ${activeTab === 'answers' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Ответы
                  {activeTab === 'answers' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" 
                      layoutId="activeTab"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center gap-2 text-xl font-medium mb-4">
                    <AlertTriangle className="text-red-500" size={20} />
                    <h2>Интерпретация результата</h2>
                  </div>
                  <p className="text-gray-300 mb-4">
                    {test.type === 'PHILLIPS' ? (
                      <>
                        Тест тревожности Филлипса направлен на изучение уровня и характера тревожности, 
                        связанной со школой. Ваш результат ({test.score.toFixed(1)}) указывает на 
                        <span className={getCategoryColor(test.category)}> {test.category.toLowerCase()}</span> уровень школьной тревожности.
                      </>
                    ) : (
                      <>
                        Опросник Олвеуса используется для выявления ситуаций буллинга в школьной среде.
                        Ваш результат ({test.score.toFixed(1)}) указывает на
                        <span className={getCategoryColor(test.category)}> {test.category.toLowerCase()}</span> уровень вовлеченности.
                      </>
                    )}
                  </p>
                  <div className="mt-4 p-4 bg-gray-800/50 rounded border border-gray-700">
                    <h3 className="text-lg font-medium mb-2">Рекомендации</h3>
                    <p className="text-gray-400">
                      {getRecommendation(test.type, test.category)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Visualization Tab Content */}
            {activeTab === 'visualize' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {test.type === 'PHILLIPS' && (
                  <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-xl font-semibold mb-6">Уровень тревожности</h2>
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              dataKey="value"
                              data={[
                                { name: 'Тревожность', value: test.score },
                                { name: 'Норма', value: 100 - test.score },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              innerRadius={60}
                              paddingAngle={2}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell fill="#e50914" />
                              <Cell fill="#0f171e" stroke="#1e293b" />
                            </Pie>
                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="flex justify-center mt-6 gap-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-600 mr-2"></div>
                        <span>Тревожность</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-800 border border-gray-600 mr-2"></div>
                        <span>Норма</span>
                      </div>
                    </div>
                  </div>
                )}

                {test.type === 'OLWEUS' && test.result && (
                  <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-xl font-semibold mb-6">Шкалы теста Олвеуса</h2>
                    {Object.entries(test.result).map(([key, value], index) => {
                      const percentage = (value / 4) * 100;
                      let barColor = "bg-green-600";
                      if (percentage > 50 && percentage < 75) barColor = "bg-yellow-500";
                      if (percentage >= 75) barColor = "bg-red-600";
                      
                      return (
                        <motion.div 
                          key={key} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-6"
                        >
                          <div className="flex justify-between mb-1">
                            <p className="text-sm">{key}</p>
                            <p className="text-sm font-medium">{value.toFixed(2)} / 4</p>
                          </div>
                          <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                              className={`h-full ${barColor}`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Answers Tab Content */}
            {activeTab === 'answers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={18} />
                    <h2 className="text-xl font-semibold">Ваши ответы</h2>
                  </div>
                  <div className="space-y-2">
                    {test.answers.map((answer, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-black/30 border border-gray-800 rounded-md flex gap-3"
                      >
                        <span className="text-gray-500 font-mono">{index + 1}.</span>
                        <span className="text-gray-300">{answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Call to action */}
            <div className="mt-8 text-center">
              <Button
                onClick={() => router.push('/student/assignments/select')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Пройти новый тест
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-lg border border-gray-800">
            <Activity size={48} className="mx-auto text-gray-500 mb-4" />
            <h2 className="text-xl font-medium mb-2">Тест не найден</h2>
            <p className="text-gray-400 mb-6">Запрашиваемый тест не существует или был удален</p>
            <Button onClick={() => router.push('/student')} variant="outline">
              Вернуться к списку тестов
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuth(TestDetailsPage);