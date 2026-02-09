import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 👇 USER INTERFEYSINI KENGAYTIRAMIZ
export interface User {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'SUPER_ADMIN';
  companyId?: string; 
  company?: any;
  hasResume?: boolean;
  
  // 👇 YANGI QO'SHILGAN MAYDONLAR (PROFIL UCHUN):
  firstName?: string;
  lastName?: string; // Agar kerak bo'lsa
  phone?: string;
  city?: string;
  jobTitle?: string;
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
      // updateuser endi yangi maydonlarni ham qabul qiladi
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      logout: () => {
        set({ user: null, accessToken: null, isAuth: false });
        localStorage.removeItem("user-storage");
        window.location.href = "/login"; 
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