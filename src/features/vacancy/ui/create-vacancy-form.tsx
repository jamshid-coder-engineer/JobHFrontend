"use client";

import { useState } from "react";
import { vacancyApi } from "../api/create-vacancy.api"; 
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateVacancyForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    salaryFrom: "",
    salaryTo: "",
    employmentType: "FULL_TIME",
  });

  // Haqiqiy yuborish funksiyasi
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit bosildi! Ma'lumotlar:", formData);
    
    setLoading(true);
    try {
      await vacancyApi.create(formData);
      toast.success("Vakansiya yaratildi!");
      router.push("/"); 
    } catch (error: any) {
      console.error("Xato:", error.response?.data);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-black mb-6">Yangi vakansiya</h2>

      <button 
        type="button"
        onClick={() => alert("Tugma mexanik jihatdan ishlayapti! Muammo onSubmit mantiqida.")}
        className="mb-4 w-full bg-red-500 text-white p-2 rounded"
      >
        DIAGNOSTIKA TUGMASI (Buni bosing)
      </button>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          placeholder="Vakansiya nomi"
          className="w-full p-2 border rounded text-black"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        
        <textarea
          placeholder="Tavsif"
          className="w-full p-2 border rounded text-black"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Maoshdan"
            className="w-1/2 p-2 border rounded text-black"
            onChange={(e) => setFormData({...formData, salaryFrom: e.target.value})}
          />
          <input
            type="number"
            placeholder="Maoshgacha"
            className="w-1/2 p-2 border rounded text-black"
            onChange={(e) => setFormData({...formData, salaryTo: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Yuborilmoqda..." : "E'lonni tasdiqlash"}
        </button>
      </form>
    </div>
  );
};