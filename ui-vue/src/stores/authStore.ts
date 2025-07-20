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

  // 사용자 정보 가져오기
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

  // 로그아웃 처리 및 상태 초기화
  const logout = async () => {
    currentUser.value = null
    try {
      await api.auth.logout()
    } catch (e) {
      console.error('Logout error', e)
    }
    window.location.href = '/'
  }

  // 사용자 정보 수동 갱신
  const updateUser = (user: User) => {
    currentUser.value = user
  }

  // accessToken 자동 갱신 인터벌 설정
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
    ) // 10분마다 갱신

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId)
        refreshIntervalId = null
      }
    }
  }

  // 인증 상태 초기화
  const initAuth = async () => {
    try {
      const user = await fetchUserInfo()
      if (user) setupTokenRefresh()
    } finally {
      isLoading.value = false
    }
  }

  // 로그인 성공 후 처리 (구글 OAuth 리디렉션 대응)
  const handleLoginSuccess = async () => {
    await initAuth()
    return currentUser.value
  }

  // 개발용 디버깅 함수 (클라이언트에서만)
  if (typeof window !== 'undefined') {
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
    logout,
    updateUser,
    fetchUserInfo,
    initAuth,
    handleLoginSuccess,
  }
})
