<script setup lang="ts">
import { categories } from '~/stores/budget'

const budgetStore = useBudgetStore()
const transactionStore = useTransactionStore()
const authStore = useAuthStore()
const { format } = useCurrency()

onMounted(() => {
  budgetStore.init()
  transactionStore.init()
})

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#7662ea',
  loisirs: '#f59e0b',
  sante: '#ef4444',
  logement: '#3b82f6',
  alimentaire: '#10b981',
  education: '#8b5cf6'
}

const pieSlices = computed(() =>
  categories
    .filter(cat => budgetStore.budgets[cat.key] > 0)
    .map(cat => ({
      label: cat.label,
      icon: cat.icon,
      value: budgetStore.budgets[cat.key],
      color: CATEGORY_COLORS[cat.key]
    }))
)

const recentTransactions = computed(() =>
  transactionStore.sortedTransactions.slice(0, 5)
)

const categoryInfo = (key: string) => categories.find(c => c.key === key)
</script>

<template>
  <div class="container mx-auto px-4 py-8 flex flex-col gap-10">

    <TitlePage
      title="Dashboard"
      :description="`Bonjour ${authStore.getUser?.name}, voici l'aperçu de vos finances.`"
    />

    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardCard>
        <template #header>
          <span class="text-sm text-gray-500 flex items-center gap-2">
            <Icon name="lucide:wallet" class="w-4 h-4 text-purple" />
            Budget restant
          </span>
        </template>
        <span
          class="text-3xl font-bold"
          :class="budgetStore.totalBudget >= 0 ? 'text-purple' : 'text-red-500'"
        >
          {{ format(budgetStore.totalBudget) }}
        </span>
        <template #footer>
          <span class="text-xs text-gray-400">Solde actuel de tous vos budgets</span>
        </template>
      </DashboardCard>

      <DashboardCard>
        <template #header>
          <span class="text-sm text-gray-500 flex items-center gap-2">
            <Icon name="lucide:trending-down" class="w-4 h-4 text-red-400" />
            Total dépenses
          </span>
        </template>
        <span class="text-3xl font-bold text-red-500">
          -{{ format(transactionStore.totalDepenses) }}
        </span>
        <template #footer>
          <span class="text-xs text-gray-400">Toutes catégories confondues</span>
        </template>
      </DashboardCard>

      <DashboardCard>
        <template #header>
          <span class="text-sm text-gray-500 flex items-center gap-2">
            <Icon name="lucide:trending-up" class="w-4 h-4 text-green-400" />
            Total bénéfices
          </span>
        </template>
        <span class="text-3xl font-bold text-green-500">
          +{{ format(transactionStore.totalBenefices) }}
        </span>
        <template #footer>
          <span class="text-xs text-gray-400">Toutes catégories confondues</span>
        </template>
      </DashboardCard>
    </section>

    <!-- Camembert + transactions récentes -->
    <section class="flex flex-col lg:flex-row gap-6">

      <DashboardCard title="Répartition du budget" class="w-full lg:w-1/2">
        <PieChart :slices="pieSlices" />
        <template #footer>
          <NuxtLink to="/budget" class="text-sm text-purple font-semibold hover:underline">
            Gérer les budgets →
          </NuxtLink>
        </template>
      </DashboardCard>

      <DashboardCard title="Transactions récentes" class="w-full lg:w-1/2">
        <div v-if="recentTransactions.length === 0" class="flex flex-col items-center gap-2 py-6 text-gray-400">
          <Icon name="lucide:clipboard-list" class="w-10 h-10 text-gray-300" />
          <p class="text-sm">Aucune transaction pour le moment.</p>
        </div>

        <div v-else class="flex flex-col gap-2">
          <div
            v-for="t in recentTransactions"
            :key="t.id"
            class="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0"
          >
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  t.type === 'depense' ? 'bg-red-100' : 'bg-green-100'
                ]"
              >
                <Icon
                  :name="categoryInfo(t.categorie)?.icon ?? 'lucide:circle'"
                  :class="['w-4 h-4', t.type === 'depense' ? 'text-red-500' : 'text-green-500']"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-800 truncate max-w-36">{{ t.description }}</span>
                <span class="text-xs text-gray-400">{{ categoryInfo(t.categorie)?.label }}</span>
              </div>
            </div>
            <span
              class="font-bold text-sm shrink-0"
              :class="t.type === 'depense' ? 'text-red-500' : 'text-green-500'"
            >
              {{ t.type === 'depense' ? '-' : '+' }}{{ format(t.montant) }}
            </span>
          </div>
        </div>

        <template #footer>
          <NuxtLink to="/transactions" class="text-sm text-purple font-semibold hover:underline">
            Voir toutes les transactions →
          </NuxtLink>
        </template>
      </DashboardCard>
    </section>

    <!-- Budget par catégorie -->
    <section class="flex flex-col gap-4">
      <Title title="Budget par catégorie" />
      <div class="slider flex gap-4 overflow-x-auto py-2">
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="slide flex flex-col gap-3 min-w-48 bg-white rounded-2xl p-5 text-center justify-center items-center shrink-0"
        >
          <div class="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
            <Icon :name="cat.icon" class="w-5 h-5 text-purple" />
          </div>
          <span class="font-bold text-base">{{ cat.label }}</span>
          <span
            class="text-xl font-semibold"
            :class="budgetStore.budgets[cat.key] >= 0 ? 'text-purple' : 'text-red-500'"
          >
            {{ format(budgetStore.budgets[cat.key]) }}
          </span>
        </div>
      </div>
    </section>

  </div>
</template>
