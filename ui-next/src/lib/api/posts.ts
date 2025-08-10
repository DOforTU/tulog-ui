import { CreatePostDto, UpdatePostDto, Post } from "@/lib/types/post.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 포스트 생성
export async function createPost(postData: CreatePostDto): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
    }

    return response.json();
}

// 포스트 업데이트
export async function updatePost(postId: number, postData: UpdatePostDto): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update post");
    }

    return response.json();
}

// 포스트 상세 조회
export async function getPost(postId: number): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch post");
    }

    return response.json();
}

// 포스트 목록 조회
export async function getPosts(params?: {
    page?: number;
    limit?: number;
    status?: "PUBLIC" | "PRIVATE" | "DRAFT";
    teamId?: number;
}): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.teamId) searchParams.append("teamId", params.teamId.toString());

    const response = await fetch(`${API_BASE_URL}/posts?${searchParams}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch posts");
    }

    return response.json();
}

// 포스트 삭제
export async function deletePost(postId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete post");
    }
}

// 임시저장
export async function saveDraft(postData: CreatePostDto): Promise<Post> {
    return createPost({ ...postData, status: "DRAFT" });
}

// 포스트 발행
export async function publishPost(postData: CreatePostDto): Promise<Post> {
    return createPost({ ...postData, status: "PUBLIC" });
}

// 편집자 추가
export async function addEditor(
    postId: number,
    editorId: number,
    permission: "POSSIBLE" | "READ_ONLY" | "EDIT" = "EDIT"
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/editors`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ editorId, permission }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add editor");
    }
}

// 편집자 제거
export async function removeEditor(postId: number, editorId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/editors/${editorId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to remove editor");
    }
}
