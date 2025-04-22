'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { LogOut, Settings } from 'lucide-react';

export default function MyProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section */}
      <section className="relative py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Мой <span className="text-red-600">профиль</span>
          </motion.h1>
          <p className="text-gray-400 mt-2">
            Управляйте своей учетной записью и личными данными.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 pb-12 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 p-6 border border-gray-800 shadow-xl rounded-lg">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-red-600">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt="Аватар"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left space-y-2">
                <div>
                  <p className="text-sm text-gray-400">Имя:</p>
                  <p className="text-xl font-semibold">{user.name || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email:</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Роль:</p>
                  <span className="bg-red-600/20 text-red-500 border border-red-600/30 px-3 py-1 rounded text-sm font-medium uppercase">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => router.push('/settings')}
            className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <Settings size={18} /> Настройки
          </Button>
          <Button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <LogOut size={18} /> Выйти
          </Button>
        </div>
      </main>
    </div>
  );
}
