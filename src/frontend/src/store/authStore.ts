import { validateCredentials } from "@/data/mockAuth";
import type { AuthUser } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginError: string | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: AuthUser["role"][]) => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loginError: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, loginError: null });
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        const user = validateCredentials(email, password);
        if (user) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            loginError: null,
          });
          return true;
        }
        set({
          isLoading: false,
          loginError: "Invalid email or password. Please try again.",
        });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, loginError: null });
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === "super_admin") return true;
        return user.permissions.includes(permission);
      },

      hasRole: (roles: AuthUser["role"][]) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },

      clearError: () => set({ loginError: null }),
    }),
    {
      name: "tka-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
