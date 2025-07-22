<template>
  <div class="write-view">
    <div class="container">
      <h1>Write</h1>
      <p>Create a new blog post.</p>

      <div class="coming-soon">
        <h2>✍️ Coming Soon</h2>
        <p>Post writing feature is under development.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// Redirect to login if not authenticated
if (!isAuthenticated.value) {
  // This will be handled by route guards later
}
</script>

<style scoped>
.write-view {
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.coming-soon {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 2rem;
}

.coming-soon h2 {
  color: #6c757d;
  margin-bottom: 1rem;
}

.coming-soon p {
  color: #6c757d;
}
</style>
