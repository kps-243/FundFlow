<script setup lang="ts">
import type { CategoryKey } from '~/stores/budget'

const props = defineProps<{
  categoryKey: CategoryKey
  label: string
  icon: string
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

function startEdit() {
  isEditing.value = true
  nextTick(() => inputRef.value?.focus())
}

function confirmEdit() {
  const parsed = parseFloat(String(localValue.value))
  emit('update:modelValue', isNaN(parsed) ? 0 : parsed)
  isEditing.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') confirmEdit()
  if (e.key === 'Escape') {
    localValue.value = props.modelValue
    isEditing.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl p-5 flex flex-col gap-4 w-full">
    <div class="flex items-center gap-3">
      <span class="text-2xl">{{ icon }}</span>
      <span class="font-semibold text-gray-800">{{ label }}</span>
    </div>

    <div class="flex flex-col gap-2">
      <div v-if="!isEditing" class="flex items-center justify-between">
        <span class="text-2xl font-bold" :class="modelValue > 0 ? 'text-purple' : 'text-gray-300'">
          {{ modelValue.toLocaleString('fr-FR') }} €
        </span>
        <button
          @click="startEdit"
          class="text-sm text-gray-400 hover:text-purple transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-purple/10"
        >
          Modifier
        </button>
      </div>

      <div v-else class="flex items-center gap-2">
        <input
          ref="inputRef"
          v-model="localValue"
          type="number"
          min="0"
          @keydown="onKeydown"
          @blur="confirmEdit"
          class="w-full rounded-lg border border-purple px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple/50"
        />
        <button
          @click="confirmEdit"
          class="bg-purple text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold cursor-pointer"
        >
          OK
        </button>
      </div>

      <div class="w-full bg-gray-100 rounded-full h-1.5">
        <div
          class="bg-purple h-1.5 rounded-full transition-all duration-500"
          :style="{ width: modelValue > 0 ? '100%' : '0%' }"
        />
      </div>
    </div>
  </div>
</template>
