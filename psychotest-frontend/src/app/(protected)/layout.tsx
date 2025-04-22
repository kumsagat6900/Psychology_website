// app/(protected)/layout.tsx
import TeacherSidebar from "@/components/TeacherSidebar";
import Header from "@/components/Header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-black min-h-screen">
      <TeacherSidebar />
      <div className="flex-1">
        <Header />
        <main className="pt-20 px-6">{children}</main>
      </div>
    </div>
  );
}
