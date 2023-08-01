// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  app: {
    head: {
      title: "Tiptap with Nuxt 3",
    },
  },
});
