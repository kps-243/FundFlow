<script setup lang="ts">
const premiumStore = usePremiumStore()
const router = useRouter()
const { viewProduct, addToCart } = useTracking()

onMounted(() => {
  viewProduct(PREMIUM_PRODUCT)
})

const confirmCancel = ref(false)

function handleCtaClick() {
  addToCart(PREMIUM_PRODUCT)
  router.push('/premium/checkout')
}

function handleDeactivate() {
  premiumStore.deactivate()
  confirmCancel.value = false
}

const freeFeatures = [
  'Suivi des transactions',
  'Gestion du budget par catégorie',
  'Tableau de bord de base',
  '1 compte utilisateur',
]

const premiumFeatures = [
  'Tout ce qui est inclus dans Gratuit',
  'Rapports avancés & statistiques',
  'Export CSV / PDF',
  'Alertes budgétaires intelligentes',
  'Accès multi-comptes',
  'Support prioritaire 24/7',
]
</script>

<template>
  <div class="container mx-auto px-4 py-8 flex flex-col gap-10">

    <TitlePage
      title="Choisissez votre plan"
      description="Débloquez toutes les fonctionnalités de FundFlow et gérez vos finances comme un pro."
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl w-full">

      <!-- Plan Gratuit -->
      <div class="bg-white rounded-2xl p-8 flex flex-col gap-6 border-2 border-transparent">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Gratuit</span>
          <div class="flex items-end gap-1 mt-1">
            <span class="text-4xl font-bold text-gray-800">0 €</span>
            <span class="text-gray-400 pb-1">/mois</span>
          </div>
          <p class="text-sm text-gray-500 mt-1">Pour commencer à gérer vos finances.</p>
        </div>

        <ul class="flex flex-col gap-3 flex-1">
          <li
            v-for="feature in freeFeatures"
            :key="feature"
            class="flex items-center gap-3 text-sm text-gray-600"
          >
            <div class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Icon name="lucide:check" class="w-3 h-3 text-gray-400" />
            </div>
            {{ feature }}
          </li>
        </ul>

        <div class="w-full text-center py-3 rounded-xl border-2 border-gray-200 text-gray-400 font-semibold text-sm cursor-default">
          {{ premiumStore.isPremium ? 'Plan de base' : 'Plan actuel' }}
        </div>
      </div>

      <!-- Plan Premium -->
      <div
        class="rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden shadow-lg transition-all duration-300"
        :class="premiumStore.isPremium ? 'bg-purple shadow-purple/30' : 'bg-purple shadow-purple/30'"
      >
        <div class="absolute top-5 right-5 flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
          <Icon name="lucide:star" class="w-3 h-3" />
          {{ premiumStore.isPremium ? 'Actif' : 'Recommandé' }}
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold text-white/60 uppercase tracking-widest">Premium</span>
          <div class="flex items-end gap-1 mt-1">
            <span class="text-4xl font-bold text-white">9,99 €</span>
            <span class="text-white/60 pb-1">/mois</span>
          </div>
          <p class="text-sm text-white/70 mt-1">Toutes les fonctionnalités pour des finances maîtrisées.</p>
        </div>

        <ul class="flex flex-col gap-3 flex-1">
          <li
            v-for="feature in premiumFeatures"
            :key="feature"
            class="flex items-center gap-3 text-sm text-white"
          >
            <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Icon name="lucide:check" class="w-3 h-3 text-white" />
            </div>
            {{ feature }}
          </li>
        </ul>

        <!-- CTA selon l'état -->
        <div v-if="premiumStore.isPremium" class="flex flex-col gap-3 mt-auto">
          <div class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 text-white font-bold">
            <Icon name="lucide:crown" class="w-4 h-4" />
            Plan actuel
          </div>

          <!-- Résiliation -->
          <div v-if="!confirmCancel">
            <button
              @click="confirmCancel = true"
              class="w-full text-center text-xs text-white/50 hover:text-white/80 transition-colors py-1"
            >
              Résilier mon abonnement
            </button>
          </div>

          <div v-else class="flex flex-col gap-2 bg-white/10 rounded-xl p-4">
            <p class="text-sm text-white font-semibold text-center">Confirmer la résiliation ?</p>
            <p class="text-xs text-white/60 text-center">Vous repasserez au plan Gratuit immédiatement.</p>
            <div class="flex gap-2 mt-1">
              <button
                @click="confirmCancel = false"
                class="flex-1 py-2 rounded-lg bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="handleDeactivate"
                class="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Résilier
              </button>
            </div>
          </div>
        </div>

        <button
          v-else
          @click="handleCtaClick"
          class="w-full flex items-center justify-center gap-2 bg-white text-purple font-bold py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          Passer à Premium
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Garantie -->
    <p class="text-sm text-gray-400 flex items-center gap-2 max-w-3xl">
      <Icon name="lucide:shield-check" class="w-4 h-4 shrink-0" />
      Satisfait ou remboursé sous 14 jours. Aucun engagement, résiliez à tout moment.
    </p>

  </div>
</template>
