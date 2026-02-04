"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, Loader2 } from "lucide-react";
import { companyApi } from "../../../../features/company/api/company.api";
import { useUserStore } from "../../../../entities/user/model/user-store";
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";

export default function CompanySetupPage() {
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: "", description: "", website: "", location: "" }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => companyApi.createMyCompany(data),
    onSuccess: (res: any) => {
      updateUser({ company: res.data, companyId: res.data.id });
      toast.success("Kompaniya profili yaratildi!");
      router.push("/dashboard/vacancies/create");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Kompaniya yarating</h1>
        </div>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
          <Input {...register("name", { required: true })} placeholder="Kompaniya nomi" className="h-14 rounded-2xl" />
          <Input {...register("location")} placeholder="Manzil (Toshkent, O'zbekiston)" className="h-14 rounded-2xl" />
          <Input {...register("website")} placeholder="Veb-sayt (https://...)" className="h-14 rounded-2xl" />
          <textarea {...register("description")} placeholder="Kompaniya haqida..." className="w-full p-4 border rounded-2xl h-32 outline-none focus:ring-2 focus:ring-blue-500" />
          <Button disabled={mutation.isPending} className="w-full h-16 bg-blue-600 rounded-2xl font-bold text-lg">
            {mutation.isPending ? <Loader2 className="animate-spin" /> : "Saqlash va davom etish"}
          </Button>
        </form>
      </div>
    </div>
  );
}