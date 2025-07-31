import apiClient from "./api-client";

export const fetchCurrentUser = async () => {
    const response = await apiClient.get("api/users/me", {
        withCredentials: true,
    });
    return response.data;
};
