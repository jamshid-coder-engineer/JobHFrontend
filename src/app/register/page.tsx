"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { $api } from "../../shared/api/axios-instance";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "CANDIDATE", // DTO dagi Roles.CANDIDATE ga mos
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Bekentingizdagi endpointni tekshiring (odatda /auth/register)
      await $api.post("/auth/register", formData);
      alert("Ro'yxatdan o'tdingiz! Endi login orqali kiring.");
      router.push("/login");
    } catch (error: any) {
      console.error("Xatolik:", error.response?.data);
      alert(error.response?.data?.message || "Ro'yxatdan o'tishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-slate-800">
            Hisob yaratish
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <Input 
                type="email" 
                required 
                placeholder="cand1@test.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Parol (kamida 6 ta belgi)</label>
              <Input 
                type="password" 
                required 
                placeholder="******"
                minLength={6}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Sizning rolingiz</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="CANDIDATE">Ish qidiruvchi (Candidate)</option>
                <option value="EMPLOYER">Ish beruvchi (Employer)</option>
              </select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg" 
              disabled={loading}
            >
              {loading ? "Jarayon..." : "Ro'yxatdan o'tish"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-500">
            Profilingiz bormi? <Link href="/login" className="text-blue-600 font-bold hover:underline">Kirish</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}