<template>
  <div class="posts-view">
    <div class="container">
      <h1 v-if="category === 'featured'" class="category-content">Posts: Featured</h1>
      <h1 v-if="category === 'recent'" class="category-content">Posts: Recent</h1>

      <div class="category-buttons">
        <button
          class="category-btn"
          :class="{ active: category === 'recent' }"
          @click="category = 'recent'"
        >
          최신글
        </button>
        <button
          class="category-btn"
          :class="{ active: category === 'featured' }"
          @click="category = 'featured'"
        >
          인기글
        </button>
      </div>

      <div v-if="category === 'featured'" class="category-content">
        <h2>Trend Posts</h2>
        <ul class="post-list">
          <li v-for="post in featuredPosts" :key="post.id" class="post-item">
            <strong>{{ post.title }}</strong>
            <span class="author">by {{ post.author.name }}</span>
          </li>
        </ul>
      </div>
      <div v-else-if="category === 'recent'" class="category-content">
        <h2>Recent Posts</h2>
        <ul class="post-list">
          <li v-for="post in recentPosts" :key="post.id" class="post-item">
            <strong>{{ post.title }}</strong>
            <span class="author">by {{ post.author.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const category = ref('featured')
const featuredPosts = ref<any[]>([])
const recentPosts = ref<any[]>([])

function getCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const value = params.get('category')
  if (value === 'recent') return 'recent'
  return 'featured'
}

function setCategoryUrl(value: string) {
  const params = new URLSearchParams(window.location.search)
  params.set('category', value)
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, '', newUrl)
}

onMounted(async () => {
  category.value = getCategoryFromUrl()
  const response = await fetch('/samplePosts.json')
  const data = await response.json()
  // 절반 featured, 절반 recent로 나누기
  const half = Math.ceil(data.length / 2)
  featuredPosts.value = data.slice(0, half)
  recentPosts.value = data.slice(half)
})

watch(category, (val) => {
  setCategoryUrl(val)
})
</script>

<style scoped>
.category-buttons {
  display: flex;
  gap: 1rem;
  margin: 2rem 0 1rem 0;
}
/* 카테고리 버튼 다크/라이트 테마 대응 */
.category-btn {
  font-size: 1rem;
  color: var(--color-primary);
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  cursor: pointer;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  transition:
    color 0.2s,
    background 0.2s,
    border 0.2s;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(var(--color-background-rgb), 0.04);
}
.category-btn.active {
  color: var(--color-primary-dark);
  background: var(--color-background-mute);
  border: 1.5px solid var(--color-primary);
  font-weight: 700;
}
.category-btn:hover {
  color: var(--color-primary-light);
  background: var(--color-background-mute);
  border: 1.5px solid var(--color-primary-light);
}
.posts-view {
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.container h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
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
