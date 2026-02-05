"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../../features/admin/api/admin.api";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { Loader2, Trash2, ShieldCheck, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminsManagementPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false); // Modal ochish/yopish
  const [form, setForm] = useState({ firstName: "", email: "", password: "" });

  // 1. Adminlar ro'yxatini olish
  const { data, isLoading } = useQuery({
    queryKey: ["admins-list"],
    queryFn: () => adminApi.getAdmins(),
  });

  // 2. Yaratish
  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createAdmin(data),
    onSuccess: () => {
      toast.success("Yangi admin qo'shildi! 🚀");
      setIsOpen(false);
      setForm({ firstName: "", email: "", password: "" });
      queryClient.invalidateQueries({ queryKey: ["admins-list"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Xatolik"),
  });

  // 3. O'chirish
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteAdmin(id),
    onSuccess: () => {
      toast.success("Admin o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["admins-list"] });
    },
  });

  const admins = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-purple-600"/> Adminlar boshqaruvi
          </h1>
          <p className="text-slate-500">Yangi adminlar qo'shish va boshqarish (Faqat Super Admin)</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
           <UserPlus size={18}/> Yangi Admin
        </Button>
      </div>

      {/* RO'YXAT */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-sm">
              <tr>
                <th className="p-4">Ism</th>
                <th className="p-4">Email</th>
                <th className="p-4">Yaratilgan sana</th>
                <th className="p-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin: any) => (
                <tr key={admin.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-800">{admin.firstName}</td>
                  <td className="p-4 text-slate-600">{admin.email}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => {
                        if(confirm("Rostdan ham bu adminni o'chirmoqchimisiz?")) deleteMutation.mutate(admin.id);
                      }}
                    >
                      <Trash2 size={18}/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL (Yaratish uchun) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={24}/>
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-slate-800">Yangi Admin qo'shish</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700">Ism</label>
                <Input value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} placeholder="Admin ismi" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700">Email</label>
                <Input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@uz.job" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700">Parol</label>
                <Input value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="********" type="password" />
              </div>
              
              <Button 
                onClick={() => createMutation.mutate(form)}
                disabled={createMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 rounded-xl mt-2"
              >
                {createMutation.isPending ? "Yaratilmoqda..." : "Yaratish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}