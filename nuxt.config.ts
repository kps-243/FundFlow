// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  runtimeConfig: {
    public: {
      glitchtipDsn: 'https://3d16d73c5c044e4086cfee608e4357c0@app.glitchtip.com/24464',      // surcharge via NUXT_PUBLIC_GLITCHTIP_DSN
      umamiWebsiteId: '',    // surcharge via NUXT_PUBLIC_UMAMI_WEBSITE_ID
      umamiUrl: '',          // surcharge via NUXT_PUBLIC_UMAMI_URL
    }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
})
