"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  BarChart2,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Settings,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const links = [
  { label: "Главная", path: "/psychologist", icon: <Home size={20} /> },
  { label: "Студенты", path: "/psychologist/students", icon: <Users size={20} /> },
  { label: 'Задания', path: '/psychologist/assignments', icon: <FileText size={20} /> },
  {
    label: "Аналитика",
    path: "/psychologist/analytics",
    icon: <BarChart2 size={20} />,
  },
];

const bottomLinks = [
  { label: "Документация", path: "/docs", icon: <BookOpen size={20} /> },
  { label: "Настройки", path: "/settings", icon: <Settings size={20} /> },
];

export default function NetflixTeacherSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black/50 backdrop-blur-sm p-2 rounded-full"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Menu size={24} className="text-white" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "min-h-screen bg-black border-r border-zinc-900 fixed top-0 left-0 z-40 pt-20 transition-all duration-300 hidden md:flex flex-col text-white justify-between",
          isCollapsed ? "w-20 p-3" : "w-64 p-6"
        )}
      >
        <div>
          {/* Collapse Toggle */}
          <button
            className="absolute top-24 -right-3 bg-zinc-900 rounded-full p-1 text-gray-400 hover:text-white"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronRight
              size={16}
              className={cn(
                "transition-transform",
                isCollapsed ? "rotate-180" : ""
              )}
            />
          </button>

          <nav className="flex flex-col space-y-1 mt-20">
            {" "}
            {/* ⬅️ Добавил mt-8 */}
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all",
                  isActive(link.path)
                    ? "bg-zinc-900 text-white border-l-4 border-red-600"
                    : "hover:bg-zinc-900/50 text-gray-400 hover:text-white",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div className={isActive(link.path) ? "text-red-600" : ""}>
                  {link.icon}
                </div>
                {!isCollapsed && <span>{link.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div>
          <nav className="flex flex-col space-y-1">
            {bottomLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-zinc-900/50",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <div>{link.icon}</div>
                {!isCollapsed && <span>{link.label}</span>}
              </button>
            ))}

            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all text-red-500 hover:text-white hover:bg-zinc-900/50",
                isCollapsed && "justify-center px-2"
              )}
            >
              <LogOut size={20} className="text-red-600" />
              {!isCollapsed && <span>Выйти</span>}
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/95 z-40 md:hidden flex flex-col pt-16"
        >
          <div className="flex justify-center items-center py-6 border-b border-zinc-800">
            <h2 className="text-red-600 font-bold text-xl">ЖАНҰЯ</h2>
          </div>

          <nav className="flex flex-col p-6 space-y-2 mt-4">
            {links.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  router.push(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 rounded-md text-base font-medium transition-all",
                  isActive(link.path)
                    ? "bg-zinc-900 text-white border-l-4 border-red-600"
                    : "text-gray-400 hover:bg-zinc-900/50 hover:text-white"
                )}
              >
                <div className={isActive(link.path) ? "text-red-600" : ""}>
                  {link.icon}
                </div>
                <span>{link.label}</span>
              </button>
            ))}

            <hr className="border-zinc-800 my-4" />

            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-4 rounded-md text-base font-medium transition-all text-red-600 hover:bg-zinc-900/50"
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </nav>
        </motion.div>
      )}
    </>
  );
}
