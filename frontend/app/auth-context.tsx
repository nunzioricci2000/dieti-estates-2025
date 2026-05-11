"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: "admin" | "agent" | "user" | null;
    userEmail: string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<"admin" | "agent" | "user" | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Check for auth token on mount
        const token = localStorage.getItem("auth_token");
        const email = localStorage.getItem("user_email");
        const role = (localStorage.getItem("user_role") as any) || "user";

        if (token) {
            setIsAuthenticated(true);
            setUserEmail(email);
            setUserRole(role);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_role");
        setIsAuthenticated(false);
        setUserRole(null);
        setUserEmail(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                userRole,
                userEmail,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
