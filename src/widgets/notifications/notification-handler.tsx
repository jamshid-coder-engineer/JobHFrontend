"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { socketService } from "../../shared/lib/socket.service"; // Yo'lni tekshiring
import { useRouter } from "next/navigation";

export const NotificationHandler = () => {
  const router = useRouter();

  useEffect(() => {
    let intervalId: any = null;

    const getTokenFromZustand = () => {
      try {
        // 1. Zustand saqlagan 'user-storage' ni olamiz
        const storage = localStorage.getItem("user-storage");
        if (!storage) return null;

        // 2. JSON parse qilib ichidan tokeni olamiz
        const parsedData = JSON.parse(storage);
        return parsedData.state?.accessToken || null;
      } catch (e) {
        return null;
      }
    };

    const init = () => {
      // ⚠️ O'ZGARISH: Oddiy 'accessToken' emas, Zustanddan olamiz
      const rawToken = getTokenFromZustand(); 

      if (!rawToken) {
        // Token yo'q bo'lsa tinchgina qaytamiz (console.log kerak emas, spam bo'ladi)
        return false;
      }

      const socket = socketService.getSocket() ?? socketService.connect(rawToken);
      if (!socket) return false;

      // Agar ulanib bo'lgan bo'lsa qayta ulamaymiz
      if (socket.connected) return true;

      socket.off("application_update");
      
      socket.on("application_update", (data: any) => {
        console.log("XABAR KELDI:", data);
        const isAccepted = data.status === "ACCEPTED";
        toast.success(isAccepted ? "Tabriklaymiz! 🎉" : "Ariza holati yangilandi", {
          description: `"${data.vacancy}" uchun status: ${data.status}`,
          action: {
            label: "Ko'rish",
            onClick: () => router.push("/dashboard/employer-applications"),
          },
        });
      });

      return true;
    };

    // 1) Boshlanishida bir marta urinamiz
    init();

    // 2) Agar token hali yo'q bo'lsa (login qilayotgan payt), har 2 sekundda tekshiramiz (0.5s juda tez)
    intervalId = setInterval(() => {
      const connected = init();
      if (connected) {
        clearInterval(intervalId); // Ulangandan keyin to'xtatamiz
      }
    }, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
      const socket = socketService.getSocket();
      if (socket) {
        socket.off("application_update");
      }
    };
  }, [router]);

  return null;
};