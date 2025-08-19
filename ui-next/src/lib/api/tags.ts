import { Tag } from "../types/post.interface";
import apiClient from "./api-client";

// 기본 10개
export async function getPopularTags(params?: { limit?: number }): Promise<Tag[]> {
    const response = await apiClient.get("/api/tags/popular", { params });
    return response.data.data;
}
