/**
 * Auth store — manages JWT tokens and admin identity.
 * Persisted to sessionStorage (cleared on tab close).
 * Full token-refresh wiring in Phase 11.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AdminRole = "SYS_ADMIN" | "TAX_ADMIN";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: AdminRole | null;
  adminId: string | null;
  email: string | null;

  // Actions
  setAuth: (params: {
    accessToken: string;
    refreshToken: string;
    role: AdminRole;
    adminId: string;
    email: string;
  }) => void;
  clearAuth: () => void;
  setAccessToken: (token: string) => void;

  // Computed helpers
  isAuthenticated: () => boolean;
  isSysAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      adminId: null,
      email: null,

      setAuth: ({ accessToken, refreshToken, role, adminId, email }) =>
        set({ accessToken, refreshToken, role, adminId, email }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          role: null,
          adminId: null,
          email: null,
        }),

      setAccessToken: (token) => set({ accessToken: token }),

      isAuthenticated: () => !!get().accessToken,

      isSysAdmin: () => get().role === "SYS_ADMIN",
    }),
    {
      name: "ghana-tax-auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
