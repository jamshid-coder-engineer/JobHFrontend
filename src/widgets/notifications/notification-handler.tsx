"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { socketService } from "../../shared/lib/socket.service"; 
import { useRouter } from "next/navigation";

export const NotificationHandler = () => {
  const router = useRouter();

  useEffect(() => {
    let intervalId: any = null;

    const getTokenFromZustand = () => {
      try {
        
        const storage = localStorage.getItem("user-storage");
        if (!storage) return null;

        
        const parsedData = JSON.parse(storage);
        return parsedData.state?.accessToken || null;
      } catch (e) {
        return null;
      }
    };

    const init = () => {
      
      const rawToken = getTokenFromZustand(); 

      if (!rawToken) {
        
        return false;
      }

      const socket = socketService.getSocket() ?? socketService.connect(rawToken);
      if (!socket) return false;

      
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

    
    init();

    
    intervalId = setInterval(() => {
      const connected = init();
      if (connected) {
        clearInterval(intervalId); 
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