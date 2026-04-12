<script setup lang="ts">
import NavLink from './NavLink.vue'

const dashboardNavbar = [
  { label: 'Home', link: '/', icon: 'lucide:layout-dashboard' },
  { label: 'Transactions', link: '/transactions', icon: 'lucide:arrow-left-right' },
  { label: 'Budget', link: '/budget', icon: 'lucide:wallet' },
]
</script>

<template>
  <aside class="w-full lg:w-64">
    <nav class="h-full flex flex-col gap-3">
      <NavLink
        v-for="(item, index) in dashboardNavbar"
        :key="index"
        :link="item.link"
        :label="item.label"
        :icon="item.icon"
      />
    </nav>
  </aside>
</template>
