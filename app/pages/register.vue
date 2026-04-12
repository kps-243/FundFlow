<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { errors, validateRegister, clearError } = useAuthForm()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const serverError = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  serverError.value = ''

  if (!validateRegister(form)) return

  isLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 300))

  const result = authStore.register(form.name, form.email, form.password)

  if (!result.success) {
    serverError.value = result.error ?? 'Une erreur est survenue.'
  } else {
    router.push('/')
  }

  isLoading.value = false
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
    <div class="flex flex-col gap-2 mb-8">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Créer un compte</h1>
      <p class="text-gray-500 text-sm">Rejoignez FundFlow pour gérer vos finances.</p>
    </div>

    <div
      v-if="serverError"
      class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5"
    >
      {{ serverError }}
    </div>

    <div class="flex flex-col">
      <FormInput
        v-model="form.name"
        type="text"
        label="Nom complet"
        placeholder="Jean Dupont"
        name="name"
        :error="errors.name"
        @update:model-value="clearError('name')"
      />
      <FormInput
        v-model="form.email"
        type="email"
        label="Adresse email"
        placeholder="jean@exemple.com"
        name="email"
        :error="errors.email"
        @update:model-value="clearError('email')"
      />
      <FormInput
        v-model="form.password"
        type="password"
        label="Mot de passe"
        placeholder="Minimum 6 caractères"
        name="password"
        :error="errors.password"
        @update:model-value="clearError('password')"
      />
      <FormInput
        v-model="form.confirmPassword"
        type="password"
        label="Confirmer le mot de passe"
        placeholder="Répétez votre mot de passe"
        name="confirmPassword"
        :error="errors.confirmPassword"
        @update:model-value="clearError('confirmPassword')"
      />

      <button
        :disabled="isLoading"
        @click="handleSubmit"
        class="w-full bg-purple hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2"
      >
        {{ isLoading ? 'Création en cours...' : 'Créer mon compte' }}
      </button>
    </div>

    <p class="text-center text-sm text-gray-500 mt-6">
      Vous avez déjà un compte ?
      <NuxtLink to="/login" class="text-purple font-semibold hover:underline">
        Se connecter
      </NuxtLink>
    </p>
  </div>
</template>
