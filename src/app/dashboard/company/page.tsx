"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Building2, MapPin, Loader2, UploadCloud, 
  Save, AlertCircle, CheckCircle 
} from "lucide-react";

import { companyApi } from "../../../features/company/api/company.api";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { CompanyLogo } from "../../../shared/ui/company-logo"; 

export default function CompanySettingsPage() {
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
  });

  
  const { data, isLoading } = useQuery({
    queryKey: ["my-company"],
    queryFn: () => companyApi.getMyCompany(),
  });

  const company = data?.data; 

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        location: company.location || "",
        description: company.description || "",
      });
    }
  }, [company]);

  
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyApi.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-company"] }); 
      queryClient.invalidateQueries({ queryKey: ["my-company-check"] });
      toast.success("Logotip yangilandi! 🎨");
    },
    onError: () => toast.error("Rasm yuklashda xatolik bo'ldi"),
  });

  
  const updateInfoMutation = useMutation({
    mutationFn: (data: any) => companyApi.updateMyCompany(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
      toast.success("Ma'lumotlar saqlandi! ✅");
    },
    onError: () => toast.error("Saqlashda xatolik bo'ldi"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning("Rasm hajmi 2MB dan oshmasligi kerak");
        return;
      }
      uploadLogoMutation.mutate(file); 
    }
  };

  if (isLoading) return <div className="flex h-[50vh] w-full items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10"/></div>;

  if (!company) {
    return <div className="text-center p-10 font-bold text-slate-500">Kompaniya ma'lumotlari topilmadi.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 pb-32">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Kompaniya Kabineti</h1>
        <p className="text-slate-500 font-medium">Logotip va ma'lumotlarni shu yerdan o'zgartirishingiz mumkin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative group cursor-pointer inline-block">
                 <CompanyLogo 
                   logo={company.logo} 
                   name={company.name} 
                   size="xl" 
                   className="w-32 h-32 text-4xl shadow-lg mb-4 ring-4 ring-slate-50 mx-auto"
                 />
                 <label className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                    <UploadCloud size={24} />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Yangilash</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                 </label>
                 {uploadLogoMutation.isPending && (
                   <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center z-10">
                      <Loader2 className="animate-spin text-blue-600" />
                   </div>
                 )}
              </div>

              <h2 className="text-xl font-bold text-slate-800 mt-2">{company.name}</h2>
              <p className="text-sm text-slate-400 font-medium mb-4">INN: {company.inn}</p>

              <div className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 
                ${company.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                {company.status === 'APPROVED' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                {company.status === 'APPROVED' ? "Tasdiqlangan" : "Moderatsiyada"}
              </div>
           </div>
        </div>

        
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 pb-4 border-b border-slate-100">
                <Building2 className="text-blue-600" size={20}/> Asosiy ma'lumotlar
              </h3>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Kompaniya nomi</label>
                 <Input 
                   value={form.name} 
                   onChange={(e) => setForm({...form, name: e.target.value})}
                   className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Manzil</label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                    <Input 
                      value={form.location} 
                      onChange={(e) => setForm({...form, location: e.target.value})}
                      className="h-12 pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Kompaniya haqida</label>
                 <textarea 
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    rows={5}
                    placeholder="Bizning kompaniya haqida qisqacha..."
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all font-medium text-slate-700 text-sm"
                 />
              </div>

              <div className="pt-4 flex justify-end">
                 <Button 
                   onClick={() => updateInfoMutation.mutate(form)}
                   disabled={updateInfoMutation.isPending}
                   className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-blue-200"
                 >
                   {updateInfoMutation.isPending ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2" size={18}/>}
                   O'zgarishlarni saqlash
                 </Button>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}