import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Customer {
  id: number;
  email: string;
  organization_id: number | null;
}

interface AuthState {
  token: string | null;
  customer: Customer | null;
  setAuth: (token: string, customer: Customer) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      customer: null,
      setAuth: (token, customer) => {
        localStorage.setItem("access_token", token);
        set({ token, customer });
      },
      clearAuth: () => {
        localStorage.removeItem("access_token");
        set({ token: null, customer: null });
      },
    }),
    {
      name: "cyxor-auth",
    }
  )
);
