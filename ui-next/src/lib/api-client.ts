// HTTP 응답 인터셉터 - API 응답 형식 통일 및 에러 처리
interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp?: string;
    path?: string;
    statusCode?: number;
    error?: string;
}

interface RequestConfig {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    credentials?: RequestCredentials;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = "http://localhost:8000") {
        this.baseURL = baseURL;
    }

    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        const defaultConfig: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...config.headers,
            },
            credentials: "include", // 쿠키 포함
            ...config,
        };

        try {
            const response = await fetch(url, defaultConfig);
            const data: ApiResponse<T> = await response.json();

            // 응답이 표준 형식이 아닌 경우 래핑
            if (!("success" in data)) {
                return {
                    success: response.ok,
                    data: data as T,
                    statusCode: response.status,
                };
            }

            return data;
        } catch (error) {
            // 네트워크 오류 또는 JSON 파싱 오류
            return {
                success: false,
                message: error instanceof Error ? error.message : "Network error",
                statusCode: 500,
            };
        }
    }

    // GET 요청
    async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "GET", headers });
    }

    // POST 요청
    async post<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    // PUT 요청
    async put<T>(
        endpoint: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    // DELETE 요청
    async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE", headers });
    }

    // PATCH 요청
    async patch<T>(
        endpoint: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    }
}

// 전역 API 클라이언트 인스턴스
export const apiClient = new ApiClient();

// 타입 export
export type { ApiResponse };

// 편의 함수들
export const api = {
    // 인증 관련
    auth: {
        refresh: () => apiClient.post("/auth/refresh"),
        logout: () => apiClient.post("/auth/logout"),
    },

    // 사용자 관련
    users: {
        me: () => apiClient.get("/users/me"),
        getAll: () => apiClient.get("/users"),
        getById: (id: number) => apiClient.get(`/users/${id}`),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        update: (id: number, data: any) => apiClient.put(`/users/${id}`, data),
        delete: (id: number) => apiClient.delete(`/users/${id}`),
        restore: (id: number) => apiClient.patch(`/users/${id}/restore`),
        getDeleted: () => apiClient.get("/users/deleted"),
        getCount: () => apiClient.get("/users/count"),
    },

    // 시스템 관련
    system: {
        health: () => apiClient.get("/api/health"),
        status: () => apiClient.get("/api"),
    },
};
