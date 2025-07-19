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
  let isFetchingUser = false // 중복 요청 방지를 위한 상태
  let initPromise: Promise<void> | null = null // 초기화 Promise 캐싱

  // 사용자 정보 가져오기
  const fetchUserInfo = async (): Promise<User | null> => {
    // 이미 요청 중이면 기다리기만 하고 중복 요청 방지
    if (isFetchingUser) return currentUser.value
    isFetchingUser = true

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
    } finally {
      isFetchingUser = false
    }
  }

  // 로그인 이후 사용자 정보 초기화
  const login = async () => {
    await fetchUserInfo()
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

  // 인증 상태 초기화 (Promise 캐싱으로 중복 방지)
  const initAuth = async () => {
    // 이미 초기화 중이면 같은 Promise 반환
    if (initPromise) return initPromise

    // 이미 초기화 완료되었으면 즉시 반환
    if (isInitialized) return Promise.resolve()

    // 새로운 초기화 Promise 생성 및 캐싱
    initPromise = (async () => {
      try {
        isInitialized = true
        const user = await fetchUserInfo()
        if (user) setupTokenRefresh()
      } finally {
        isLoading.value = false
        initPromise = null // 완료 후 캐시 초기화
      }
    })()

    return initPromise
  }

  // 로그인 성공 후 처리 (구글 OAuth 리디렉션 대응)
  const handleLoginSuccess = async () => {
    await initAuth()
    // store에서는 상태만 업데이트, 리디렉션은 컴포넌트에서 처리
    return currentUser.value
  }

  // URL에 success=true 파라미터가 있으면 자동 로그인 처리
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
    login,
    logout,
    updateUser,
    fetchUserInfo,
    initAuth,
    handleLoginSuccess,
  }
})
