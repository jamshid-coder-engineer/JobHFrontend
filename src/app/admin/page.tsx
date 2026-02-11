"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../features/admin/api/admin.api";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Building2, Briefcase, Users, CheckCircle, Badge } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getStats,
  });

  if (isLoading) return <div className="p-10 text-center">Statistika yuklanmoqda...</div>;

  const stats = data?.data?.summary;
  const leaderboard = data?.data?.leaderboard || [];

  const cards = [
    { title: "Kompaniyalar", value: stats?.totalCompanies, icon: <Building2 />, color: "text-blue-600" },
    { title: "Vakansiyalar", value: stats?.totalVacancies, icon: <Briefcase />, color: "text-purple-600" },
    { title: "Arizalar", value: stats?.totalApplications, icon: <Users />, color: "text-orange-600" },
    { title: "Ishga olindi", value: stats?.totalHired, icon: <CheckCircle />, color: "text-green-600" },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{card.title}</CardTitle>
              <div className={card.color}>{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Eng faol kompaniyalar (Top-5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((comp: any, i: number) => (
              <div key={i} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-slate-700">{comp.name}</span>
                <Badge className="bg-blue-100 text-blue-700">{comp.hired_candidates} ta ishchi olgan</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}