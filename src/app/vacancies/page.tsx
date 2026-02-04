"use client";

import { useQuery } from "@tanstack/react-query";
import { vacancyApi } from "../../features/vacancy/api/create-vacancy.api";
import Link from "next/link";
import { MapPin, Briefcase, Loader2, Search, ArrowLeft } from "lucide-react";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { Input } from "../../shared/ui/input";
import { useState } from "react";

export default function AllVacanciesPage() {
  const [search, setSearch] = useState("");
  
  // Backenddan barcha PUBLISHED vakansiyalarni olamiz
  const { data, isLoading } = useQuery({
    queryKey: ["public-vacancies", search],
    queryFn: () => vacancyApi.getPublicVacancies({ q: search }),
  });

  const vacancies = data?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header qismi */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
             <Link href="/">
               <Button variant="ghost" size="icon"><ArrowLeft/></Button>
             </Link>
             <h1 className="text-3xl font-black text-slate-900">Barcha vakansiyalar</h1>
           </div>
           
           {/* Qidiruv */}
           <div className="relative w-full md:w-96">
             <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
             <Input 
               placeholder="Kasb yoki kompaniya nomi..." 
               className="pl-10 h-12 rounded-xl border-slate-200 bg-white"
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10"/>
          </div>
        )}

        {/* Ro'yxat */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isLoading && vacancies.map((v: any) => (
            <Link key={v.id} href={`/vacancies/${v.id}`}>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer h-full flex flex-col justify-between group">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-600 text-xl">
                        {v.company?.name?.[0] || "C"}
                      </div>
                      {v.isPremium && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Premium</Badge>}
                   </div>
                   
                   <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                     {v.title}
                   </h3>
                   <p className="text-slate-500 font-medium text-sm mt-1 mb-4">{v.company?.name}</p>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <MapPin size={16}/> {v.city}
                   </div>
                   <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">
                        ${v.salaryFrom} - ${v.salaryTo}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Agar bo'sh bo'lsa */}
        {!isLoading && vacancies.length === 0 && (
            <div className="text-center py-20">
                <p className="text-slate-400 font-medium">Vakansiyalar topilmadi</p>
            </div>
        )}

      </div>
    </div>
  );
}