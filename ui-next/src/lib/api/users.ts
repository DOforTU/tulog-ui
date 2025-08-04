import { updateUserDto } from "./../types/user.interface";
import apiClient from "./api-client";

export const fetchCurrentUser = async () => {
    const response = await apiClient.get("/api/users/me", {
        withCredentials: true,
    });
    return response.data;
};

export const updateCurrentUser = async (data: updateUserDto) => {
    const response = await apiClient.patch("/api/users/me", {
        ...data,
    });
    return response.data;
};

// 닉네임으로 유저 정보 가져오기
export const fetchUserByNickname = async (nickname: string) => {
    const response = await apiClient.get(`/api/users/nickname/${nickname}`);
    return response.data;
};

// 본인 팔로워 목록 가져오기
export const fetchMyFollowers = async () => {
    const response = await apiClient.get("/api/users/me/followers", {
        withCredentials: true,
    });
    return response.data;
};

// 본인 팔로잉 목록 가져오기
export const fetchMyFollowing = async () => {
    const response = await apiClient.get("/api/users/me/followings", {
        withCredentials: true,
    });
    return response.data;
};

// 특정 유저의 팔로워 목록 가져오기
export const fetchUserFollowers = async (userId: string) => {
    const response = await apiClient.get(`/api/users/${userId}/followers`);
    return response.data;
};

// 특정 유저의 팔로잉 목록 가져오기
export const fetchUserFollowing = async (userId: string) => {
    const response = await apiClient.get(`/api/users/${userId}/followings`);
    return response.data;
};

export const fetchUserAllTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/users/${userId}/teams`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchUserJoinedTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/users/${userId}/teams?status=joined`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchUserInvitedTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/users/${userId}/teams?status=invited`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchUserPendingTeams = async (userId: string) => {
    const response = await apiClient.get(`/api/users/${userId}/teams?status=pending`, {
        withCredentials: true,
    });
    return response.data;
};
