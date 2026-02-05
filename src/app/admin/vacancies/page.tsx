"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../features/admin/api/admin.api"; 
import { Loader2, CheckCircle, XCircle, Crown, AlertCircle } from "lucide-react"; // Iconlar
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../../../shared/ui/input";

export default function AdminVacanciesPage() {
  const queryClient = useQueryClient();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [premiumDays, setPremiumDays] = useState<Record<string, number>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-vacancies"],
    queryFn: () => adminApi.getVacancies(), 
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveVacancy(id),
    onSuccess: () => {
      toast.success("Vakansiya tasdiqlandi!");
      queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      adminApi.rejectVacancy(id, reason),
    onSuccess: () => {
      toast.success("Vakansiya rad etildi");
      setRejectId(null);
      setRejectReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
    },
  });

  const premiumMutation = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => 
      adminApi.setPremium(id, days),
    onSuccess: () => {
      toast.success("Premium muvaffaqiyatli faollashdi! 👑");
      queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const handleDaysChange = (id: string, val: string) => {
    setPremiumDays(prev => ({ ...prev, [id]: Number(val) }));
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin"/></div>;

  const vacancies = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-800">Vakansiyalar moderatsiyasi ({vacancies.length})</h1>
      </div>

      <div className="space-y-4">
        {vacancies.map((v: any) => (
          <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
            
            {/* Chap tomon: Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                 <h3 className="text-xl font-bold text-slate-900">{v.title}</h3>
                 
                 {/* STATUS BADGE */}
                 <Badge className={`
                    ${v.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                      v.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}
                 `}>
                    {v.status}
                 </Badge>

                 {v.isPremium && (
                   <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1 border border-purple-200">
                      <Crown size={12} /> Premium ({new Date(v.premiumUntil).toLocaleDateString()} gacha)
                   </Badge>
                 )}
              </div>
              
              <p className="text-sm text-slate-500 font-bold flex gap-3">
                 <span>🏢 {v.company?.name}</span>
                 <span>📍 {v.city}</span>
                 <span>💰 ${v.salaryFrom} - ${v.salaryTo}</span>
              </p>
              
              {/* Agar rad etilgan bo'lsa sababini ko'rsatamiz */}
              {v.status === 'REJECTED' && v.rejectedReason && (
                 <div className="bg-red-50 p-3 rounded-lg text-sm text-red-600 flex gap-2 items-start">
                    <AlertCircle size={16} className="mt-0.5 shrink-0"/>
                    <span><b>Rad etish sababi:</b> {v.rejectedReason}</span>
                 </div>
              )}

              <p className="text-slate-600 line-clamp-2 text-sm bg-slate-50 p-3 rounded-xl">
                {v.description}
              </p>
            </div>

            {/* O'ng tomon: Actionlar (Admin Panel) */}
            <div className="flex flex-col gap-3 min-w-[320px]">
               
               {/* 1. APPROVE / REJECT TUGMALARI (LOGIKA O'ZGARDI ⚡️) */}
               <div className="flex gap-2">
                  
                  {/* Tasdiqlash tugmasi: Agar allaqachon PUBLISHED bo'lmasa chiqadi */}
                  {v.status !== 'PUBLISHED' && (
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
                      onClick={() => approveMutation.mutate(v.id)}
                    >
                       <CheckCircle size={16} className="mr-2"/> Tasdiqlash
                    </Button>
                  )}
                  
                  {/* Rad etish tugmasi: Agar allaqachon REJECTED bo'lmasa chiqadi */}
                  {v.status !== 'REJECTED' && (
                    <Button 
                      className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 shadow-sm"
                      onClick={() => setRejectId(v.id === rejectId ? null : v.id)} // Toggle qilish
                    >
                       <XCircle size={16} className="mr-2"/> Rad etish
                    </Button>
                  )}
               </div>

               {/* RAD ETISH FORM (Faqat tugma bosilganda ochiladi) */}
               {rejectId === v.id && (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                     <p className="text-xs font-bold text-red-700 mb-2">Rad etish sababini yozing:</p>
                     <textarea 
                       className="w-full p-3 text-sm rounded-lg mb-3 border-red-200 focus:ring-red-500 min-h-[80px]" 
                       placeholder="Masalan: Talablarga mos kelmaydi..."
                       value={rejectReason}
                       onChange={(e) => setRejectReason(e.target.value)}
                     />
                     <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 bg-white"
                          onClick={() => setRejectId(null)}
                        >
                          Bekor qilish
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-red-600 text-white hover:bg-red-700"
                          onClick={() => rejectMutation.mutate({ id: v.id, reason: rejectReason })}
                        >
                          Yuborish
                        </Button>
                     </div>
                  </div>
               )}

               {/* 2. PREMIUM QILISH (Har doim ko'rinadi) */}
               <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-auto">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-purple-700 flex items-center gap-1">
                        <Crown size={14}/> Premium muddati
                    </p>
                    <span className="text-[10px] text-purple-400 font-medium">Kunlar soni</span>
                  </div>
                  
                  <div className="flex gap-2">
                     <Input 
                       type="number" 
                       placeholder="7" 
                       className="h-10 bg-white w-20 text-center border-purple-200 focus:ring-purple-500"
                       min="1"
                       value={premiumDays[v.id] || ""} 
                       onChange={(e) => handleDaysChange(v.id, e.target.value)}
                     />
                     <Button 
                       className="flex-1 bg-purple-600 hover:bg-purple-700 text-white h-10 shadow-sm shadow-purple-200"
                       onClick={() => {
                          const days = premiumDays[v.id] || 7; 
                          premiumMutation.mutate({ id: v.id, days });
                       }}
                       disabled={premiumMutation.isPending}
                     >
                       {premiumMutation.isPending ? "..." : "Saqlash"}
                     </Button>
                  </div>
               </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}