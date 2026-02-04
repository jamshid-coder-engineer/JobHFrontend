"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../entities/user/model/user-store";
import { loginUser } from "../api/login-api";
import { Input } from "../../../shared/ui/input";
import { Button } from "../../../shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card";

export const LoginForm = () => {
  // Test uchun default qiymatlar o'rnatildi
  const [email, setEmail] = useState("emp1@t.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  
  const setAuth = useUserStore((state) => state.setAuth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      
      setAuth(res.data.user, res.data.accessToken);

      console.log("Login muvaffaqiyatli, yo'naltirilmoqda...", res.data.user.role);

      setTimeout(() => {
        if (res.data.user.role === "ADMIN" || res.data.user.role === "SUPER_ADMIN") {
          router.push("/admin/dashboard");
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
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Tizimga kirish</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Parol" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};