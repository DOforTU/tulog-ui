import apiClient from "./api-client";

export async function getPostsAndUser(query: string) {
    const response = await apiClient.get(`/api/search?q=${query}`);
    return response.data.data;
}
