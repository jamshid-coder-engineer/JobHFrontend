"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { $api } from "../../shared/api/axios-instance";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Loader2, Briefcase, Mail, Lock, User, CheckCircle2, ArrowLeft } from "lucide-react"; 

export default function RegisterPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<"REGISTER" | "VERIFY">("REGISTER");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "saribayevj1666@gmail.com",
    password: "123456",
    role: "CANDIDATE",
  });
  const [otp, setOtp] = useState(""); 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await $api.post("/auth/register", formData);
      setStep("VERIFY"); 
    } catch (error: any) {
      alert(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await $api.post("/auth/verify", { 
        email: formData.email, 
        code: otp 
      });
      alert("Tabriklaymiz! Hisobingiz muvaffaqiyatli tasdiqlandi. Endi kirishingiz mumkin. 🔐");
      router.push('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || "Kod noto'g'ri!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      
      {}
      <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-3 text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white drop-shadow-lg">
          <Briefcase className="w-12 h-12 text-blue-300" strokeWidth={2.5} />
          <span>Tech.Jobs</span>
        </div>
      </div>

      {}
      <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 relative overflow-hidden transition-all duration-500 p-2">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-black text-white">
            {step === "REGISTER" ? "Hisob yaratish" : "Emailni tasdiqlash"}
          </CardTitle>
          <p className="text-base text-slate-300 mt-2">
            {step === "REGISTER" 
              ? "Yangi imkoniyatlar sari qadam tashlang" 
              : "Xavfsizlik uchun pochtangizni tasdiqlang"}
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          
          {step === "REGISTER" && (
            <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-300">
              <div className="space-y-2">
                <label className="text-base font-medium text-slate-200 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                  {}
                  <Input 
                    type="email" 
                    required 
                    value={formData.email}
                    placeholder="email@example.com"
                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-14 text-lg rounded-xl"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-200 ml-1">Parol</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                  <Input 
                    type="password" 
                    required 
                    value={formData.password}
                    placeholder="******"
                    minLength={6}
                    className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-14 text-lg rounded-xl"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-200 ml-1">Rolingiz</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 h-6 w-6 text-slate-400 z-10" />
                  <select 
                    className="pl-12 flex h-14 w-full rounded-xl border border-white/10 bg-white/5 text-white px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="CANDIDATE" className="bg-slate-900 text-white">Ish qidiruvchi (Candidate)</option>
                    <option value="EMPLOYER" className="bg-slate-900 text-white">Ish beruvchi (Employer)</option>
                  </select>
                </div>
              </div>

              {}
              <Button 
                type="submit" 
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 border-0 mt-6 rounded-xl transition-all active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Yuborilmoqda...</>
                ) : (
                  "Davom etish"
                )}
              </Button>
            </form>
          )}

          {step === "VERIFY" && (
            <form onSubmit={handleVerify} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl text-center backdrop-blur-sm">
                <p className="text-base text-blue-200">
                  Biz <b className="text-white">{formData.email}</b> manziliga 6 xonali kod yubordik.
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="text-base font-medium text-slate-200 ml-1 text-center block">Tasdiqlash kodi</label>
                <Input 
                  type="text" 
                  required 
                  placeholder="123456"
                  className="text-center text-4xl tracking-[0.5em] font-bold bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-green-500/50 focus-visible:border-green-500 h-20 rounded-2xl"
                  maxLength={6}
                  autoFocus
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-500/30 border-0 rounded-xl transition-all active:scale-[0.98]" 
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Tekshirilmoqda...</>
                ) : (
                  <><CheckCircle2 className="mr-2 h-6 w-6" /> Tasdiqlash</>
                )}
              </Button>

              <button 
                type="button" 
                onClick={() => setStep("REGISTER")}
                className="w-full flex items-center justify-center gap-2 text-base text-slate-400 hover:text-white mt-4 transition-colors py-2"
              >
                <ArrowLeft size={18} /> Emailni o'zgartirish
              </button>
            </form>
          )}

          {step === "REGISTER" && (
             <div className="mt-10 text-center text-base text-slate-300">
               Profilingiz bormi? <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline-offset-4 hover:underline ml-1">Kirish</Link>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}