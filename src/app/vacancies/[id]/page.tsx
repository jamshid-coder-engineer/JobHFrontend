"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { vacancyApi } from "../../../features/vacancy/api/create-vacancy.api";
import { applicationApi } from "../../../features/application/api/application.api";
import { Loader2, MapPin, Building2, Calendar, DollarSign, ArrowLeft, AlertCircle, Briefcase } from "lucide-react"; // Iconlar
import Link from "next/link";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "../../../entities/user/model/user-store"; // 👈 STORE CHAQIRILDI

export default function SingleVacancyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  // 1. USERNI STORE ORQALI OLAMIZ (localStorage shart emas)
  const { user } = useUserStore(); 
  
  const [isApplying, setIsApplying] = useState(false); 

  // 2. VAKANSIYANI OLISH
  const { data, isLoading, error } = useQuery({
    queryKey: ["vacancy", id],
    queryFn: () => vacancyApi.getOne(id),
    enabled: !!id,
  });

  // 3. ARIZA TOPSHIRISH
  const handleApply = async () => {
    // A) Mehmon bo'lsa -> Registerga
    if (!user) {
      toast.info("Ariza topshirish uchun avval ro'yxatdan o'ting");
      router.push("/login"); // Login yoki Registerga
      return;
    }

    // B) Ehtiyot shart: Agar baribir admin tugmani bossa (hack qilib)
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'EMPLOYER') {
      toast.error("Sizning rolizda ariza topshirish mumkin emas");
      return;
    }

    setIsApplying(true); 
    try {
      await applicationApi.apply({ vacancyId: id });
      toast.success("Ariza muvaffaqiyatli yuborildi! 🎉");
    } catch (err: any) {
      const msg = err.response?.data?.message;

      if (msg === "ALREADY_APPLIED") {
        toast.warning("Siz bu ishga allaqachon ariza topshirgansiz! ✅");
      } 
      else if (msg === "PROFILE_INCOMPLETE") {
        toast.error("Iltimos, avval rezyume yarating 📝");
        setTimeout(() => router.push("/dashboard/profile"), 1500); // Resume sahifasiga
      } 
      else {
        toast.error("Xatolik yuz berdi.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Vakansiya topilmadi 😕</h2>
        <Link href="/">
          <Button>Bosh sahifaga qaytish</Button>
        </Link>
      </div>
    );
  }

  const v = data.data || data; 

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-medium transition-colors cursor-pointer">
          <ArrowLeft size={18} className="mr-2"/> Ortga qaytish
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
           
           <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-sm">
                        {v.employmentType === 'FULL_TIME' ? "To'liq bandlik" : v.employmentType}
                    </Badge>
                    <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Calendar size={14}/> {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'Sana yo\'q'}
                    </span>
                 </div>
                 
                 <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                    {v.title}
                 </h1>

                 <div className="flex flex-wrap gap-4 md:gap-8 text-slate-600 font-medium text-lg">
                    <span className="flex items-center gap-2">
                        <DollarSign className="text-green-600" size={20}/> 
                        {v.salaryFrom} - {v.salaryTo}
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin className="text-red-500" size={20}/> 
                        {v.city}
                    </span>
                 </div>
              </div>

              {/* Company Logo */}
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-slate-400 uppercase">
                  {v.company?.name?.[0] || "C"}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* TAVSIF QISMI */}
            <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Vakansiya haqida</h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {v.description}
                </div>
            </div>

            {/* SIDEBAR (Action) */}
            <div className="space-y-6">
                
                {/* Kompaniya Info */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 uppercase">
                       <Building2 />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900">{v.company?.name}</h4>
                </div>

                {/* 🔥 DINAMIK TUGMA QISMI 🔥 */}
                <div className="sticky top-4">
                    
                    {/* 1. ADMINLAR UCHUN */}
                    {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? (
                       <div className="bg-red-50 rounded-[2rem] p-6 border border-red-100 text-center space-y-2">
                          <AlertCircle className="mx-auto text-red-500 w-10 h-10 mb-2" />
                          <h4 className="text-red-700 font-bold">Admin rejimi</h4>
                          <p className="text-red-500 text-sm">
                             Siz admin bo'lganingiz uchun ariza topshira olmaysiz.
                          </p>
                       </div>
                    ) 
                    
                    /* 2. ISH BERUVCHILAR UCHUN */
                    : user?.role === 'EMPLOYER' ? (
                       <div className="bg-blue-50 rounded-[2rem] p-6 border border-blue-100 text-center space-y-2">
                          <Briefcase className="mx-auto text-blue-500 w-10 h-10 mb-2" />
                          <h4 className="text-blue-700 font-bold">Ish beruvchi</h4>
                          <p className="text-blue-500 text-sm">
                             Sizning hisobingiz vakansiya joylash uchun mo'ljallangan.
                          </p>
                       </div>
                    )

                    : (
                      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                          <Button 
                            onClick={handleApply}
                            disabled={isApplying}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isApplying ? (
                              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Yuborilmoqda...</>
                            ) : (
                              "Ariza topshirish"
                            )}
                          </Button>
                          <p className="text-center text-xs text-slate-400 mt-4">
                              {!user 
                                ? "Ariza topshirish uchun tizimga kiring" 
                                : "Sizning rezyumeyingiz avtomatik yuboriladi"}
                          </p>
                      </div>
                    )}

                </div>

            </div>
        </div>

      </div>
    </div>
  );
}