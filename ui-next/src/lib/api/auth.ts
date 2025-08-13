import apiClient from "./api-client";

export function loginWithGoogle() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
}

export async function loginWithLocal(email: string, password: string) {
    return await apiClient.post("/api/auth/login", {
        email,
        password,
    });
}

export async function signupWithLocal(signupData: {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    nickname: string;
}) {
    return await apiClient.post("/api/auth/signup", signupData);
}

export async function completeSignup(email: string, code: string) {
    return await apiClient.post("/api/auth/complete-signup", {
        email,
        code,
    });
}

export async function logout() {
    return await apiClient.post("/api/auth/logout");
}

export async function refreshToken() {
    return await apiClient.post("/api/auth/refresh");
}
