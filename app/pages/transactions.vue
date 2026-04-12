<script setup lang="ts">
import { categories } from '~/stores/budget'

const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()

onMounted(() => {
  budgetStore.init()
  transactionStore.init()
})

const showForm = ref(false)
const filterType = ref<'all' | 'depense' | 'benefice'>('all')
const filterCategorie = ref<string>('all')
const deleteConfirmId = ref<string | null>(null)

const filteredTransactions = computed(() => {
  return transactionStore.sortedTransactions.filter(t => {
    const matchType = filterType.value === 'all' || t.type === filterType.value
    const matchCat = filterCategorie.value === 'all' || t.categorie === filterCategorie.value
    return matchType && matchCat
  })
})

function handleDelete(id: string) {
  deleteConfirmId.value = id
}

function confirmDelete() {
  if (deleteConfirmId.value) {
    transactionStore.deleteTransaction(deleteConfirmId.value)
    deleteConfirmId.value = null
  }
}

const solde = computed(() =>
  transactionStore.totalBenefices - transactionStore.totalDepenses
)
</script>

<template>
  <div class="container mx-auto px-4 py-8 flex flex-col gap-10">
    <div class="flex items-start justify-between flex-wrap gap-4">
      <TitlePage
        title="Transactions"
        description="Suivez l'ensemble de vos dépenses et bénéfices par catégorie."
      />
      <button
        @click="showForm = true"
        class="bg-purple hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        Nouvelle transaction
      </button>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 flex flex-col gap-1">
        <span class="text-sm text-gray-500">Total dépenses</span>
        <span class="text-2xl font-bold text-red-500">
          -{{ transactionStore.totalDepenses.toLocaleString('fr-FR') }} €
        </span>
      </div>
      <div class="bg-white rounded-2xl p-5 flex flex-col gap-1">
        <span class="text-sm text-gray-500">Total bénéfices</span>
        <span class="text-2xl font-bold text-green-500">
          +{{ transactionStore.totalBenefices.toLocaleString('fr-FR') }} €
        </span>
      </div>
      <div class="bg-white rounded-2xl p-5 flex flex-col gap-1">
        <span class="text-sm text-gray-500">Solde net</span>
        <span
          class="text-2xl font-bold"
          :class="solde >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          {{ solde >= 0 ? '+' : '' }}{{ solde.toLocaleString('fr-FR') }} €
        </span>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <Title title="Impact sur le budget" />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="bg-white rounded-xl p-4 flex flex-col gap-2"
        >
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-2 font-semibold text-sm">
              <Icon :name="cat.icon" class="w-4 h-4 text-purple" />
              {{ cat.label }}
            </span>
            <span
              class="text-sm font-bold"
              :class="budgetStore.budgets[cat.key] >= 0 ? 'text-green-500' : 'text-red-500'"
            >
              {{ budgetStore.budgets[cat.key].toLocaleString('fr-FR') }} €
            </span>
          </div>
          <div class="flex justify-between text-xs text-gray-400">
            <span>Budget actuel : {{ budgetStore.budgets[cat.key].toLocaleString('fr-FR') }} €</span>
            <span>Dépensé : {{ (transactionStore.spentByCategory[cat.key] ?? 0).toLocaleString('fr-FR') }} €</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full transition-all duration-500 bg-purple"
              :style="{ width: '100%' }"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <Title title="Historique" />
        <div class="flex gap-2 ml-auto flex-wrap">
          <select
            v-model="filterType"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple/50"
          >
            <option value="all">Tous les types</option>
            <option value="depense">Dépenses</option>
            <option value="benefice">Bénéfices</option>
          </select>
          <select
            v-model="filterCategorie"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple/50"
          >
            <option value="all">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat.key" :value="cat.key">
              {{ cat.label }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="filteredTransactions.length === 0" class="bg-white rounded-2xl p-8 text-center text-gray-400 flex flex-col gap-2 items-center">
        <Icon name="lucide:clipboard-list" class="w-10 h-10 text-gray-300" />
        <p class="font-semibold">Aucune transaction</p>
        <p class="text-sm">Ajoutez votre première transaction pour commencer.</p>
      </div>

      <div v-else class="flex flex-col gap-2">
        <TransactionRow
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          :transaction="transaction"
          @delete="handleDelete"
        />
      </div>
    </section>

    <div v-if="showForm" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="showForm = false"
      />
      <div class="relative z-10 flex min-h-screen items-center justify-center px-4">
        <TransactionForm
          @submit="showForm = false"
          @cancel="showForm = false"
        />
      </div>
    </div>

    <div v-if="deleteConfirmId" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="deleteConfirmId = null" />
      <div class="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
          <h3 class="text-lg font-bold">Supprimer la transaction ?</h3>
          <p class="text-sm text-gray-500">Cette action est irréversible et impactera votre budget.</p>
          <div class="flex gap-3 justify-end">
            <button
              @click="deleteConfirmId = null"
              class="px-5 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              @click="confirmDelete"
              class="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold cursor-pointer"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
