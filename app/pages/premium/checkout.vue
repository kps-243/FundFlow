<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const premiumStore = usePremiumStore()
const router = useRouter()
const { checkoutStart } = useTracking()

onMounted(() => {
  if (premiumStore.isPremium) {
    router.replace('/premium/success')
    return
  }
  // Étape 3 : l'utilisateur accède au formulaire de paiement
  checkoutStart(PREMIUM_PRODUCT)
})

const form = reactive({
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: ''
})

const errors = reactive({
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: ''
})

const isLoading = ref(false)

function validate() {
  errors.cardName = ''
  errors.cardNumber = ''
  errors.expiry = ''
  errors.cvv = ''

  let valid = true

  if (!form.cardName.trim()) {
    errors.cardName = 'Le nom est requis.'
    valid = false
  }
  if (form.cardNumber.replace(/\s/g, '').length !== 16) {
    errors.cardNumber = 'Numéro de carte invalide (16 chiffres).'
    valid = false
  }
  if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
    errors.expiry = 'Format invalide (MM/AA).'
    valid = false
  }
  if (!/^\d{3,4}$/.test(form.cvv)) {
    errors.cvv = 'CVV invalide (3 ou 4 chiffres).'
    valid = false
  }

  return valid
}

function onCardNumberInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16)
  form.cardNumber = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function onExpiryInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
  form.expiry = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw
}

function onCvvInput(e: Event) {
  form.cvv = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1400))
  premiumStore.activate()
  router.push('/premium/success')
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

    <!-- En-tête -->
    <div class="flex flex-col gap-2 mb-8">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center">
          <Icon name="lucide:crown" class="w-4 h-4 text-purple" />
        </div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Passer à Premium</h1>
      </div>
      <p class="text-gray-500 text-sm">Finalisez votre abonnement pour débloquer toutes les fonctionnalités.</p>
    </div>

    <!-- Récapitulatif -->
    <div class="bg-purple/5 border border-purple/20 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="lucide:star" class="w-4 h-4 text-purple" />
        <span class="text-sm font-semibold text-gray-800">FundFlow Premium</span>
      </div>
      <span class="text-sm font-bold text-purple">9,99 € / mois</span>
    </div>

    <!-- Formulaire de paiement -->
    <div class="flex flex-col gap-4">

      <!-- Nom sur la carte -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Nom sur la carte</label>
        <input
          v-model="form.cardName"
          type="text"
          placeholder="Jean Dupont"
          :class="[
            'w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors',
            errors.cardName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
          ]"
        />
        <p v-if="errors.cardName" class="text-red-500 text-xs mt-1">{{ errors.cardName }}</p>
      </div>

      <!-- Numéro de carte -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Numéro de carte</label>
        <div class="relative">
          <input
            :value="form.cardNumber"
            type="text"
            placeholder="0000 0000 0000 0000"
            inputmode="numeric"
            @input="onCardNumberInput"
            :class="[
              'w-full rounded-lg border px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors tracking-widest',
              errors.cardNumber ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            ]"
          />
          <Icon name="lucide:credit-card" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <p v-if="errors.cardNumber" class="text-red-500 text-xs mt-1">{{ errors.cardNumber }}</p>
      </div>

      <!-- Expiry + CVV -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Expiration</label>
          <input
            :value="form.expiry"
            type="text"
            placeholder="MM/AA"
            inputmode="numeric"
            @input="onExpiryInput"
            :class="[
              'w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors',
              errors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            ]"
          />
          <p v-if="errors.expiry" class="text-red-500 text-xs mt-1">{{ errors.expiry }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">CVV</label>
          <div class="relative">
            <input
              :value="form.cvv"
              type="text"
              placeholder="123"
              inputmode="numeric"
              @input="onCvvInput"
              :class="[
                'w-full rounded-lg border px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors',
                errors.cvv ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              ]"
            />
            <Icon name="lucide:lock" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <p v-if="errors.cvv" class="text-red-500 text-xs mt-1">{{ errors.cvv }}</p>
        </div>
      </div>

      <button
        :disabled="isLoading"
        @click="handleSubmit"
        class="w-full bg-purple hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 mt-2 flex items-center justify-center gap-2"
      >
        <Icon v-if="isLoading" name="lucide:loader-circle" class="w-4 h-4 animate-spin" />
        <Icon v-else name="lucide:lock" class="w-4 h-4" />
        {{ isLoading ? 'Traitement en cours...' : 'Payer 9,99 € / mois' }}
      </button>

      <p class="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Icon name="lucide:shield-check" class="w-3 h-3" />
        Paiement sécurisé · Résiliez à tout moment
      </p>
    </div>

    <p class="text-center text-sm text-gray-500 mt-6">
      <NuxtLink to="/premium" class="text-purple font-semibold hover:underline">
        ← Retour aux plans
      </NuxtLink>
    </p>
  </div>
</template>
