"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../entities/user/model/user-store";
import { Briefcase, ShieldCheck, LogOut, ChevronDown } from "lucide-react";

export const AdminHeader = () => {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white border-b border-slate-100 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* Logo - Admin uchun */}
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200 group-hover:rotate-12 transition-transform duration-300">
            <Briefcase className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter italic text-slate-800 uppercase">
            Tech<span className="text-purple-600">Jobs</span>
          </span>
        </Link>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center ring-2 ring-white">
              <ShieldCheck className="text-white" size={20} />
            </div>
            
            {/* User Info */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-slate-700 leading-none">
                {user?.firstName || "Admin"}
              </p>
              <p className="text-xs text-purple-600 uppercase font-bold leading-none mt-0.5">
                {user?.role}
              </p>
            </div>

            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2">
              
              {/* Asosiy saytga qaytish */}
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-blue-600 font-medium transition-colors cursor-pointer">
                  <Briefcase size={18} /> Asosiy sahifa
                </div>
              </Link>

              <div className="h-[1px] bg-slate-100 my-1"></div>

              {/* Chiqish */}
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
    </header>
  );
};