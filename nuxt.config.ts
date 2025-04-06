// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    scanPageMeta: "after-resolve",
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    normalizeComponentNames: false,
    spaLoadingTemplateLocation: "within",
    defaults: {
      useAsyncData: {
        deep: true,
      },
    },
  },

  features: {
    inlineStyles: true,
  },

  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false,
    },
  },

  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/leaflet",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
  ],

  runtimeConfig: {
    public: {
      apiUrl: "http://localhost:3000/api",
    },
  },
});
