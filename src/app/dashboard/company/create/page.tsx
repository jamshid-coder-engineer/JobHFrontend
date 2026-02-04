"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Building2, Loader2, Globe, MapPin } from "lucide-react";
import Link from "next/link";

// API yo'lini o'zingiznikiga moslang
import { companyApi } from "../../../../features/company/api/company.api"; 
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";

export default function CreateCompanyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: (data: any) => companyApi.createMyCompany(data),
    onSuccess: () => {
      // 1. Keshni tozalaymiz (CreateVacancy sahifasi yangi kompaniyani ko'rishi uchun)
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
      
      toast.success("Kompaniya muvaffaqiyatli yaratildi! 🎉");
      
      // 2. Endi bemalol vakansiya yaratishga qaytaramiz
      router.push("/dashboard/vacancies/create");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    }
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

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
          
          {/* Logo / Icon (Vizual bezak) */}
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="text-blue-600 w-8 h-8" />
          </div>

          {/* 1. Kompaniya Nomi */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Kompaniya nomi *</label>
            <Input 
              {...register("name", { required: "Nom kiritilishi shart" })} 
              placeholder="Masalan: 'Techno Soft' MChJ" 
              className="h-12 rounded-xl text-lg font-bold"
            />
            {errors.name && <span className="text-red-500 text-xs font-bold">{String(errors.name.message)}</span>}
          </div>

          {/* 2. Tavsif */}
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
            {/* 3. Vebsayt */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Globe size={14} /> Vebsayt (ixtiyoriy)
              </label>
              <Input 
                {...register("website")} 
                placeholder="https://company.uz" 
                className="h-12 rounded-xl"
              />
            </div>

            {/* 4. Manzil */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin size={14} /> Manzil
              </label>
              <Input 
                {...register("location")} 
                placeholder="Toshkent sh, Chilonzor..." 
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          {/* Submit Tugmasi */}
          <Button 
            disabled={createMutation.isPending} 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-xl text-lg shadow-lg mt-4"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Saqlash va davom etish"}
          </Button>

        </form>
      </div>
    </div>
  );
}