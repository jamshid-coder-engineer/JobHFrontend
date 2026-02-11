import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../shared/ui/card";
import { Badge } from "../../../shared/ui/badge";
import Link from "next/link";

interface VacancyCardProps {
  id: string; 
  title: string;
  company?: { name: string };
  salaryFrom?: string;
  salaryTo?: string;
  city?: string;
}

export const VacancyCard = ({ id, title, company, salaryFrom, salaryTo, city }: VacancyCardProps) => {
  const salaryDisplay = salaryFrom || salaryTo 
    ? `${salaryFrom || 0} - ${salaryTo || '...'} USD` 
    : "Maosh kelishiladi";

  return (
    <Card className="hover:shadow-xl transition-all border-slate-200 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold text-slate-800 line-clamp-2">{title}</CardTitle>
          <Badge variant="outline" className="shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200">
            {salaryDisplay}
          </Badge>
        </div>
        <p className="text-sm font-medium text-blue-600">{company?.name || "Kompaniya"}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-slate-500">📍 {city || "Masofaviy"}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/vacancies/${id}`} className="w-full">
          <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
            Batafsil ko'rish
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
};