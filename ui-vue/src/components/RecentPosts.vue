<template>
  <section class="recent-section">
    <div class="container">
      <div
        class="section-header"
        style="display: flex; align-items: center; justify-content: space-between"
      >
        <h2>Recent Stories</h2>
        <a href="/posts?category=recent" class="view-all-link">전체 보기</a>
      </div>
      <div class="posts-list">
        <article
          v-for="post in posts.slice(0, 10)"
          :key="post.id"
          class="post-card"
          @click="$emit('navigate', post.id)"
        >
          <div class="post-content">
            <div class="post-meta">
              <div class="author-info">
                <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar" />
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  posts: any[]
  formatDate: (dateString: string) => string
}>()
const emit = defineEmits(['navigate'])
</script>

<style>
/* 전체 글 보기 링크 스타일 */
.view-all-link {
  font-size: 1rem;
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  margin-left: 1rem;
  transition: color 0.2s;
}
.view-all-link:hover {
  color: var(--color-primary-dark);
}
.recent-section {
  padding: 4rem 0;
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

.engagement {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.read-time {
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
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.clap-btn:hover {
  background-color: var(--color-background-soft);
}

@media (max-width: 768px) {
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
