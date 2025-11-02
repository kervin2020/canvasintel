import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hotelId: string | null;
}

interface Hotel {
  id: string;
  name: string;
  currency: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  hotel: Hotel | null;
  token: string | null;
  setAuth: (user: User, hotel: Hotel | null, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hotel: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, hotel, token) =>
        set({ user, hotel, token, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, hotel: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export function getAuthToken(): string | null {
  return useAuth.getState().token;
}
