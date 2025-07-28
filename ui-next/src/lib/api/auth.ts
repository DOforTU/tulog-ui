import apiClient from "./api-client";

export function loginWithGoogle() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
}

export async function logout() {
    return apiClient.post("api/auth/logout");
}

export async function refreshToken() {
    return apiClient.post("api/auth/refresh");
}
