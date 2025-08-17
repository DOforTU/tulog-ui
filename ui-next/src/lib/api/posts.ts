import { CreatePostDto, UpdatePostDto } from "@/lib/types/post.interface";
import apiClient from "./api-client";

// 포스트 생성
export async function createPost(postData: CreatePostDto) {
    const response = await apiClient.post("/api/posts", postData);
    return response.data;
}

// 포스트 업데이트
export async function updatePost(postId: number, postData: UpdatePostDto) {
    const response = await apiClient.patch(`/api/posts/${postId}`, postData);
    return response.data;
}

// 포스트 상세 조회
export async function getPost(postId: number) {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data;
}

// 포스트 목록 조회
export async function getPosts(params?: { page?: number; limit?: number }) {
    const response = await apiClient.get("/api/posts", { params });
    return response.data;
}

// 포스트 삭제
export async function deletePost(postId: number) {
    const response = await apiClient.patch(`/api/posts/${postId}/delete`);
    return response.data;
}

// 임시저장
export async function saveDraft(postData: CreatePostDto) {
    const response = await apiClient.post("/api/posts/draft", postData);
    return response.data;
}

// 공개 포스트 목록 조회 (최신순) - 래퍼 반환
export async function getPublicPosts(params?: { limit?: number; offset?: number }) {
    const response = await apiClient.get("/api/posts", { params });
    return response.data;
}

export async function postLike(postId: number) {
    const response = await apiClient.post(`/api/posts/${postId}/like`);
    return response.data;
}

export async function postUnlike(postId: number) {
    const response = await apiClient.delete(`/api/posts/${postId}/unlike`);
    return response.data;
}

export async function checkIsLiked(postId: number) {
    const response = await apiClient.get(`/api/posts/${postId}/likes/me`);
    return response.data;
}

// 팀별 포스트 조회
export async function getTeamPublicPosts(teamId: number) {
    const response = await apiClient.get(`/api/posts/teams/${teamId}/public`);
    return response.data;
}

export async function getTeamPrivatePosts(teamId: number) {
    const response = await apiClient.get(`/api/posts/teams/${teamId}/private`);
    return response.data;
}

export async function getTeamDraftPosts(teamId: number) {
    const response = await apiClient.get(`/api/posts/teams/${teamId}/draft`);
    return response.data;
}

// 사용자가 좋아요한 포스트 목록 조회
export async function getLikedPosts() {
    const response = await apiClient.get("/api/posts/liked/me", {
        withCredentials: true,
    });
    return response.data;
}

// 사용자가 북마크한 포스트 목록 조회
export async function getBookmarkedPosts() {
    const response = await apiClient.get("/api/bookmark", {
        withCredentials: true,
    });
    return response.data;
}

// 포스트 북마크 추가
export async function bookmarkPost(postId: number) {
    const response = await apiClient.post(`/api/bookmark/${postId}`, {}, {
        withCredentials: true,
    });
    return response.data;
}

// 포스트 북마크 제거
export async function unbookmarkPost(postId: number) {
    const response = await apiClient.delete(`/api/bookmark/${postId}`, {
        withCredentials: true,
    });
    return response.data;
}

// 특정 포스트가 북마크되었는지 확인
export async function checkIsBookmarked(postId: number) {
    try {
        const response = await getBookmarkedPosts();
        const bookmarkedPosts = response.data || [];
        return bookmarkedPosts.some((post: any) => post.id === postId);
    } catch (error) {
        console.error("Failed to check bookmark status:", error);
        return false;
    }
}
