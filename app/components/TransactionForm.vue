<script setup lang="ts">
import { categories } from '~/stores/budget'
import type { CategoryKey } from '~/stores/budget'
import type { TransactionType } from '~/stores/transaction'

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const transactionStore = useTransactionStore()

const form = reactive({
  montant: null as number | null,
  categorie: null as CategoryKey | null,
  type: 'depense' as TransactionType,
  description: ''
})

const errors = reactive({
  montant: '',
  categorie: '',
  description: ''
})

function validate(): boolean {
  errors.montant = ''
  errors.categorie = ''
  errors.description = ''

  if (!form.montant || form.montant <= 0) {
    errors.montant = 'Le montant doit être supérieur à 0.'
  }
  if (!form.categorie) {
    errors.categorie = 'Veuillez choisir une catégorie.'
  }
  if (!form.description.trim()) {
    errors.description = 'La description est requise.'
  }

  return !errors.montant && !errors.categorie && !errors.description
}

function handleSubmit() {
  if (!validate()) return

  transactionStore.addTransaction({
    montant: form.montant!,
    categorie: form.categorie!,
    type: form.type,
    description: form.description.trim()
  })

  emit('submit')
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
    <h2 class="text-xl font-bold mb-5">Nouvelle transaction</h2>

    <!-- Type toggle -->
    <div class="flex rounded-xl overflow-hidden border border-gray-200 mb-5">
      <button
        @click="form.type = 'depense'"
        :class="[
          'flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2',
          form.type === 'depense' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-50'
        ]"
      >
        <Icon name="lucide:trending-down" class="w-4 h-4" />
        Dépense
      </button>
      <button
        @click="form.type = 'benefice'"
        :class="[
          'flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2',
          form.type === 'benefice' ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-50'
        ]"
      >
        <Icon name="lucide:trending-up" class="w-4 h-4" />
        Bénéfice
      </button>
    </div>

    <!-- Montant -->
    <div class="flex flex-col gap-1 mb-4">
      <label class="text-sm font-medium text-gray-700">Montant (€)</label>
      <input
        v-model="form.montant"
        type="number"
        min="0"
        placeholder="0.00"
        :class="[
          'w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50',
          errors.montant ? 'border-red-400 bg-red-50' : 'border-gray-300'
        ]"
      />
      <p v-if="errors.montant" class="text-red-500 text-xs">{{ errors.montant }}</p>
    </div>

    <!-- Catégorie -->
    <div class="flex flex-col gap-1 mb-4">
      <label class="text-sm font-medium text-gray-700">Catégorie</label>
      <select
        v-model="form.categorie"
        :class="[
          'w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 bg-white',
          errors.categorie ? 'border-red-400 bg-red-50' : 'border-gray-300'
        ]"
      >
        <option :value="null" disabled>Choisir une catégorie</option>
        <option v-for="cat in categories" :key="cat.key" :value="cat.key">
          {{ cat.label }}
        </option>
      </select>
      <p v-if="errors.categorie" class="text-red-500 text-xs">{{ errors.categorie }}</p>
    </div>

    <!-- Description -->
    <div class="flex flex-col gap-1 mb-6">
      <label class="text-sm font-medium text-gray-700">Description</label>
      <input
        v-model="form.description"
        type="text"
        placeholder="Ex: Courses Monoprix"
        :class="[
          'w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50',
          errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
        ]"
      />
      <p v-if="errors.description" class="text-red-500 text-xs">{{ errors.description }}</p>
    </div>

    <div class="flex gap-3 justify-end">
      <button
        @click="emit('cancel')"
        class="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
      >
        Annuler
      </button>
      <button
        @click="handleSubmit"
        :class="[
          'px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer flex items-center gap-2',
          form.type === 'depense' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        ]"
      >
        <Icon name="lucide:check" class="w-4 h-4" />
        Confirmer
      </button>
    </div>
  </div>
</template>
