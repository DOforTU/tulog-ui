# TULOG UI - Vue

## Project Structure

### ui-vue/ Folder

- **Vue Version**: 3.5.17
- **Vite Version**: 7.0.0
- **TypeScript**: 5.8.x

### Project Folder Structure

```
ui-vue/
├── public/                          # Static assets served directly
│   ├── default-avatar.svg
│   ├── favicon.png
│   ├── samplePosts.json
│   ├── tulog_text_logo_black.png
│   └── tulog_text_logo_white.png
├── src/                             # Source code directory
│   ├── App.vue                      # Root Vue component
│   ├── main.ts                      # Application entry point
│   ├── assets/                      # Build-time assets (CSS, images)
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components/                  # Reusable Vue components
│   │   ├── HelloWorld.vue
│   │   ├── TheWelcome.vue
│   │   ├── WelcomeItem.vue
│   │   ├── icons/                   # Icon components
│   │   └── layout/                  # Layout components
│   ├── composables/                 # Vue composition functions
│   ├── lib/                         # Utility libraries and helpers
│   ├── router/                      # Vue Router configuration
│   ├── stores/                      # Pinia store definitions
│   └── views/                       # Page-level components
├── package.json                     # Project dependencies and scripts
├── vite.config.ts                   # Vite build configuration
├── tsconfig.json                    # TypeScript configuration
└── eslint.config.ts                 # ESLint configuration
```

### Tech Stack

- **Framework**: Vue.js 3.5.17
- **Build Tool**: Vite 7.0.0
- **State Management**: Pinia 3.0.3
- **Routing**: Vue Router 4.5.1
- **Language**: TypeScript
- **Development Tools**: ESLint, Prettier, Vue DevTools

### Development Server

```bash
cd ui-vue
npm run dev
```

### Build

```bash
cd ui-vue
npm run build
```

### Key Features

- Vue 3.5.17 with Composition API
- Vite 7.0.0 for fast development and building
- TypeScript support with strict type checking
- Pinia for modern state management
- Vue Router for client-side routing
- ESLint and Prettier for code quality
- Vue DevTools integration for enhanced debugging

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
