"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import Image from "next/image";

// Backend manzili (Env fayldan olgan ma'qul, hozircha qo'lda yozamiz)
const API_URL = "http://localhost:3000"; // Portingiz 3000 yoki boshqa bo'lsa o'zgartiring

interface CompanyLogoProps {
  logo?: string | null; // Bazadan kelgan fayl nomi
  name?: string;        // Kompaniya nomi (Fallback uchun)
  size?: "sm" | "md" | "lg" | "xl"; // O'lchamlar
  className?: string;
}

export const CompanyLogo = ({ logo, name = "Company", size = "md", className = "" }: CompanyLogoProps) => {
  const [imageError, setImageError] = useState(false);

  // O'lchamlar logikasi
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  // Agar logo bo'lsa va hali xato bermagan bo'lsa -> Rasmni ko'rsat
  if (logo && !imageError) {
    // URL yasash: Agar "http" bilan boshlansa o'zi, bo'lmasa biz ulaymiz
    const fullUrl = logo.startsWith("http") ? logo : `${API_URL}/uploads/${logo}`;

    return (
      <div className={`relative rounded-full overflow-hidden border border-slate-200 bg-white ${sizeClasses[size]} ${className}`}>
        <img
          src={fullUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)} // Agar rasm topilmasa, harfga o'tadi
        />
      </div>
    );
  }

  // Fallback: Agar logo yo'q bo'lsa -> Bosh harf
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  
  // Har xil ranglar (nomiga qarab)
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-violet-100 text-violet-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
  ];
  
  // Ism uzunligiga qarab rang tanlash (doim bir xil chiqishi uchun)
  const colorIndex = name.length % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className={`flex items-center justify-center rounded-full font-black select-none ${sizeClasses[size]} ${colorClass} ${className}`}>
      {initial}
    </div>
  );
};