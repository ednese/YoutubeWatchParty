export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      youtubeApiKey: process.env.NUXT_YOUTUBE_API_KEY
    }
  },
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  css: [
    "~/assets/css/tailwind.css"
  ],
})
