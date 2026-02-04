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
  setAuth: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void; 
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuth: false,
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
    }),
    { name: "user-storage" }
  )
);