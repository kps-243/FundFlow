import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const dsn = config.public.glitchtipDsn as string

  if (!dsn) return

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
    beforeSend(event) {
      // RGPD : supprimer toute donnée personnelle avant envoi
      if (event.user) {
        event.user = { id: event.user.id }
      }
      return event
    }
  })

  return {
    provide: {
      captureException: (e: unknown) => Sentry.captureException(e),
      addBreadcrumb: (b: Sentry.Breadcrumb) => Sentry.addBreadcrumb(b),
    }
  }
})
