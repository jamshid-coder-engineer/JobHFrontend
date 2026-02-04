"use client";

import { useQuery } from "@tanstack/react-query";
import { vacancyApi } from "../features/vacancy/api/create-vacancy.api"; // APIni chaqiramiz
import Link from "next/link";
import { Button } from "../shared/ui/button";
import { MapPin, Briefcase, Loader2, Search } from "lucide-react";
import { Badge } from "../shared/ui/badge";

export default function HomePage() {
  
  // 👇 1. MA'LUMOTLARNI OLISH (PUBLIC)
  const { data, isLoading } = useQuery({
    queryKey: ["public-vacancies"],
    queryFn: () => vacancyApi.getPublicVacancies({ limit: 6 }), // Oxirgi 6 tasini olamiz
  });

  const vacancies = data?.data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HEADER / HERO QISMI (Qidiruv) */}
      <div className="bg-white py-16 md:py-24 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            O'zingizga mos <span className="text-blue-600">ishni</span> toping
          </h1>
          <p className="text-slate-500 text-lg">
            O'zbekistondagi eng nufuzli kompaniyalardan 1000 dan ortiq vakansiyalar.
          </p>
          
          {/* Qidiruv inputlari (Dizayn uchun) */}
          <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
            <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl">
               <Search className="text-slate-400" size={20}/>
               <input placeholder="Kasb, mutaxassislik..." className="w-full bg-transparent p-3 outline-none text-slate-700 font-medium"/>
            </div>
            <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Izlash
            </Button>
          </div>
        </div>
      </div>

      {/* 👇 2. SO'NGGI E'LONLAR RO'YXATI */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-black text-slate-800">So'nggi e'lonlar</h2>
           <Link href="/vacancies" className="text-blue-600 font-bold hover:underline">
             Barchasini ko'rish &rarr;
           </Link>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && vacancies.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">Hozircha e'lonlar yo'q</h3>
            <p className="text-slate-400">Tez orada yangi vakansiyalar qo'shiladi.</p>
          </div>
        )}

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((v: any) => (
            <Link key={v.id} href={`/vacancies/${v.id}`}>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer h-full flex flex-col justify-between group">
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
                        {v.salaryFrom && v.salaryTo 
                          ? `$${v.salaryFrom} - $${v.salaryTo}` 
                          : "Kelishilgan holda"}
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
      </div>
    </div>
  );
}