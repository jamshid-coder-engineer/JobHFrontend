"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, History } from "lucide-react";
import { Button } from "../shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import { vacancyApi } from "../features/vacancy/api/create-vacancy.api";
import Link from "next/link";
import { Badge } from "../shared/ui/badge";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function HomePage() {
  
  // STATE
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  
  // Dropdownlarni boshqarish uchun
  const [isJobFocused, setIsJobFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);

  // DEBOUNCE
  const debouncedQuery = useDebounce(query, 300);
  const debouncedCity = useDebounce(city, 300); // Shahar uchun ham tezroq

  // 1. KASB TAKLIFLARI (Suggestions)
  const { data: jobSuggestions = [] } = useQuery({
    queryKey: ["autocomplete-job", debouncedQuery],
    queryFn: () => vacancyApi.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });

  // 2. SHAHAR TAKLIFLARI (City Suggestions) - ✅ YANGI
  const { data: citySuggestions = [] } = useQuery({
    queryKey: ["autocomplete-city", debouncedCity],
    queryFn: () => vacancyApi.getCitySuggestions(debouncedCity),
    enabled: debouncedCity.length > 1,
  });

  // 3. ASOSIY NATIJALAR (Vakansiyalar)
  const { data, isLoading } = useQuery({
    queryKey: ["home-vacancies", debouncedQuery, debouncedCity],
    queryFn: () => vacancyApi.getPublicVacancies({ 
      q: debouncedQuery,     
      city: debouncedCity,   
      limit: 9               
    }),
    placeholderData: (previousData) => previousData, 
  });

  const vacancies = data?.data || [];
  
  // Tashqariga bossa dropdownlar yopilishi uchun
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsJobFocused(false);
        setIsCityFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-slate-50 py-20 px-4 border-b border-slate-100">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          <h1 className="text-2xl md:text-4xl font-black text-slate-500 leading-tight">
            <span className="text-cyan-500">UZ.JOB</span> biz zumda <span className="text-blue-600">NATIJA</span>ga erishing
          </h1>

          {/* 🔍 SEARCH BAR (IKKITA GIBRID) */}
          <div ref={wrapperRef} className="relative z-50 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
             
             {/* 1. KASB INPUT (Dropdown bilan) */}
             <div className="flex-1 relative">
                <div className="flex items-center h-full">
                    <Search className="absolute left-4 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Kasb (masalan: Flutter)" 
                      className="w-full h-14 pl-12 pr-4 rounded-xl outline-none text-slate-700 font-medium placeholder:font-normal"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => { setIsJobFocused(true); setIsCityFocused(false); }} 
                      autoComplete="off"
                    />
                </div>

                {/* KASB DROPDOWN */}
                {isJobFocused && query.length > 1 && jobSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-2 z-50">
                    <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Kasblar</p>
                    {jobSuggestions.map((item: string, index: number) => (
                      <div 
                        key={index}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors text-slate-700 font-medium"
                        onClick={() => {
                          setQuery(item); 
                          setIsJobFocused(false); 
                        }}
                      >
                        <History size={16} className="text-slate-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                )}
             </div>

             <div className="hidden md:block w-[1px] h-8 bg-slate-200 self-center"></div>

             {/* 2. SHAHAR INPUT (Dropdown bilan) - ✅ YANGI */}
             <div className="flex-1 relative">
                <div className="flex items-center h-full">
                    <MapPin className="absolute left-4 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Shahar (masalan: Toshkent)" 
                      className="w-full h-14 pl-12 pr-4 rounded-xl outline-none text-slate-700 font-medium placeholder:font-normal"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onFocus={() => { setIsCityFocused(true); setIsJobFocused(false); }}
                      autoComplete="off"
                    />
                </div>

                {/* SHAHAR DROPDOWN */}
                {isCityFocused && city.length > 1 && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-2 z-50">
                    <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Shaharlar</p>
                    {citySuggestions.map((item: string, index: number) => (
                      <div 
                        key={index}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors text-slate-700 font-medium"
                        onClick={() => {
                          setCity(item); 
                          setIsCityFocused(false); 
                        }}
                      >
                        <MapPin size={16} className="text-slate-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {/* BUTTON */}
             <Button className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-200">
               Izlash
             </Button>
          </div>

          {/* <div className="text-sm text-slate-400 font-medium pt-2">
             Topildi: {vacancies.length} ta vakansiya
          </div> */}

        </div>
      </div>

      {/* --- ASOSIY NATIJALAR (PASTKI QISM) --- */}
      <div className="max-w-6xl mx-auto py-16 px-4">
         
         {/* LOADING STATE */}
         {isLoading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
            </div>
         ) : vacancies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {vacancies.map((v: any) => (
                  <Link href={`/vacancies/${v.id}`} key={v.id} className="group">
                     <div className={`
                       bg-white p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg h-full flex flex-col
                       ${v.isPremium ? 'border-purple-200 shadow-purple-100' : 'border-slate-100 shadow-sm'}
                     `}>
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400 uppercase text-lg">
                              {v.company?.name?.[0] || "C"}
                           </div>
                           {v.isPremium && (
                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Premium</Badge>
                           )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                           {v.title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium mb-4">
                           {v.company?.name} • {v.city}
                        </p>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-auto">
                           <span className="font-bold text-slate-700">
                              ${v.salaryFrom} - ${v.salaryTo}
                           </span>
                           <span className="text-xs text-slate-400">
                              {new Date(v.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
               <p className="text-xl font-bold text-slate-400">😥 Afsuski, hech narsa topilmadi</p>
            </div>
         )}
      </div>

    </div>
  );
}