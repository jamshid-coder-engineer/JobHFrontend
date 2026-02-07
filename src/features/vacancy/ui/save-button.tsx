"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../entities/user/model/user-store"; // Yo'lni tekshiring
import { vacancyApi } from "../api/create-vacancy.api"; 
import { Button } from "../../../shared/ui/button";

interface SaveButtonProps {
  vacancyId: string;
  initialSaved?: boolean; 
}

export const SaveButton = ({ vacancyId, initialSaved = false }: SaveButtonProps) => {
  const { user, isAuth } = useUserStore();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    // 🛑 Muhim: Card bosilib ketmasligi uchun hodisani to'xtatamiz
    e.stopPropagation(); 
    e.preventDefault();

    if (!isAuth) {
      toast.info("Saqlash uchun tizimga kiring");
      // Agar login sahifasi boshqa joyda bo'lsa, to'g'irlang
      router.push("/login"); 
      return;
    }

    if (user?.role !== "CANDIDATE") {
      toast.error("Faqat nomzodlar ishni saqlay oladi");
      return;
    }

    setLoading(true);
    const previousState = isSaved;
    setIsSaved(!isSaved); // Optimistik UI (darhol o'zgartiramiz)

    try {
      await vacancyApi.toggleSave(vacancyId);
      // Agar muvaffaqiyatli bo'lsa, backend o'zi hal qiladi
    } catch (err) {
      setIsSaved(previousState); // Xato bo'lsa qaytaramiz
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`rounded-full hover:bg-slate-100 transition-all z-20 ${loading ? "opacity-50" : ""}`}
    >
      <Heart 
        size={24} 
        className={`transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-slate-600"}`} 
      />
    </Button>
  );
};