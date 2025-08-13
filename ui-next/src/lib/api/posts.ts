import { CreatePostDto, UpdatePostDto, Post, PublicPost, PostStatus } from "@/lib/types/post.interface";
import apiClient, { publicApiClient } from "./api-client";

// 포스트 생성
export async function createPost(postData: CreatePostDto): Promise<Post> {
    const response = await apiClient.post("/api/posts", postData);
    return response.data;
}

// 포스트 업데이트
export async function updatePost(postId: number, postData: UpdatePostDto): Promise<Post> {
    const response = await apiClient.patch(`/api/posts/${postId}`, postData);
    return response.data;
}

// 포스트 상세 조회
export async function getPost(postId: number): Promise<Post> {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return response.data;
}

// 포스트 목록 조회
export async function getPosts(params?: {
    page?: number;
    limit?: number;
    status?: "PUBLIC" | "PRIVATE" | "DRAFT";
    teamId?: number;
}): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
    const response = await apiClient.get("/api/posts", { params });
    return response.data;
}

// 포스트 삭제
export async function deletePost(postId: number): Promise<void> {
    await apiClient.delete(`/api/posts/${postId}`);
}

// 임시저장
export async function saveDraft(postData: CreatePostDto): Promise<Post> {
    const response = await apiClient.post("/api/posts/draft", postData);
    return response.data;
}

// 포스트 발행
export async function publishPost(postData: CreatePostDto): Promise<Post> {
    return createPost({ ...postData, status: PostStatus.PUBLIC });
}

// 공개 포스트 목록 조회 (최신순)
export async function getPublicPosts(params?: { limit?: number; offset?: number }): Promise<PublicPost[]> {
    const response = await publicApiClient.get("/api/posts", { params });

    // 서버의 ResponseInterceptor가 감싸서 보내는 경우 처리
    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    return response.data;
}
