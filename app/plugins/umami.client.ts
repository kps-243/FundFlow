export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const websiteId = config.public.umamiWebsiteId as string
  const umamiUrl = config.public.umamiUrl as string

  if (!websiteId || !umamiUrl) return

  useHead({
    script: [
      {
        src: `${umamiUrl}/script.js`,
        defer: true,
        'data-website-id': websiteId,
        // Umami gère automatiquement les changements de route SPA
        'data-auto-track': 'true',
      }
    ]
  })
})
