'use client';

import { useEffect, useState } from 'react';
import { withAuth } from '@/lib/withAuth';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Header from '@/components/Header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, BarChart2, AlertTriangle } from 'lucide-react';

interface TestResult {
  id: string;
  type: string;
  score: number;
  category: string;
  createdAt: string;
}

function getCategoryColor(category: string) {
  if (category.includes('высок')) return 'bg-red-600 text-white';
  if (category.includes('умерен')) return 'bg-yellow-500 text-black';
  if (category.includes('норма')) return 'bg-green-600 text-white';
  return 'bg-gray-500 text-white';
}

function getCategoryIcon(category: string) {
  if (category.includes('высок')) return <AlertTriangle size={14} />;
  if (category.includes('умерен')) return <AlertTriangle size={14} />;
  if (category.includes('норма')) return <BarChart2 size={14} />;
  return <BarChart2 size={14} />;
}

function getTestTypeBadge(type: string) {
  if (type === 'PHILLIPS') {
    return (
      <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-sm">
        Филлипс
      </span>
    );
  }
  return (
    <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-sm">
      Олвеус
    </span>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function StudentPage() {
  const { token } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'ALL' | 'PHILLIPS' | 'OLWEUS'>('ALL');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get('http://localhost:3000/tests/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(res.data);
      } catch (err) {
        console.error('Ошибка при загрузке тестов:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTests();
  }, [token]);

  const filteredTests = selectedType === 'ALL' ? tests : tests.filter(t => t.type === selectedType);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background with subtle pattern */}
      <div className="fixed inset-0 bg-[url('/bg-pattern.png')] opacity-5 z-0"></div>
      
      <Header />
      
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Мои тесты</h1>
              <p className="text-gray-400">Просмотр и анализ результатов пройденных тестов</p>
            </div>
            <Link href="/student/assignments/select">
              <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-6">
                <span>Пройти тест</span>
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
          
          <Tabs 
            defaultValue="ALL" 
            value={selectedType} 
            onValueChange={(val) => setSelectedType(val as any)} 
            className="w-full"
          >
            <TabsList className="bg-gray-900 p-1 rounded-md">
              <TabsTrigger 
                value="ALL" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-sm"
              >
                Все тесты
              </TabsTrigger>
              <TabsTrigger 
                value="PHILLIPS" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-sm"
              >
                Тест Филлипса
              </TabsTrigger>
              <TabsTrigger 
                value="OLWEUS" 
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-sm"
              >
                Тест Олвеуса
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        {/* Test results section */}
        <section>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse flex space-x-4">
                <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                <div className="h-3 w-3 bg-red-600 rounded-full"></div>
                <div className="h-3 w-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="mb-4 text-gray-400">
                <BarChart2 size={48} className="mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-medium mb-2">Нет результатов</h3>
              <p className="text-gray-400 mb-6">По выбранному фильтру не найдено тестов</p>
              <Link href="/student/assignments/select">
                <Button variant="outline">Пройти новый тест</Button>
              </Link>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredTests.map((test) => (
                <motion.div key={test.id} variants={itemVariants}>
                  <Link href={`/student/test/${test.id}`}>
                    <div className="group p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-gray-600 shadow-md">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          {getTestTypeBadge(test.type)}
                          <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getCategoryColor(test.category)}`}>
                            {getCategoryIcon(test.category)}
                            {test.category}
                          </span>
                        </div>
                        <span className="flex items-center text-xs text-gray-400 gap-1">
                          <Calendar size={12} />
                          {formatDate(test.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-medium mb-3 group-hover:text-red-400 transition-colors">
                        {test.type === 'PHILLIPS' ? 'Тест тревожности Филлипса' : 'Опросник Олвеуса'}
                      </h3>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Ваш результат</p>
                          <p className="text-3xl font-bold">
                            {test.score.toFixed(1)}
                            <span className="text-gray-500 text-lg">/10</span>
                          </p>
                        </div>
                        <div className="text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
                          Подробнее <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
        
        {filteredTests.length > 0 && (
          <section className="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
            <h2 className="text-lg font-medium mb-3">Рекомендации</h2>
            <p className="text-gray-400">
              Регулярное прохождение тестов поможет вам отслеживать изменения в вашем психологическом состоянии. 
              Рекомендуем проходить оценку не реже одного раза в месяц.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default withAuth(StudentPage);