<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const { errors, validateLogin, clearError } = useAuthForm()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const serverError = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  serverError.value = ''

  if (!validateLogin(form)) return

  isLoading.value = true

  await new Promise(resolve => setTimeout(resolve, 300))

  const result = authStore.login(form.email, form.password)

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
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Connexion</h1>
      <p class="text-gray-500 text-sm">Bienvenue ! Connectez-vous à votre compte.</p>
    </div>

    <div
      v-if="serverError"
      class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5"
    >
      {{ serverError }}
    </div>

    <div class="flex flex-col">
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
        placeholder="Votre mot de passe"
        name="password"
        :error="errors.password"
        @update:model-value="clearError('password')"
      />

      <button
        :disabled="isLoading"
        @click="handleSubmit"
        class="w-full bg-purple hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-300 mt-2"
      >
        {{ isLoading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </div>

    <p class="text-center text-sm text-gray-500 mt-6">
      Pas encore de compte ?
      <NuxtLink to="/register" class="text-purple font-semibold hover:underline">
        S'inscrire
      </NuxtLink>
    </p>
  </div>
</template>
