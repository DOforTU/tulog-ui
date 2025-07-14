"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// 사용자 타입 정의
interface User {
    id: string;
    email: string;
    username: string;
    nickname: string;
    profilePicture?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userInfo: string) => void;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(async () => {
        // 먼저 로컬 상태를 정리
        setUser(null);

        // Google 로그아웃도 시도
        try {
            // Google 계정 로그아웃
            await fetch("https://accounts.google.com/logout");
        } catch {
            // Google 로그아웃 실패해도 계속 진행
        }

        // 백엔드 로그아웃 API 호출 (쿠키 삭제)
        try {
            // 타임아웃 설정
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            await fetch("http://localhost:8000/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 쿠키 포함
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
        } catch {
            // 백엔드 오류가 있어도 프론트엔드에서는 이미 로그아웃 처리됨
        }

        // 페이지 새로고침으로 완전 초기화
        window.location.href = "/";
    }, []);

    useEffect(() => {
        // 쿠키에서 사용자 정보 확인
        const userInfoCookie = document.cookie.split("; ").find((row) => row.startsWith("userInfo="));

        if (userInfoCookie) {
            try {
                const userInfo = userInfoCookie.split("=")[1];
                const decodedUser = decodeURIComponent(userInfo);
                const parsedUser = JSON.parse(decodedUser);
                setUser(parsedUser);
            } catch {
                // 쿠키 파싱 실패 시 무시
            }
        }
        setIsLoading(false);
    }, []);

    // 자동 토큰 갱신 (14분마다 실행)
    useEffect(() => {
        if (!user) return;

        const refreshInterval = setInterval(async () => {
            try {
                const response = await fetch("http://localhost:8000/auth/refresh", {
                    method: "POST",
                    credentials: "include", // 쿠키 포함
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        // 새로운 액세스 토큰은 쿠키로 자동 설정됨
                        setUser(data.user);
                    }
                } else {
                    // 토큰 갱신 실패 시 로그아웃
                    logout();
                }
            } catch {
                // 토큰 갱신 실패 시 로그아웃
                logout();
            }
        }, 14 * 60 * 1000); // 14분마다 갱신

        return () => clearInterval(refreshInterval);
    }, [user, logout]);

    const login = useCallback((userInfo: string) => {
        try {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            // 쿠키는 이미 백엔드에서 설정됨
        } catch (error) {
            throw error;
        }
    }, []);

    const updateUser = useCallback((newUser: User) => {
        setUser(newUser);
        // 쿠키는 백엔드에서 관리하므로 여기서는 상태만 업데이트
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
