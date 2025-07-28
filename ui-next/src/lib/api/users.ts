import apiClient from "./api-client";

export const fetchCurrentUser = async () => {
    const response = await apiClient.get("api/users/me/info", {
        withCredentials: true,
    });
    return response.data;
};
