<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Turn thoughts into words, experiences into stories</h1>
          <p class="hero-subtitle">
            A platform where individuals and teams share their stories across all topics
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Posts -->
    <FeaturedPosts :posts="featuredPosts" :formatDate="formatDate" @navigate="navigateToPost" />

    <!-- Featured와 Recent 사이 광고 배너 -->
    <div class="ad-banner">
      <a href="https://ad.example.com" target="_blank" rel="noopener">
        <img src="/ad_sample.png" alt="광고" />
        <div class="ad-content">
          <div class="ad-title">광고 제목</div>
          <div class="ad-desc">광고 설명 또는 슬로건</div>
        </div>
        <div class="ad-label">AD</div>
      </a>
    </div>

    <!-- Recent Posts and Sidebar -->
    <section class="recent-sidebar-section">
      <div class="container">
        <div class="content-layout">
          <main class="main-content">
            <RecentPosts :posts="recentPosts" :formatDate="formatDate" @navigate="navigateToPost" />
          </main>

          <Sidebar :popularTags="popularTags" :recommendedAuthors="recommendedAuthors" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue'
import { ref, onMounted } from 'vue'
import FeaturedPosts from '../components/FeaturedPosts.vue'
import RecentPosts from '../components/RecentPosts.vue'

interface Author {
  name: string
  avatar: string
  bio: string
}

interface Post {
  id: number
  title: string
  subtitle: string
  content: string
  excerpt: string
  author: Author
  publishedAt: string
  readTime: number
  tags: string[]
  featured: boolean
  claps: number
  image: string
}

const posts = ref<Post[]>([])
const featuredPosts = ref<Post[]>([])
const recentPosts = ref<Post[]>([])
const popularTags = ref<string[]>([])
const recommendedAuthors = ref<Author[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/samplePosts.json')
    const data = await response.json()
    posts.value = data

    featuredPosts.value = data.filter((post: Post) => post.featured).slice(0, 3)
    recentPosts.value = data.slice(0, 6)

    // Extract popular tags
    const allTags = data.flatMap((post: Post) => post.tags)
    const tagCounts = allTags.reduce((acc: any, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})
    popularTags.value = Object.keys(tagCounts)
      .sort((a, b) => tagCounts[b] - tagCounts[a])
      .slice(0, 8)

    // Recommended authors
    recommendedAuthors.value = data
      .map((post: Post) => post.author)
      .filter(
        (author: Author, index: number, self: Author[]) =>
          self.findIndex((a) => a.name === author.name) === index,
      )
      .slice(0, 3)
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const navigateToPost = (postId: number) => {
  console.log('Navigate to post:', postId)
  // 라우터 구현 후 실제 네비게이션 로직 추가
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section */
.hero {
  padding: 4rem 0;
  border-bottom: 1px solid var(--color-border);
}

.hero-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--color-heading);
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-light);
  line-height: 1.6;
}

/* Tags */
.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-background-soft);
  color: var(--color-text-light);
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Engagement */
.engagement {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.read-time {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.claps,
.clap-btn {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.clap-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  transition: background-color 0.2s ease;
}

.clap-btn:hover {
  background-color: var(--color-background-soft);
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* RecentPosts와 Sidebar를 나란히 배치 */
.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.sidebar-card {
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.sidebar-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.popular-tag {
  padding: 0.5rem 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.popular-tag:hover {
  background-color: var(--color-primary);
  color: white;
}

.recommended-authors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.author-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-item .author-avatar {
  width: 32px;
  height: 32px;
}

.author-item .author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.follow-btn {
  padding: 0.375rem 0.875rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.follow-btn:hover {
  background-color: var(--color-primary-dark);
}

/* 광고 배너 */
.ad-banner {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.ad-banner img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.ad-label {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  letter-spacing: 0.05em;
  z-index: 2;
}

.ad-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ad-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary-dark, #2d3a4a);
  margin-bottom: 0.25rem;
}

.ad-desc {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
  text-align: center;
}

.ad-btn {
  padding: 0.5rem 1.25rem;
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: background 0.2s;
}
.ad-btn:hover {
  background-color: var(--color-primary-dark);
}

/* 반응형 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .content-layout {
    display: flex;
    flex-direction: column-reverse;
    gap: 2rem;
  }

  .post-card {
    flex-direction: column;
    gap: 1rem;
  }

  .post-image {
    width: 100%;
    height: 160px;
  }

  .post-title {
    font-size: 1.25rem;
  }
}
</style>
