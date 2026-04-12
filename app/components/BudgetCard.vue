<script setup lang="ts">
    import Button from '~/components/Button.vue';

    const props = defineProps<{
        number: number;
        description?: string;
        textButton?: string;
        color?: string;
        button?: boolean;
        variant?: 'primary' | 'secondary';
        handle?: () => void;
    }>();

</script>
<template>
    <div class="flex flex-col gap-7 justify-center items-center bg-white rounded-2xl p-7 w-full">
      <div class="flex flex-col text-center justify-center items-center gap-7">
        <div class="flex flex-col gap-4">
          <span class="font-bold text-3xl" :class="props.color ? `${props.color}` : ''">{{ props.number }}€</span>
          <span class="text-sm text-gray-500">{{ props.description }}</span>
        </div>
        <Button v-if="props.button !== false" @onClick="props.handle" :text="props.textButton || '+ Ajouter des fonds'"   :variant="props.variant"/>
      </div>
    </div>
</template>