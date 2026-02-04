"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vacancyApi } from "../../../features/vacancy/api/create-vacancy.api";
import { PremiumBanner } from "../../../shared/ui/premium-banner";
import { Plus, MapPin, Users, ArrowLeft, Loader2, Trash2, Edit, Briefcase, Crown, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { toast } from "sonner";

export default function MyVacanciesPage() {
  const queryClient = useQueryClient();

  // 1. VAKANSIYALARNI OLISH
  const { data, isLoading } = useQuery({
    queryKey: ["my-vacancies"],
    queryFn: () => vacancyApi.getMyVacancies(),
  });

  // 2. O'CHIRISH LOGIKASI
  const deleteMutation = useMutation({
    mutationFn: (id: string) => vacancyApi.deleteVacancy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-vacancies"] });
      toast.success("Vakansiya o'chirildi");
    },
    onError: () => toast.error("O'chirishda xatolik yuz berdi"),
  });

  const vacancies = data?.data || [];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* 1. PREMIUM BANNER (Marketing) */}
      <PremiumBanner />

      {/* 2. NAVIGATSIYA VA CREATE TUGMASI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors font-medium">
          <ArrowLeft size={16} /> Bosh sahifaga qaytish
        </Link>
        
        <Link href="/dashboard/vacancies/create">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 font-bold shadow-lg shadow-blue-100 h-12 text-white">
            <Plus className="w-5 h-5 mr-2" /> Yangi e'lon yaratish
          </Button>
        </Link>
      </div>

      {/* 3. RO'YXAT QISMI */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          Sizning e'lonlaringiz 
          <span className="bg-slate-100 text-slate-500 text-sm px-3 py-1 rounded-full font-bold">
            {vacancies.length}
          </span>
        </h3>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
            <p className="font-medium">Yuklanmoqda...</p>
          </div>
        )}

        {/* EMPTY STATE (Agar vakansiya bo'lmasa) */}
        {!isLoading && vacancies.length === 0 && (
          <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-xl">Hali birorta ham e'lon bermagansiz.</p>
          </div>
        )}

        {/* VAKANSIYALAR RO'YXATI */}
        <div className="grid gap-4">
          {vacancies.map((v: any) => (
            <div key={v.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all border-l-[10px] border-l-blue-600 group relative overflow-hidden flex flex-col gap-4">
              
              {/* STATUS PENDING BO'LSA ORQA FONDA OGOHLANTIRISH */}
              {v.status === 'PENDING' && (
                <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
                  MODERATSIYADA
                </div>
              )}

              {/* ASOSIY MA'LUMOTLAR VA TUGMALAR */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
                
                {/* CHAP TOMON: TITLE VA INFO */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">{v.title}</h4>
                    
                    {/* STATUS BADGELARI */}
                    <Badge className={`uppercase text-[10px] ${
                      v.status === 'PUBLISHED' ? 'bg-green-50 text-green-600 border-green-100' : 
                      v.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-yellow-50 text-yellow-600 border-yellow-100'
                    }`}>
                      {v.status === 'PENDING' ? 'KUTILMOQDA' : v.status}
                    </Badge>

                    {/* PREMIUM BELGISI */}
                    {v.isPremium && (
                      <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 uppercase text-[10px] flex items-center gap-1">
                        <Crown size={12} fill="currentColor" /> Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-4 md:gap-6 text-sm text-slate-500 font-medium items-center flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-slate-400"/> {v.city || 'Shahar ko\'rsatilmagan'}
                    </span>
                    
                    {/* ARIZALARGA O'TISH LINKI */}
                    <Link href="/dashboard/employer-applications">
                      <button className="flex items-center gap-1.5 text-blue-600 font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                        <Users size={16}/> 
                        {/* Backenddagi applications array uzunligi */}
                        {v.applications?.length || 0} ta ariza
                      </button>
                    </Link>
                  </div>
                </div>
                
                {/* O'NG TOMON: ACTION BUTTONS (Edit/Delete) */}
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                  <Link href={`/dashboard/vacancies/edit/${v.id}`} className="flex-1 md:flex-none">
                    <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 font-bold">
                      <Edit size={16} /> <span className="md:hidden">Tahrirlash</span>
                    </Button>
                  </Link>
                  
                  <Button 
                    disabled={deleteMutation.isPending}
                    onClick={() => { if(confirm("O'chirishni tasdiqlaysizmi?")) deleteMutation.mutate(v.id) }}
                    variant="destructive" 
                    className="rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white gap-2 shadow-none font-bold"
                  >
                    <Trash2 size={16} /> 
                  </Button>
                </div>
              </div>

              {/* ⚠️ RAD ETISH SABABI (Faqat Rejected bo'lsa chiqadi) */}
              {v.status === 'REJECTED' && v.rejectedReason && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 w-full">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-bold text-red-700 text-sm">Moderator rad etdi:</h5>
                    <p className="text-red-600 text-sm mt-1 font-medium">
                      "{v.rejectedReason}"
                    </p>
                    <p className="text-red-400 text-xs mt-2 font-semibold">
                      Iltimos, "Tahrirlash" tugmasini bosib, xatoliklarni to'g'irlang va qayta yuboring.
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}