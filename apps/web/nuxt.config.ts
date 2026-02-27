export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt', '@vueuse/nuxt'],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },
  app: {
    head: {
      title: 'abdurblog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A personal blog and portfolio' },
      ],
    },
  },
  compatibilityDate: '2024-04-03',
});
