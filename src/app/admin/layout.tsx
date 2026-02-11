"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../entities/user/model/user-store";
import { Sidebar } from "./_components/sidebar";
import { AdminHeader } from "./_components/admin-header";
import { Loader2 } from "lucide-react"; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuth, _hasHydrated } = useUserStore();
  const router = useRouter();

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
    <div className="min-h-screen bg-slate-50">
      
      {/* Admin Header */}
      <AdminHeader />
      
      {/* Sidebar - to'liq balandlikda */}
      <Sidebar 
        collapsed={collapsed} 
        toggleCollapsed={() => setCollapsed(!collapsed)} 
      />

      {/* Main content */}
      <main 
        className={`
          min-h-screen transition-all duration-300 p-6 pt-24
          ${collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"} 
        `}
      >
        {children}
      </main>
    </div>
  );
}