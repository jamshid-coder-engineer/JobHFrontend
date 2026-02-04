"use client";

import { Crown, Send } from "lucide-react";
import { Button } from "./button"; // Agar button boshqa joyda bo'lsa yo'lni to'g'irla

export const PremiumBanner = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-blue-800 rounded-[2rem] p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mb-8">
      {/* Orqa fon bezagi */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
      
      <div className="space-y-2 relative z-10 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-black tracking-wider uppercase text-xs md:text-sm">
          <Crown size={18} fill="currentColor" /> Premium Xizmat
        </div>
        <h2 className="text-2xl md:text-3xl font-black">E'loningizni TOPga olib chiqing!</h2>
        <p className="text-blue-100 max-w-xl text-sm md:text-base">
          Premium e'lonlar 10 barobar ko'proq ko'riladi. E'loningizni yuqoriga chiqarish uchun Admin bilan bog'laning.
        </p>
      </div>

      <a href="https://t.me/jamshid_admin" target="_blank" rel="noreferrer" className="relative z-10 w-full md:w-auto">
        <Button className="w-full md:w-auto bg-white text-blue-900 hover:bg-blue-50 font-bold h-12 px-8 rounded-xl shadow-lg border-0 gap-2">
          <Send size={18} /> Admin bilan bog'lanish
        </Button>
      </a>
    </div>
  );
};