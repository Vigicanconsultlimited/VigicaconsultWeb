import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      allUserData: null,
      loading: true,
      hydrated: false,

      setUser: (user) => set({ allUserData: user }),
      setLoading: (loading) => set({ loading }),
      clearUser: () => set({ allUserData: null }),
      isLoggedIn: () => get().allUserData !== null,
    }),
    {
      name: "auth-storage", // localStorage key
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
