"use client";

import { fetchCurrentUser } from "@/lib/api/users";
import { loginWithGoogle, logout as logoutApi, refreshToken } from "@/lib/api/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
    id: string;
    email: string;
    nickname: string;
    profilePicture: string;
}

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    logout: () => Promise<void>;
    loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetchCurrentUser();
                setCurrentUser(res.data);
            } catch {
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const interval = setInterval(async () => {
            try {
                await refreshToken();
            } catch {
                await logoutApi();
                setCurrentUser(null);
            }
        }, 10 * 60 * 1000); // 10분(기본), 6초(테스트)

        return () => clearInterval(interval);
    }, [currentUser]);

    const setUser = (user: User | null) => setCurrentUser(user);
    const clearUser = () => setCurrentUser(null);
    const logout = async () => {
        await logoutApi();
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, setUser, clearUser, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
