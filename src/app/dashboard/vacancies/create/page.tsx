"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Building2, AlertCircle } from "lucide-react";

// Importlarni o'zingizdagi yo'llarga qarab to'g'irlang
import { vacancyApi } from "../../../../features/vacancy/api/create-vacancy.api";
import { companyApi } from "../../../../features/company/api/company.api";
import { PremiumBanner } from "../../../../shared/ui/premium-banner";
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";

export default function CreateVacancyPage() {
  const router = useRouter();
  
  // 1. react-hook-form ni sozlaymiz
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      city: "",
      employmentType: "FULL_TIME",
      salaryFrom: "",
      salaryTo: "",
      description: ""
    }
  });

  // 2. KOMPANIYA BORLIGINI TEKSHIRISH
  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["my-company"],
    queryFn: () => companyApi.getMyCompany(),
    retry: 1,
  });

  const myCompany = Array.isArray(companyData?.data) ? companyData.data[0] : companyData?.data;

  // 3. VAKANSIYA YARATISH MUTATSIYASI
  const createMutation = useMutation({
    mutationFn: (data: any) => vacancyApi.create(data),
    onSuccess: () => {
      toast.success("Vakansiya moderatsiyaga yuborildi! ⏳ Admin tasdig'ini kuting.");
      router.push("/dashboard/vacancies");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    }
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      salaryFrom: Number(data.salaryFrom),
      salaryTo: Number(data.salaryTo),
    };
    createMutation.mutate(payload);
  };

  // --- MINUSNI BLOKLASH FUNKSIYASI ---
  const blockInvalidChars = (e: any) => {
    if (["-", "+", "e", "E"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // --- LOADING ---
  if (isCompanyLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // --- ⛔️ AGAR KOMPANIYA BO'LMASA ---
  if (!myCompany) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <PremiumBanner />
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-10 h-10 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Kompaniya mavjud emas!</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Vakansiya e'lon qilish uchun avval kompaniyangiz (yoki tashkilot) profilini yaratishingiz kerak.
            </p>
          </div>
          <Link href="/dashboard/company/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-200 gap-2">
              <Building2 size={18} /> Kompaniya yaratish
            </Button>
          </Link>
          <div className="pt-4">
             <Link href="/dashboard/vacancies" className="text-sm text-slate-400 hover:text-slate-600 font-medium">
                Ortga qaytish
             </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- ✅ FORMA ---
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      
      <PremiumBanner />

      <div className="flex items-center gap-4">
        <Link href="/dashboard/vacancies">
          <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
        </Link>
        <div>
           <h1 className="text-2xl font-black text-slate-800">Yangi vakansiya yaratish</h1>
           <p className="text-sm text-slate-500 font-bold flex items-center gap-1">
             <Building2 size={14} className="text-blue-600"/> 
             Kompaniya: <span className="text-slate-900">{myCompany.name}</span>
           </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex gap-3">
           <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
           <p className="text-sm text-blue-800 font-medium">
             Diqqat: Yangi e'lon yaratilgandan so'ng, u <b>Moderatsiya</b> holatiga o'tadi. 
             Admin tasdiqlagandan keyingina saytda ko'rinadi.
           </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Lavozim */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Lavozim nomi</label>
            <Input 
              {...register("title", { required: "Lavozim kiritilishi shart" })} 
              placeholder="Masalan: Senior Backend Developer" 
              className="h-12 rounded-xl"
            />
            {errors.title && <span className="text-red-500 text-xs font-bold">{String(errors.title.message)}</span>}
          </div>

          {/* Shahar va Bandlik */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Shahar</label>
              <Input 
                {...register("city", { required: true })} 
                placeholder="Toshkent" 
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Bandlik turi</label>
              <select 
                {...register("employmentType")} 
                className="w-full h-12 rounded-xl border border-slate-200 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="FULL_TIME">To'liq bandlik</option>
                <option value="PART_TIME">Yarim kunlik</option>
                <option value="REMOTE">Masofaviy</option>
                <option value="PROJECT">Loyiha asosida</option>
              </select>
            </div>
          </div>
          

  {/* MAOSH QISMI (YAKUNIY YECHIM 🛠) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Maosh (dan) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Maosh (dan)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">$</span>
                <Input
                  type="text" // 👈 DIQQAT: type="number" emas, "text" qilamiz (xavfsizroq)
                  placeholder="1000"
                  className="pl-8 h-12 rounded-xl"
                  inputMode="numeric" // 👈 Telefonda klaviatura raqam bo'lib ochiladi
                  {...register("salaryFrom", { 
                    required: true, 
                    onChange: (e) => {
                      // 1. Faqat raqamlarni qoldiramiz (Minus, nuqta, harf - hammasi ketadi)
                      let val = e.target.value.replace(/\D/g, '');
                      
                      // 2. Agar 0 bilan boshlansa, uni ham o'chiramiz
                      if (val.startsWith('0')) {
                        val = val.replace(/^0+/, '');
                      }
                      
                      // 3. Tozalangan qiymatni qaytarib joylaymiz
                      e.target.value = val;
                    }
                  })}
                />
              </div>
            </div>

            {/* Maosh (gacha) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Maosh (gacha)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">$</span>
                <Input
                  type="text" // 👈 Bu yerda ham "text"
                  placeholder="2000"
                  className="pl-8 h-12 rounded-xl"
                  inputMode="numeric"
                  {...register("salaryTo", { 
                    required: true, 
                    onChange: (e) => {
                       let val = e.target.value.replace(/\D/g, '');
                       if (val.startsWith('0')) val = val.replace(/^0+/, '');
                       e.target.value = val;
                    }
                  })}
                />
              </div>
            </div>
          </div>



          {/* Tavsif */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Batafsil tavsif</label>
            <textarea 
              {...register("description", { required: true })} 
              rows={6}
              placeholder="Talablar va vazifalar..." 
              className="w-full rounded-xl border border-slate-200 p-4 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <Button 
            disabled={createMutation.isPending} 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-xl text-lg shadow-lg shadow-blue-200"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Moderatsiyaga yuborish"}
          </Button>

        </form>
      </div>
    </div>
  );
}