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
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <h2>Featured Stories</h2>
        </div>
        <div class="featured-grid">
          <article
            v-for="post in featuredPosts"
            :key="post.id"
            class="featured-card"
            @click="navigateToPost(post.id)"
          >
            <div class="card-image">
              <img :src="post.image" :alt="post.title" />
            </div>
            <div class="card-content">
              <div class="card-meta">
                <div class="author-info">
                  <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar" />
                  <span class="author-name">{{ post.author.name }}</span>
                </div>
                <span class="publish-date">{{ formatDate(post.publishedAt) }}</span>
              </div>
              <h3 class="card-title">{{ post.title }}</h3>
              <p class="card-excerpt">{{ post.excerpt }}</p>
              <div class="card-footer">
                <div class="tags">
                  <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
                <div class="engagement">
                  <span class="read-time">{{ post.readTime }} min read</span>
                  <span class="claps">{{ post.claps }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Recent Posts -->
    <section class="recent-section">
      <div class="container">
        <div class="content-layout">
          <main class="main-content">
            <div class="section-header">
              <h2>Recent Stories</h2>
            </div>
            <div class="posts-list">
              <article
                v-for="post in recentPosts"
                :key="post.id"
                class="post-card"
                @click="navigateToPost(post.id)"
              >
                <div class="post-content">
                  <div class="post-meta">
                    <div class="author-info">
                      <img
                        :src="post.author.avatar"
                        :alt="post.author.name"
                        class="author-avatar"
                      />
                      <div class="author-details">
                        <span class="author-name">{{ post.author.name }}</span>
                        <span class="author-bio">{{ post.author.bio }}</span>
                      </div>
                    </div>
                    <span class="publish-date">{{ formatDate(post.publishedAt) }}</span>
                  </div>
                  <h3 class="post-title">{{ post.title }}</h3>
                  <p class="post-subtitle">{{ post.subtitle }}</p>
                  <div class="post-footer">
                    <div class="tags">
                      <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">
                        {{ tag }}
                      </span>
                    </div>
                    <div class="engagement">
                      <span class="read-time">{{ post.readTime }} min</span>
                      <button class="clap-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M19 14C19 18.4183 15.4183 22 11 22C6.58172 22 3 18.4183 3 14C3 9.58172 6.58172 6 11 6C15.4183 6 19 9.58172 19 14Z"
                            stroke="currentColor"
                            stroke-width="1.5"
                          />
                          <path
                            d="M9 9L15 15M15 9L9 15"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                        </svg>
                        {{ post.claps }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="post-image" v-if="post.image">
                  <img :src="post.image" :alt="post.title" />
                </div>
              </article>
            </div>
          </main>

          <aside class="sidebar">
            <div class="sidebar-card">
              <h3>Popular Topics</h3>
              <div class="popular-tags">
                <span v-for="tag in popularTags" :key="tag" class="popular-tag">
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="sidebar-card">
              <h3>Recommended Writers</h3>
              <div class="recommended-authors">
                <div v-for="author in recommendedAuthors" :key="author.name" class="author-item">
                  <img :src="author.avatar" :alt="author.name" class="author-avatar" />
                  <div class="author-info">
                    <span class="author-name">{{ author.name }}</span>
                    <span class="author-bio">{{ author.bio }}</span>
                  </div>
                  <button class="follow-btn">Follow</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
  max-width: 600px;
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

/* Section Headers */
.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
}

/* Featured Section */
.featured-section {
  padding: 4rem 0;
  border-bottom: 1px solid var(--color-border);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.featured-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.featured-card:hover {
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem 0;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.publish-date {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.card-excerpt {
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Recent Section */
.recent-section {
  padding: 4rem 0;
}

.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-card {
  display: flex;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.post-card:hover {
  background-color: var(--color-background-soft);
  margin: 0 -1rem;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  border-bottom: 1px solid transparent;
}

.post-content {
  flex: 1;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-bio {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.post-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.post-subtitle {
  color: var(--color-text-light);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-image {
  width: 160px;
  height: 120px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    grid-template-columns: 1fr;
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
