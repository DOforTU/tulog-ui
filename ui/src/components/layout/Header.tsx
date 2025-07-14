"use client";

import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Search, Bell, PenTool, UserCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSearch } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";

// 사용자 타입 정의
interface User {
    id: string;
    email: string;
    username: string;
    nickname: string;
    profilePicture?: string;
}

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { searchTerm, setSearchTerm } = useSearch();
    const { user, isLoading, logout } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        if (window.confirm("정말 로그아웃하시겠습니까?")) {
            await logout();
            setIsDropdownOpen(false);
        }
    };

    if (isLoading) {
        return (
            <header className="bg-white shadow-xs border-b h-[60px] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="text-2xl font-bold text-blue-600"></Link>
                            <div className="w-64 h-8 bg-gray-200 animate-pulse rounded hidden md:block"></div>
                        </div>
                        <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-xs border-b h-[60px] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="flex justify-between items-center w-full">
                    {/* 로고와 검색창 */}
                    <div className="flex items-center space-x-6">
                        {/* 로고 */}
                        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                            <Image
                                src="/tulog_text_logo_black.png"
                                alt="TULOG"
                                width={75}
                                height={25}
                                className="h-[25px] w-auto"
                            />
                        </Link>

                        {/* 검색창 */}
                        <div className="relative hidden md:block">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 pl-9 pr-4 py-1 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#499200] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <nav className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* 글쓰기 버튼 */}
                                <Link
                                    href="/write"
                                    className="flex items-center space-x-2 px-3 py-2 text-[#499200] hover:bg-green-50 rounded-md transition-colors"
                                >
                                    <PenTool size={16} />
                                    <span className="hidden sm:block font-medium">Write</span>
                                </Link>

                                {/* 알림 버튼 */}
                                <button className="relative p-2 text-gray-600 hover:text-[#499200] hover:bg-gray-50 rounded-md transition-colors">
                                    <Bell size={20} />
                                    {/* 알림 뱃지 (예시) */}
                                    {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        3
                                    </span> */}
                                </button>

                                {/* 프로필 드롭다운 */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center hover:opacity-80 transition-opacity"
                                    >
                                        {user.profilePicture ? (
                                            <Image
                                                src={user.profilePicture}
                                                alt="프로필"
                                                width={36}
                                                height={36}
                                                className="w-9 h-9 rounded-full ring-2 ring-gray-200 hover:ring-[#499200] transition-colors"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center ring-2 ring-gray-200 hover:ring-[#499200] transition-colors">
                                                <User size={20} className="text-gray-600" />
                                            </div>
                                        )}
                                    </button>

                                    {/* 드롭다운 메뉴 */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.nickname || user.username}
                                                </p>{" "}
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <Link
                                                href={`/${user.nickname || user.username}`}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <UserCircle size={16} className="mr-2" />
                                                마이페이지
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                로그아웃
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center space-x-1 px-4 py-2 text-[#499200] font-bold rounded-md "
                            >
                                <User size={16} />
                                <span>로그인</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
