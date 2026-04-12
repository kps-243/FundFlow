<script setup lang="ts">
import { currencies } from '~/stores/currency'

const authStore = useAuthStore()
const currencyStore = useCurrencyStore()
const router = useRouter()

onMounted(() => {
  currencyStore.fetchRates()
})

const showCurrencyMenu = ref(false)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function selectCurrency(code: typeof currencies[number]['code']) {
  currencyStore.setCurrency(code)
  showCurrencyMenu.value = false
}
</script>

<template>
  <div class="container mx-auto flex flex-col gap-5 lg:gap-8">
    <div class="flex justify-between items-center py-5 px-3 lg:px-0">
      <div class="flex items-center gap-2 lg:gap-4">
        <img src="/img/logo.png" alt="logo" class="lg:w-20 w-12 h-auto object-cover">
        <span class="lg:text-3xl text-2xl font-bold">FundFlow</span>
      </div>

      <div class="flex items-center gap-2 lg:gap-4">

        <!-- Sélecteur de devise -->
        <div class="relative">
          <button
            @click="showCurrencyMenu = !showCurrencyMenu"
            class="flex items-center gap-1.5 px-4 py-2 bg-purple hover:bg-white hover:text-black border border-transparent hover:border-gray-200 transition-all duration-100 text-white text-sm rounded-full cursor-pointer"
          >
            <Icon v-if="currencyStore.loading" name="lucide:loader-circle" class="w-3.5 h-3.5 animate-spin" />
            <span>{{ currencyStore.currentCurrency.code }}</span>
            <Icon name="lucide:chevron-down" class="w-3 h-3" />
          </button>

          <div
            v-if="showCurrencyMenu"
            class="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-36"
          >
            <button
              v-for="currency in currencies"
              :key="currency.code"
              @click="selectCurrency(currency.code)"
              class="w-full flex items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
              :class="currencyStore.selected === currency.code ? 'text-purple font-semibold' : 'text-gray-700'"
            >
              <span>{{ currency.code }}</span>
              <span class="text-gray-400 text-xs">{{ currency.symbol }}</span>
            </button>
          </div>

          <!-- Fermer le menu en cliquant ailleurs -->
          <div
            v-if="showCurrencyMenu"
            class="fixed inset-0 z-40"
            @click="showCurrencyMenu = false"
          />
        </div>

        <!-- Infos utilisateur + déconnexion -->
        <div class="flex items-center gap-3">
          <div class="hidden lg:flex flex-col items-end">
            <span class="text-sm font-semibold text-gray-800">{{ authStore.getUser?.name }}</span>
            <span class="text-xs text-gray-400">{{ authStore.getUser?.email }}</span>
          </div>
          <img src="/img/profile-default.png" alt="profile-default" class="w-10 lg:w-12 h-auto object-cover rounded-full">
          <button
            @click="handleLogout"
            class="px-3 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            title="Se déconnecter"
          >
            <Icon name="lucide:log-out" class="w-4 h-4" />
            <span class="hidden lg:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
