import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

export const useAuthStore = create(
  (set, get) => ({
    allUserData: null,
    loading: true,

    setUser: (user) => set({ allUserData: user }),
    setLoading: (loading) => set({ loading }),
    clearUser: () => set({ allUserData: null }),
    isLoggedIn: () => get().allUserData !== null,
  }),
  {
    name: "auth-storage",
    getStorage: () => localStorage,
  }
);

if (import.meta.env.MODE === "development") {
  mountStoreDevtool("Store", useAuthStore);
}

{
  /* 
    user: () => ({
    user_id: get().allUserData?.user_id || null,
    username: get().allUserData?.username || null,
  }), 
  */
}
