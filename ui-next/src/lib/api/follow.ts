import apiClient from "./api-client";

export interface PublicUser {
    id: number;
    nickname: string;
    profilePicture: string;
    isActive: boolean;
}

export interface Follow {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: string;
}

// ===== Follow/Unfollow Actions =====

/**
 * Follow a user
 * @param userId - ID of the user to follow
 * @returns Follow relationship object
 */
export const followUser = async (userId: number): Promise<Follow> => {
    const response = await apiClient.post(`/api/users/${userId}/follow`);
    return response.data;
};

/**
 * Unfollow a user
 * @param userId - ID of the user to unfollow
 * @returns Success status
 */
export const unfollowUser = async (userId: number): Promise<boolean> => {
    const response = await apiClient.delete(`/api/users/${userId}/unfollow`);
    return response.data;
};

// ===== Get Followers/Following Lists =====

/**
 * Get my followers
 * @returns Array of users who follow me
 */
export const getMyFollowers = async (): Promise<PublicUser[]> => {
    const response = await apiClient.get("/api/users/me/followers");
    return response.data;
};

/**
 * Get my followings
 * @returns Array of users I follow
 */
export const getMyFollowings = async (): Promise<PublicUser[]> => {
    const response = await apiClient.get("/api/users/me/followings");
    return response.data;
};

/**
 * Get followers of a specific user
 * @param userId - ID of the user
 * @returns Array of users who follow the specified user
 */
export const getUserFollowers = async (userId: number): Promise<PublicUser[]> => {
    const response = await apiClient.get(`/api/users/${userId}/followers`);
    return response.data;
};

/**
 * Get followings of a specific user
 * @param userId - ID of the user
 * @returns Array of users the specified user follows
 */
export const getUserFollowings = async (userId: number): Promise<PublicUser[]> => {
    const response = await apiClient.get(`/api/users/${userId}/followings`);
    return response.data;
};
