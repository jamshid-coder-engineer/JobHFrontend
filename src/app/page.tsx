"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, Loader2, Search, 
  DollarSign, Briefcase, Filter, Crown, CheckCircle, Building2 
} from "lucide-react";
import { toast } from "sonner"; 

// API IMPORTLARI
import { vacancyApi } from "../features/vacancy/api/create-vacancy.api"; 
import { applicationApi } from "../features/application/api/application.api"; 
import { useUserStore } from "../entities/user/model/user-store"; 
import { Button } from "../shared/ui/button";
import { Badge } from "../shared/ui/badge";
import { SaveButton } from "../features/vacancy/ui/save-button"; 

// 👇 1. Rasmlar manzili (Backend Porti 2026)
const BASE_URL = "http://localhost:2026/uploads/images/";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuth } = useUserStore();

  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    minSalary: searchParams.get("minSalary") || "",
    date: searchParams.get("date") || "",
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-vacancies", filters], 
    queryFn: () => vacancyApi.getPublicVacancies(filters),
  });

  const vacancies = data?.data?.data || [];

  useEffect(() => {
    if (Array.isArray(vacancies) && vacancies.length > 0 && !selectedId && window.innerWidth >= 768) {
      setSelectedId(vacancies[0].id);
    }
  }, [vacancies, selectedId]);

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleCardClick = (id: string) => {
    if (window.innerWidth < 768) {
       router.push(`/vacancies/${id}`);
    } else {
       setSelectedId(id);
    }
  };

  const handleApply = async (vacancyId: string) => {
    if (!isAuth) {
      toast.info("Ariza topshirish uchun tizimga kiring");
      return router.push("/login");
    }
    if (user?.role === "EMPLOYER" || user?.role === "ADMIN") {
      toast.error("Faqat nomzodlar ariza topshira oladi! 🚫");
      return;
    }
    setApplyingId(vacancyId); 
    try {
      await applicationApi.apply({ vacancyId });
      toast.success("Ariza muvaffaqiyatli yuborildi! 🎉");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === "ALREADY_APPLIED") toast.warning("Siz allaqachon topshirgansiz! ✅");
      else if (msg === "PROFILE_INCOMPLETE") {
        toast.error("Iltimos, avval rezyume yarating 📝");
        setTimeout(() => router.push("/dashboard/profile"), 1500);
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } finally {
      setApplyingId(null);
    }
  };

  const selectedVacancy = Array.isArray(vacancies) 
    ? vacancies.find((v: any) => v.id === selectedId) 
    : null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      
      {/* HEADER QISMI */}
      <div className="bg-white border-b border-slate-200 z-20 shadow-sm relative">
        <div className="max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
          <div className="text-center animate-in fade-in slide-in-from-top-2">
             <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
               Tech<span className="text-blue-600">Jobs</span> bir zumda <span className="text-blue-600">NATIJA</span>ga erishing!
             </h1>
          </div>
          
          {/* Qidiruv va Filtrlar (O'zgarishsiz) */}
          <div className="flex flex-col md:flex-row gap-0 md:gap-0 shadow-lg shadow-blue-100/50 rounded-2xl overflow-hidden border border-slate-200">
             <div className="relative flex-1 border-b md:border-b-0 md:border-r border-slate-200 bg-white group hover:bg-slate-50 transition-colors">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={20}/>
               <input 
                 placeholder="Lavozim, kompaniya yoki kalit so'z..." 
                 className="w-full h-14 pl-12 pr-4 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal"
                 value={filters.q}
                 onChange={(e) => updateFilter("q", e.target.value)}
               />
             </div>
             <div className="relative flex-1 bg-white group hover:bg-slate-50 transition-colors">
               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" size={20}/>
               <input 
                 placeholder="Shahar yoki viloyat..." 
                 className="w-full h-14 pl-12 pr-4 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal"
                 value={filters.city}
                 onChange={(e) => updateFilter("city", e.target.value)}
               />
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 px-8 md:w-auto w-full transition-colors flex items-center justify-center gap-2">
               Izlash
             </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
             <div className="flex items-center gap-2 text-slate-500 font-bold mr-2 text-base">
                <Filter size={20}/> <span className="hidden sm:inline">Saralash:</span>
             </div>
             <select 
               className="h-12 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold border border-transparent hover:border-slate-300 outline-none cursor-pointer transition-all appearance-none min-w-[140px]"
               value={filters.date} onChange={(e) => updateFilter("date", e.target.value)}
             >
               <option value="">🗓 Sana: Barchasi</option>
               <option value="1d">So'nggi 24 soat</option>
               <option value="3d">So'nggi 3 kun</option>
               <option value="7d">So'nggi hafta</option>
             </select>
             <select 
               className="h-12 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold border border-transparent hover:border-slate-300 outline-none cursor-pointer transition-all appearance-none min-w-[140px]"
               value={filters.type} onChange={(e) => updateFilter("type", e.target.value)}
             >
               <option value="">💼 Turi: Barchasi</option>
               <option value="FULL_TIME">To'liq bandlik</option>
               <option value="PART_TIME">Yarim kunlik</option>
               <option value="REMOTE">Masofaviy</option>
               <option value="PROJECT">Loyiha</option>
             </select>
             <select 
               className="h-12 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold border border-transparent hover:border-slate-300 outline-none cursor-pointer transition-all appearance-none min-w-[140px]"
               value={filters.minSalary} onChange={(e) => updateFilter("minSalary", e.target.value)}
             >
               <option value="">💰 Maosh: Barchasi</option>
               <option value="500">$500 dan yuqori</option>
               <option value="1000">$1,000 dan yuqori</option>
               <option value="2000">$2,000 dan yuqori</option>
             </select>
          </div>
        </div>
      </div>


      {/* --- ASOSIY KONTENT --- */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1400px] mx-auto h-full flex">
            
            {/* ⬅️ CHAP TOMON: RO'YXAT */}
            <div className="w-full md:w-[450px] lg:w-[480px] h-full overflow-y-auto border-r border-slate-200 bg-white custom-scrollbar pb-20">
               {isLoading && <div className="text-center p-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>}
               
               {!isLoading && vacancies.length === 0 && (
                 <div className="text-center py-20 text-slate-400">
                    <p>😞 Afsuski, hech narsa topilmadi</p>
                 </div>
               )}

               {Array.isArray(vacancies) && vacancies.map((v: any) => (
                 <div 
                   key={v.id}
                   onClick={() => handleCardClick(v.id)}
                   className={`
                     relative p-5 border-b cursor-pointer transition-all hover:bg-slate-50 group
                     ${selectedId === v.id ? "md:bg-blue-50/50 md:border-l-4 md:border-l-blue-600" : "border-slate-100 border-l-4 border-l-transparent"}
                   `}
                 >
                    <div className="absolute top-4 right-4 z-10">
                        <SaveButton vacancyId={v.id} initialSaved={v.isSaved} />
                    </div>

                    <div className="flex items-start gap-4 mb-3">
                       {/* 👇 2. LOGO RO'YXATDA (Chap tomon) */}
                       <div className="shrink-0">
                          {v.company?.logo ? (
                            <img 
                              src={`${BASE_URL}${v.company.logo}`} 
                              alt={v.company.name} 
                              className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                               {v.company?.name?.[0]?.toUpperCase() || <Building2 size={20}/>}
                            </div>
                          )}
                       </div>

                       <div className="flex-1 pr-8">
                          <h3 className={`font-bold text-lg leading-tight group-hover:underline ${selectedId === v.id ? 'md:text-blue-700' : 'text-slate-900'}`}>
                            {v.title}
                          </h3>
                          <p className="text-sm text-slate-600 font-medium mt-1">{v.company?.name}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                       {/* Badge qismlari o'zgarishsiz */}
                    </div>

                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                       <MapPin size={12}/> {v.city}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                       {(v.salaryFrom) && (
                         <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs font-bold border-0">
                            ${v.salaryFrom} {v.salaryTo ? `- ${v.salaryTo}` : "+"}
                         </Badge>
                       )}
                       <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs font-bold border-0">
                          {v.employmentType}
                       </Badge>
                       {v.isPremium && <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1 py-0"><Crown size={10} className="mr-1"/> Premium</Badge>}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                       Joylandi: {new Date(v.createdAt).toLocaleDateString()}
                    </p>
                 </div>
               ))}
               <div className="h-20"></div>
            </div>

            {/* ➡️ O'NG TOMON: BATAFSIL */}
            <div className="hidden md:block flex-1 h-full overflow-y-auto bg-white custom-scrollbar p-8">
               {selectedVacancy ? (
                 <div className="max-w-3xl mx-auto animate-in fade-in duration-300 pb-20">
                    <div className="mb-6 border-b border-slate-100 pb-6 relative">
                       <div className="absolute top-0 right-0">
                          <SaveButton vacancyId={selectedVacancy.id} initialSaved={selectedVacancy.isSaved} />
                       </div>

                       {/* 👇 3. LOGO BATAFSIL KO'RISHDA (O'ng tomon) */}
                       <div className="flex items-center gap-4 mb-4">
                          {selectedVacancy.company?.logo ? (
                            <img 
                              src={`${BASE_URL}${selectedVacancy.company.logo}`} 
                              alt={selectedVacancy.company.name} 
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-blue-200 shadow-lg">
                               {selectedVacancy.company?.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                          
                          <div>
                             <h1 className="text-2xl font-black text-slate-900">{selectedVacancy.title}</h1>
                             <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mt-1">
                                <Link href={`/companies/${selectedVacancy.company?.id}`} className="underline decoration-dotted hover:text-blue-600">
                                   {selectedVacancy.company?.name}
                                </Link>
                                <span>•</span>
                                <span>{selectedVacancy.city}</span>
                             </div>
                          </div>
                       </div>
                       
                       <Button 
                         onClick={() => handleApply(selectedVacancy.id)}
                         disabled={applyingId === selectedVacancy.id} 
                         className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl text-lg shadow-lg shadow-blue-200 transition-transform active:scale-95 min-w-[160px]"
                       >
                          {applyingId === selectedVacancy.id ? (
                             <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Yuborilmoqda...</>
                          ) : (
                             "Topshirish"
                          )}
                       </Button>

                       {!isAuth && (
                          <p className="text-xs text-slate-400 font-bold mt-2">
                            Topshirish uchun tizimga kirish kerak
                          </p>
                       )}
                    </div>
                    
                    {/* Qolgan qismlar o'zgarishsiz... */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Maosh</p>
                          <p className="text-lg font-black text-slate-800">
                            {selectedVacancy.salaryFrom ? `$${selectedVacancy.salaryFrom}` : "Kelishilgan"}
                          </p>
                       </div>
                       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Briefcase size={12}/> Bandlik</p>
                          <p className="text-lg font-black text-slate-800">{selectedVacancy.employmentType}</p>
                       </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                       <h3 className="text-lg font-bold text-slate-900 mb-3">Vakansiya haqida</h3>
                       <div className="whitespace-pre-line text-slate-600 leading-relaxed text-sm md:text-base font-medium">
                          {selectedVacancy.description}
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <Briefcase size={64} className="mb-4 opacity-10"/>
                    <p className="font-bold">Batafsil ko'rish uchun tanlang</p>
                 </div>
               )}
            </div>

        </div>
      </div>
    </div>
  );
}