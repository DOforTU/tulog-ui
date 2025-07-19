<template>
  <div class="explore-view">
    <div class="container">
      <h1>Explore</h1>
      <p>Discover new content and trending topics.</p>

      <div class="coming-soon">
        <h2>🚀 Coming Soon</h2>
        <p>This feature is under development.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Explore page logic will be implemented here
</script>

<style scoped>
.explore-view {
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
