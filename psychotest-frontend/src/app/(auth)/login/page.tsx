'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { ChevronLeft, EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({
    message: "Введите корректный email адрес",
  }),
  password: z.string().min(6, {
    message: "Пароль должен содержать минимум 6 символов",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:3000/auth/login', data);
      const { access_token } = res.data;

      login(access_token);
      toast.success('Успешный вход');

      const decoded = jwtDecode(access_token);
      const role = decoded.role;

      if (role === 'STUDENT') router.push('/student');
      else if (role === 'PSYCHOLOGIST') router.push('/psychologist');
    } catch (err) {
      toast.error('Неверный логин или пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/90 to-black"></div>
      
      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
            <span className="ml-1">Назад</span>
          </Link>
          <div className="absolute top-4 md:top-6 left-1/2 transform -translate-x-1/2">
            <div className="text-red-600 font-bold text-2xl">PSYCHO</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/80 border border-gray-800 rounded-md p-8 max-w-md w-full shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6">Вход</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Email</label>
              <Input 
                placeholder="Введите ваш email" 
                type="email" 
                {...register('email')} 
                className={`bg-gray-800 border-gray-700 text-white placeholder-gray-500 p-3 rounded ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Пароль</label>
              <div className="relative">
                <Input 
                  placeholder="Введите ваш пароль" 
                  type={showPassword ? "text" : "password"} 
                  {...register('password')} 
                  className={`bg-gray-800 border-gray-700 text-white placeholder-gray-500 p-3 pr-10 rounded ${errors.password ? 'border-red-500' : ''}`}
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded"
            >
              {isSubmitting ? 'Подождите...' : 'Войти'}
            </Button>
          </form>
          
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link href="/forgot-password" className="text-gray-400 hover:text-white text-sm">
                Забыли пароль?
              </Link>
            </div>
            <div className="text-center text-gray-400">
              <p>Еще нет аккаунта? <Link href="/register" className="text-white hover:underline">Зарегистрироваться</Link></p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <p>© 2025 PSYCHO. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}