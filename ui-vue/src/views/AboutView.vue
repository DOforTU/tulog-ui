<template>
  <div class="about-page">
    <div class="container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">TULOG</h1>
          <p class="hero-subtitle">A platform for sharing stories, ideas, and experiences</p>
          <p class="hero-description">
            Where individuals and teams come together to share their stories, insights, and
            experiences across all topics and interests.
          </p>
        </div>
      </section>

      <!-- Mission & Vision -->
      <section class="mission-section">
        <div class="section-grid">
          <div class="mission-card">
            <div class="card-icon">🚀</div>
            <h3>Mission</h3>
            <p>
              To create a vibrant community where people can freely share their stories, connect
              with like-minded individuals, and inspire each other through authentic experiences.
            </p>
          </div>

          <div class="mission-card">
            <div class="card-icon">💡</div>
            <h3>Vision</h3>
            <p>
              To become the go-to platform where creativity meets collaboration, fostering a world
              where every voice matters and every story has the power to inspire.
            </p>
          </div>
        </div>
      </section>

      <!-- Core Values -->
      <section class="values-section">
        <h2 class="section-title">Core Values</h2>
        <div class="values-grid">
          <div class="value-item">
            <div class="value-icon">🤝</div>
            <h4>Collaboration</h4>
            <p>
              Bringing together diverse voices and perspectives to create meaningful connections.
            </p>
          </div>

          <div class="value-item">
            <div class="value-icon">📚</div>
            <h4>Learning</h4>
            <p>Fostering continuous growth through shared experiences and knowledge exchange.</p>
          </div>

          <div class="value-item">
            <div class="value-icon">✨</div>
            <h4>Creativity</h4>
            <p>
              Encouraging innovative thinking and creative expression across all topics and fields.
            </p>
          </div>

          <div class="value-item">
            <div class="value-icon">🌍</div>
            <h4>Inclusivity</h4>
            <p>
              Creating a welcoming space where everyone's story matters and diversity is celebrated.
            </p>
          </div>
        </div>
      </section>

      <!-- Platform Features -->
      <section class="features-section">
        <h2 class="section-title">Platform Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h4>📝 Personal & Team Blogs</h4>
            <p>
              Share your individual stories or collaborate with your team to create compelling
              content.
            </p>
          </div>

          <div class="feature-card">
            <h4>💬 Engaging Discussions</h4>
            <p>Connect with readers through meaningful comments and thoughtful conversations.</p>
          </div>

          <div class="feature-card">
            <h4>🔍 Smart Discovery</h4>
            <p>
              Find content that interests you through tags, categories, and personalized
              recommendations.
            </p>
          </div>

          <div class="feature-card">
            <h4>👥 Community Building</h4>
            <p>Build your audience and connect with fellow writers who share your passions.</p>
          </div>
        </div>
      </section>

      <!-- Statistics -->
      <section class="stats-section">
        <h2 class="section-title">Growing Community</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">1,234+</div>
            <div class="stat-label">Writers</div>
          </div>

          <div class="stat-item">
            <div class="stat-number">2,856+</div>
            <div class="stat-label">Stories</div>
          </div>

          <div class="stat-item">
            <div class="stat-number">15,643+</div>
            <div class="stat-label">Comments</div>
          </div>

          <div class="stat-item">
            <div class="stat-number">120+</div>
            <div class="stat-label">Topics</div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Start Your Journey</h2>
          <p>
            Join TULOG today and begin sharing your unique stories and experiences with the world.
          </p>
          <div class="cta-buttons">
            <router-link to="/signup" class="btn btn-primary"> Get Started </router-link>
            <router-link to="/login" class="btn btn-secondary"> Sign In </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 히어로 섹션 */
.hero-section {
  text-align: center;
  padding: 4rem 0 6rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 미션 섹션 */
.mission-section {
  padding: 4rem 0;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
}

.mission-card {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.mission-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.mission-card p {
  color: var(--color-text-light);
  line-height: 1.6;
}

/* 섹션 타이틀 */
.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 3rem;
}

/* 핵심 가치 */
.values-section {
  padding: 6rem 0;
  background: var(--color-background-soft);
  border-radius: 16px;
  margin: 4rem 0;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.value-item {
  text-align: center;
  padding: 2rem 1rem;
}

.value-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.value-item h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.value-item p {
  color: var(--color-text-light);
  line-height: 1.5;
}

/* 플랫폼 특징 */
.features-section {
  padding: 4rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: var(--color-text-light);
  line-height: 1.5;
}

/* 통계 */
.stats-section {
  padding: 6rem 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.125rem;
  color: var(--color-text-light);
  font-weight: 500;
}

/* CTA 섹션 */
.cta-section {
  padding: 6rem 0;
  background: var(--color-background-soft);
  border-radius: 16px;
  text-align: center;
  margin: 4rem 0;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.125rem;
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: 2px solid var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-secondary:hover {
  background-color: var(--color-primary);
  color: white;
}

/* 반응형 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-grid {
    grid-template-columns: 1fr;
  }

  .values-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}
</style>
