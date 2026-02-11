"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "../../../entities/user/model/user-store";
import { 
  LayoutDashboard, Building2, Briefcase, 
  ShieldCheck, ChevronLeft, ChevronRight 
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export function Sidebar({ collapsed, toggleCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUserStore();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Kompaniyalar", href: "/admin/companies", icon: Building2 },
    { name: "Vakansiyalar", href: "/admin/vacancies", icon: Briefcase },
  ];

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col border-r border-slate-800
        z-40  
        ${collapsed ? "w-20" : "w-64"} 
      `}
    >
      {/* Top padding - Header uchun joy */}
      <div className="h-20"></div>

      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        
        {!collapsed && (
          <div className="animate-in fade-in duration-300 overflow-hidden whitespace-nowrap">
            <h1 className="text-xl font-black tracking-tighter">TechJobs <span className="text-blue-500">A</span></h1>
            <p className="text-[15px] text-slate-400 uppercase font-bold tracking-wider">{user?.role}</p>
          </div>
        )}
        
        <button 
          onClick={toggleCollapsed}
          className={`
            p-2 rounded-lg bg-slate-400 hover:bg-blue-600 hover:text-white text-slate-900 transition-all shadow-sm
            ${collapsed ? "mx-auto" : ""}
          `}
        >
          {collapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.name : ""}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium whitespace-nowrap overflow-hidden
                ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                ${collapsed ? "justify-center" : ""}
              `}>
                <item.icon size={22} className="flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </div>
            </Link>
          );
        })}

        {user?.role === "SUPER_ADMIN" && (
          <>
            {!collapsed && <div className="my-4 border-t border-slate-800 mx-2"></div>}
            
            <Link href="/admin/admins" title="Adminlar">
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium whitespace-nowrap overflow-hidden
                ${pathname === "/admin/admins" ? "bg-purple-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                ${collapsed ? "justify-center" : ""}
              `}>
                <ShieldCheck size={22} className="text-purple-400 flex-shrink-0" />
                {!collapsed && <span>Adminlar</span>}
              </div>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}