import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/api-client'

export interface User {
  id: string
  email: string
  username: string
  nickname: string
  profilePicture?: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(true)
  const isAuthenticated = computed(() => currentUser.value !== null)
  let refreshIntervalId: number | null = null
  let isInitialized = false

  const fetchUserInfo = async (): Promise<User | null> => {
    try {
      const raw = await api.auth.meInfo()
      const response = raw.data || raw

      if (response.success && response.data) {
        const data = response.data
        currentUser.value = {
          id: (data.id || data.sub || '').toString(),
          email: data.email || '',
          username: data.username || data.email?.split('@')[0] || '',
          nickname: data.nickname || data.username || data.email?.split('@')[0] || '',
          profilePicture: data.profilePicture,
        }
        return currentUser.value
      }
      currentUser.value = null
      return null
    } catch {
      currentUser.value = null
      return null
    }
  }

  const login = async () => {
    await fetchUserInfo()
  }

  const logout = async () => {
    currentUser.value = null
    try {
      await api.auth.logout()
    } catch (e) {
      console.error('Logout error', e)
    }
    window.location.href = '/'
  }

  const updateUser = (user: User) => {
    currentUser.value = user
  }

  const setupTokenRefresh = () => {
    if (!currentUser.value) return
    if (refreshIntervalId) clearInterval(refreshIntervalId)

    refreshIntervalId = setInterval(
      async () => {
        try {
          const res = await api.auth.refresh()
          if (!res.success) await logout()
        } catch {
          await logout()
        }
      },
      10 * 60 * 1000,
    )

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId)
        refreshIntervalId = null
      }
    }
  }

  const initAuth = async () => {
    if (isInitialized) return
    isInitialized = true

    try {
      const user = await fetchUserInfo()
      if (user) setupTokenRefresh()
    } finally {
      isLoading.value = false
    }
  }

  const handleLoginSuccess = async () => {
    await initAuth()
    if (currentUser.value && window.location.pathname === '/login') {
      window.location.href = '/'
    }
  }

  const checkLoginSuccess = async () => {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      await handleLoginSuccess()
    } else {
      await initAuth()
    }
  }

  if (typeof window !== 'undefined') {
    checkLoginSuccess()
    ;(window as any).debugAuth = () => {
      console.log('=== AUTH DEBUG ===')
      console.log('User:', currentUser.value)
      console.log('Is Authenticated:', isAuthenticated.value)
      console.log('Is Loading:', isLoading.value)
      console.log('===================')
    }
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    fetchUserInfo,
    initAuth,
    handleLoginSuccess,
  }
})
