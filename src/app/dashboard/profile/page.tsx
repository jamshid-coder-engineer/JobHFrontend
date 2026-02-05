"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { $api } from "../../../shared/api/axios-instance";
import { resumeApi } from "../../../features/resume/api/resume.api";
import { toast } from "sonner";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { FileText, UploadCloud, Loader2, Eye, MapPin, Briefcase, User, Phone } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "+998 ", // Default boshlanishi
    city: "",      
    jobTitle: "", 
  });

  // 1. USER MA'LUMOTLARINI OLISH
  useEffect(() => {
    const storage = localStorage.getItem("user-storage");
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        const user = parsed.state?.user;
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            // Agar bazada telefon bo'lsa o'shani, yo'qsa +998 ni qo'yamiz
            phone: user.phone || "+998 ", 
            city: user.city || "",        
            jobTitle: user.jobTitle || "", 
          });
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  // 2. REZYUMENI OLISH
  const { data: resumeData } = useQuery({
    queryKey: ["my-resume"],
    queryFn: () => resumeApi.getMe(),
    retry: false,
  });

  // --- MUTATSIYALAR ---
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => await $api.patch("/auth/profile", data),
    onSuccess: (res) => {
      toast.success("Profil yangilandi! ✅");
      const storage = localStorage.getItem("user-storage");
      if (storage) {
        const parsed = JSON.parse(storage);
        parsed.state.user = { ...parsed.state.user, ...formData };
        localStorage.setItem("user-storage", JSON.stringify(parsed));
      }
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const uploadCvMutation = useMutation({
    mutationFn: (file: File) => resumeApi.uploadCv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-resume"] });
      toast.success("CV yuklandi! 📄");
    },
    onError: () => toast.error("Fayl yuklashda xatolik!"),
  });

  // 🛠 1. TELEFON RAQAM FORMATTERI (Mask)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Faqat raqamlarni qoldiramiz
    val = val.replace(/\D/g, ""); 

    // Agar +998 o'chib ketsa, qaytarib qo'yamiz
    if (!val.startsWith("998")) {
      val = "998" + val;
    }

    // Formatlash: 998 90 123 45 67
    let formatted = "+998 ";
    if (val.length > 3) formatted += val.substring(3, 5);
    if (val.length > 5) formatted += " " + val.substring(5, 8);
    if (val.length > 8) formatted += " " + val.substring(8, 10);
    if (val.length > 10) formatted += " " + val.substring(10, 12);

    // Maksimal uzunlikdan oshmasin
    setFormData({ ...formData, phone: formatted });
  };

  // 🛠 2. VALIDATSIYA VA SAQLASH
  const handleSaveProfile = () => {
    // A) Bo'sh joylarni tekshirish
    if (!formData.firstName.trim()) return toast.error("Ism kiritilishi shart!");
    if (!formData.jobTitle.trim()) return toast.error("Mutaxassislik kiritilishi shart!");
    if (!formData.city.trim()) return toast.error("Shahar kiritilishi shart!");
    
    // B) Telefon raqam uzunligini tekshirish (+998 90 123 45 67 -> 17 ta belgi)
    if (formData.phone.length < 17) {
      return toast.error("Telefon raqam to'liq emas!");
    }

    updateProfileMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Faqat PDF formatidagi fayl yuklang!");
        return;
      }
      uploadCvMutation.mutate(file);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-20">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900">Mening Profilim</h1>
        <p className="text-slate-500">Shaxsiy ma'lumotlaringizni boshqaring</p>
      </div>

      {/* 1-BLOK: ASOSIY MA'LUMOTLAR */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
          <User className="text-blue-600" size={20}/> Shaxsiy ma'lumotlar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Ism */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">To'liq ism (F.I.O) <span className="text-red-500">*</span></label>
            <Input 
              placeholder="Ism Familiya" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
            />
          </div>

          {/* Telefon (Mask qo'shildi) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Telefon raqam <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-slate-400" size={18}/>
              <Input 
                type="tel"
                placeholder="+998 90 123 45 67" 
                value={formData.phone}
                onChange={handlePhoneChange} // 👈 Yangi funksiya ulandi
                maxLength={17} // Cheklov
                className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Mutaxassislik */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Mutaxassislik <span className="text-red-500">*</span></label>
            <div className="relative">
               <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18}/>
               <Input 
                placeholder="Masalan: Frontend Developer" 
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Shahar */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Shahar / Viloyat <span className="text-red-500">*</span></label>
            <div className="relative">
               <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18}/>
               <Input 
                placeholder="Masalan: Toshkent" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="h-12 pl-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
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
            {updateProfileMutation.isPending ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
          </Button>
        </div>
      </div>

      {/* 2-BLOK: CV YUKLASH (Eskisi qolaveradi) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" size={20}/> Rezyume / CV
        </h2>

        {resumeData?.cvFile ? (
           <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <FileText size={24}/>
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800">Mening_CV.pdf</h3>
                    <p className="text-xs text-green-600 font-bold">Yuklangan va faol ✅</p>
                 </div>
              </div>
              
              <div className="flex gap-2">
                  <a href={`http://localhost:3026/${resumeData.cvFile}`} target="_blank" rel="noreferrer">
                     <Button variant="ghost" size="icon" className="hover:bg-white rounded-xl text-slate-500">
                       <Eye size={20}/>
                     </Button>
                  </a>
                  <label>
                     <div className="bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 h-10 px-4 rounded-xl font-bold flex items-center cursor-pointer transition-colors text-sm">
                        Yangilash
                     </div>
                     <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </label>
              </div>
           </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-slate-50 transition-all group text-center cursor-pointer relative">
             <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
                disabled={uploadCvMutation.isPending}
             />
             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                {uploadCvMutation.isPending ? <Loader2 className="animate-spin"/> : <UploadCloud size={24}/>}
             </div>
             <h3 className="font-bold text-slate-700">CV yuklash uchun bosing</h3>
             <p className="text-slate-400 text-sm">Faqat PDF format (max 5MB)</p>
          </div>
        )}
      </div>

    </div>
  );
}