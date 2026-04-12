<script setup lang="ts">
    import NavLink from './NavLink.vue';
    const dashboardNavbar = [
        {
            label: 'Home',
            link: '/',
            svg: '/img/svg/home.svg'
        },
        {
            label: 'Transactions',
            link: '/transactions',
            svg: '/img/svg/transaction.svg'
        },
        {
            label: 'Budget',
            link: '/budget',
            svg: '/img/svg/budget.svg'
        },
        {
            label: 'Reports',
            link: '/reports',
            svg: '/img/svg/report.svg'
        },
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
          :svg="item.svg"
        />
      </nav>
    </aside>
</template>