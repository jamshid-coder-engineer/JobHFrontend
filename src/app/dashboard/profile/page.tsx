"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, UploadCloud, Loader2, Eye, MapPin, Briefcase, User, Phone, Download } from "lucide-react";

// API & STORE
import { $api } from "../../../shared/api/axios-instance";
import { resumeApi } from "../../../features/resume/api/resume.api";
import { useUserStore } from "../../../entities/user/model/user-store"; // 👈 Store ishlatamiz
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";

// 👇 PORTNI TO'G'IRLADIK (3026 -> 2026)
// Agar backend faylni "uploads/..." deb qaytarsa, shunchaki base url yetarli.
const BASE_URL = "http://localhost:2026/"; 

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useUserStore(); // 👈 Store dan foydalanamiz

  const [formData, setFormData] = useState({
    firstName: "",
    phone: "+998 ",
    city: "",      
    jobTitle: "", 
  });

  // 1. STOREDAN MA'LUMOT OLISH (Reaktiv)
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        phone: user.phone || "+998 ", 
        city: user.city || "",        
        jobTitle: user.jobTitle || "", 
      });
    }
  }, [user]);

  // 2. REZYUMENI OLISH
  const { data: resumeData, isLoading: isResumeLoading } = useQuery({
    queryKey: ["my-resume"],
    queryFn: () => resumeApi.getMe(),
    retry: 1,
  });

  // --- MUTATSIYALAR ---
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // Telefon raqamni tozalab yuborish (bo'sh joylarsiz)
      const payload = { ...data, phone: data.phone.replace(/\s/g, "") };
      return await $api.patch("/auth/profile", payload);
    },
    onSuccess: (res) => {
      toast.success("Profil yangilandi! ✅");
      // Storeni ham yangilaymiz
      updateUser(formData);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Xatolik yuz berdi"),
  });

  const uploadCvMutation = useMutation({
    mutationFn: (file: File) => resumeApi.uploadCv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-resume"] });
      toast.success("CV muvaffaqiyatli yuklandi! 📄");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Fayl yuklashda xatolik!"),
  });

  // 🛠 TELEFON FORMATTERI
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); 
    if (!val.startsWith("998")) val = "998" + val;

    let formatted = "+998 ";
    if (val.length > 3) formatted += val.substring(3, 5);
    if (val.length > 5) formatted += " " + val.substring(5, 8);
    if (val.length > 8) formatted += " " + val.substring(8, 10);
    if (val.length > 10) formatted += " " + val.substring(10, 12);

    setFormData({ ...formData, phone: formatted });
  };

  const handleSaveProfile = () => {
    if (!formData.firstName.trim()) return toast.error("Ism kiritilishi shart!");
    if (!formData.jobTitle.trim()) return toast.error("Mutaxassislik kiritilishi shart!");
    if (!formData.city.trim()) return toast.error("Shahar kiritilishi shart!");
    if (formData.phone.length < 17) return toast.error("Telefon raqam to'liq emas!");

    updateProfileMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") return toast.error("Faqat PDF format yuklang!");
      uploadCvMutation.mutate(file);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-20">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900">Mening Profilim</h1>
        <p className="text-slate-500 font-medium">Shaxsiy ma'lumotlar va Rezyume boshqaruvi</p>
      </div>

      {/* 1-BLOK: SHAXSIY MA'LUMOTLAR */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          <User className="text-blue-600" size={24}/> Shaxsiy ma'lumotlar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">To'liq ism (F.I.O) <span className="text-red-500">*</span></label>
            <Input 
              placeholder="Ism Familiya" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="h-12 rounded-xl bg-slate-50 font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Telefon raqam <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-slate-400" size={18}/>
              <Input 
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={17}
                className="h-12 pl-10 rounded-xl bg-slate-50 font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Mutaxassislik <span className="text-red-500">*</span></label>
            <div className="relative">
               <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18}/>
               <Input 
                placeholder="Masalan: Frontend Developer" 
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="h-12 pl-10 rounded-xl bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Shahar / Viloyat <span className="text-red-500">*</span></label>
            <div className="relative">
               <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18}/>
               <Input 
                placeholder="Masalan: Toshkent" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="h-12 pl-10 rounded-xl bg-slate-50 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSaveProfile} 
            disabled={updateProfileMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-blue-200"
          >
            {updateProfileMutation.isPending ? <Loader2 className="animate-spin mr-2"/> : null}
            {updateProfileMutation.isPending ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
          </Button>
        </div>
      </div>

      {/* 2-BLOK: CV YUKLASH */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" size={24}/> Rezyume / CV
        </h2>

        {isResumeLoading ? (
            <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>
        ) : resumeData?.cvFile ? (
           <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-2xl gap-4">
              <div className="flex items-center gap-4 w-full">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <FileText size={28}/>
                 </div>
                 <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-900 truncate">Mening_Rezyume.pdf</h3>
                    <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                        Yuklangan va faol ✅
                    </p>
                 </div>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                  {/* KO'RISH TUGMASI */}
                  <a 
                    href={`${BASE_URL}${resumeData.cvFile}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1"
                  >
                     <Button variant="outline" className="w-full rounded-xl gap-2 hover:bg-white hover:text-blue-600 border-blue-200 text-blue-700 font-bold">
                       <Download size={18}/> Yuklab olish
                     </Button>
                  </a>
                  
                  {/* YANGILASH INPUTI */}
                  <label className="flex-1 cursor-pointer">
                     <div className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 rounded-xl font-bold flex items-center justify-center transition-colors text-sm shadow-md shadow-blue-200">
                        Yangilash
                     </div>
                     <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </label>
              </div>
           </div>
        ) : (
          <label className="block border-2 border-dashed border-slate-300 rounded-2xl p-10 hover:bg-slate-50 hover:border-blue-400 transition-all group text-center cursor-pointer relative bg-slate-50/50">
             <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploadCvMutation.isPending}
             />
             <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm border border-slate-100">
                {uploadCvMutation.isPending ? <Loader2 className="animate-spin"/> : <UploadCloud size={28}/>}
             </div>
             <h3 className="text-lg font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                CV yuklash uchun bosing
             </h3>
             <p className="text-slate-400 text-sm font-medium mt-1">Faqat PDF format (max 5MB)</p>
          </label>
        )}
      </div>

    </div>
  );
}