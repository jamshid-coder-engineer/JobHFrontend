import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'SUPER_ADMIN';
  companyId?: string; 
  company?: any;
  hasResume?: boolean;      
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  _hasHydrated: boolean; // 👈 YANGI: Yuklanganlik holati
  
  setAuth: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void; 
  logout: () => void;
  setHasHydrated: (state: boolean) => void; // 👈 YANGI
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuth: false,
      _hasHydrated: false, // Boshida false turadi

      setAuth: (user, token) => {
        set({ user, accessToken: token, isAuth: true });
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      logout: () => {
        set({ user: null, accessToken: null, isAuth: false });
      },
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      }
    }),
    {
      name: "user-storage",
      // 👇 BU ENG MUHIM QISM:
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // Ma'lumot o'qib bo'lingach true bo'ladi
      },
    }
  )
);