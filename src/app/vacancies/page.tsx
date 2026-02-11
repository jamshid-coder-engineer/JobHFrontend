"use client";

import { useState, useEffect, Suspense } from "react"; 
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, Loader2, Search, ArrowLeft, 
   DollarSign, Filter, Briefcase, Crown 
} from "lucide-react";

import { vacancyApi } from "../../features/vacancy/api/create-vacancy.api"; 
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Input } from "../../shared/ui/input";

function VacanciesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const vacancies = data?.data || [];

  useEffect(() => {
    if (vacancies.length > 0 && !selectedId) {
      setSelectedId(vacancies[0].id);
    }
  }, [vacancies]); 

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/vacancies?${params.toString()}`, { scroll: false });
  };

  const selectedVacancy = vacancies.find((v: any) => v.id === selectedId);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      
      {/* HEADER FILTERS */}
      <div className="bg-white border-b border-slate-200 z-20 px-4 py-3 shadow-sm">
        <div className="max-w-[1400px] mx-auto w-full space-y-3">
          
          <div className="flex gap-3 items-center">
             <Link href="/">
               <Button variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-slate-100">
                 <ArrowLeft size={20}/>
               </Button>
             </Link>
             
             <div className="flex-1 flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                  <Input 
                    placeholder="Lavozim, kompaniya..." 
                    className="pl-10 h-10 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500"
                    value={filters.q}
                    onChange={(e) => updateFilter("q", e.target.value)}
                  />
                </div>
                <div className="relative md:w-1/3 hidden md:block">
                  <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18}/>
                  <Input 
                    placeholder="Shahar..." 
                    className="pl-10 h-10 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500"
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 h-10 px-6 font-bold shadow-md shadow-blue-200">
                  Izlash
                </Button>
             </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
             <div className="flex items-center gap-1 text-slate-500 text-sm font-bold mr-2">
                <Filter size={14}/> Filtrlar:
             </div>
             
             <select 
               className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
               value={filters.date}
               onChange={(e) => updateFilter("date", e.target.value)}
             >
               <option value="">🗓 Sana: Barchasi</option>
               <option value="1d">So'nggi 24 soat</option>
               <option value="3d">So'nggi 3 kun</option>
               <option value="7d">So'nggi hafta</option>
             </select>

             <select 
               className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
               value={filters.type}
               onChange={(e) => updateFilter("type", e.target.value)}
             >
               <option value="">💼 Turi: Barchasi</option>
               <option value="FULL_TIME">To'liq bandlik</option>
               <option value="PART_TIME">Yarim kunlik</option>
               <option value="REMOTE">Masofaviy</option>
               <option value="PROJECT">Loyiha</option>
             </select>

             <select 
               className="bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
               value={filters.minSalary}
               onChange={(e) => updateFilter("minSalary", e.target.value)}
             >
               <option value="">💰 Maosh: Barchasi</option>
               <option value="500">$500 dan yuqori</option>
               <option value="1000">$1,000 dan yuqori</option>
               <option value="2000">$2,000 dan yuqori</option>
             </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1400px] mx-auto h-full flex">
            
            <div className="w-full md:w-[450px] lg:w-[480px] h-full overflow-y-auto border-r border-slate-200 bg-white custom-scrollbar">
               {isLoading && <div className="text-center p-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>}
               
               {!isLoading && vacancies.length === 0 && (
                 <div className="text-center py-20 text-slate-400">
                    <p>Hech narsa topilmadi</p>
                 </div>
               )}

               {vacancies.map((v: any) => (
                 <div 
                   key={v.id}
                   onClick={() => setSelectedId(v.id)}
                   className={`
                     p-5 border-b cursor-pointer transition-all hover:bg-slate-50
                     ${selectedId === v.id ? "bg-blue-50/50 border-l-4 border-l-blue-600" : "border-slate-100 border-l-4 border-l-transparent"}
                   `}
                 >
                    <div className="flex justify-between items-start mb-1">
                       <h3 className={`font-bold text-lg leading-tight ${selectedId === v.id ? 'text-blue-700' : 'text-slate-900'}`}>
                         {v.title}
                       </h3>
                       {v.isPremium && <Crown size={14} className="text-amber-500 shrink-0 mt-1"/>}
                    </div>
                    
                    <p className="text-sm text-slate-600 font-medium mb-2">{v.company?.name}</p>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                       <MapPin size={12}/> {v.city}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                       {(v.salaryFrom || v.salaryTo) && (
                         <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs font-bold border-0">
                            ${v.salaryFrom} {v.salaryTo ? `- ${v.salaryTo}` : "+"}
                         </Badge>
                       )}
                       <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs font-bold border-0">
                          {v.employmentType}
                       </Badge>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-medium mt-2">
                       Joylandi: {new Date(v.publishedAt || v.createdAt).toLocaleDateString()}
                    </p>
                 </div>
               ))}
               
               <div className="h-20"></div>
            </div>

            <div className="hidden md:block flex-1 h-full overflow-y-auto bg-white custom-scrollbar p-8">
               {selectedVacancy ? (
                 <div className="max-w-3xl mx-auto animate-in fade-in duration-300 pb-20">
                    
                    <div className="mb-6">
                       <h1 className="text-2xl font-black text-slate-900 mb-2">{selectedVacancy.title}</h1>
                       <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-4">
                          <Link href={`/companies/${selectedVacancy.company?.id}`} className="underline decoration-dotted hover:text-blue-600">
                             {selectedVacancy.company?.name}
                          </Link>
                          <span>•</span>
                          <span>{selectedVacancy.city}</span>
                       </div>
                       
                       <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl text-lg shadow-lg shadow-blue-200 w-fit">
                          Topshirish
                       </Button>
                    </div>

                    <div className="h-px bg-slate-100 w-full mb-6"></div>

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
                       <div className="whitespace-pre-line text-slate-600 leading-relaxed text-sm md:text-base">
                          {selectedVacancy.description}
                       </div>
                    </div>

                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300">
                    <Briefcase size={64} className="mb-4 opacity-10"/>
                    <p className="font-bold">Batafsil ko'rish uchun vakansiyani tanlang</p>
                 </div>
               )}
            </div>

        </div>
      </div>
    </div>
  );
}


export default function AllVacanciesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>}>
      <VacanciesContent />
    </Suspense>
  );
}