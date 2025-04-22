'use client';

import { motion } from 'framer-motion';
import CategoryStats from '@/components/CategoryStats';
import { BarChart3 } from 'lucide-react';

export default function PsychologistAnalyticsPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Заголовок */}
      <section className="py-10 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-2"
        >
          📊 Аналитика
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400"
        >
          Визуализация результатов тестирования по категориям
        </motion.p>
      </section>

      {/* Компонент с круговой диаграммой */}
      <section className="px-6">
        <CategoryStats />
      </section>

      {/* Placeholder для будущих графиков */}
      <section className="px-6 mt-10">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4 text-lg font-semibold">
            <BarChart3 size={20} className="text-blue-400" />
            Графики активности (в разработке)
          </div>
          <p className="text-gray-500">Здесь позже будут отображаться графики активности по дням, неделям и регионам.</p>
        </div>
      </section>
    </div>
  );
}
