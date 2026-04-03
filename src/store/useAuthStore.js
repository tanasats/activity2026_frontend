import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, token, refreshToken) => set({ 
        user, 
        token, 
        refreshToken,
        isAuthenticated: !!token 
      }),

      updateToken: (newToken) => set({
        token: newToken
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        refreshToken: null,
        isAuthenticated: false 
      }),
    }),

    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
