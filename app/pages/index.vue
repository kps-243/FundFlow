<script setup lang="ts">
  import Title from '~/components/Title.vue';
  import Button from '~/components/Button.vue';
  import BudgetCard from '~/components/BudgetCard.vue';
  import Input from '~/components/Input.vue';

  const budgetTotal = ref(0); 
  const revenu = ref(0);
  const depense = computed(() =>
    Object.values(depensesByCategorie.value).reduce(
      (total, value) => total + value,
      0
    )
  )
  // Modal state
  type ModalType = 'revenu' | 'depense' | null
  const modalType = ref<ModalType>(null)
  const montant = ref<number | null>(null)
  const categorie = ref<CategorieDepense | null>(null)  

  const categoriesDepense = [
    'Loisir',
    'Transport',
    'Santé',
    'Logement',
    'Éducation',
    'Alimentaire',
  ] as const

  type CategorieDepense = typeof categoriesDepense[number]

  const isOpen = computed(() => modalType.value !== null)

  const modalTitle = computed(() =>
    modalType.value === 'revenu'
      ? 'Ajouter un revenu'
      : 'Ajouter une dépense'
  )

  const modalDescription = computed(() =>
    modalType.value === 'revenu'
      ? 'Entrez le montant du revenu.'
      : 'Entrez le montant et la catégorie de la dépense.'
  )

  function openRevenuModal() {
    resetModal()
    modalType.value = 'revenu'
  }

  function openDepenseModal() {
    resetModal()
    modalType.value = 'depense'
  }

  function closeModal() {
    modalType.value = null
  }

  function resetModal() {
    montant.value = null
    categorie.value = null
  }

  // Handle confirm action for both revenu and depense
  const depensesByCategorie = ref<Record<CategorieDepense, number>>(
    Object.fromEntries(
      categoriesDepense.map(cat => [cat, 0])
    ) as Record<CategorieDepense, number>
  )
  function handleConfirm() {
    if (!montant.value) return

    if (modalType.value === 'revenu') {
      revenu.value += montant.value
      console.log('Revenu ajouté :', revenu.value)
    }

    if (modalType.value === 'depense' && categorie.value) {
      depensesByCategorie.value[categorie.value] += montant.value
    }
    budgetTotal.value = revenu.value - depense.value
    closeModal()
  }

  // BudgetCard data
  const cards = computed(() => [
  {
    title: 'Budget Total',
    card: {
      number: budgetTotal.value,
      description: 'Les Revenus + Les Dépenses',
    }
  },
  {
    title: 'Vos Revenus',
    card: {
      number: revenu.value,
      description: 'Revenus de votre projet',
      handle: openRevenuModal,
      textButton: 'Ajouter un revenu',
      button: true,
      variant: 'primary'
    }
  },
  {
    title: 'Vos Dépenses',
    card: {
      number: depense.value,
      description: 'Dépenses de votre projet',
      handle: openDepenseModal,
      textButton: 'Ajouter une dépense',
      button: true,
      variant: 'secondary'
    }
  }
])
</script>

<template>
  <div class="container mx-auto px-4 py-8 flex flex-col gap-16">
    <TitlePage title="Home" description="Consultez les détails de l'aperçu de vos projets" />

    <!-- Budget revenus section -->
    <section class="flex flex-col lg:flex-row gap-4 w-full">
      <div
        v-for="(item, index) in cards"
        :key="index"
        class="flex flex-col gap-5 w-1/3 text-center"
      >
        <Title :title="item.title" />
        <BudgetCard v-bind="item.card" />
      </div>
    </section>

    <!-- modal found -->
    <div v-if="isOpen" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="closeModal"
      ></div>
      <div class="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div class="bg-gray-100 rounded-2xl shadow-xl w-full max-w-md p-6">
          <h2 class="text-xl lg:text-2xl font-bold mb-2">
            {{ modalTitle }}
          </h2>
          <p class="text-gray-600 text-sm lg:text-base mb-6">
            {{ modalDescription }}
          </p>
          <Input v-model="montant" type="number" placeholder="Montant en euros" />
          <select
            v-if="modalType === 'depense'"
            v-model="categorie"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 mb-6"
          >
            <option :value="null" disabled>Choisir une catégorie</option>
            <option
              v-for="cat in categoriesDepense"
              :key="cat"
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
          <div class="flex justify-end gap-3">
            <Button text="Annuler" variant="secondary" @onClick="closeModal" />
            <Button text="Confirmer" variant="primary" @onClick="handleConfirm" />
          </div>
        </div>
      </div>
    </div>


    <!-- Budget depense type section -->
    <section class="flex flex-col gap-5">
      <Title title="Dépenses par catégorie" />
      <div class="slider flex gap-5 overflow-x-auto py-2">
        <div
          v-for="cat in categoriesDepense"
          :key="cat"
          class="slide flex flex-col gap-3 min-w-50 bg-white rounded-2xl p-5 text-center justify-start items-center"
        >
          <div class="flex flex-col gap-2">
            <span class="font-bold text-xl">{{ cat }}</span>
            <span class="text-sm text-gray-500">Dépenses totales pour {{ cat }}</span>
          </div>
          <span class="text-2xl font-semibold mt-2">{{ depensesByCategorie[cat]  }}€</span>
        </div>
      </div>
    </section>
  </div>
</template>
