<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const premiumStore = usePremiumStore()
const authStore = useAuthStore()
const { checkoutSuccess } = useTracking()

onMounted(() => {
  // Étape 4 : paiement réussi, arrivée sur la page de confirmation
  if (premiumStore.isPremium && premiumStore.transactionId) {
    checkoutSuccess(PREMIUM_PRODUCT, premiumStore.transactionId)
  }
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 flex flex-col items-center text-center gap-6">

    <!-- Icône succès -->
    <div class="w-20 h-20 rounded-full bg-purple/10 flex items-center justify-center">
      <Icon name="lucide:crown" class="w-10 h-10 text-purple" />
    </div>

    <!-- Titre -->
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Bienvenue dans Premium !</h1>
      <p class="text-gray-500 text-sm">
        Félicitations<span v-if="authStore.getUser">, {{ authStore.getUser.name }}</span> !
        Votre abonnement est désormais actif.
      </p>
    </div>

    <!-- Badge premium -->
    <div class="flex items-center gap-2 bg-purple/5 border border-purple/20 rounded-xl px-5 py-3">
      <Icon name="lucide:star" class="w-4 h-4 text-purple" />
      <span class="text-sm font-bold text-purple">FundFlow Premium · Actif</span>
    </div>

    <!-- Fonctionnalités débloquées -->
    <div class="w-full flex flex-col gap-2 text-left">
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Fonctionnalités débloquées</p>
      <div
        v-for="feature in ['Rapports avancés & statistiques', 'Export CSV / PDF', 'Alertes budgétaires intelligentes', 'Accès multi-comptes', 'Support prioritaire 24/7']"
        :key="feature"
        class="flex items-center gap-3 text-sm text-gray-700"
      >
        <div class="w-5 h-5 rounded-full bg-purple/10 flex items-center justify-center shrink-0">
          <Icon name="lucide:check" class="w-3 h-3 text-purple" />
        </div>
        {{ feature }}
      </div>
    </div>

    <!-- CTA -->
    <NuxtLink
      to="/"
      class="w-full flex items-center justify-center gap-2 bg-purple hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all duration-200"
    >
      <Icon name="lucide:layout-dashboard" class="w-4 h-4" />
      Aller au tableau de bord
    </NuxtLink>

    <p class="text-xs text-gray-400">
      Vous pouvez gérer votre abonnement depuis votre profil à tout moment.
    </p>
  </div>
</template>
