import functions from "./sockets/index";

export default defineNuxtConfig({
  modules: ['nuxt-internal-socket'],
  socketIO: {
    /** Required */
    socketFunctions: functions,
    /** Optional - these are the defaults
     * managerOptions is of type ManagerOptions from the socket.io-client library
     */
    // clientOptions: {
    //   uri: "/", // If you want to connect to a different server than the one created by this plugin
    //   managerOptions: {},
    // },
  },
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
