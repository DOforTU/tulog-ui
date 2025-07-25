<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo-container">
            <img
              :src="logoSrc"
              :key="logoKey"
              alt="TULOG"
              class="footer-logo"
              @error="handleImageError"
            />
            <span class="footer-logo-text" v-if="showTextLogo">TULOG</span>
          </div>
          <p class="footer-description">
            A platform for sharing personal and team stories across all topics
          </p>
        </div>

        <div class="footer-links">
          <div class="footer-section">
            <h4>Platform</h4>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/posts">Posts</router-link></li>
              <li><router-link to="/about">About</router-link></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Account</h4>
            <ul>
              <li><router-link to="/login">Sign In</router-link></li>
              <li><router-link to="/signup">Sign Up</router-link></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="mailto:support@tulog.com">Contact Us</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 TULOG. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const showTextLogo = ref(false)

// 테마에 따른 로고 이미지 경로
const logoSrc = computed(() => {
  return themeStore.isDark ? '/_p_tulog_text_logo_white.png' : '/_p_tulog_text_logo_black.png'
})

// key를 활용해 이미지 리렌더링
const logoKey = ref(0)
watch(
  () => themeStore.isDark,
  () => {
    logoKey.value++
  },
)

const handleImageError = () => {
  showTextLogo.value = true
}
</script>

<style scoped>
.app-footer {
  background-color: var(--color-background-mute);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
  height: 300px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo-container {
  display: flex;
  align-items: center;
}

.footer-logo {
  height: 32px;
  width: auto;
  max-width: 150px;
}

.footer-logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: 0.1em;
}

.footer-description {
  color: var(--color-text-light);
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: var(--color-text-light);
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.footer-bottom p {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-container {
    padding: 2rem 1rem 1rem;
  }
}
</style>
