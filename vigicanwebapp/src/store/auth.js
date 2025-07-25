import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      allUserData: null,
      userRole: null,
      loading: true,
      hydrated: false,

      setUser: (user) => set({ allUserData: user }),
      setUserRole: (role) => set({ userRole: role }),
      setLoading: (loading) => set({ loading }),
      clearUser: () => set({ allUserData: null, userRole: null }),
      isLoggedIn: () => get().allUserData !== null,
      getUserRole: () => get().userRole,
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: (set) => () => {
        set({ hydrated: true });
      },
    }
  )
);

// Optional: Zustand devtools
if (import.meta.env.MODE === "development") {
  mountStoreDevtool("AuthStore", useAuthStore);
}
