import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: (localStorage.getItem('tulog-theme') as Theme | null) || ('dark' as Theme),
  }),
  getters: {
    isDark: (state) => state.currentTheme === 'dark',
  },
  actions: {
    applyTheme(theme: Theme) {
      document.documentElement.setAttribute('data-theme', theme)
    },
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      localStorage.setItem('tulog-theme', this.currentTheme)
      this.applyTheme(this.currentTheme)
    },
    setTheme(theme: Theme) {
      this.currentTheme = theme
      localStorage.setItem('tulog-theme', theme)
      this.applyTheme(theme)
    },
  },
})
