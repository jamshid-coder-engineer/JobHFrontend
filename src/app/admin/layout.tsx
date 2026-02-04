"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../entities/user/model/user-store";
import { Sidebar } from "./_components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuth } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Agar login qilmagan bo'lsa, darhol login sahifasiga yuboramiz
    if (!isAuth) {
      router.push("/login");
    }
    // Agar login qilgan-u, lekin admin bo'lmasa, bosh sahifaga yuboramiz
    else if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
      router.push("/");
    }
  }, [user, isAuth, router]);

  // 1. Agar hali auth tekshirilayotgan bo'lsa (loading holati)
  if (!isAuth) {
    return <div className="p-20 text-center font-bold">Yuklanmoqda...</div>;
  }

  // 2. Agar foydalanuvchi admin bo'lmasa, kontentni umuman ko'rsatmaymiz
  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-10 border rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Kirish taqiqlangan!</h1>
          <p className="text-slate-500">Sizda ushbu sahifaga kirish huquqi yo'q.</p>
        </div>
      </div>
    );
  }

  // 3. Faqat hamma tekshiruvdan o'tsagina Sidebar va Children ko'rinadi
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}