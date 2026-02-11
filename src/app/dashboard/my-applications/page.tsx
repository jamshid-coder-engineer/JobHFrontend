"use client";

import { useEffect, useState } from "react";
import { applicationApi } from "../../../features/application/api/application.api";
import { Badge } from "../../../shared/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationApi.getMyApplications();
        
        setApplications(response.data || []);
      } catch (error) {
        toast.error("Arizalarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-700 border-blue-200";
      case "REVIEW": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "ACCEPTED": return "bg-green-100 text-green-700 border-green-200";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold mb-8 text-slate-800">Mening arizalarim</h1>

      {applications.length === 0 ? (
        <div className="text-center p-20 border-2 border-dashed rounded-2xl bg-slate-50">
          <p className="text-slate-500 mb-4">Siz hali birorta vakansiyaga ariza topshirmagansiz.</p>
          <Link href="/">
            <button className="text-blue-600 font-semibold hover:underline">Vakansiyalarni ko'rish</button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app: any) => (
            <div key={app.id} className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-slate-800">{app.vacancy?.title}</h3>
                <p className="text-sm text-slate-500">{app.vacancy?.company?.name || "Kompaniya nomi"}</p>
                <p className="text-xs text-slate-400">Topshirilgan sana: {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                  {app.status}
                </Badge>
                <Link href={`/vacancies/${app.vacancy?.id}`}>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Batafsil</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}