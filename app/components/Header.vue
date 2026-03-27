<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
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
        <button class="px-4 py-2 bg-purple hover:bg-white hover:text-black transition-all duration-100 text-white text-sm lg:text-md rounded-full cursor-pointer">USD</button>
        <div class="flex items-center gap-3">
          <div class="hidden lg:flex flex-col items-end">
            <span class="text-sm font-semibold text-gray-800">{{ authStore.getUser?.name }}</span>
            <span class="text-xs text-gray-400">{{ authStore.getUser?.email }}</span>
          </div>
          <img src="/img/profile-default.png" alt="profile-default" class="w-10 lg:w-12 h-auto object-cover rounded-full">
          <button
            @click="handleLogout"
            class="px-3 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
            title="Se déconnecter"
          >
            <span class="hidden lg:inline">Déconnexion</span>
            <span class="lg:hidden">↪</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
