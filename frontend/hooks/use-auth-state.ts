"use client";

import { useSyncExternalStore } from "react";
import { api, type AuthState } from "../api";

export function useAuthState(): AuthState {
    return useSyncExternalStore(
        api.auth.subscribe,
        () => api.auth.value,
        () => api.auth.value,
    );
}

export function useIsAuthenticated(): boolean {
    return useAuthState().isAuthenticated;
}

export function useAuthRole(): AuthState["role"] {
    return useAuthState().role;
}
