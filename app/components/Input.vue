<script setup lang="ts">
const props = defineProps<{
  modelValue: number | null
  type?: string
  placeholder?: string
  name?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit(
    'update:modelValue',
    target.value === '' ? null : Number(target.value)
  )
}
</script>

<template>
  <input
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :name="name"
    :value="modelValue ?? ''"
    @input="onInput"
    class="w-full rounded-lg border border-gray-300 px-4 py-3 mb-4
           focus:outline-none focus:ring-2 focus:ring-purple/50"
  />
</template>