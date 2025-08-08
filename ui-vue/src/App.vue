<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from './stores/themeStore'

const authStore = useAuthStore()
const themeStore = useThemeStore()
themeStore.applyTheme(themeStore.currentTheme)

// 앱 시작 시 한 번만 인증 초기화
onMounted(async () => {
  // URL에 success=true 파라미터가 있으면 OAuth 성공 처리
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('success') === 'true') {
    // URL 정리
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
    // OAuth 성공 처리
    await authStore.handleLoginSuccess()
  } else {
    // 일반적인 앱 초기화
    await authStore.initAuth()
  }
})
</script>

<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
