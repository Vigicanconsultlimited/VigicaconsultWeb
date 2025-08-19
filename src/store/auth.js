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

      // Fixed validateAuth function
      validateAuth: () => {
        //console.log("Auth Store: Starting validateAuth...");

        const token = Cookies.get("access_token");
        if (!token) {
          //console.log("Auth Store: No token found, clearing user");
          get().clearUser();
          set({ loading: false });
          return false;
        }

        try {
          const decoded = jwtDecode(token);
          const { exp } = decoded;

          if (Date.now() >= exp * 1000) {
            //console.log("Auth Store: Token expired, clearing user");
            get().clearUser();
            set({ loading: false });
            return false;
          }

          //console.log("Auth Store: Token valid, setting loading to false");
          set({ loading: false });
          return true;
        } catch (error) {
          //console.error("Auth Store: Error decoding token:", error);
          get().clearUser();
          set({ loading: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state, error) => {
        //console.log("Auth Store: Rehydration started");

        if (error) {
          //console.error("Auth Store: Rehydration error:", error);
          // Handle rehydration error
          useAuthStore.getState().setLoading(false);
          return;
        }

        // Use setTimeout to ensure the store is fully rehydrated
        setTimeout(() => {
          //console.log("Auth Store: Running post-rehydration validation");
          const storeInstance = useAuthStore.getState();
          storeInstance.validateAuth();
          storeInstance.setLoading(false);
          useAuthStore.setState({ hydrated: true });
        }, 0);
      },
    }
  )
);

// Devtools setup
if (import.meta.env.MODE === "development") {
  mountStoreDevtool("AuthStore", useAuthStore);
}
