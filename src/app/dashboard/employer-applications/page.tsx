"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "../../../features/application/api/application.api";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { toast } from "sonner";
import { 
  Loader2, FileText, CheckCircle2, XCircle, 
  MapPin, Phone, Mail, Calendar, Briefcase 
} from "lucide-react";


const API_BASE_URL = "http://localhost:2026"; 

export default function EmployerApplicationsPage() {
  const queryClient = useQueryClient();
  
  
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACCEPTED" | "REJECTED">("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["employer-applications"],
    queryFn: () => applicationApi.getEmployerApplications(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACCEPTED" | "REJECTED" }) => 
      applicationApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-applications"] });
      toast.success("Status yangilandi!");
    },
    onError: () => toast.error("Xatolik yuz berdi")
  });

  const getFileUrl = (dbPath: string) => {
    if (!dbPath) return "#";
    if (dbPath.startsWith("http")) return dbPath;
    const fileName = dbPath.split(/[/\\]/).pop();
    return `${API_BASE_URL}/uploads/cv/${fileName}`;
  };

  if (isLoading) return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  const applications = data?.data || [];

  const filteredApps = filterStatus === "ALL" 
    ? applications 
    : applications.filter((app: any) => app.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-32">
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelgan arizalar</h1>
          <p className="text-slate-500 font-medium mt-1">
            Jami <span className="text-blue-600 font-bold">{applications.length}</span> ta ariza mavjud
          </p>
        </div>
        
        
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
           {[
             { key: "ALL", label: "Barchasi" },

             { key: "ACCEPTED", label: "Qabul qilingan" },
             { key: "REJECTED", label: "Rad etilgan" },
           ].map((tab) => (
             <button
               key={tab.key}
               onClick={() => setFilterStatus(tab.key as any)}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                 filterStatus === tab.key 
                   ? "bg-white shadow-sm text-blue-600" 
                   : "text-slate-500 hover:text-slate-700"
               }`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      
      {filteredApps.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 border-dashed">
           <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-bold text-lg">Bu bo'limda arizalar yo'q 📭</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredApps.map((app: any) => {
            const user = app.candidate || app.applicant;
            const resume = app.resume || user?.resume;
            
            const firstName = user?.firstName || "Noma'lum";
            const lastName = user?.lastName || "Nomzod";
            const fullName = `${firstName} ${lastName}`;
            
            const jobTitle = resume?.title || "Lavozim ko'rsatilmagan";
            const phone = user?.phone || "Tel yo'q";
            const email = user?.email;
            const appliedDate = new Date(app.createdAt).toLocaleDateString('uz-UZ');
            
            const isAccepted = app.status === 'ACCEPTED';
            const isRejected = app.status === 'REJECTED';

            return (
              <div 
                key={app.id} 
                className={`bg-white p-6 md:p-8 rounded-[2rem] border transition-all hover:shadow-lg group relative overflow-hidden
                  ${isRejected ? 'border-red-100 bg-red-50/10' : 
                    isAccepted ? 'border-emerald-100 bg-emerald-50/10' : 
                    'border-slate-200 shadow-sm'}
                `}
              >
                 <div className={`absolute left-0 top-0 bottom-0 w-2 
                    ${isAccepted ? 'bg-emerald-500' : isRejected ? 'bg-red-500' : 'bg-blue-500'}`} 
                 />

                <div className="flex flex-col xl:flex-row gap-8 pl-4">
                  
                  
                  <div className="flex-1 flex gap-6">
                    <div className={`hidden sm:flex w-20 h-20 rounded-3xl items-center justify-center text-2xl font-black shadow-sm flex-shrink-0
                        ${isAccepted ? 'bg-emerald-100 text-emerald-600' : isRejected ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {firstName[0]?.toUpperCase()}
                    </div>

                    <div className="space-y-3 w-full">
                      <div>
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-2xl font-bold text-slate-900">{fullName}</h3>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-0">
                            {jobTitle}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                           <Briefcase size={16} className="text-blue-500"/>
                           Vakansiya: <span className="text-slate-800">{app.vacancy?.title}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <Phone size={16} className="text-blue-500"/> <span className="font-mono font-bold">{phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <Mail size={16} className="text-purple-500"/> <span className="truncate">{email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <Calendar size={16} className="text-orange-500"/> <span>{appliedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex flex-col gap-3 min-w-[240px] border-t xl:border-t-0 xl:border-l border-slate-100 pt-6 xl:pt-0 xl:pl-8">
                    
                    <div className="flex justify-between items-center w-full mb-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HOLAT</span>
                       <Badge className={`
                          ${isAccepted ? 'bg-emerald-500' :
                            isRejected ? 'bg-red-500' :
                            'bg-blue-500'} text-white font-bold uppercase border-0`}>
                          {app.status === 'PENDING' ? 'YANGI' : app.status}
                       </Badge>
                    </div>

                    {app.resumeUrl ? (
                      <a href={getFileUrl(app.resumeUrl)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full h-11 rounded-xl font-bold border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600">
                          <FileText size={18} className="mr-2" /> CV ni ko'rish
                        </Button>
                      </a>
                    ) : (
                      <div className="w-full py-2 text-center text-xs font-bold text-amber-600 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-center gap-2">
                        <XCircle size={14}/> CV fayl yuklanmagan
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button 
                        onClick={() => statusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                        disabled={statusMutation.isPending || isAccepted}
                        className={`font-bold rounded-xl shadow-sm transition-all h-11 ${isAccepted ? 'bg-emerald-600 text-white opacity-100' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'}`}
                      >
                         {statusMutation.isPending ? <Loader2 className="animate-spin"/> : <CheckCircle2 size={18} className="mr-1"/>}
                         Qabul
                      </Button>
                      
                      <Button 
                        onClick={() => statusMutation.mutate({ id: app.id, status: 'REJECTED' })}
                        disabled={statusMutation.isPending || isRejected}
                        className={`font-bold rounded-xl shadow-sm transition-all h-11 ${isRejected ? 'bg-red-600 text-white opacity-100' : 'bg-white text-slate-600 border border-slate-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50'}`}
                      >
                         {statusMutation.isPending ? <Loader2 className="animate-spin"/> : <XCircle size={18} className="mr-1"/>}
                         Rad
                      </Button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}