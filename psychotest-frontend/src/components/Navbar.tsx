"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, Bell, User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black shadow-md py-2" : "bg-gradient-to-b from-black/80 to-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="text-red-600 font-bold text-3xl cursor-pointer flex items-center space-x-2"
        >
          <span className="font-extrabold">ЖАНҰЯ</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-5 text-sm text-gray-300 font-light">
          <button
            onClick={() => router.push("/")}
            className="hover:text-white transition-colors font-medium"
          >
            Главная
          </button>
          <button
            onClick={() => router.push("/#test")}
            className="hover:text-white transition-colors"
          >
            О тесте
          </button>
          <button
            onClick={() => router.push("/#fund")}
            className="hover:text-white transition-colors"
          >
            О фонде
          </button>
          <button
            onClick={() => router.push("/#team")}
            className="hover:text-white transition-colors"
          >
            Команда
          </button>
          <button
            onClick={() => router.push("/#gallery")}
            className="hover:text-white transition-colors"
          >
            Галерея
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <button className="text-white hidden md:block">
            <Search size={20} />
          </button>
          <button onClick={() => router.push("/login")} className="hidden md:block text-white">
            <Bell size={20} />
          </button>
          
          {/* Profile */}
          <div className="relative group hidden md:block">
            <button className="flex items-center text-white">
              <div className="w-8 h-8 bg-red-600 rounded text-white flex items-center justify-center">
                <User size={16} />
              </div>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-gray-800 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                Аккаунт
              </button>
              <button
                onClick={() => router.push("/settings")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                Настройки
              </button>
              <div className="border-t border-gray-800"></div>
              <button
                onClick={() => router.push("/login")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                Вход
              </button>
              <button
                onClick={() => router.push("/register")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
              >
                Регистрация
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-black border-t border-gray-800 py-3 px-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                router.push("/");
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Главная
            </button>
            <button
              onClick={() => {
                router.push("/#test");
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              О тесте
            </button>
            <button
              onClick={() => {
                router.push("/#fund");
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              О фонде
            </button>
            <button
              onClick={() => {
                router.push("/#team");
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Команда
            </button>
            <button
              onClick={() => {
                router.push("/#gallery");
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Галерея
            </button>
            <button
              onClick={() => {
                router.push("/#reviews");
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Отзывы
            </button>
            <button
              onClick={() => {
                router.push("/#contacts");
                setMobileMenuOpen(false);
              }}
              className="text-gray-300 hover:text-white py-2 border-b border-gray-800"
            >
              Контакты
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Вход
              </button>

              <button
                onClick={() => {
                  router.push("/register");
                  setMobileMenuOpen(false);
                }}
                className="text-white border border-gray-600 px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Регистрация
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}