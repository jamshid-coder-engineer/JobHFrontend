"use client";

import Link from "next/link";
import { useUserStore } from "../../../entities/user/model/user-store"; // Yo'lni o'zingnikiga mosla
import { Button } from "../../../shared/ui/button";
import { LogOut, PlusCircle, User, Briefcase, LayoutDashboard } from "lucide-react";

export const Header = () => {
  const { isAuth, user, logout } = useUserStore();

  // 🛠 MUHIM MANTIQ: Rolga qarab "Profil" tugmasi qayerga olib borishini hal qilamiz
  const getProfileLink = () => {
    switch (user?.role) {
      case "EMPLOYER":
        return "/dashboard/vacancies"; // Ish beruvchi -> O'z vakansiyalariga
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/admin/dashboard";     // Admin -> Admin panelga
      default:
        return "/dashboard/profile";   // Nomzod (CANDIDATE) -> Rezyumesiga
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto h-20 px-4 flex items-center justify-between">
        
        {/* 1. LOGO (Bosh sahifaga qaytish) */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Briefcase className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
            Uz<span className="text-blue-600">.job</span>
          </span>
        </Link>

        {/* 2. NAVIGATION (O'rtadagi menyular) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            Vakansiyalar
          </Link>
          {/* Kelajakda kompaniyalar ro'yxati uchun */}
          {/* <Link href="/companies" className="...">Kompaniyalar</Link> */}
        </nav>

        {/* 3. AUTH / ACTIONS (O'ng tomon) */}
        <div className="flex items-center gap-3">
          {isAuth ? (
            <>
              {/* --- ISH BERUVCHI UCHUN --- */}
              {user?.role === "EMPLOYER" && (
                <Link href="/dashboard/vacancies/create">
                  <Button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-md shadow-blue-100">
                    <PlusCircle size={18} />
                    E'lon berish
                  </Button>
                </Link>
              )}

              {/* --- NOMZOD UCHUN --- */}
              {user?.role === "CANDIDATE" && (
                <Link href="/dashboard/my-applications" className="hidden md:block text-sm font-bold text-slate-600 mr-2 hover:text-blue-600">
                  Arizalarim
                </Link>
              )}

              {/* --- PROFIL VA CHIQISH --- */}
              <div className="flex items-center gap-2 border-l pl-4 ml-2 border-slate-200">
                
                {/* MANA SHU YERDA MANTIQ O'ZGARDI:
                    Logoga bosganda getProfileLink() funksiyasi ishlaydi 
                */}
                <Link href={getProfileLink()}>
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    {user?.role === 'EMPLOYER' ? <LayoutDashboard size={20} /> : <User size={20} />}
                  </Button>
                </Link>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => logout()}
                >
                  <LogOut size={20} />
                </Button>
              </div>
            </>
          ) : (
            /* --- MEHMON (LOGIN QILMAGAN) UCHUN --- */
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-slate-700">Kirish</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 shadow-lg shadow-slate-200">
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