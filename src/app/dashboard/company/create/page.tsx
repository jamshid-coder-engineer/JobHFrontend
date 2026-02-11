"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Search, Building2, AlertCircle, UploadCloud, Image as ImageIcon, ArrowRight, X } from "lucide-react";


import { companyApi } from "../../../../features/company/api/company.api";
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";

export default function CreateCompanyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  
  const [step, setStep] = useState<'inn' | 'logo'>('inn');
  
  
  const [inn, setInn] = useState("");

  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  
  const createByInnMutation = useMutation({
    mutationFn: (innValue: string) => companyApi.createByInn(innValue),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
      const companyName = res.data?.data?.name || "Kompaniya";
      toast.success(`${companyName} muvaffaqiyatli ro'yxatdan o'tdi! 🎉`);

      setStep('logo');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Xatolik yuz berdi";
      toast.error(msg);
    }
  });

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyApi.uploadLogo(file), // API da bu metod bo'lishi kerak
    onSuccess: () => {
      toast.success("Logo muvaffaqiyatli yuklandi! 🎨");
      finishProcess();
    },
    onError: (err: any) => {
      toast.error("Logo yuklashda xatolik bo'ldi, lekin kompaniya yaratilgan.");
      finishProcess(); // Xato bo'lsa ham o'tkazib yuboramiz (skip)
    }
  });

  const finishProcess = () => {
    queryClient.invalidateQueries({ queryKey: ["my-company"] });
    router.push("/dashboard/vacancies/create");
  };

  const handleInnSubmit = () => {
    if (inn.length !== 9) {
      toast.warning("STIR (INN) 9 xonali son bo'lishi kerak!");
      return;
    }
    createByInnMutation.mutate(inn);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      if (file.size > 2 * 1024 * 1024) {
        toast.warning("Rasm hajmi 2MB dan oshmasligi kerak");
        return;
      }
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoUpload = () => {
    if (!logoFile) return;
    uploadLogoMutation.mutate(logoFile);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8">
        
        
        <div className="text-center space-y-2">
           <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              {step === 'inn' ? <Building2 size={32} /> : <ImageIcon size={32} />}
           </div>
           <h1 className="text-3xl font-black text-slate-800">
             {step === 'inn' ? "Kompaniyangizni ro'yxatdan o'tkazing" : "Kompaniya Logotipi"}
           </h1>
           <p className="text-slate-500 font-medium">
             {step === 'inn' 
               ? "Davlat reyestridagi ma'lumotlarni avtomatik yuklash" 
               : "Brendingiz tanilishi uchun logotip yuklang"}
           </p>
        </div>

        
        {step === 'inn' && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in duration-300">
             <label className="text-sm font-bold text-slate-700 mb-2 block">
                Tashkilot STIR (INN) raqami
             </label>
             <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                   <Input 
                     placeholder="Masalan: 300000001" 
                     value={inn}
                     onChange={(e) => setInn(e.target.value.replace(/\D/g, "").slice(0, 9))}
                     className="h-14 pl-12 text-lg font-bold tracking-widest bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                   />
                </div>
             </div>

             <Button 
               onClick={handleInnSubmit} 
               disabled={createByInnMutation.isPending || inn.length !== 9}
               className="w-full h-14 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
             >
               {createByInnMutation.isPending ? <Loader2 className="animate-spin mr-2"/> : "Qidirish va Yaratish"}
             </Button>

             
             <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2">
                <p className="font-bold text-slate-600 flex items-center gap-2"><AlertCircle size={14}/> Test INN:</p>
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-blue-600 font-bold">300000001</div>
                   <div className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-blue-600 font-bold">300000002</div>
                </div>
             </div>
          </div>
        )}

        
        {step === 'logo' && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 animate-in slide-in-from-right duration-300">
            
            <div className="flex flex-col items-center justify-center w-full mb-6">
              <label 
                htmlFor="dropzone-file" 
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all 
                  ${previewUrl ? 'border-blue-300 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full p-4 flex items-center justify-center group">
                    <img src={previewUrl} alt="Preview" className="max-h-full object-contain rounded-lg shadow-sm" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                       <p className="text-white font-bold flex items-center gap-2"><UploadCloud/> O'zgartirish</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                    <UploadCloud className="w-12 h-12 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm font-bold">Yuklash uchun bosing</p>
                    <p className="text-xs">PNG, JPG (MAX. 2MB)</p>
                  </div>
                )}
                <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <div className="flex gap-3">
               <Button 
                 variant="outline"
                 onClick={finishProcess} 
                 className="flex-1 h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-600"
               >
                 O'tkazib yuborish
               </Button>
               
               <Button 
                 onClick={handleLogoUpload} 
                 disabled={!logoFile || uploadLogoMutation.isPending}
                 className="flex-[2] h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
               >
                 {uploadLogoMutation.isPending ? <Loader2 className="animate-spin mr-2"/> : "Saqlash va Davom etish"}
                 {!uploadLogoMutation.isPending && <ArrowRight size={18} className="ml-2"/>}
               </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}