"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { companyApi } from "../../../features/company/api/company.api"; 
import { Loader2, MapPin, Globe, Building2, ArrowLeft, Briefcase, Calendar } from "lucide-react";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import Link from "next/link";
import { SaveButton } from "../../../features/vacancy/ui/save-button"; 


const BASE_URL = "http://localhost:2026/uploads/images/";

export default function CompanyPublicPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["company-public", id],
    queryFn: () => companyApi.getOnePublic(id as string),
    enabled: !!id,
  });

  const company = data?.data || data;

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>;
  }

  if (!company) {
    return <div className="text-center py-20">Kompaniya topilmadi</div>;
  }

  const firstLetter = company.name?.charAt(0).toUpperCase() || "C";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {}
        <Button variant="ghost" onClick={() => router.back()} className="hover:bg-transparent hover:text-blue-600 pl-0">
           <ArrowLeft className="mr-2 h-4 w-4"/> Orqaga qaytish
        </Button>

        {}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
           
           <div className="flex flex-col md:flex-row items-start gap-6">
              
              {}
              <div className="shrink-0">
                 {company.logo ? (
                    <img 
                      
                      src={`${BASE_URL}${company.logo}`} 
                      alt={company.name} 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-slate-100 shadow-inner"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                 ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-lg shadow-blue-200">
                       {firstLetter}
                    </div>
                 )}
              </div>

              
              <div className="flex-1 space-y-4 pt-2">
                 <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{company.name}</h1>
                    <div className="flex flex-wrap gap-4 text-slate-500 font-medium text-sm">
                       {company.location && (
                          <span className="flex items-center gap-1"><MapPin size={16}/> {company.location}</span>
                       )}
                       {company.website && (
                          <a href={company.website} target="_blank" className="flex items-center gap-1 hover:text-blue-600 hover:underline">
                             <Globe size={16}/> Veb-sayt
                          </a>
                       )}
                       <span className="flex items-center gap-1"><Building2 size={16}/> IT Kompaniya</span>
                    </div>
                 </div>

                 {company.description && (
                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                       {company.description}
                    </p>
                 )}
              </div>
           </div>
        </div>

        
        <div className="space-y-4">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="text-blue-600"/>
              Ochiq Vakansiyalar <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">{company.vacancies?.length || 0}</Badge>
           </h2>

           {(!company.vacancies || company.vacancies.length === 0) ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                 <Briefcase size={48} className="mx-auto text-slate-300 mb-4"/>
                 <p className="text-slate-500 font-medium">Hozircha ochiq vakansiyalar yo'q</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {company.vacancies.map((v: any) => (
                    <Link href={`/vacancies/${v.id}`} key={v.id}>
                       <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300 group relative">
                          
                          <div className="absolute top-4 right-4 z-10">
                              <SaveButton vacancyId={v.id} />
                          </div>

                          <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                                {v.title}
                             </h3>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                             <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                {v.employmentType}
                             </Badge>
                             {v.salaryFrom && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700">
                                   ${v.salaryFrom}
                                </Badge>
                             )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-2 border-t border-slate-50">
                             <span className="flex items-center gap-1"><MapPin size={12}/> {v.city}</span>
                             <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(v.createdAt).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
           )}
        </div>

      </div>
    </div>
  );
}