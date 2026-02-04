"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "../../../features/application/api/application.api";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { toast } from "sonner";
import { Loader2, FileText, CheckCircle, XCircle } from "lucide-react";

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
    onError: () => {
      toast.error("Xatolik yuz berdi");
    }
  });

  // URL to'g'irlovchi
  const getFileUrl = (dbPath: string) => {
    if (!dbPath) return "#";
    const fileName = dbPath.split(/[/\\]/).pop();
    return `http://localhost:2026/uploads/cv/${fileName}`;
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  const applications = data?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Kelgan arizalar</h1>
          <p className="text-slate-500 font-medium">Vakansiyalaringizga topshirilgan nomzodlar ro'yxati</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-sm font-bold border-slate-300">
          JAMI: {applications.length}
        </Badge>
      </div>

      <div className="grid gap-4">
        {applications.map((app: any) => {
          // ⚠️ DIQQAT: Rezyume endi 'applicant' ichida
          const resume = app.applicant?.resume; 
          const applicant = app.applicant;

          return (
            <div key={app.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* CHAP TOMON: NOMZOD VA PDF */}
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{app.vacancy?.title}</h3>
                  <p className="text-slate-500 font-medium text-sm">
                    Nomzod: <span className="text-slate-800 font-bold">
                      {/* Ismni rezyumedan yoki Userdan olamiz */}
                      {resume?.fullName || applicant?.fullName || applicant?.email || "Nomzod"}
                    </span>
                  </p>
                  {/* Shahar va Title */}
                  {resume && (
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {resume.title} • {resume.city}
                    </p>
                  )}
                </div>

                {/* PDF TUGMASI */}
                {resume?.cvFile ? (
                  <a 
                    href={getFileUrl(resume.cvFile)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold gap-2 shadow-lg shadow-slate-200">
                      <FileText size={18} /> Rezyumeni PDFda ochish
                    </Button>
                  </a>
                ) : (
                  <span className="text-amber-500 text-xs font-bold bg-amber-50 px-3 py-1 rounded-lg flex items-center gap-1 w-fit">
                    ⚠️ PDF rezyume yuklanmagan
                  </span>
                )}
              </div>

              {/* O'NG TOMON: STATUS VA TUGMALAR */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <Badge className={`uppercase font-bold px-3 py-1 rounded-lg ${
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                      'bg-blue-100 text-blue-700 hover:bg-blue-100'
                    }`}>
                      {app.status}
                  </Badge>
                </div>

                <div className="flex gap-2 pl-4 border-l border-slate-100">
                  <Button 
                    onClick={() => statusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                    disabled={statusMutation.isPending}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl px-4 shadow-lg shadow-green-100"
                  >
                    <CheckCircle size={18} className="mr-2" /> Accept
                  </Button>
                  <Button 
                    onClick={() => statusMutation.mutate({ id: app.id, status: 'REJECTED' })}
                    disabled={statusMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl px-4 shadow-lg shadow-red-100"
                  >
                     <XCircle size={18} className="mr-2" /> Reject
                  </Button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}