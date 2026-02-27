<script setup lang="ts">
    const props = defineProps<{
        title: string
    }>()
</script>

<template>
    <h2 class="text-lg lg:text-2xl font-bold mb-2">{{ title }}</h2>
</template>