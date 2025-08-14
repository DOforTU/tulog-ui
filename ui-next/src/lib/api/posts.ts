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
    const response = await apiClient.delete(`/api/posts/${postId}`);
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
