"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Briefcase, Home, LogOut } from "lucide-react";
import { cn } from "../../../shared/lib/utils"; // Shadcn utility

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Kompaniyalar", href: "/admin/companies", icon: <Building2 size={20} /> },
  { name: "Vakansiyalar", href: "/admin/vacancies", icon: <Briefcase size={20} /> },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-blue-400">HH Admin Panel</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              pathname === item.href ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-400"
            )}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link href="/" className="flex items-center gap-3 p-3 text-slate-400 hover:text-white transition-colors">
          <Home size={20} />
          <span>Saytga qaytish</span>
        </Link>
      </div>
    </aside>
  );
};