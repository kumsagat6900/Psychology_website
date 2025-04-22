// ✅ Root layout: применяется ко всем страницам
// app/layout.tsx
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Toaster />
        <AuthProvider>
          {children} {/* Header здесь не нужен, иначе будет дублироваться */}
        </AuthProvider>
      </body>
    </html>
  );
}