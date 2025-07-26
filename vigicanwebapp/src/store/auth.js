import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      allUserData: null,
      userRole: null,
      loading: true,
      hydrated: false,

      // Actions
      setUser: (user) => set({ allUserData: user }),
      setUserRole: (role) => set({ userRole: role }),
      setLoading: (loading) => set({ loading }),

      clearUser: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        set({ allUserData: null, userRole: null });
      },

      // Enhanced isLoggedIn that checks token validity
      isLoggedIn: () => {
        const token = Cookies.get("access_token");
        if (!token) return false;

        try {
          const { exp } = jwtDecode(token);
          return get().allUserData !== null && Date.now() < exp * 1000;
        } catch {
          return false;
        }
      },

      getUserRole: () => get().userRole,

      // New action to validate token on rehydration
      validateAuth: () => {
        const token = Cookies.get("access_token");
        if (!token) {
          get().clearUser();
          return false;
        }

        try {
          const { exp } = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            get().clearUser();
            return false;
          }
          return true;
        } catch {
          get().clearUser();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: (state) => (persistedState) => {
        // Validate auth state when rehydrating
        state.validateAuth();
        state.setLoading(false);
        set({ hydrated: true });
      },
    }
  )
);

// Devtools setup
if (import.meta.env.MODE === "development") {
  mountStoreDevtool("AuthStore", useAuthStore);
}
