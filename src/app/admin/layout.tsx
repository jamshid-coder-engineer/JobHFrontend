"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../entities/user/model/user-store";
import { Sidebar } from "./_components/sidebar";
import { Loader2 } from "lucide-react"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuth, _hasHydrated } = useUserStore();
  const router = useRouter();

  // SIDEBAR HOLATI (Ochiq/Yopiq)
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (_hasHydrated) {
      if (!isAuth) {
        router.push("/login");
      }
      else if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
        router.push("/");
      }
    }
  }, [user, isAuth, _hasHydrated, router]);

  if (!_hasHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. SIDEBAR */}
      <Sidebar 
        collapsed={collapsed} 
        toggleCollapsed={() => setCollapsed(!collapsed)} 
      />

      {/* 2. MAIN CONTENT (Asosiy qism) */}
      <main 
        className={`
          flex-1 transition-all duration-300 p-6 pt-24 md:pt-6
          ${collapsed ? "ml-20" : "ml-64"} /* Sidebar kengligiga qarab suriladi */
        `}
      >
        {/* Agar oq header haliyam xalaqit bersa, tepadagi bo'sh joyni (pt-24) olib tashlash mumkin */}
        {children}
      </main>
    </div>
  );
}