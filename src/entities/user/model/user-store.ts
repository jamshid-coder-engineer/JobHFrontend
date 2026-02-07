import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'SUPER_ADMIN';
  companyId?: string; 
  company?: any; // 👈 Bu muhim
  hasResume?: boolean;      
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  _hasHydrated: boolean;
  
  setAuth: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void; 
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuth: false,
      _hasHydrated: false,

      setAuth: (user, token) => {
        set({ user, accessToken: token, isAuth: true });
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      // 🔥 LOGOUT LOGIKASI KUCHAYTIRILDI
      logout: () => {
        set({ user: null, accessToken: null, isAuth: false });
        localStorage.removeItem("user-storage"); // 🧹 Majburiy tozalash
        
        // ⚡️ React Query keshini tozalash uchun sahifani yangilash (Eng ishonchli yo'l)
        // Yoki shunchaki login sahifasiga o'tganda eski data ko'rinmasligini ta'minlaydi
      },
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      }
    }),
    {
      name: "user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);