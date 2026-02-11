"use client";

import { useState } from "react";


const API_URL = "http://localhost:2026"; 

interface CompanyLogoProps {
  logo?: string | null;
  name?: string;       
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const CompanyLogo = ({ logo, name = "Company", size = "md", className = "" }: CompanyLogoProps) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  
  if (logo && !imageError) {
    
    
    const fullUrl = logo.startsWith("http") 
      ? logo 
      : `${API_URL}/uploads/images/${logo}`;

    return (
      <div className={`relative rounded-full overflow-hidden border border-slate-200 bg-white ${sizeClasses[size]} ${className}`}>
        <img
          src={fullUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)} 
        />
      </div>
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : "?";
  
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-violet-100 text-violet-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
  ];
  
  const colorIndex = name.length % colors.length;
  const colorClass = colors[colorIndex];

  return (
    <div className={`flex items-center justify-center rounded-full font-black select-none ${sizeClasses[size]} ${colorClass} ${className}`}>
      {initial}
    </div>
  );
};

