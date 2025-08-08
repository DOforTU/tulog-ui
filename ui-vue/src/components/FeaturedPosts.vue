<template>
  <section class="featured-section">
    <div class="container">
      <div
        class="section-header"
        style="display: flex; align-items: center; justify-content: space-between"
      >
        <h2>Featured Stories</h2>
        <router-link to="/posts?category=featured" class="view-more-link"
          >Look more &gt;
        </router-link>
      </div>
      <div class="featured-grid">
        <article
          v-for="post in posts"
          :key="post.id"
          class="featured-card"
          @click="$emit('navigate', post.id)"
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
/* 전체 보기 링크 스타일 */
.view-more-link {
  font-size: 1rem;
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  margin-left: 1rem;
  transition: color 0.2s;
}
.view-more-link:hover {
  color: var(--color-primary-dark);
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
</style>
