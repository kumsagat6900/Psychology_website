"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown, User, Bell, Search } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const headerClasses = `fixed w-full z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center ${
    scrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
  }`;

  if (!user) {
    return (
      <header className={headerClasses}>
      
      </header>
    );
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={headerClasses}
    >
      <div className="flex items-center">
        <h1
          onClick={() => router.push("/")}
          className="text-red-600 font-bold text-3xl mr-8 cursor-pointer"
        >
          Жанұя
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-white p-2 rounded-full hover:bg-gray-800">
          <Search size={20} />
        </button>
        <button className="text-white p-2 rounded-full hover:bg-gray-800 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full text-xs flex items-center justify-center">
            2
          </span>
        </button>

        <div className="relative group">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center overflow-hidden">
              <User size={16} />
            </div>
            <div className="hidden md:block">
              <div className="text-sm text-white">
                {user?.name || "Пользователь"}
              </div>
              <div className="text-xs text-gray-400 uppercase">
                {user?.role || "Гость"}
              </div>
            </div>
            <ChevronDown
              size={16}
              className="text-white group-hover:rotate-180 transition-transform duration-300"
            />
          </div>

          {/* Выпадающее меню */}
          <div
            className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-800 rounded shadow-lg 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                          transition-all duration-300 z-50"
          >
            <div className="p-3 border-b border-gray-800">
              <p className="text-sm text-gray-400">Вы вошли как</p>
              <p className="text-white break-words">{user?.email}</p>
            </div>
            <ul>
              <li>
                <button
                  onClick={() => router.push("/profile")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Мой профиль
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/settings")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Настройки
                </button>
              </li>

              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Помощь
                </a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800"
                >
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
