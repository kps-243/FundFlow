<script setup lang="ts">
import NavLink from './NavLink.vue'

const premiumStore = usePremiumStore()

const dashboardNavbar = [
  { label: 'Home', link: '/', icon: 'lucide:layout-dashboard' },
  { label: 'Transactions', link: '/transactions', icon: 'lucide:arrow-left-right' },
  { label: 'Budget', link: '/budget', icon: 'lucide:wallet' },
]
</script>

<template>
  <aside class="w-full lg:w-64 flex flex-col gap-3">
    <nav class="flex flex-col gap-3">
      <NavLink
        v-for="(item, index) in dashboardNavbar"
        :key="index"
        :link="item.link"
        :label="item.label"
        :icon="item.icon"
      />
    </nav>

    <!-- CTA Premium -->
    <div class="mt-auto pt-4">
      <NuxtLink
        to="/premium"
        v-if="!premiumStore.isPremium"
        class="flex items-center gap-3 px-3 py-3 rounded-xl bg-purple/10 hover:bg-purple/20 transition-all duration-200 group"
      >
        <div class="w-8 h-8 rounded-full bg-purple flex items-center justify-center shrink-0">
          <Icon name="lucide:crown" class="w-4 h-4 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-purple leading-tight">Passer à Premium</span>
          <span class="text-xs text-gray-400 leading-tight">9,99 € / mois</span>
        </div>
        <Icon name="lucide:arrow-right" class="w-4 h-4 text-purple ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
      </NuxtLink>

      <NuxtLink
        to="/premium"
        v-else
        class="flex items-center gap-3 px-3 py-3 rounded-xl bg-purple/10 transition-all duration-200"
      >
        <div class="w-8 h-8 rounded-full bg-purple flex items-center justify-center shrink-0">
          <Icon name="lucide:crown" class="w-4 h-4 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-purple leading-tight">Premium</span>
          <span class="text-xs text-gray-400 leading-tight">Abonnement actif</span>
        </div>
      </NuxtLink>
    </div>
  </aside>
</template>
