<script setup lang="ts">
    const props = defineProps<{
        link: string;
        label: string;
        svg: string;
    }>();
</script>

<template>
    <div>
        <nuxt-link :to="props.link" class="flex items-center gap-2 lg:gap-4 px-3 py-2 rounded-lg hover:bg-white hover:text-purple transition-all duration-100">
            <img :src="props.svg" :alt="'icon-' + props.label" class="w-5 h-auto object-cover">
            <span class="lg:text-lg font-bold">{{ props.label }}</span>
        </nuxt-link>
    </div>
</template>