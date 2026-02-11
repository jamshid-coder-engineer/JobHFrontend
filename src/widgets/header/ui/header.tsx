"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; 
import { useQuery } from "@tanstack/react-query";
import { 
  LogOut, PlusCircle, User, Briefcase, 
  LayoutList, Heart, Loader2, Inbox, 
  Settings, FileText, ChevronDown, ShieldCheck 
} from "lucide-react";

import { useUserStore } from "../../../entities/user/model/user-store"; 
import { companyApi } from "../../../features/company/api/company.api";
import { Button } from "../../../shared/ui/button";
import { CompanyLogo } from "../../../shared/ui/company-logo";

export const Header = () => {
  const { isAuth, user, logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname(); 
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: companyData, isLoading } = useQuery({
    queryKey: ["my-company-check"], 
    queryFn: () => companyApi.getMyCompany(),
    enabled: isAuth && user?.role === "EMPLOYER",
    retry: false, 
  });

  const handleLogout = () => {
    logout();
    router.push("/login"); 
  };

  const handleCreateClick = () => {
    if (companyData?.data) {
      router.push("/dashboard/vacancies/create");
    } else {
      router.push("/dashboard/company/create");
    }
  };

  const getUserRoleLabel = () => {
    if (user?.role === "EMPLOYER") return "Ish beruvchi";
    if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") return "Admin";
    return "Nomzod";
  };

  const getUserName = () => {
    if (user?.role === "EMPLOYER") return companyData?.data?.name || "Kompaniya";
    return user?.firstName || "Foydalanuvchi";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="container mx-auto h-20 px-4 flex items-center justify-between">
        
        {}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
            <Briefcase className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter italic text-slate-800 uppercase">
            Tech<span className="text-blue-600">Jobs</span>
          </span>
        </Link>

        {}
        <div className="flex items-center gap-4">
          {isAuth ? (
            <div className="flex items-center gap-4">
              
              {}
              {user?.role === "EMPLOYER" && (
                <Button 
                  onClick={handleCreateClick}
                  disabled={isLoading}
                  className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-6 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" size={18}/> : <PlusCircle className="mr-2" size={18} />} 
                  E'lon berish
                </Button>
              )}

              {}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  {}
                  {user?.role === "EMPLOYER" ? (
                     <CompanyLogo 
                       logo={companyData?.data?.logo} 
                       name={companyData?.data?.name} 
                       size="sm" 
                       className="ring-2 ring-white"
                     />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                      ${user?.role?.includes('ADMIN') ? 'bg-purple-600' : 'bg-slate-400'}
                    `}>
                       {user?.role?.includes('ADMIN') ? <ShieldCheck size={16}/> : <User size={18} />}
                    </div>
                  )}

                  
                  <div className="hidden md:block text-left mr-1">
                    <p className="text-xs font-bold text-slate-700 leading-none max-w-[100px] truncate">
                      {getUserName()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mt-0.5">
                      {getUserRoleLabel()}
                    </p>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                
                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 z-50">
                    
                    
                    {user?.role === "EMPLOYER" && (
                      <>
                        <Link href="/dashboard/vacancies" onClick={() => setIsMenuOpen(false)}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${pathname === '/dashboard/vacancies' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'}`}>
                            <LayoutList size={18} /> Mening vakansiyalarim
                          </div>
                        </Link>
                        <Link href="/dashboard/employer-applications" onClick={() => setIsMenuOpen(false)}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${pathname === '/dashboard/employer-applications' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'}`}>
                             <div className="relative">
                               <Inbox size={18} />
                               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                             </div>
                             Kelgan arizalar
                          </div>
                        </Link>
                        <Link href="/dashboard/company" onClick={() => setIsMenuOpen(false)}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${pathname === '/dashboard/company' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'}`}>
                            <Settings size={18} /> Kompaniya sozlamalari
                          </div>
                        </Link>
                      </>
                    )}

                    
                    {user?.role === "CANDIDATE" && (
                      <>
                        <Link href="/dashboard/my-applications" onClick={() => setIsMenuOpen(false)}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${pathname === '/dashboard/my-applications' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'}`}>
                            <FileText size={18} /> Arizalarim
                          </div>
                        </Link>
                        <Link href="/dashboard/saved-jobs" onClick={() => setIsMenuOpen(false)}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${pathname === '/dashboard/saved-jobs' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50 text-slate-600 hover:text-red-500'}`}>
                            <Heart size={18} /> Tanlanganlar
                          </div>
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer ${pathname === '/dashboard/profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600 hover:text-blue-600'}`}>
                            <Settings size={18} /> Profil sozlamalari
                          </div>
                        </Link>
                      </>
                    )}

                    
                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                       <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-purple-600 font-medium transition-colors cursor-pointer">
                            <ShieldCheck size={18} /> Admin Panel
                          </div>
                       </Link>
                    )}

                    <div className="h-[1px] bg-slate-100 my-1"></div>

                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                    >
                      <LogOut size={18} /> Chiqish
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            
            <div className="flex items-center text-slate-500 font-bold text-base md:text-lg">
               <Link 
                 href="/login" 
                 className={`transition-colors px-2 py-1 ${pathname === '/login' ? 'text-blue-600' : 'hover:text-blue-600'}`}
               >
                 Kirish
               </Link>
               
               <span className="text-slate-300 mx-1">/</span>
               
               <Link 
                 href="/register" 
                 className={`transition-colors px-2 py-1 ${pathname === '/register' ? 'text-blue-600' : 'hover:text-blue-600'}`}
               >
                 Ro'yxatdan o'tish
               </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};