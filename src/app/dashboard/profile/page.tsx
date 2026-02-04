"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resumeApi } from "../../../features/resume/api/resume.api";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { useUserStore } from "../../../entities/user/model/user-store"; // UserStoreni olamiz

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const { register, handleSubmit, reset } = useForm();
  
  // 🛠 User store funksiyasini olamiz
  const { updateUser } = useUserStore();

  const loadProfile = async () => {
    try {
      const response = await resumeApi.getMe();
      if (response?.data) {
        setResumeData(response.data);
        reset(response.data);
        
        // Agar ma'lumot bo'lsa, storeni ham yangilab qo'yamiz
        updateUser({ hasResume: true }); 
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error("Profilni yuklashda xatolik");
      }
    }
  };

  useEffect(() => { loadProfile(); }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (resumeData) {
        await resumeApi.update(data);
        toast.success("Ma'lumotlar saqlandi! ✅");
      } else {
        await resumeApi.create(data);
        toast.success("Profil yaratildi! 🎉");
      }
      
      // 🛠 MUHIM: Ma'lumot saqlangach, storeni "True" qilamiz
      updateUser({ hasResume: true });
      loadProfile();
    } catch (err: any) {
      const message = err.response?.data?.message || "Xatolik yuz berdi";
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("PDF yuklanmoqda...");
    try {
      await resumeApi.uploadCv(file);
      toast.success("PDF muvaffaqiyatli yuklandi!", { id: toastId });
      
      // 🛠 PDF yuklangach ham "True" qilamiz
      updateUser({ hasResume: true });
      loadProfile();
    } catch (err) {
      toast.error("Fayl yuklashda xatolik yuz berdi", { id: toastId });
    }
  };

  const getFileUrl = (path: string) => {
    if (!path) return "";
    return `http://localhost:2026/${path}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-sm border mt-10">
      <h1 className="text-2xl font-bold mb-8 text-slate-900 font-mono uppercase tracking-tight">Mening Profilim</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">To'liq ism (F.I.O)</label>
            <Input {...register("fullName")} placeholder="Masalan: Jamshid ..." className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Mutaxassislik</label>
            <Input {...register("title")} placeholder="Masalan: Senior React Developer" className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Shahar</label>
            <Input {...register("city")} className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Telefon</label>
            <Input {...register("phone")} className="rounded-xl border-slate-200" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Ko'nikmalar</label>
          <Input {...register("skills")} placeholder="React, Next.js, Node.js" className="rounded-xl border-slate-200" />
        </div>

        <Button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-10 h-12 transition-all">
          {loading ? "Saqlanmoqda..." : "Ma'lumotlarni saqlash"}
        </Button>
      </form>

      <div className="mt-10 pt-10 border-t border-slate-100">
        <h3 className="text-lg font-bold mb-4 text-slate-800">Rezyume yuklash (PDF)</h3>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <input type="file" id="cv" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          <label htmlFor="cv" className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl cursor-pointer hover:bg-blue-600 hover:text-white transition-all font-bold shadow-sm">
            {resumeData?.cvFile ? "Faylni yangilash" : "PDF tanlash"}
          </label>

          {resumeData?.cvFile && (
            <a 
              href={getFileUrl(resumeData.cvFile)} 
              target="_blank" 
              className="text-blue-600 hover:text-blue-800 font-bold underline decoration-2 underline-offset-4"
            >
              Yuklangan PDFni ko'rish
            </a>
          )}
        </div>
      </div>
    </div>
  );
}