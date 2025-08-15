import { PublicUser } from "../types/user.interface";
import apiClient from "./api-client";

// Comment creation DTO type
export interface CreateCommentDto {
    content: string;
}

// Comment type that matches CommentWithAuthor from backend
export interface Comment {
    id: number;
    content: string;
    postId: number;
    createdAt: string;
    author: PublicUser;
    replies?: Comment[];
    likeCount?: number;
    authorId?: number;
    parentCommentId?: number;
    updatedAt?: string;
}

// Create comment
export async function createComment(postId: number, commentData: CreateCommentDto, parentCommentId?: number) {
    const url = parentCommentId
        ? `/api/comment?postId=${postId}&commentId=${parentCommentId}`
        : `/api/comment?postId=${postId}`;
    const response = await apiClient.post(url, commentData);
    return response.data;
}

// Get comments by post ID
export async function getCommentsByPostId(postId: number) {
    const response = await apiClient.get(`/api/comment/post/${postId}`);
    return response.data;
}

// Delete comment
export async function deleteComment(commentId: number, postId: number) {
    const response = await apiClient.delete(`/api/comment/${commentId}/posts/${postId}`);
    return response.data;
}
