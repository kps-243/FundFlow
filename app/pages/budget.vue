<script setup lang="ts">
import { categories } from '~/stores/budget'
import type { CategoryKey } from '~/stores/budget'

const budgetStore = useBudgetStore()

onMounted(() => {
  budgetStore.init()
})

const totalBudget = computed(() => budgetStore.totalBudget)

const largestCategory = computed(() => {
  if (!budgetStore.hasAnyBudget) return null
  return categories.reduce((max, cat) =>
    budgetStore.budgets[cat.key] > budgetStore.budgets[max.key] ? cat : max
  )
})

function updateBudget(key: CategoryKey, value: number) {
  budgetStore.setCategoryBudget(key, value)
}

function handleReset() {
  budgetStore.reset()
}

const showResetConfirm = ref(false)

const negativeAlerts = ref<string[]>([])

watch(
  () => ({ ...budgetStore.budgets }),
  (newBudgets, oldBudgets) => {
    if (!oldBudgets) return
    const newNegatives = categories
      .filter(cat => newBudgets[cat.key] < 0 && oldBudgets[cat.key] >= 0)
      .map(cat => cat.label)

    if (newNegatives.length > 0) {
      negativeAlerts.value.push(...newNegatives)
    }
  },
  { deep: true }
)

function dismissAlert(label: string) {
  negativeAlerts.value = negativeAlerts.value.filter(a => a !== label)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 flex flex-col gap-10">

    <div
      v-for="label in negativeAlerts"
      :key="label"
      class="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3"
    >
      <div class="flex items-center gap-2">
        <Icon name="lucide:alert-triangle" class="w-4 h-4 shrink-0" />
        <span class="text-sm font-medium">
          Le budget <strong>{{ label }}</strong> est passé en négatif suite à une transaction.
        </span>
      </div>
      <button @click="dismissAlert(label)" class="cursor-pointer text-red-400 hover:text-red-600">
        <Icon name="lucide:x" class="w-4 h-4" />
      </button>
    </div>
    <div class="flex items-start justify-between flex-wrap gap-4">
      <TitlePage
        title="Budget"
        description="Définissez vos budgets par catégorie pour mieux gérer vos dépenses."
      />
      <button
        v-if="budgetStore.hasAnyBudget && !showResetConfirm"
        @click="showResetConfirm = true"
        class="text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
      >
        Réinitialiser
      </button>
      <div v-if="showResetConfirm" class="flex items-center gap-2">
        <span class="text-sm text-gray-500">Confirmer la réinitialisation ?</span>
        <button
          @click="handleReset(); showResetConfirm = false"
          class="text-sm text-red-500 font-semibold hover:underline cursor-pointer"
        >
          Oui
        </button>
        <button
          @click="showResetConfirm = false"
          class="text-sm text-gray-400 hover:underline cursor-pointer"
        >
          Non
        </button>
      </div>
    </div>

    <section class="flex flex-col gap-3">
      <Title title="Budget global" />
      <div class="bg-white rounded-2xl p-7 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div class="flex flex-col gap-2 text-center lg:text-left">
          <span class="text-5xl font-bold text-purple">
            {{ totalBudget.toLocaleString('fr-FR') }} €
          </span>
          <span class="text-gray-500 text-sm">Somme de toutes vos catégories</span>
        </div>

        <div class="flex flex-col gap-3 w-full lg:w-1/2">
          <div
            v-for="cat in categories"
            :key="cat.key"
            class="flex items-center gap-2"
          >
            <Icon :name="cat.icon" class="w-4 h-4 text-purple shrink-0" />
            <span class="text-sm text-gray-600 w-24 shrink-0">{{ cat.label }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-2">
              <div
                class="bg-purple h-2 rounded-full transition-all duration-500"
                :style="{
                  width: totalBudget > 0
                    ? `${(budgetStore.budgets[cat.key] / totalBudget) * 100}%`
                    : '0%'
                }"
              />
            </div>
            <span class="text-sm font-semibold text-gray-700 w-16 text-right">
              {{ budgetStore.budgets[cat.key].toLocaleString('fr-FR') }} €
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <Title title="Par catégorie" />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BudgetCategoryCard
          v-for="cat in categories"
          :key="cat.key"
          :category-key="cat.key"
          :label="cat.label"
          :icon="cat.icon"
          :model-value="budgetStore.budgets[cat.key]"
          @update:model-value="(val) => updateBudget(cat.key, val)"
        />
      </div>
    </section>

    <div
      v-if="!budgetStore.hasAnyBudget"
      class="bg-white rounded-2xl p-8 text-center text-gray-400 flex flex-col gap-2 items-center"
    >
      <Icon name="lucide:lightbulb" class="w-10 h-10 text-gray-300" />
      <p class="font-semibold">Aucun budget défini</p>
      <p class="text-sm">Cliquez sur "Modifier" dans une catégorie pour commencer.</p>
    </div>

    <section v-else class="flex flex-col gap-3">
      <Title title="Résumé" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl p-5 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center shrink-0">
            <Icon name="lucide:trophy" class="w-5 h-5 text-purple" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Catégorie principale</span>
            <span class="font-bold text-gray-800 flex items-center gap-1.5">
              <Icon :name="largestCategory?.icon ?? 'lucide:circle'" class="w-4 h-4 text-purple" />
              {{ largestCategory?.label }}
              — {{ budgetStore.budgets[largestCategory!.key].toLocaleString('fr-FR') }} €
            </span>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-5 flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center shrink-0">
            <Icon name="lucide:folder" class="w-5 h-5 text-purple" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Catégories renseignées</span>
            <span class="font-bold text-gray-800">
              {{ categories.filter(c => budgetStore.budgets[c.key] > 0).length }} / {{ categories.length }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
