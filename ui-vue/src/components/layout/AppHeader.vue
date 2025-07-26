<template>
  <header class="app-header">
    <nav class="nav-container">
      <!-- Logo -->
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <img
            class="brand-img"
            :src="isDark ? '/_p_tulog_text_logo_white.png' : '/_p_tulog_text_logo_black.png'"
            alt="TULOG"
          />
        </router-link>
      </div>

      <!-- Search Bar -->
      <div class="search-container">
        <!-- 모바일: 검색 버튼은 항상 보임 -->
        <button
          v-if="isMobile"
          class="search-button"
          @click="toggleMobileSearch"
          aria-label="Open Search"
        >
          <svg class="search-button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <!-- 모바일: 버튼 클릭 시 드롭다운 -->
        <div v-if="isMobile && showMobileSearch" class="search-box show">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="search-input"
            v-model="searchQuery"
            @input="handleSearch"
            @click.stop
          />
        </div>
        <!-- 데스크탑: 항상 보임 -->
        <div v-if="!isMobile" class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="search-input"
            v-model="searchQuery"
            @input="handleSearch"
            @click.stop
          />
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-menu">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/posts/?category=featured" class="nav-link">Posts</router-link>

        <router-link v-if="isAuthenticated" to="/write" class="nav-link write-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Write
        </router-link>
      </div>

      <!-- User Menu -->
      <div class="nav-auth">
        <!-- 햄버거 메뉴 (480px 이하에서만 표시) -->
        <button
          v-if="isSmallMobile"
          @click="toggleHamburgerMenu"
          class="btn-hamburger"
          aria-label="Toggle Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- 햄버거 메뉴 드롭다운 -->
        <div v-if="isSmallMobile && showHamburgerMenu" class="hamburger-dropdown" @click.stop>
          <!-- 인증된 사용자 메뉴 -->
          <div v-if="!isLoading" class="hamburger-user-section">
            <div v-if="isAuthenticated" class="hamburger-user-info">
              <img
                :src="currentUser?.profilePicture || '/default-avatar.svg'"
                :alt="currentUser?.nickname"
                class="hamburger-avatar"
                @error="handleImageError"
              />
              <div class="hamburger-user-details">
                <span class="hamburger-user-name">{{ currentUser?.nickname }}</span>
                <span class="hamburger-user-email">{{ currentUser?.email }}</span>
              </div>
            </div>

            <!-- 주요 이동 메뉴 -->
            <div class="hamburger-menu-items">
              <router-link
                v-if="!isAuthenticated"
                to="/login"
                class="hamburger-menu-item hamburger-signin"
                @click="closeHamburgerMenu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 17L15 12L10 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15 12H3"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Sign In
              </router-link>
              <div class="hamburger-divider"></div>
              <router-link
                v-if="isAuthenticated"
                to="/write"
                class="hamburger-menu-item"
                @click="closeHamburgerMenu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Write
              </router-link>
              <router-link to="/" class="hamburger-menu-item" @click="closeHamburgerMenu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12L12 3l9 9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 21V12h6v9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Home
              </router-link>
              <router-link
                to="/posts/?category=featured"
                class="hamburger-menu-item"
                @click="closeHamburgerMenu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M8 8h8M8 12h8M8 16h4"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                Posts
              </router-link>
            </div>
            <div class="hamburger-divider"></div>

            <!-- 환경설정 -->
            <div class="hamburger-menu-items">
              <button @click="toggleTheme" class="hamburger-menu-item">
                <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1583 17.4668C18.1127 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7473 21.1181 10.0713 20.746C8.39524 20.3739 6.84947 19.5345 5.61705 18.3021C4.38464 17.0697 3.54518 15.5239 3.17311 13.8479C2.80104 12.1718 2.91189 10.4312 3.49267 8.8234C4.07344 7.21565 5.09999 5.8064 6.45239 4.7608C7.80479 3.71519 9.42699 3.07647 11.129 2.919C9.96798 4.05244 9.32504 5.55581 9.32504 7.13C9.32504 8.70418 9.96798 10.2076 11.129 11.341C12.2624 12.502 13.7658 13.145 15.34 13.145C16.9142 13.145 18.4176 12.502 19.551 11.341C19.3934 13.0430 18.7547 14.6652 17.709 16.0176Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ isDark ? 'Light Mode' : 'Dark Mode' }}
              </button>
              <button v-if="isAuthenticated" class="hamburger-menu-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Notifications
              </button>
            </div>

            <!-- 계정 관련 -->
            <div v-if="isAuthenticated" class="hamburger-menu-items">
              <div class="hamburger-divider"></div>
              <a href="#" class="hamburger-menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Profile
              </a>
              <a href="#" class="hamburger-menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12.22 2H13.78C14.51 2 15.09 2.59 15.09 3.33V4.67C15.09 5.41 14.51 6 13.78 6H12.22C11.49 6 10.91 5.41 10.91 4.67V3.33C10.91 2.59 11.49 2 12.22 2Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19.78 8H21.22C21.95 8 22.53 8.59 22.53 9.33V10.67C22.53 11.41 21.95 12 21.22 12H19.78C19.05 12 18.47 11.41 18.47 10.67V9.33C18.47 8.59 19.05 8 19.78 8Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.78 8H4.22C4.95 8 5.53 8.59 5.53 9.33V10.67C5.53 11.41 4.95 12 4.22 12H2.78C2.05 12 1.47 11.41 1.47 10.67V9.33C1.47 8.59 2.05 8 2.78 8Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Settings
              </a>
              <button
                v-if="isAuthenticated"
                @click="handleLogout"
                class="hamburger-menu-item logout"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <!-- 기존 데스크탑/태블릿 메뉴 (480px 초과에서만 표시) -->
        <div v-if="!isSmallMobile" class="desktop-menu">
          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="btn-theme"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <svg v-if="isDark" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1583 17.4668C18.1127 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.7473 21.1181 10.0713 20.746C8.39524 20.3739 6.84947 19.5345 5.61705 18.3021C4.38464 17.0697 3.54518 15.5239 3.17311 13.8479C2.80104 12.1718 2.91189 10.4312 3.49267 8.8234C4.07344 7.21565 5.09999 5.8064 6.45239 4.7608C7.80479 3.71519 9.42699 3.07647 11.129 2.919C9.96798 4.05244 9.32504 5.55581 9.32504 7.13C9.32504 8.70418 9.96798 10.2076 11.129 11.341C12.2624 12.502 13.7658 13.145 15.34 13.145C16.9142 13.145 18.4176 12.502 19.551 11.341C19.3934 13.0430 18.7547 14.6652 17.709 16.0176Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- Authenticated User Menu -->
          <div v-if="!isLoading && isAuthenticated" class="user-menu">
            <button class="btn-notification">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <div class="user-profile" @click="toggleUserMenu">
              <img
                :src="currentUser?.profilePicture || '/default-avatar.svg'"
                :alt="currentUser?.nickname"
                class="user-avatar"
                @error="handleImageError"
              />
              <span class="user-name">{{ currentUser?.nickname }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="dropdown-icon">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <!-- User Dropdown Menu -->
            <div v-if="showUserMenu" class="user-dropdown" @click.stop>
              <div class="dropdown-header">
                <img
                  :src="currentUser?.profilePicture || '/default-avatar.svg'"
                  :alt="currentUser?.nickname"
                  class="dropdown-avatar"
                  @error="handleImageError"
                />
                <div class="dropdown-info">
                  <span class="dropdown-name">{{ currentUser?.nickname }}</span>
                  <span class="dropdown-email">{{ currentUser?.email }}</span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-menu">
                <a href="#" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Profile
                </a>
                <a href="#" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12.22 2H13.78C14.51 2 15.09 2.59 15.09 3.33V4.67C15.09 5.41 14.51 6 13.78 6H12.22C11.49 6 10.91 5.41 10.91 4.67V3.33C10.91 2.59 11.49 2 12.22 2Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19.78 8H21.22C21.95 8 22.53 8.59 22.53 9.33V10.67C22.53 11.41 21.95 12 21.22 12H19.78C19.05 12 18.47 11.41 18.47 10.67V9.33C18.47 8.59 19.05 8 19.78 8Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.78 8H4.22C4.95 8 5.53 8.59 5.53 9.33V10.67C5.53 11.41 4.95 12 4.22 12H2.78C2.05 12 1.47 11.41 1.47 10.67V9.33C1.47 8.59 2.05 8 2.78 8Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Settings
                </a>
                <div class="dropdown-divider"></div>
                <button @click="handleLogout" class="dropdown-item logout">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16 17L21 12L16 7"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21 12H9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <!-- Guest User Menu -->
          <div v-else-if="!isLoading" class="guest-menu">
            <router-link to="/login" class="nav-link auth-link">Sign In</router-link>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="loading-menu">
            <div class="loading-skeleton"></div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'

// --- 인증 및 테마 상태 관리 ---
const authStore = useAuthStore()
const { isAuthenticated, currentUser, isLoading } = storeToRefs(authStore) // 인증 상태, 유저 정보, 로딩
const { logout } = authStore

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore) // 다크모드 여부
const toggleTheme = themeStore.toggleTheme // 테마 토글 함수

const router = useRouter() // 라우터 인스턴스

// --- 검색창 상태 ---
const searchQuery = ref('') // 검색어

// --- 사용자 메뉴 드롭다운 상태 ---
const showUserMenu = ref(false) // 유저 메뉴 드롭다운 표시 여부

// --- 모바일 검색창 토글 상태 ---
const showMobileSearch = ref(false) // 모바일에서 검색 input 표시 여부
const isMobile = ref(window.innerWidth <= 768) // 현재 뷰포트가 모바일인지 여부
const isSmallMobile = ref(window.innerWidth <= 620) // 620px 이하 여부

// --- 햄버거 메뉴 상태 ---
const showHamburgerMenu = ref(false) // 햄버거 메뉴 표시 여부

// 모바일에서 아이콘 클릭 시 검색 input 토글
function toggleMobileSearch() {
  if (!isMobile.value) return
  showMobileSearch.value = !showMobileSearch.value
}

// 뷰포트 크기 변경 시 모바일 여부 갱신 및 검색 input 숨김
function handleResize() {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) showMobileSearch.value = false
  isSmallMobile.value = window.innerWidth <= 620
  if (!isSmallMobile.value) showHamburgerMenu.value = false
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 검색 input에서 엔터/입력 이벤트 처리
const handleSearch = (event: Event) => {
  event.preventDefault()
}

// 유저 메뉴 토글
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 햄버거 메뉴 토글
const toggleHamburgerMenu = () => {
  showHamburgerMenu.value = !showHamburgerMenu.value
}

// 햄버거 메뉴 닫기
const closeHamburgerMenu = () => {
  showHamburgerMenu.value = false
}

// 유저 프로필 이미지 에러 시 기본 이미지로 대체
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/default-avatar.svg'
}

// 로그아웃 처리
const handleLogout = async () => {
  try {
    await logout()
    showUserMenu.value = false
    showHamburgerMenu.value = false
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// 유저 메뉴 외부 클릭 시 드롭다운 닫기
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showUserMenu.value = false
  }
  if (!target.closest('.hamburger-dropdown') && !target.closest('.btn-hamburger')) {
    showHamburgerMenu.value = false
  }
}

// 외부 클릭 이벤트 등록/해제
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  background-color: rgba(var(--color-background-rgb), 0.9);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  gap: 2rem;
}

/* 브랜드 */
.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.02em;
}

.brand-img {
  height: 24px;
  display: block;
}

/* 검색창 */
.search-container {
  flex: 1;
  max-width: 400px;
  margin: 0 2rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-light);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 40px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: var(--color-background);
  box-shadow: 0 0 0 3px rgba(73, 146, 0, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-light);
}

/* 네비게이션 메뉴 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.router-link-active {
  color: var(--color-primary);
}

.write-link {
  /* color: var(--color-primary); */
  font-weight: 600;
}

/* 사용자 메뉴 */
.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.desktop-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-link {
  font-weight: 600;
}

.btn-theme,
.btn-notification {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: var(--color-text-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-theme:hover,
.btn-notification:hover {
  background-color: var(--color-background-soft);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.btn-theme svg,
.btn-notification svg {
  transition: all 0.3s ease;
}

.btn-theme:hover svg,
.btn-notification:hover svg {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(73, 146, 0, 0.3));
}

/* 햄버거 버튼 기본 숨김 */
.btn-hamburger {
  display: none;
}

/* 햄버거 드롭다운 기본 숨김 */
.hamburger-dropdown {
  display: none;
}

/* 반응형 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    gap: 1rem;
  }

  .search-container {
    margin: 0;
  }

  .search-button {
    background: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 34px;
    height: 34px;
    border-radius: 20%;
    border: 1px solid var(--color-text-light);
    color: var(--color-text);
  }

  .search-button-icon {
    position: static;
    pointer-events: auto;
    cursor: pointer;
    padding: 8px;
    width: 34px;
    height: 34px;
    border-radius: 20%;
    border: none;
    background: none;
    color: var(--color-text);
  }

  .search-icon {
    position: absolute;
    left: 18px;
    pointer-events: auto;
    cursor: pointer;
    padding: 8px;
    width: 34px;
    height: 34px;
    border-radius: 20%;
    border: none;
    background: none;
    color: var(--color-text);
  }

  .search-box.show {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    left: 0;
    top: 64.8px;
    width: 100%;
    z-index: 10;
    background: var(--color-background-mute);
    border-bottom: 1px solid var(--color-border);
    padding: 10px 12px;
    gap: 0.5rem;
  }

  .search-input {
    display: block;
    width: 100%;
    min-width: 0;
    padding: 8px 12px 8px 40px;
    /* border: 1px solid var(--color-border); */
    border: 1px solid var(--color-primary);
    border-radius: 24px;
    background-color: var(--color-background-soft);
    color: var(--color-text);
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .search-input:hover {
    border-color: var(--color-primary);
  }

  .nav-auth {
    gap: 0.5rem;
  }

  .brand-text {
    font-size: 1.25rem;
  }

  .user-name {
    display: block;
  }

  .user-dropdown {
    width: 240px;
  }

  .dropdown-header {
    padding: 0.75rem;
  }

  .dropdown-item {
    padding: 0.625rem 0.75rem;
  }
}

@media (max-width: 620px) {
  .nav-menu {
    display: none;
  }

  .btn-notification {
    display: none;
  }

  .desktop-menu {
    display: none;
  }

  .btn-hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: var(--color-text-light);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-hamburger:hover {
    background-color: var(--color-background-soft);
    color: var(--color-primary);
  }

  .hamburger-dropdown {
    display: block;
    position: absolute;
    top: 100%;
    right: 0;
    width: 280px;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 50;
    margin-top: 0.5rem;
    overflow: hidden;
  }

  .hamburger-signin {
    color: var(--color-primary) !important;
    font-weight: 600;
  }
  .hamburger-signin svg {
    color: var(--color-primary);
    stroke: var(--color-primary);
  }

  .hamburger-user-section {
    padding: 1rem;
  }

  .hamburger-user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .hamburger-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-border);
  }

  .hamburger-user-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .hamburger-user-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .hamburger-user-email {
    font-size: 0.75rem;
    color: var(--color-text-light);
  }

  .hamburger-menu-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hamburger-menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
    color: var(--color-text);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 8px;
  }

  .hamburger-menu-item:hover {
    background-color: var(--color-background-soft);
  }

  .hamburger-menu-item.logout {
    color: #ef4444;
  }

  .hamburger-menu-item.logout:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }

  .hamburger-menu-item svg {
    width: 20px;
    height: 20px;
    opacity: 0.7;
  }

  .hamburger-guest-section {
    padding: 1rem;
  }

  .hamburger-common-section {
    padding: 1rem;
    border-top: 1px solid var(--color-border);
  }
}

/* User profile and dropdown styles */
.guest-menu {
  display: flex;
  align-items: center;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-profile:hover {
  background-color: rgba(var(--color-text-light-rgb, 0, 0, 0), 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  display: none;
}

.dropdown-icon {
  color: var(--color-text-light);
  opacity: 0.7;
  transition: transform 0.2s ease;
}

.user-profile:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* User dropdown menu */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 50;
  margin-top: 0.5rem;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.dropdown-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dropdown-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.dropdown-email {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border);
}

.dropdown-menu {
  padding: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--color-background-soft);
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

/* 햄버거 메뉴 드롭다운 */
.hamburger-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 50;
  margin-top: 0.5rem;
  overflow: hidden;
}

.hamburger-user-section {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.hamburger-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hamburger-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.hamburger-user-details {
  display: flex;
  flex-direction: column;
}

.hamburger-user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.hamburger-user-email {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.hamburger-menu-items {
  padding: 0.5rem 0;
}

.hamburger-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-text);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.hamburger-menu-item:hover {
  background-color: var(--color-background-soft);
}

.hamburger-menu-item.logout {
  color: #ef4444;
}

.hamburger-menu-item.logout:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

.hamburger-menu-item svg {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.hamburger-common-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--color-border);
}

/* Loading skeleton */
.loading-menu {
  display: flex;
  align-items: center;
}

.loading-skeleton {
  width: 80px;
  height: 32px;
  background: linear-gradient(
    90deg,
    var(--color-background-soft) 25%,
    rgba(255, 255, 255, 0.5) 50%,
    var(--color-background-soft) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 6px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 스타일 추가 */
.hamburger-divider {
  width: 100%;
  height: 1px;
  background: var(--color-border);
  margin: 0.5rem 0;
}
</style>
