"use client";

import { useQuery } from "@tanstack/react-query";
import { vacancyApi } from "../../../features/vacancy/api/create-vacancy.api";
import { Loader2, Heart, MapPin, DollarSign, Briefcase } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../shared/ui/badge";
import { Button } from "../../../shared/ui/button";
import { SaveButton } from "../../../features/vacancy/ui/save-button";

export default function SavedJobsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["saved-vacancies"],
    queryFn: () => vacancyApi.getSavedVacancies(),
  });

  const vacancies = data?.data || [];

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
           <Heart className="fill-red-500" size={20}/>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Tanlangan vakansiyalar ({vacancies.length})</h1>
      </div>

      {vacancies.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
           <Heart size={48} className="mx-auto text-slate-300 mb-4"/>
           <h3 className="text-lg font-bold text-slate-600">Hozircha bo'sh</h3>
           <p className="text-slate-400 mb-6">Sizga yoqqan vakansiyalarni saqlab qo'ying</p>
           <Link href="/">
             <Button variant="outline">Vakansiyalarni ko'rish</Button>
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {vacancies.map((v: any) => (
             <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group">
                
                {/* O'chirish tugmasi (SaveButton o'zi handle qiladi) */}
                <div className="absolute top-4 right-4">
                   <SaveButton vacancyId={v.id} initialSaved={true} />
                </div>

                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-lg font-bold text-slate-500 uppercase">
                      {v.company?.name?.[0]}
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{v.title}</h3>
                      <p className="text-sm text-slate-500">{v.company?.name}</p>
                   </div>
                </div>

                <div className="space-y-2 mb-6">
                   <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} className="text-slate-400"/> {v.city}
                   </div>
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <DollarSign size={16} className="text-green-500"/> {v.salaryFrom ? `$${v.salaryFrom}` : "Kelishilgan"}
                   </div>
                </div>

                <Link href={`/vacancies/${v.id}`}>
                   <Button className="w-full bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200">
                      Batafsil ko'rish
                   </Button>
                </Link>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}