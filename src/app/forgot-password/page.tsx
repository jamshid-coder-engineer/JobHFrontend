"use client";

import { useState } from "react";
import Link from "next/link";
import { $api } from "../../shared/api/axios-instance"; // Yo'lni to'g'irlang
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await $api.post("/auth/forgot-password", { email });
      setSent(true); // Muvaffaqiyatli yuborildi oynasiga o'tamiz
    } catch (error: any) {
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      
      <Card className="w-full max-w-md border-0 shadow-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-white">
            {sent ? "Emailni tekshiring" : "Parolni tiklash"}
          </CardTitle>
          <p className="text-sm text-slate-300">
            {sent 
              ? `Biz ${email} manziliga tiklash linkini yubordik.` 
              : "Emailingizni kiriting, biz sizga link yuboramiz."}
          </p>
        </CardHeader>
        
        <CardContent className="pt-6">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <Input 
                    type="email" 
                    required 
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 h-12"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 border-0 mt-2" 
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Link yuborish"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                  <Mail size={32} />
               </div>
               <p className="text-slate-300 text-sm">
                 Spam papkani ham tekshirishni unutmang.
               </p>
               <Button 
                 variant="outline"
                 onClick={() => setSent(false)}
                 className="w-full border-white/20 hover:bg-white/50"
               >
                 Qaytadan yuborish
               </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft size={16} /> Login sahifasiga qaytish
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}