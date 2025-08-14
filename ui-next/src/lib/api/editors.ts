import apiClient from "./api-client";

// 사용자의 공개 포스트 목록 조회
export async function getUserPublicPosts(userId: number) {
    const response = await apiClient.get(`/api/editor/${userId}/posts/public`);
    return response.data;
}

// 사용자의 팀 공개 포스트 목록 조회
export async function getUserTeamPublicPosts(userId: number) {
    const response = await apiClient.get(`/api/editor/${userId}/posts/team-public`);
    return response.data;
}

// 사용자의 비공개 포스트 목록 조회 (로그인 필요)
export async function getUserPrivatePosts(userId: number) {
    const response = await apiClient.get(`/api/editor/${userId}/posts/private`);
    return response.data;
}

// 사용자의 팀 비공개 포스트 목록 조회 (로그인 필요)
export async function getUserTeamPrivatePosts(userId: number) {
    const response = await apiClient.get(`/api/editor/${userId}/posts/team-private`);
    return response.data;
}

// 사용자의 임시저장 포스트 목록 조회 (로그인 필요)
export async function getUserDraftPosts(userId: number) {
    const response = await apiClient.get(`/api/editor/${userId}/posts/draft`);
    return response.data;
}
