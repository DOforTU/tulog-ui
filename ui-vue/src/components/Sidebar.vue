<template>
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
    <!-- 광고 배너 -->
    <div class="ad-banner">
      <a href="https://ad.example.com" target="_blank" rel="noopener" class="ad-link">
        <img src="/ad_sample.png" alt="AD" />
        <div class="ad-content">
          <div class="ad-title">AD TITLE</div>
          <div class="ad-desc">AD DESCRIPTION OR SLOGAN</div>
          <button class="ad-btn">Learn More</button>
        </div>
        <div class="ad-label">AD</div>
      </a>
      <a href="https://ad.example.com" target="_blank" rel="noopener">
        <img src="/ad_sample.png" alt="AD" />
        <div class="ad-content">
          <div class="ad-title">AD TITLE</div>
          <div class="ad-desc">AD DESCRIPTION OR SLOGAN</div>
          <button class="ad-btn">Learn More</button>
        </div>
        <div class="ad-label">AD</div>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  popularTags: string[]
  recommendedAuthors: Array<{ name: string; avatar: string; bio: string }>
}>()
</script>

<style>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 4rem 0;
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

@media (max-width: 768px) {
  .ad-banner {
    display: none;
  }
}
</style>
