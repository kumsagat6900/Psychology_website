'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import LandingLayout from '@/components/LandingLayout';
import MapKazakhstan from '@/components/MapKazakhstan';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LandingLayout>
      {/* Hero Section - Netflix-style gradient overlay on a dark background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/70 z-10"></div>
        
        {/* Background image or pattern (could be replaced with a video background) */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-20 bg-repeat"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight"
          >
            Платформа <span className="text-red-600">онлайн-диагностики</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light"
          >
            Психологические тесты, отчеты и статистика по регионам — всё в одном месте.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 items-center"
          >
            <Button 
              onClick={() => router.push('/register')}
              className="bg-red-600 hover:bg-red-700 text-white rounded px-8 py-6 text-xl font-medium flex items-center"
            >
              Начать <ChevronRight className="ml-2" />
            </Button>
            <Button 
              onClick={() => router.push('/login')} 
              variant="outline" 
              className="border-gray-400 text-white hover:bg-gray-800 px-8 py-6 text-xl"
            >
              Вход
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Netflix-style cards */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-white"
          >
            Исследуйте данные по всему Казахстану
          </motion.h2>
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-lg overflow-hidden bg-gray-900/50 border border-gray-800 shadow-xl"
            >
              <div className="p-6">
                <MapKazakhstan />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Highlights in Netflix-style rows */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Комплексная диагностика</h2>
              <p className="text-lg text-gray-400">Получите доступ к полному набору психологических тестов, разработанных профессионалами. Наши инструменты помогут вам глубже понять себя и других.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-purple-600 to-red-600 rounded-lg aspect-video flex items-center justify-center"
            >
              <div className="text-4xl font-bold">01</div>
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24 md:flex-row-reverse">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:order-2"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Аналитика по регионам</h2>
              <p className="text-lg text-gray-400">Изучите данные по всем регионам Казахстана. Наша интерактивная карта предоставляет детальную информацию о психологическом состоянии населения.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg aspect-video flex items-center justify-center md:order-1"
            >
              <div className="text-4xl font-bold">02</div>
            </motion.div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Персональные рекомендации</h2>
              <p className="text-lg text-gray-400">На основе результатов тестирования, наша система предлагает индивидуальные рекомендации для улучшения психологического благополучия.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg aspect-video flex items-center justify-center"
            >
              <div className="text-4xl font-bold">03</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Netflix-style CTA */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            Готовы начать?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Присоединяйтесь к тысячам людей, которые уже улучшили качество своей жизни с помощью нашей платформы.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={() => router.push('/register')} 
              className="bg-red-600 hover:bg-red-700 text-white rounded px-8 py-6 text-xl"
            >
              Начать сейчас
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Similar to Netflix FAQ */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Часто задаваемые вопросы</h2>
          
          {/* FAQ items would go here - could be expanded with a dropdown functionality */}
          <div className="space-y-4">
            {[
              {
                question: 'Как начать использовать платформу?',
                answer: 'Просто зарегистрируйтесь, пройдите верификацию и получите доступ ко всем функциям нашей платформы.'
              },
              {
                question: 'Безопасны ли мои данные?',
                answer: 'Да, мы используем современные методы шифрования для защиты всех ваших личных данных и результатов тестирования.'
              },
              {
                question: 'Могу ли я использовать платформу бесплатно?',
                answer: 'У нас есть как бесплатный базовый план, так и расширенные планы с дополнительными функциями.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-lg p-6"
              >
                <h3 className="text-xl font-medium text-white mb-2">{item.question}</h3>
                <p className="text-gray-400">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}