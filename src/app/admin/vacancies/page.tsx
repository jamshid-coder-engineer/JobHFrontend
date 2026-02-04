"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../features/admin/api/admin.api"; // ⚠️ YANGI API ULANDI
import { toast } from "sonner";
import { Badge } from "../../../shared/ui/badge";
import { Button } from "../../../shared/ui/button";
import { Loader2, XCircle, CheckCircle, Crown } from "lucide-react";

export default function AdminVacanciesPage() {
  const queryClient = useQueryClient();
  const [reasons, setReasons] = useState<Record<string, string>>({});

  // 1. API dan ma'lumot olish (adminApi orqali)
  const { data, isLoading } = useQuery({
    queryKey: ["admin-vacancies"],
    queryFn: () => adminApi.getVacancies(),
  });

  // 2. Rad etish mutatsiyasi
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      adminApi.rejectVacancy(id, reason), // Funksiya nomi o'zgardi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
      toast.success("Vakansiya rad etildi");
      setReasons({});
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  // 3. Tasdiqlash mutatsiyasi
  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveVacancy(id), // Funksiya nomi o'zgardi
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
      toast.success("Vakansiya tasdiqlandi");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  // 4. Premium qilish mutatsiyasi (Qo'shimcha)
  const premiumMutation = useMutation({
    mutationFn: (id: string) => adminApi.setPremium(id, 7), // 7 kunga premium
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
      toast.success("Vakansiya Premium qilindi (7 kun)");
    },
  });

  const handleReasonChange = (id: string, text: string) => {
    setReasons(prev => ({ ...prev, [id]: text }));
  };

  const onReject = (id: string) => {
    const reason = reasons[id]?.trim();
    if (!reason) {
      toast.error("Rad etish sababini yozing!");
      return;
    }
    rejectMutation.mutate({ id, reason });
  };

  const vacancies = data?.data || data || []; // Backend formatiga qarab moslanadi

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>;

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-black text-slate-800">Vakansiyalar moderatsiyasi</h1>
            <p className="text-slate-500">Yangi qo'shilgan e'lonlarni tekshiring</p>
         </div>
         <Badge variant="outline" className="text-lg px-4 py-1">Jami: {vacancies.length}</Badge>
      </div>
      
      <div className="grid gap-6">
        {vacancies.map((v: any) => (
          <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-6 hover:shadow-md transition-all">
            
            {/* Ma'lumot qismi */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-xl text-slate-900">{v.title}</h3>
                <Badge className={`uppercase text-[10px] ${
                  v.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                  v.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {v.status}
                </Badge>
                {v.isPremium && <Badge className="bg-indigo-100 text-indigo-700"><Crown size={12} className="mr-1"/> Premium</Badge>}
              </div>
              
              <div className="flex gap-4 text-sm text-slate-500 font-bold">
                 <span>🏢 {v.company?.name || "Kompaniya yo'q"}</span>
                 <span>📍 {v.city}</span>
                 <span>💰 {v.salaryFrom} - {v.salaryTo}</span>
              </div>

              <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
                {v.description ? v.description.slice(0, 200) + "..." : "Izoh yo'q"}
              </div>
            </div>

            {/* Boshqaruv paneli */}
            <div className="flex flex-col gap-3 min-w-[320px] border-l pl-0 xl:pl-6 border-slate-100 pt-4 xl:pt-0">
               
               {/* Rad etish inputi */}
               <div className="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-3">
                  <p className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                    <XCircle size={14}/> Rad etish
                  </p>
                  <textarea 
                    className="w-full text-sm p-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none bg-white placeholder:text-red-200 text-red-700"
                    placeholder="Rad etish sababi..."
                    rows={2}
                    value={reasons[v.id] || ""}
                    onChange={(e) => handleReasonChange(v.id, e.target.value)}
                  />
                  <Button 
                    onClick={() => onReject(v.id)}
                    disabled={rejectMutation.isPending}
                    variant="destructive" 
                    className="w-full h-10 rounded-xl font-bold shadow-red-100 shadow-lg"
                  >
                    {rejectMutation.isPending ? "..." : "Rad etish"}
                  </Button>
               </div>

               {/* Tasdiqlash va Premium tugmalari */}
               <div className="flex gap-2">
                 {v.status !== 'PUBLISHED' && (
                   <Button 
                     onClick={() => approveMutation.mutate(v.id)}
                     disabled={approveMutation.isPending}
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-green-100"
                   >
                     <CheckCircle size={18} className="mr-2"/> Tasdiqlash
                   </Button>
                 )}
                 
                 {/* Agar tasdiqlangan bo'lsa Premium tugmasini ko'rsatish mumkin */}
                 {v.status === 'PUBLISHED' && !v.isPremium && (
                    <Button 
                      onClick={() => premiumMutation.mutate(v.id)}
                      disabled={premiumMutation.isPending}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-100"
                    >
                      <Crown size={18} className="mr-2"/> Premium (7 kun)
                    </Button>
                 )}
               </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}