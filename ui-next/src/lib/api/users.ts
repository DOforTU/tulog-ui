import apiClient from "./api-client";

export const fetchCurrentUser = async () => {
    const response = await apiClient.get("/api/users/me", {
        withCredentials: true,
    });
    return response.data;
};

// 닉네임으로 유저 정보 가져오기
export const fetchUserByNickname = async (nickname: string) => {
    const response = await apiClient.get(`/api/users/nickname/${nickname}`);
    return response.data;
};
