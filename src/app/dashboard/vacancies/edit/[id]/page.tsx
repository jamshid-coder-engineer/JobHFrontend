"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { vacancyApi } from "../../../../../features/vacancy/api/create-vacancy.api";
import { Button } from "../../../../../shared/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditVacancyPage() {
  const { id } = useParams(); // URL-dan ID-ni olamiz
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 1. Mavjud ma'lumotlarni yuklab olish
  const { data: vacancyData, isLoading } = useQuery({
    queryKey: ["vacancy", id],
    queryFn: () => vacancyApi.findOne(id as string), // API-da findOne bo'lishi kerak
  });

  // Ma'lumot kelishi bilan formani to'ldiramiz
  useEffect(() => {
    if (vacancyData?.data) {
      reset(vacancyData.data);
    }
  }, [vacancyData, reset]);

  // 2. O'zgarishlarni saqlash (Patch)
  const mutation = useMutation({
    mutationFn: (data: any) => vacancyApi.updateVacancy(id as string, data),
    onSuccess: () => {
      toast.success("O'zgarishlar saqlandi!");
      queryClient.invalidateQueries({ queryKey: ["my-vacancies"] });
      router.push("/dashboard/vacancies");
    },
    onError: () => {
      toast.error("Saqlashda xatolik yuz berdi.");
    }
  });
const onSubmit = (data: any) => {
  // Backend faqat mana shu maydonlarni qabul qiladi
  const updateDto: any = {
    title: data.title,
    description: data.description,
    city: data.city || "Toshkent",
    // DTO string kutyapti, shuning uchun .toString() qilamiz
    salaryFrom: data.salaryFrom ? data.salaryFrom.toString() : undefined,
    salaryTo: data.salaryTo ? data.salaryTo.toString() : undefined,
    // Agar employmentType bo'lsa yuboramiz
    employmentType: data.employmentType || undefined,
    isActive: data.isActive === undefined ? true : Boolean(data.isActive),
  };

  // Faqat qiymati bor maydonlarni yuboramiz (undefined bo'lganlarini o'chirib tashlaymiz)
  Object.keys(updateDto).forEach(key => 
    updateDto[key] === undefined && delete updateDto[key]
  );

  mutation.mutate(updateDto);
};4
  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/vacancies" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2">
        <ArrowLeft size={16} /> Ortga qaytish
      </Link>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-6">Vakansiyani tahrirlash</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Vakansiya nomi</label>
            <input 
              {...register("title", { required: true })}
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tavsif</label>
            <textarea 
              {...register("description", { required: true })}
              rows={5}
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Maoshdan</label>
              <input {...register("salaryFrom")} type="number" className="w-full p-4 rounded-2xl border border-slate-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Maoshgacha</label>
              <input {...register("salaryTo")} type="number" className="w-full p-4 rounded-2xl border border-slate-200 outline-none" />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl transition-all"
          >
            {mutation.isPending ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
          </Button>
        </form>
      </div>
    </div>
  );
}