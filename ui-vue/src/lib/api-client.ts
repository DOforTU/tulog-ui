// API Client for TULOG backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Generic API response type
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}

// HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// Generic fetch wrapper
async function fetchAPI<T = any>(
  endpoint: string,
  options: {
    method?: HttpMethod
    body?: any
    headers?: Record<string, string>
  } = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const config: RequestInit = {
    method: options.method || 'GET',
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)

    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: errorData.message || `HTTP ${response.status}`,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// Auth API endpoints
export const auth = {
  // Get current user
  meInfo: () => {
    return fetchAPI('/users/me/info', { method: 'GET' })
  },

  // Refresh token
  refresh: () => {
    return fetchAPI('/auth/refresh', { method: 'POST' })
  },

  // Logout
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),

  // Start Google OAuth (redirect)
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`
  },
}

// Users API endpoints
export const users = {
  // Get all users
  getAll: () => fetchAPI('/users'),

  // Get user by ID
  getById: (id: string) => fetchAPI(`/users/${id}`),

  // Update user
  update: (id: string, data: any) => fetchAPI(`/users/${id}`, { method: 'PUT', body: data }),

  // Delete user (soft delete)
  delete: (id: string) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),

  // Hard delete user
  hardDelete: (id: string) => fetchAPI(`/users/${id}/hard`, { method: 'DELETE' }),

  // Restore user
  restore: (id: string) => fetchAPI(`/users/${id}/restore`, { method: 'PATCH' }),

  // Get deleted users
  getDeleted: () => fetchAPI('/users/deleted'),

  // Get user count
  getCount: () => fetchAPI('/users/count'),
}

// System API endpoints
export const system = {
  // Health check
  health: () => fetchAPI('/api/health'),

  // Basic check
  ping: () => fetchAPI('/api'),
}

// Export all APIs
export const api = {
  auth,
  users,
  system,
}

export default api
