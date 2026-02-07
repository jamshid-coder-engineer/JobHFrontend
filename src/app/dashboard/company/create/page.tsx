"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Globe, MapPin, Camera, Upload } from "lucide-react";
import Link from "next/link";

// API
import { companyApi } from "../../../../features/company/api/company.api"; 
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";

export default function CreateCompanyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Rasm uchun state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 2-BOSQICH: LOGO YUKLASH MUTATSIYASI
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      // Backenddagi Controller FileInterceptor('file') deb kutyapti
      formData.append('file', file); 
      return companyApi.uploadLogo(formData);
    },
    onSuccess: () => {
      // Ikkala ish ham bitdi!
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
      toast.success("Kompaniya va logotip muvaffaqiyatli yaratildi! 🎉");
      router.push("/dashboard/vacancies/create");
    },
    onError: () => {
      // Kompaniya yaratildi, lekin logo o'xshamadi
      toast.warning("Kompaniya yaratildi, lekin logotipni yuklashda xatolik bo'ldi.");
      router.push("/dashboard/vacancies/create");
    }
  });

  // 1-BOSQICH: KOMPANIYA MA'LUMOTLARINI YARATISH
  const createMutation = useMutation({
    mutationFn: (data: any) => companyApi.createMyCompany(data),
    onSuccess: () => {
      // ✅ Kompaniya yaratildi. Endi rasm bormi tekshiramiz.
      if (selectedFile) {
        // Rasm bor ekan -> 2-bosqichni boshlaymiz
        uploadLogoMutation.mutate(selectedFile);
      } else {
        // Rasm yo'q ekan -> Tugatamiz
        queryClient.invalidateQueries({ queryKey: ["my-company"] });
        toast.success("Kompaniya muvaffaqiyatli yaratildi! 🎉");
        router.push("/dashboard/vacancies/create");
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    }
  });

  const onSubmit = (data: any) => {
    // Faqat ma'lumotlarni yuboramiz (1-bosqich)
    createMutation.mutate(data);
  };

  // Ikkalasidan biri ishlayotgan bo'lsa ham loading ko'rsatamiz
  const isLoading = createMutation.isPending || uploadLogoMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/vacancies">
          <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
        </Link>
        <div>
           <h1 className="text-2xl font-black text-slate-800">Kompaniya profilini yaratish</h1>
           <p className="text-slate-500 font-medium">E'lon berishdan oldin kompaniyangizni taniting</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* LOGO YUKLASH QISMI */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="relative group cursor-pointer w-28 h-28 rounded-3xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 flex items-center justify-center overflow-hidden transition-all"
            >
               {logoPreview ? (
                 <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
               ) : (
                 <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                    <Camera size={32} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase">Logo</span>
                 </div>
               )}

               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="text-white" size={24} />
               </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              accept="image/*"
              onChange={handleLogoChange}
            />
            
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Logotip yuklash uchun bosing (ixtiyoriy)
            </p>
          </div>

          {/* INPUTLAR (O'zgarishsiz) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Kompaniya nomi *</label>
            <Input 
              {...register("name", { required: "Nom kiritilishi shart" })} 
              placeholder="Masalan: 'Techno Soft' MChJ" 
              className="h-12 rounded-xl text-lg font-bold"
            />
            {errors.name && <span className="text-red-500 text-xs font-bold">{String(errors.name.message)}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Kompaniya haqida qisqacha</label>
            <textarea 
              {...register("description")} 
              rows={4}
              placeholder="Bizning kompaniya 2010-yildan beri..." 
              className="w-full rounded-xl border border-slate-200 p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium text-slate-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Globe size={14} /> Vebsayt (ixtiyoriy)
              </label>
              <Input {...register("website")} placeholder="https://company.uz" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin size={14} /> Manzil
              </label>
              <Input {...register("location")} placeholder="Toshkent sh, Chilonzor..." className="h-12 rounded-xl" />
            </div>
          </div>

          {/* Submit Tugmasi */}
          <Button 
            disabled={isLoading} 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-xl text-lg shadow-lg mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Saqlash va davom etish"}
          </Button>

        </form>
      </div>
    </div>
  );
}