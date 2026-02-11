"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { vacancyApi } from "../../../features/vacancy/api/create-vacancy.api"; 
import { applicationApi } from "../../../features/application/api/application.api";
import { useUserStore } from "../../../entities/user/model/user-store";
import { 
  Loader2, MapPin, DollarSign, Briefcase, Calendar, 
  Building2, ArrowLeft, Share2, Flag, CheckCircle 
} from "lucide-react";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";


const BASE_URL = "http://localhost:2026/uploads/images/";

export default function SingleVacancyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuth } = useUserStore();
  const [applying, setApplying] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["vacancy", id],
    queryFn: () => vacancyApi.getOne(id as string),
    enabled: !!id,
  });

  const vacancy = data?.data || data;

  
  const handleApply = async () => {
    
    if (!isAuth) {
      toast.info("Ariza topshirish uchun tizimga kiring");
      return router.push("/login");
    }

    
    if (user?.role !== "CANDIDATE") {
      return toast.error("Faqat nomzodlar ariza topshira oladi 🚫");
    }

    setApplying(true);
    try {
      await applicationApi.apply({ vacancyId: id as string });
      toast.success("Ariza muvaffaqiyatli yuborildi! 🎉");
    } catch (err: any) {
      
      const msg = err.response?.data?.message;

      if (msg === "PROFILE_INCOMPLETE") {
        toast.error("Iltimos, avval rezyume yarating 📝");
        
        setTimeout(() => router.push("/dashboard/profile"), 1500);
      } else if (msg === "ALREADY_APPLIED") {
        toast.warning("Siz allaqachon bu ishga topshirgansiz ✅");
      } else {
        toast.error(msg || "Xatolik yuz berdi");
      }
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) return <div className="h-screen flex center items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>;
  if (!vacancy) return <div className="text-center py-20">Vakansiya topilmadi</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {}
        <div className="flex justify-between items-center mb-6">
           <Button variant="ghost" onClick={() => router.back()} className="hover:bg-slate-200">
             <ArrowLeft size={18} className="mr-2"/> Orqaga
           </Button>
           <div className="flex gap-2">
             <Button variant="outline" size="icon"><Share2 size={18}/></Button>
             <Button variant="outline" size="icon"><Flag size={18}/></Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {}
           <div className="lg:col-span-2 space-y-6">
              
              {}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                 
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                       {vacancy.employmentType && <Badge variant="secondary">{vacancy.employmentType}</Badge>}
                       <Badge variant="outline" className="text-slate-500 flex gap-1"><Calendar size={12}/> {new Date(vacancy.createdAt).toLocaleDateString()}</Badge>
                    </div>
                    {}
                    <div className="text-9xl font-black text-slate-50 absolute -right-4 -top-4 select-none -z-0">
                       {vacancy.title?.[0]}
                    </div>
                 </div>

                 <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 relative z-10">{vacancy.title}</h1>

                 <div className="flex flex-wrap gap-4 mb-8 relative z-10">
                    <div className="bg-green-50 px-4 py-2 rounded-xl flex items-center gap-2 text-green-700 font-bold border border-green-100">
                       <DollarSign size={20}/> 
                       {vacancy.salaryFrom ? `$${vacancy.salaryFrom} - ${vacancy.salaryTo || '...'}` : "Kelishilgan"}
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 text-slate-600 font-bold border border-slate-100">
                       <MapPin size={20} className="text-red-500"/> {vacancy.city}
                    </div>
                 </div>
              </div>

              
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Briefcase className="text-blue-600"/> Vakansiya haqida
                 </h3>
                 <div className="prose prose-slate max-w-none text-slate-600 font-medium whitespace-pre-line">
                    {vacancy.description}
                 </div>
              </div>

           </div>

           
           <div className="space-y-6">
              
              
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm text-center">
                 <div className="w-20 h-20 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 shadow-inner overflow-hidden">
                    
                    
                    {vacancy.company?.logo ? (
                      <img 
                         src={`${BASE_URL}${vacancy.company.logo}`} 
                         alt={vacancy.company.name}
                         className="w-full h-full object-cover"
                         onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <Building2 className="text-slate-400" size={32}/>
                    )}

                 </div>
                 
                 <h3 className="text-xl font-black text-slate-800 mb-1">{vacancy.company?.name}</h3>
                 <p className="text-xs text-slate-500 font-bold mb-6">Rasmiy ish beruvchi</p>

                 <Link href={`/companies/${vacancy.company?.id}`} className="block">
                    <Button variant="outline" className="w-full rounded-xl">Kompaniya profili</Button>
                 </Link>
              </div>

              
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm sticky top-6">
                 <h3 className="font-bold text-slate-800 mb-4">Qiziqdingizmi?</h3>
                 <Button 
                   onClick={handleApply} 
                   disabled={applying}
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                 >
                   {applying ? <Loader2 className="animate-spin mr-2"/> : "Ariza topshirish"}
                 </Button>
                 
                 <p className="text-xs text-center text-green-600 font-bold mt-3 flex items-center justify-center gap-1">
                    <CheckCircle size={12}/> Rezyume avtomatik yuboriladi
                 </p>
                 
                 
                 {!isAuth && (
                   <p className="text-[10px] text-center text-slate-400 mt-2">
                     Topshirish uchun tizimga kiring
                   </p>
                 )}
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}