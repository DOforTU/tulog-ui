"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { useSearch } from "@/contexts/SearchContext";
// 임시 블로그 포스트 데이터 (실제로는 API에서 가져올 예정)
const samplePosts = [
    {
        id: "1",
        title: "Next.js 15와 React 19로 블로그 만들기",
        content: "Next.js 15와 React 19의 새로운 기능들을 활용해서 모던 블로그를 만들어보겠습니다...",
        excerpt:
            "Next.js 15와 React 19의 새로운 기능들을 활용해서 모던 블로그를 만들어보겠습니다. TypeScript와 Tailwind CSS를 사용하여 개발자 친화적인 환경을 구축했습니다.",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        author: {
            id: "1",
            username: "개발자 김철수",
            nickname: "devkim",
            profilePicture:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        tags: ["Next.js", "React", "TypeScript", "TailwindCSS"],
    },
    {
        id: "2",
        title: "TypeORM과 PostgreSQL로 데이터베이스 설계하기",
        content:
            "NestJS 프로젝트에서 TypeORM을 사용해 PostgreSQL 데이터베이스를 효율적으로 설계하는 방법을 알아봅시다...",
        excerpt:
            "NestJS 프로젝트에서 TypeORM을 사용해 PostgreSQL 데이터베이스를 효율적으로 설계하는 방법을 알아봅시다. Entity 관계 설정부터 마이그레이션까지 단계별로 진행합니다.",
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T14:20:00Z",
        author: {
            id: "1",
            username: "개발자 김철수",
            nickname: "devkim",
            profilePicture:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        },
        tags: ["TypeORM", "PostgreSQL", "NestJS", "Database"],
    },
    {
        id: "3",
        title: "Google OAuth 2.0 구현하기",
        content: "Passport.js를 활용해서 Google OAuth 2.0 인증을 구현하는 방법을 상세히 설명합니다...",
        excerpt:
            "Passport.js를 활용해서 Google OAuth 2.0 인증을 구현하는 방법을 상세히 설명합니다. JWT 토큰 발급과 사용자 세션 관리까지 포함합니다.",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
        author: {
            id: "2",
            username: "백엔드 박민수",
            nickname: "backendpark",
            profilePicture:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        },
        tags: ["OAuth", "Google", "Passport", "JWT", "Authentication"],
    },
];

export default function Home() {
    const [filteredPosts, setFilteredPosts] = useState(samplePosts);
    const { searchTerm, setSearchTerm } = useSearch();

    useEffect(() => {
        // 검색 필터링
        if (searchTerm.trim() === "") {
            setFilteredPosts(samplePosts);
        } else {
            const filtered = samplePosts.filter(
                (post) =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredPosts(filtered);
        }
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* 헤로 섹션 */}
                <section className="text-center mb-12">
                    {/* <h1 className="text-4xl font-bold text-gray-900 mb-4">일상을 TULOG에서 공유해주세요.</h1> */}
                </section>

                {/* 블로그 포스트 목록 */}
                <section>
                    {filteredPosts.length > 0 ? (
                        <div className="grid gap-6">
                            {filteredPosts.map((post) => (
                                <BlogPostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm ? "검색 결과가 없습니다." : "아직 포스트가 없습니다."}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="mt-4 text-[#499200] hover:text-[#3d7a00]"
                                >
                                    전체 포스트 보기
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
