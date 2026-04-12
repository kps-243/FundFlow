<script setup lang="ts">
import { categories } from '~/stores/budget'
import type { Transaction } from '~/stores/transaction'

const props = defineProps<{
  transaction: Transaction
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const categoryInfo = computed(() =>
  categories.find(c => c.key === props.transaction.categorie)
)

const formattedDate = computed(() => {
  return new Date(props.transaction.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})
</script>

<template>
  <div class="flex items-center justify-between gap-3 bg-white rounded-xl px-5 py-4">
    <div class="flex items-center gap-4 min-w-0">
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          transaction.type === 'depense' ? 'bg-red-100' : 'bg-green-100'
        ]"
      >
        <Icon
          :name="categoryInfo?.icon ?? 'lucide:circle'"
          :class="['w-5 h-5', transaction.type === 'depense' ? 'text-red-500' : 'text-green-500']"
        />
      </div>
      <div class="flex flex-col min-w-0">
        <span class="font-semibold text-gray-800 truncate">{{ transaction.description }}</span>
        <span class="text-xs text-gray-400">{{ categoryInfo?.label }} · {{ formattedDate }}</span>
      </div>
    </div>

    <div class="flex items-center gap-4 shrink-0">
      <span
        :class="[
          'font-bold text-lg',
          transaction.type === 'depense' ? 'text-red-500' : 'text-green-500'
        ]"
      >
        {{ transaction.type === 'depense' ? '-' : '+' }}{{ transaction.montant.toLocaleString('fr-FR') }} €
      </span>
      <button
        @click="emit('delete', transaction.id)"
        class="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
        title="Supprimer"
      >
        <Icon name="lucide:x" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
