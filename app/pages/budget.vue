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
</script>

<template>
  <div class="container mx-auto px-4 py-8 flex flex-col gap-10">
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

    <!-- Budget global card -->
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
            <span class="w-5 text-center text-sm">{{ cat.icon }}</span>
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

    <!-- Catégories -->
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

    <!-- Info si budget vide -->
    <div
      v-if="!budgetStore.hasAnyBudget"
      class="bg-white rounded-2xl p-8 text-center text-gray-400 flex flex-col gap-2 items-center"
    >
      <span class="text-4xl">💡</span>
      <p class="font-semibold">Aucun budget défini</p>
      <p class="text-sm">Cliquez sur "Modifier" dans une catégorie pour commencer.</p>
    </div>

    <!-- Résumé si données présentes -->
    <section v-else class="flex flex-col gap-3">
      <Title title="Résumé" />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl p-5 flex items-center gap-4">
          <span class="text-3xl">📊</span>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Catégorie principale</span>
            <span class="font-bold text-gray-800">
              {{ largestCategory?.icon }} {{ largestCategory?.label }}
              — {{ budgetStore.budgets[largestCategory!.key].toLocaleString('fr-FR') }} €
            </span>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-5 flex items-center gap-4">
          <span class="text-3xl">📂</span>
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
