'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AvatarUpload from '@/components/AvatarUpload';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [lang, setLang] = useState('ru');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleSave = () => {
    alert(`✅ Изменения сохранены:\nИмя: ${name}\nЯзык: ${lang}\nУведомления: ${notificationsEnabled}`);
    // API-запрос PATCH /users/profile
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Настройки <span className="text-red-600">профиля</span>
          </motion.h1>
          <p className="text-gray-400 mt-2">
            Управляйте интерфейсом и личными данными
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 pb-12 -mt-4">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/60 p-6 rounded-lg border border-gray-800 shadow mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Фото профиля</h2>
          <AvatarUpload currentAvatar={user.avatar} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/60 p-6 rounded-lg border border-gray-800 shadow mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Имя:</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Email:</label>
              <Input
                value={user.email}
                disabled
                className="mt-1 bg-gray-800 border-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/60 p-6 rounded-lg border border-gray-800 shadow mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Интерфейс</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Язык интерфейса:</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="mt-1 bg-gray-800 border-gray-700 text-white px-3 py-2 rounded"
              >
                <option value="ru">Русский</option>
                <option value="kz">Қазақша</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="accent-red-600"
              />
              <label className="text-gray-300">Получать уведомления о новых тестах</label>
            </div>
          </div>
        </motion.section>

        <div className="flex justify-center">
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white">
            <Save size={18} className="mr-2" /> Сохранить
          </Button>
        </div>
      </main>
    </div>
  );
}
