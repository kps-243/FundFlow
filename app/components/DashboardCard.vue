<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="bg-white rounded-2xl p-6 flex flex-col gap-4">
    <!-- Slot header : titre custom ou prop title -->
    <div class="flex items-center justify-between">
      <slot name="header">
        <Title v-if="title" :title="title" />
      </slot>
    </div>

    <!-- Slot par défaut : contenu de la carte -->
    <slot />

    <!-- Slot footer : lien, bouton, info en bas -->
    <div v-if="$slots.footer" class="mt-auto pt-2 border-t border-gray-100">
      <slot name="footer" />
    </div>
  </div>
</template>
