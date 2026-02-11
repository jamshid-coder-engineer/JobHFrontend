import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { $api } from '../../../shared/api/axios-instance'; 

export interface User {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN' | 'SUPER_ADMIN';
  companyId?: string; 
  company?: any;
  hasResume?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  jobTitle?: string;
}

interface UserState {
  user: User | null;
  isAuth: boolean;
  _hasHydrated: boolean;
  
  setAuth: (user: User) => void;
  updateUser: (userData: Partial<User>) => void; 
  logout: () => Promise<void>; 
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      _hasHydrated: false,

      setAuth: (user) => {
        set({ user, isAuth: true });
      },
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      
      
      logout: async () => {
        try {
          
          await $api.post('/auth/logout'); 
        } catch (error) {
          console.error("Logout error", error);
        } finally {
          
          set({ user: null, isAuth: false });
          localStorage.removeItem("user-storage");
          window.location.href = "/login"; 
        }
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