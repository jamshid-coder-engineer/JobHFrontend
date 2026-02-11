"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { $api } from "../../shared/api/axios-instance";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Token topilmadi!");
    
    setLoading(true);
    try {
      await $api.post("/auth/reset-password", { token, newPassword: password });
      setSuccess(true);
      
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || "Xatolik! Link eskirgan bo'lishi mumkin.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-white text-center p-4 bg-white/10 rounded-xl backdrop-blur-md">
        <p>Noto'g'ri link. Iltimos, emailingizdagi linkni qaytadan tekshiring.</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-white">
          {success ? "Parol yangilandi! 🎉" : "Yangi parol o'rnatish"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200 ml-1">Yangi parolingiz</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  type="password" 
                  required 
                  minLength={6}
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 border-0 mt-2" 
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Saqlash"}
            </Button>
          </form>
        ) : (
            <div className="text-center py-6 animate-in fade-in zoom-in">
              <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
              <p className="text-slate-300">
                Hozir sizni Login sahifasiga yo'naltiramiz...
              </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      <Suspense fallback={<div className="text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Yuklanmoqda...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
