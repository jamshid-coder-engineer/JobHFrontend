"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../features/admin/api/admin.api";
import { Button } from "../../../shared/ui/button";
import { Badge } from "../../../shared/ui/badge";
import { toast } from "sonner";

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();

  
  const { data, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: () => adminApi.getCompanies(), 
  });

  
  const approveMutation = useMutation({
    mutationFn: adminApi.approveCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies"] });
      toast.success("Kompaniya tasdiqlandi!");
    },
  });

  if (isLoading) return <div className="p-10 text-center">Ma'lumotlar yuklanmoqda...</div>;

  const companies = data?.data || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Kompaniyalar moderatsiyasi</h2>
        <Badge variant="outline">Jami: {companies.length}</Badge>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Kompaniya nomi</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Eshik/Verifikatsiya</th>
              <th className="p-4 text-right font-semibold">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400">Kompaniyalar topilmadi.</td>
              </tr>
            ) : (
              companies.map((comp: any) => (
                <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">{comp.name}</td>
                  <td className="p-4">
                    <Badge className={
                      comp.status === 'APPROVED' ? "bg-green-100 text-green-700" : 
                      comp.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    }>
                      {comp.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {comp.isVerified ? 
                      <span className="text-blue-600 text-sm font-bold">✓ Verified</span> : 
                      <span className="text-slate-300 text-sm">Not Verified</span>
                    }
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {comp.status !== 'APPROVED' && (
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700 h-8"
                        onClick={() => approveMutation.mutate(comp.id)}
                      >
                        Tasdiqlash
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" className="h-8">
                      O'chirish
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}