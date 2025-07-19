import { ref, computed } from 'vue'
import { api } from '@/lib/api-client'

export interface User {
  id: string
  email: string
  username: string
  nickname: string
  profilePicture?: string
}

// 전역 상태
const currentUser = ref<User | null>(null)
const isLoading = ref(true)
let refreshIntervalId: number | null = null // 전역 interval 관리
let isInitialized = false // 초기화 상태 추가

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null)

  // 사용자 정보 가져오기
  const fetchUserInfo = async (): Promise<User | null> => {
    try {
      const raw = await api.auth.meInfo()

      const response = raw.data || raw

      if (response && response.success && response.data) {
        const userData = response.data

        const user: User = {
          id: (userData.id || userData.sub || '').toString(),
          email: userData.email || '',
          username: userData.username || userData.email?.split('@')[0] || '',
          nickname: userData.nickname || userData.username || userData.email?.split('@')[0] || '',
          profilePicture: userData.profilePicture,
        }
        currentUser.value = user
        return user
      }

      currentUser.value = null
      return null
    } catch (error) {
      currentUser.value = null
      return null
    }
  }

  // 로그인 성공 후 사용자 정보 가져오기
  const login = async (): Promise<void> => {
    await fetchUserInfo()
  }

  // 로그아웃 처리
  const logout = async (): Promise<void> => {
    currentUser.value = null
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    window.location.href = '/'
  }

  const updateUser = (newUser: User): void => {
    currentUser.value = newUser
  }

  // accessToken 자동 갱신
  const setupTokenRefresh = (): (() => void) | undefined => {
    if (!currentUser.value) {
      return
    }

    // 기존 interval이 있다면 제거
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId)
    }

    refreshIntervalId = setInterval(
      async () => {
        try {
          const response = await api.auth.refresh()

          if (response && response.success) {
          } else {
            await logout()
          }
        } catch (error) {
          await logout()
        }
      },
      10 * 60 * 1000,
    ) // 10분마다 갱신 (토큰 만료 전에 갱신)

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId)
        refreshIntervalId = null
      }
    }
  }

  // 인증 상태 초기화
  const initAuth = async (): Promise<void> => {
    if (isInitialized) {
      console.log('🔄 Auth already initialized, skipping...')
      return
    }

    isInitialized = true
    console.log('🚀 Initializing auth...')

    try {
      const user = await fetchUserInfo()
      if (user) {
        setupTokenRefresh()
      }
    } finally {
      isLoading.value = false
    }
  }

  // 로그인 성공 후 초기화 및 리디렉션
  const handleLoginSuccess = async (): Promise<void> => {
    console.log('🎉 Login success detected')
    await initAuth()
    if (currentUser.value && window.location.pathname === '/login') {
      window.location.href = '/'
    }
  }

  // 로그인 성공 URL 파라미터 처리
  const checkLoginSuccess = async (): Promise<void> => {
    if (typeof window === 'undefined') return

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      console.log('🔗 Login success URL parameter detected')
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      await handleLoginSuccess()
      return // 여기서 return하여 아래 initAuth() 호출 방지
    }

    // success 파라미터가 없을 때만 일반 초기화 실행
    await initAuth()
  }

  // 최초 실행
  if (typeof window !== 'undefined') {
    checkLoginSuccess() // 이미 내부에서 initAuth() 호출하므로 중복 제거

    // 디버깅 함수
    ;(window as any).debugAuth = () => {
      console.log('=== AUTH DEBUG ===')
      console.log('User:', currentUser.value)
      console.log('Is Authenticated:', isAuthenticated.value)
      console.log('Is Loading:', isLoading.value)
      console.log('===================')
    }
  }

  return {
    user: computed(() => currentUser.value),
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    login,
    logout,
    updateUser,
    fetchUserInfo,
    initAuth,
    handleLoginSuccess,
  }
}
