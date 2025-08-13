import { PublicUser } from "./user.interface";

export interface Author {
    name: string;
    avatar: string;
    bio: string;
}

// 서버와 동일한 EditorRole enum
export enum EditorRole {
    OWNER = "OWNER",
    EDITOR = "EDITOR",
    VIEWER = "VIEWER",
}

// 서버와 동일한 PostStatus enum
export enum PostStatus {
    DRAFT = "DRAFT",
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

// ERD 기반 Post 인터페이스
export interface Post {
    id: number;
    teamId: number | null;
    title: string;
    content: string;
    excerpt?: string;
    thumbnailImage: string;
    status: PostStatus;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    editors: PostEditor[];
    postTags?: PostTag[];
    team?: any;
}

// PostTag 관계 인터페이스
export interface PostTag {
    postId: number;
    tagId: number;
    createdAt: string;
    tag: Tag;
}

// Editor 관계 인터페이스 (서버의 Editor entity와 일치)
export interface PostEditor {
    postId: number;
    userId: number;
    createdAt: string;
    role: EditorRole;
    user: PublicUser;
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
    excerpt?: string;
    thumbnailImage?: string;
    status?: PostStatus;
    teamId?: number;
    tags?: string[]; // 서버와 일치
}

export interface UpdatePostDto {
    title?: string;
    content?: string;
    excerpt?: string;
    thumbnailImage?: string;
    status?: PostStatus;
    teamId?: number;
    tags?: string[]; // 서버와 일치
}

// 서버 API 응답과 일치하는 PublicPost 인터페이스
export interface PublicPost {
    id: number;
    title: string;
    excerpt: string;
    thumbnailImage: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    teamId?: number;
    teamName?: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    authors: PublicUser[];
}
