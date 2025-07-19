import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'

export const useTheme = () => {
  // localStorage에서 저장된 테마 읽기, 기본값은 dark
  const savedTheme = localStorage.getItem('tulog-theme') as Theme | null
  const currentTheme = ref<Theme>(savedTheme || 'dark')

  // 테마 변경 함수
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('tulog-theme', currentTheme.value)
    applyTheme(currentTheme.value)
  }

  // 특정 테마로 설정
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem('tulog-theme', theme)
    applyTheme(theme)
  }

  // DOM에 테마 적용
  const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  // 다크 모드 여부
  const isDark = computed(() => currentTheme.value === 'dark')

  // 초기 테마 적용
  applyTheme(currentTheme.value)

  return {
    currentTheme,
    isDark,
    toggleTheme,
    setTheme,
  }
}
