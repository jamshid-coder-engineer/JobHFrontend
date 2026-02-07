"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../entities/user/model/user-store"; 
import { Button } from "../../../shared/ui/button";
import { LogOut, PlusCircle, User, Briefcase, LayoutDashboard, Heart } from "lucide-react";

export const Header = () => {
  const { isAuth, user, logout } = useUserStore();
  const router = useRouter();

  const getProfileLink = () => {
    switch (user?.role) {
      case "EMPLOYER": return "/dashboard/vacancies"; 
      case "ADMIN": case "SUPER_ADMIN": return "/admin";     
      default: return "/dashboard/profile";   
    }
  };

  const handleLogout = () => {
    logout();
    // 🧹 Kesh tozalanishi uchun oynani to'liq yangilab yuboramiz (Login sahifasiga)
    window.location.href = "/login"; 
  };

  // 🔥 AQLLI LINK LOGIKASI
  // Agar userda 'company' bo'lmasa -> Kompaniya yaratishga jo'natamiz
  const createVacancyLink = user?.company 
      ? "/dashboard/vacancies/create" 
      : "/dashboard/company/create";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto h-20 px-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Briefcase className="text-white" size={24} />
          </div>
          <span className="text-2xl md:text-3xl font-black tracking-tighter italic text-slate-700 uppercase">
            Tech<span className="text-blue-600">Jobs</span>
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">
          {isAuth ? (
            <>
              {/* 🔥 YANGILANGAN TUGMA */}
              {user?.role === "EMPLOYER" && (
                <Link href={createVacancyLink}>
                  <Button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-md shadow-blue-100">
                    <PlusCircle size={18} /> E'lon berish
                  </Button>
                </Link>
              )}

              {/* CANDIDATE */}
              {user?.role === "CANDIDATE" && (
                <>
                   <Link href="/dashboard/saved-jobs">
                      <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors relative">
                        <Heart size={22} />
                      </Button>
                   </Link>
                   
                   <Link href="/dashboard/my-applications" className="hidden md:block text-sm font-bold text-slate-600 hover:text-blue-600">
                     Arizalarim
                   </Link>
                </>
              )}

              {/* PROFILE & LOGOUT */}
              <div className="flex items-center gap-1 border-l pl-2 ml-2 border-slate-200">
                <Link href={getProfileLink()}>
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600">
                    {user?.role === 'EMPLOYER' ? <LayoutDashboard size={20} /> : <User size={20} />}
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" className="rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600" onClick={handleLogout}>
                  <LogOut size={20} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-slate-700">Kirish</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 shadow-lg">
                  Ro'yxatdan o'tish
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};