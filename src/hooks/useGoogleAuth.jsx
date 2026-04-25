// useGoogleAuth.js
import { useEffect, useCallback, useRef } from "react";
import { setAuthUser } from "../utils/auth";
import apiInstance from "../utils/axios"; // 👈 import axios instance

let googleInitialized = false;

const GOOGLE_CLIENT_ID = "982353799341-vgob2p4poe1kl63ecsu939dcknbovlp1.apps.googleusercontent.com";

export const useGoogleAuth = ({ onSuccess, onError }) => {

    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onSuccessRef.current = onSuccess;
        onErrorRef.current = onError;
    }, [onSuccess, onError]);

    const handleCredentialResponse = useCallback(async (response) => {
        try {
            // ✅ Use axios instance instead of fetch — same base URL, same config
            const { data } = await apiInstance.post("auth/google", {
                idToken: response.credential,
            });


            if (!data.token) {
                onErrorRef.current?.("No token received from server.");
                return;
            }

            setAuthUser({
                token: data.token,
                refreshToken: null,
                user: null,
                userRole: data.userRole,
            });

            onSuccessRef.current?.(data);

        } catch (err) {
            console.error("Google auth error:", err);
            const errorMsg =
                err.response?.data?.message ||
                "Something went wrong. Please try again.";
            onErrorRef.current?.(errorMsg);
        }
    }, []);

    useEffect(() => {
        const initializeGoogle = () => {
            if (window.google && !googleInitialized) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                });
                googleInitialized = true;
            }
        };

        if (window.google) {
            initializeGoogle();
            return;
        }

        const interval = setInterval(() => {
            if (window.google) {
                initializeGoogle();
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [handleCredentialResponse]);

    const signInWithGoogle = useCallback(() => {
        if (!navigator.onLine) {
            onErrorRef.current?.("No internet connection. Please check your network.");
            return;
        }
        if (!window.google) {
            onErrorRef.current?.("Google SDK not loaded. Please refresh the page.");
            return;
        }
        window.google.accounts.id.prompt();
    }, []);

    return { signInWithGoogle };
};