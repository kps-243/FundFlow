<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  label?: string
  error?: string
  name?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputType = ref(props.type ?? 'text')
const isPasswordVisible = ref(false)

function togglePassword() {
  isPasswordVisible.value = !isPasswordVisible.value
  inputType.value = isPasswordVisible.value ? 'text' : 'password'
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1 mb-4">
    <label v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative">
      <input
        :type="inputType"
        :placeholder="placeholder"
        :name="name"
        :value="modelValue"
        @input="onInput"
        :class="[
          'w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple/50 transition-colors',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
        ]"
      />
      <button
        v-if="props.type === 'password'"
        type="button"
        @click="togglePassword"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <span class="text-sm">{{ isPasswordVisible ? '🙈' : '👁️' }}</span>
      </button>
    </div>
    <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
  </div>
</template>
