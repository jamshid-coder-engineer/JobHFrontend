"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "../../../features/application/api/application.api";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { toast } from "sonner";
import { 
  Loader2, FileText, CheckCircle2, XCircle, 
  MapPin, Phone, Mail, Calendar 
} from "lucide-react";

export default function EmployerApplicationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["employer-applications"],
    queryFn: () => applicationApi.getEmployerApplications(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      applicationApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-applications"] });
      toast.success("Status yangilandi!");
    },
    onError: () => toast.error("Xatolik yuz berdi")
  });

  const getFileUrl = (dbPath: string) => {
    if (!dbPath) return "#";
    const fileName = dbPath.split(/[/\\]/).pop();
    return `http://localhost:2026/uploads/cv/${fileName}`;
  };

  if (isLoading) return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
    </div>
  );

  const applications = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelgan arizalar</h1>
          <p className="text-slate-500 font-medium mt-1">
            Vakansiyalaringiz bo'yicha nomzodlarni saralang
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 text-lg px-4 py-1 rounded-lg border-0">
          JAMI: {applications.length}
        </Badge>
      </div>

      {/* RO'YXAT */}
      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
           <p className="text-slate-400 font-medium">Hozircha arizalar yo'q 📭</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app: any) => {
            const resume = app.applicant?.resume; 
            const user = app.applicant;
            
            const fullName = resume?.fullName || user?.firstName || "Noma'lum nomzod";
            const jobTitle = resume?.title || user?.jobTitle || "Lavozim ko'rsatilmagan";
            const phone = resume?.phone || user?.phone || "Tel yo'q";
            const city = resume?.city || user?.city || "Shahar yo'q";
            const email = user?.email;
            const appliedDate = new Date(app.createdAt).toLocaleDateString('uz-UZ');
            
            // Statuslar
            const isAccepted = app.status === 'ACCEPTED';
            const isRejected = app.status === 'REJECTED';

            return (
              <div 
                key={app.id} 
                className={`bg-white p-6 md:p-8 rounded-[2rem] border transition-all hover:shadow-xl group
                  ${isRejected ? 'border-red-100 bg-red-50/20' : 
                    isAccepted ? 'border-green-100 bg-green-50/20' : 
                    'border-slate-200 shadow-sm'}
                `}
              >
                <div className="flex flex-col xl:flex-row gap-8">
                  
                  {/* 1. CHAP TOMON: TO'LIQ INFO (RESTORE QILINDI ✅) */}
                  <div className="flex-1 flex gap-6">
                    {/* Avatar */}
                    <div className="hidden sm:flex w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl items-center justify-center text-3xl font-black shadow-inner flex-shrink-0">
                      {fullName[0]?.toUpperCase()}
                    </div>

                    <div className="space-y-3 w-full">
                      {/* Ism va Lavozim */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-bold text-slate-900">
                            {fullName}
                          </h3>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-0">
                            {jobTitle}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                           <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">Vakansiya:</span> 
                           {app.vacancy?.title}
                        </p>
                      </div>

                      {/* Kontaktlar Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <Phone size={16} className="text-blue-500"/> <span className="font-mono font-bold">{phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <Mail size={16} className="text-purple-500"/> <span className="truncate">{email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <MapPin size={16} className="text-red-500"/> <span>{city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
                          <Calendar size={16} className="text-orange-500"/> <span>{appliedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. O'NG TOMON: HARAKATLAR */}
                  <div className="flex flex-col gap-3 min-w-[240px] border-t xl:border-t-0 xl:border-l border-slate-100 pt-6 xl:pt-0 xl:pl-8">
                    
                    {/* Status Badge */}
                    <div className="flex justify-between items-center w-full mb-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HOLAT</span>
                       <Badge className={`
                          ${isAccepted ? 'bg-green-500' :
                            isRejected ? 'bg-red-500' :
                            'bg-blue-500'} text-white font-bold uppercase`}>
                          {app.status === 'PENDING' ? 'YANGI' : app.status}
                       </Badge>
                    </div>

                    {/* PDF Button */}
                    {resume?.cvFile ? (
                      <a href={getFileUrl(resume.cvFile)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full h-10 rounded-xl font-bold border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600">
                          <FileText size={16} className="mr-2" /> CV ni ko'rish
                        </Button>
                      </a>
                    ) : (
                      <div className="w-full py-2 text-center text-xs font-bold text-amber-600 bg-amber-50 rounded-xl border border-amber-100">
                        ⚠️ CV fayl yo'q
                      </div>
                    )}

                    {/* TOGGLE BUTTONS */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button 
                        onClick={() => statusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                        disabled={statusMutation.isPending}
                        className={`
                          font-bold rounded-xl shadow-sm transition-all
                          ${isAccepted 
                            ? 'bg-green-600 text-white hover:bg-green-700 ring-2 ring-green-200' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-green-500 hover:text-green-600 hover:bg-green-50'}
                        `}
                      >
                         {statusMutation.isPending ? <Loader2 className="animate-spin"/> : <CheckCircle2 size={18} className="mr-1"/>}
                         Qabul
                      </Button>
                      
                      <Button 
                        onClick={() => statusMutation.mutate({ id: app.id, status: 'REJECTED' })}
                        disabled={statusMutation.isPending}
                        className={`
                          font-bold rounded-xl shadow-sm transition-all
                          ${isRejected 
                            ? 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-200' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-red-500 hover:text-red-600 hover:bg-red-50'}
                        `}
                      >
                         {statusMutation.isPending ? <Loader2 className="animate-spin"/> : <XCircle size={18} className="mr-1"/>}
                         Rad
                      </Button>
                    </div>

                    <p className="text-center text-[10px] text-slate-400 font-medium">
                      Statusni istalgan vaqt o'zgartirishingiz mumkin
                    </p>

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