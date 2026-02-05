"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Link qo'shildi (Ro'yxatdan o'tishga yo'naltirish uchun)
import { useUserStore } from "../../../entities/user/model/user-store";
import { loginUser } from "../api/login-api";
import { Input } from "../../../shared/ui/input";
import { Button } from "../../../shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Loader2 } from "lucide-react"; // Loading ikonkasi

export const LoginForm = () => {
  // Test uchun default qiymatlar
  const [email, setEmail] = useState("saribayevj1666@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  
  const setAuth = useUserStore((state) => state.setAuth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      
      // Mantiq o'z joyida qoldi
      setAuth(res.data.user, res.data.accessToken);
      console.log("Login muvaffaqiyatli:", res.data.user.role);

      setTimeout(() => {
        if (res.data.user.role === "ADMIN" || res.data.user.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 100);

    } catch (error) {
      console.error("Login Error:", error);
      // Bu yerda chiroyli Toast ishlatsangiz yanada yaxshi bo'ladi
      alert("Email yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 3. FORMA KARTASI: Glassmorphism (Oyna effekti)
    <Card className="w-full max-w-md border-0 shadow-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-bold text-white">
          Tizimga kirish
        </CardTitle>
        <p className="text-sm text-slate-300">
          Hisobingizga kirish uchun ma'lumotlarni kiriting
        </p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200 ml-1">Email</label>
            <Input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="email@example.com"
              // Input stili o'zgardi (shaffof fon)
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 text-lg"
            />
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-200 ml-1">Parol</label>
                <Link href="/forgot-password" className="text-sm text-blue-300 hover:text-blue-200 text-xs">Unutdingizmi?</Link>
             </div>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="******"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12 text-lg tracking-widest"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 border-0 mt-4 transition-all active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Kirilmoqda...</>
            ) : (
              "Kirish"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-300">
          Hisobingiz yo'qmi? <Link href="/register" className="text-blue-300 font-bold hover:text-blue-200 transition-colors underline-offset-4 hover:underline">Ro'yxatdan o'tish</Link>
        </div>
      </CardContent>
    </Card>
  );
};