<script setup lang="ts">
    const props = defineProps<{
  text: string
  variant?: 'primary' | 'secondary'
}>()

const bgClass = props.variant === 'secondary'
  ? 'bg-white hover:bg-gray-100 text-black hover:text-purple border border-gray-300'
  : 'bg-purple hover:bg-purple-700 text-white'
</script>
<template>
    <button :class="`${bgClass} font-semibold py-2 px-7 rounded-xl transition-all duration-300 ease-in-out`" @click="$emit('onClick')">
        {{ props.text }}
    </button>
</template>