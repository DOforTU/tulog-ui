"use client";

import { fetchCurrentUser } from "@/lib/api/users";
import { loginWithGoogle, loginWithLocal, logout as logoutApi, refreshToken } from "@/lib/api/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
    id: number;
    email: string;
    name: string;
    nickname: string;
    profilePicture: string;
    role: "user" | "admin";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    logout: () => Promise<void>;
    loginWithGoogle: () => void;
    loginWithLocal: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await fetchCurrentUser();
                setCurrentUser(userData.data);
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

    const handleLocalLogin = async (email: string, password: string): Promise<boolean> => {
        try {
            await loginWithLocal(email, password);
            // 로그인 성공 후 사용자 정보 다시 가져오기
            const userData = await fetchCurrentUser();
            setCurrentUser(userData.data);
            console.log(userData.data);

            return true;
        } catch (error) {
            console.error("Local login failed:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isLoading,
                setUser,
                clearUser,
                logout,
                loginWithGoogle,
                loginWithLocal: handleLocalLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
