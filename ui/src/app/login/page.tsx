"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login, user } = useAuth();

    useEffect(() => {
        // URL에서 성공 플래그 확인 (백엔드에서 리다이렉트된 경우)
        const success = searchParams.get("success");

        if (success === "true") {
            // 쿠키에서 사용자 정보 읽기
            const userInfoCookie = document.cookie.split("; ").find((row) => row.startsWith("userInfo="));

            if (userInfoCookie) {
                try {
                    const userInfo = userInfoCookie.split("=")[1];
                    const decodedUser = decodeURIComponent(userInfo);

                    // AuthContext를 통해 로그인 처리 (토큰은 쿠키에 있으므로 사용자 정보만 전달)
                    login(decodedUser);
                    // 홈으로 리다이렉트
                    router.replace("/");
                } catch {
                    setError("로그인 처리 중 오류가 발생했습니다.");
                }
            } else {
                setError("사용자 정보를 찾을 수 없습니다.");
            }
        }
    }, [searchParams, router, login]);

    useEffect(() => {
        // 이미 로그인된 사용자인지 확인
        if (user) {
            router.replace("/");
        }
    }, [user, router]);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setError("");

        // 백엔드 Google OAuth 엔드포인트로 리다이렉트
        window.location.href = "http://localhost:8000/auth/google";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* 뒤로 가기 버튼 */}
                <Link href="/" className="inline-flex items-center space-x-2 text-[#499200] hover:text-[#3d7a00] mb-8">
                    <ArrowLeft size={20} />
                    <span>홈으로 돌아가기</span>
                </Link>

                {/* 로고 */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/tulog_text_logo_black.png"
                            alt="TULOG"
                            width={150}
                            height={50}
                            className="h-12 w-auto"
                        />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-8">개발자 블로그 로그인</h2>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10 border">
                    <div className="space-y-6">
                        {/* 에러 메시지 */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* 로그인 설명 */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-6">
                                TULOG는 Google 계정을 통해 간편하게 로그인할 수 있습니다.
                                <br />
                                별도의 회원가입 없이 바로 시작하세요!
                            </p>
                        </div>

                        {/* Google 로그인 버튼 */}
                        <div>
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#499200] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#499200]"></div>
                                        <span>로그인 중...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span>Google로 로그인</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* 로그인 정보 */}
                        <div className="mt-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <div className="flex items-start">
                                    <LogIn className="text-blue-500 mr-2 mt-0.5" size={16} />
                                    <div className="text-sm text-blue-700">
                                        <p className="font-medium mb-1">로그인 정보</p>
                                        <ul className="space-y-1 text-xs">
                                            <li>• Google 계정 정보를 안전하게 보호합니다</li>
                                            <li>• 이메일 주소와 기본 프로필 정보만 사용합니다</li>
                                            <li>• 언제든지 계정을 삭제할 수 있습니다</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 링크 */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        로그인에 문제가 있으신가요?{" "}
                        <Link href="/" className="text-[#499200] hover:text-[#3d7a00]">
                            홈으로 돌아가기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
