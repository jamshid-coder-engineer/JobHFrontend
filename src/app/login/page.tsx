import { LoginForm } from "../../features/auth/ui/login-form";
import { Briefcase } from "lucide-react"; // Ikonka uchun (agar o'rnatilmagan bo'lsa: npm i lucide-react)

export default function LoginPage() {
  return (
    // 1. FON: Chuqur ko'k radial gradient
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black">
      
      {/* 2. LOGOTIP: 3D effektli UZ.JOB */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white drop-shadow-lg">
          <Briefcase className="w-10 h-10 text-blue-300" strokeWidth={2.5} />
          <span>TechJobs</span>
        </div>
        <p className="text-blue-200 mt-2 text-sm font-medium tracking-wider uppercase opacity-80">
          Karyerangiz shu yerdan boshlanadi
        </p>
      </div>

      {/* Forma komponenti shu yerga tushadi */}
      <LoginForm />
      
    </div>
  );
}