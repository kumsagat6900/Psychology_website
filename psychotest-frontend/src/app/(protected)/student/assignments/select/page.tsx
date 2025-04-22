'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/lib/withAuth';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

function SelectTestPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (type: string) => {
    router.push(`/student/assignments/${type.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section with Netflix-style gradient overlay */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70 z-10"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-20 bg-repeat"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight"
          >
            Выберите <span className="text-red-600">тест</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 font-light"
          >
            Наша платформа предлагает профессиональные диагностические инструменты для точной оценки психологического состояния
          </motion.p>
        </div>
      </section>

      {/* Tests Selection Cards */}
      <section className="relative z-20 -mt-20 px-4 mb-20">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-purple-900 to-red-900 p-0.5 rounded-lg shadow-xl">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                        📘
                      </div>
                      <h3 className="ml-4 text-xl font-bold text-white">Тест Филлипса</h3>
                    </div>
                    <p className="text-gray-400 mb-4">Диагностика уровня тревожности у школьников в различных социальных ситуациях</p>
                    <Button 
                      onClick={() => handleSelect('phillips')}
                      className="bg-red-600 hover:bg-red-700 text-white w-full py-5 flex items-center justify-center"
                    >
                      Начать тест <ChevronRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-blue-900 to-cyan-900 p-0.5 rounded-lg shadow-xl">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">
                        📕
                      </div>
                      <h3 className="ml-4 text-xl font-bold text-white">Тест Олвеуса</h3>
                    </div>
                    <p className="text-gray-400 mb-4">Исследование распространенности буллинга в образовательной среде</p>
                    <Button 
                      onClick={() => handleSelect('olweus')}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full py-5 flex items-center justify-center"
                    >
                      Начать тест <ChevronRight className="ml-2" size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold mb-10 text-center text-white"
          >
            Почему стоит пройти наши тесты?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Точность', 
                description: 'Научно обоснованные методики тестирования', 
                icon: '🎯',
                color: 'from-red-600 to-red-700' 
              },
              { 
                title: 'Быстрота', 
                description: 'Мгновенная обработка результатов', 
                icon: '⚡',
                color: 'from-blue-600 to-blue-700' 
              },
              { 
                title: 'Конфиденциальность', 
                description: 'Полная защита ваших личных данных', 
                icon: '🔒',
                color: 'from-green-600 to-green-700' 
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl bg-gradient-to-r ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold mb-6 text-white"
          >
            Готовы приступить к тестированию?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 mb-8"
          >
            Выберите тест из предложенных вариантов и получите профессиональную оценку и рекомендации
          </motion.p>
        </div>
      </section>
    </div>
  );
}

export default withAuth(SelectTestPage);