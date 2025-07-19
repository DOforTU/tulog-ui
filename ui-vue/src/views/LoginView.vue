<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-form">
          <div class="form-header">
            <h1>Welcome to TULOG</h1>
            <p>Where stories begin and ideas flourish</p>
          </div>

          <!-- Google Sign-in Button -->
          <button @click="handleGoogleLogin" class="btn-google">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <!-- Email Login Form -->
          <form @submit.prevent="handleEmailLogin" class="email-form">
            <div class="form-group">
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-input"
                placeholder="Email"
                disabled
              />
            </div>

            <div class="form-group">
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-input"
                placeholder="Password"
                disabled
              />
            </div>

            <button type="submit" class="btn-primary" disabled>Sign In (Coming Soon)</button>
          </form>

          <div class="form-footer">
            <p>
              Don't have an account?
              <router-link to="/signup" class="signup-link">Sign up</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const { isAuthenticated, currentUser } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')

// Handle Google OAuth login
const handleGoogleLogin = () => {
  try {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`
  } catch (error) {
    console.error('Google login failed:', error)
  }
}

const handleEmailLogin = () => {
  console.log('Email login will be implemented later')
}

// Watch for authentication state changes
watch(
  isAuthenticated,
  (newValue) => {
    if (newValue && currentUser.value) {
      console.log('User authenticated, redirecting to home...')
      router.push('/')
    }
  },
  { immediate: true },
)

// Handle OAuth callback success (fallback)
onMounted(() => {
  // If already authenticated, redirect immediately
  if (isAuthenticated.value) {
    router.push('/')
    return
  }

  // Check for success parameter and clean URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('success') === 'true') {
    console.log('OAuth success parameter detected in LoginView')
    // Clean the URL
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)

    // useAuth will handle the rest
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 2rem;
}

.login-container {
  width: 100%;
}

.login-form {
  background: var(--color-background-soft);
  padding: 3rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  line-height: 1.3;
}

.form-header p {
  color: var(--color-text-light);
  font-size: 1rem;
}

.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;
}

.btn-google:hover {
  background-color: var(--color-background-soft);
  border-color: var(--color-border-hover);
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  background: var(--color-background-soft);
  padding: 0 1rem;
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.email-form {
  opacity: 0.5;
  pointer-events: none;
}

.form-group {
  margin-bottom: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(73, 146, 0, 0.1);
}

.form-input::placeholder {
  color: var(--color-text-light);
}

.btn-primary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.form-footer p {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.signup-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

/* 반응형 */
@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .login-form {
    padding: 2rem;
  }

  .form-header h1 {
    font-size: 1.5rem;
  }
}
</style>
