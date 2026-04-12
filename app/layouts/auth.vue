<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="container mx-auto flex flex-col gap-5 lg:gap-8">
      <div class="flex justify-between items-center py-5 px-3 lg:px-0">
        <NuxtLink to="/" class="flex items-center gap-2 lg:gap-4">
          <img src="/img/logo.png" alt="logo" class="lg:w-20 w-12 h-auto object-cover">
          <span class="lg:text-3xl text-2xl font-bold">FundFlow</span>
        </NuxtLink>
      </div>
    </div>
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <slot />
    </main>
  </div>
</template>
