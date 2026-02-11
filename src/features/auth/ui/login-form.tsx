"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { useUserStore } from "../../../entities/user/model/user-store";
import { loginUser } from "../api/login-api";
import { Input } from "../../../shared/ui/input";
import { Button } from "../../../shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Loader2 } from "lucide-react"; 

export const LoginForm = () => {
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
      
      
      setAuth(res.data.user);
      
      setTimeout(() => {
        if (res.data.user.role === "ADMIN" || res.data.user.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 100);

    } catch (error) {
      console.error("Login Error:", error);
      alert("Email yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 p-2">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-3xl font-black text-white tracking-tight">
          Tizimga kirish
        </CardTitle>
        <p className="text-base text-slate-300 mt-2">
          Sahifangizga kirish uchun ma'lumotlarni kiriting
        </p>
      </CardHeader>
      
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-base font-medium text-slate-200 ml-1">Email</label>
            <Input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="email@example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-14 text-lg px-4 rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
             <label className="text-base font-medium text-slate-200 ml-1">Parol</label>
            
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="******"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-14 text-lg tracking-widest px-4 rounded-xl"
            />
            
            <div className="flex justify-end pt-1">
                <Link href="/forgot-password" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Unutdingizmi?
                </Link>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 border-0 mt-4 rounded-xl transition-all active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Kirilmoqda...</>
            ) : (
              "Kirish"
            )}
          </Button>
        </form>

        <div className="mt-10 text-center text-base text-slate-300">
          Sahifangiz yo'qmi? <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline-offset-4 hover:underline ml-1">Ro'yxatdan o'tish</Link>
        </div>
      </CardContent>
    </Card>
  );
};