"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resumeApi } from "../../../../features/resume/api/resume.api";
import { useUserStore } from "../../../../entities/user/model/user-store"; 
import { Input } from "../../../../shared/ui/input";
import { Button } from "../../../../shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/ui/card";
import { toast } from "sonner"; 

export default function CreateResumePage() {
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    about: "",
    city: "",
    phone: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resumeApi.create(formData);
      
      
      updateUser({ hasResume: true }); 
      
      toast.success("Rezyume muvaffaqiyatli saqlandi! ✅");
      
      
      router.back(); 
    } catch (error: any) {
      console.error("Xatolik tafsiloti:", error.response?.data);
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-blue-600 rounded-[2rem]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-black text-slate-900">Profilingizni to'ldiring</CardTitle>
          <p className="text-sm text-slate-500 font-medium">Bu ma'lumotlar ish beruvchilarga ko'rinadi</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">To'liq ismingiz</label>
                <Input 
                  className="h-12 rounded-xl border-slate-200"
                  placeholder="Jamshid Saribayev" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Mutaxassislik (Title)</label>
                <Input 
                  className="h-12 rounded-xl border-slate-200"
                  placeholder="Frontend Developer" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
            </div>

            {}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">O'zingiz haqingizda (About)</label>
              <textarea 
                className="flex min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tajribangiz va maqsadlaringiz haqida batafsilroq yozing..."
                value={formData.about}
                onChange={(e) => setFormData({...formData, about: e.target.value})}
              />
            </div>

            <div className="pt-6 flex gap-3">
              <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => router.back()}>
                Bekor qilish
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold text-white shadow-lg shadow-blue-100" disabled={loading}>
                {loading ? "Saqlanmoqda..." : "Rezyumeni saqlash"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}