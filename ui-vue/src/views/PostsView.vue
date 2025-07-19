<template>
  <div class="posts-view">
    <div class="container">
      <h1>Posts</h1>
      <p>Browse all blog posts.</p>

      <div class="coming-soon">
        <h2>📝 Coming Soon</h2>
        <p>Post listing feature is under development.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Posts page logic will be implemented here
</script>

<style scoped>
.posts-view {
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
