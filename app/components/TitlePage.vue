<script setup lang="ts">
    const props = defineProps<{
        title: string,
        description: string
    }>()
</script>
<template>
    <section class="mb-4">
        <h1 class="text-lg lg:text-3xl font-bold mb-2">{{ props.title }}</h1>
        <p class="text-gray-600 text-sm lg:text-md">{{ props.description }}</p>
    </section>
</template>