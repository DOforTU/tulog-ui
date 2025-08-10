import { PublicUser } from "./user.interface";

export interface Author {
    name: string;
    avatar: string;
    bio: string;
}

// ERD 기반 Post 인터페이스
export interface Post {
    id: number;
    teamId: number | null;
    title: string;
    content: string;
    thumbnailImage: string;
    createdAt: string;
    status: "PRIVATE" | "PUBLIC" | "DRAFT";
    editors: PostEditor[];
}

// Editor 관계 인터페이스
export interface PostEditor {
    postId: number;
    editorId: number;
    createdAt: string;
    isCreator: boolean;
    permission: "POSSIBLE" | "READ_ONLY" | "EDIT";
    user: PublicUser; // PublicUser 타입 활용
}

// 기존 호환성을 위한 레거시 Post 인터페이스
export interface LegacyPost {
    id: number;
    title: string;
    subtitle: string;
    excerpt: string;
    author: Author;
    publishedAt: string;
    readTime: number;
    tags: Tag[];
    featured: boolean;
    claps: number;
    image: string;
}

export interface Tag {
    id: number;
    name: string;
}

// 포스트 생성/수정을 위한 DTO
export interface CreatePostDto {
    title: string;
    content: string;
    thumbnailImage?: string;
    status: "PRIVATE" | "PUBLIC" | "DRAFT";
    teamId?: number;
    editorIds?: number[]; // 공동 편집자 ID 목록
}

export interface UpdatePostDto {
    title?: string;
    content?: string;
    thumbnailImage?: string;
    status?: "PRIVATE" | "PUBLIC" | "DRAFT";
    teamId?: number;
}
