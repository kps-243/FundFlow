<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Slice {
  label: string
  value: number
  color: string
  icon: string
}

const props = defineProps<{
  slices: Slice[]
}>()

const chartData = computed(() => ({
  labels: props.slices.map(s => s.label),
  datasets: [
    {
      data: props.slices.map(s => s.value),
      backgroundColor: props.slices.map(s => s.color),
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 8
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        padding: 16,
        font: { size: 13 },
        usePointStyle: true,
        pointStyleWidth: 10
      }
    },
    tooltip: {
      callbacks: {
        label: (ctx: { parsed: number }) => {
          const total = props.slices.reduce((s, sl) => s + sl.value, 0)
          const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0
          return ` ${ctx.parsed.toLocaleString('fr-FR')} € (${pct}%)`
        }
      }
    }
  }
}

const isEmpty = computed(() => props.slices.every(s => s.value === 0) || props.slices.length === 0)
</script>

<template>
  <div class="w-full flex items-center justify-center" style="height: 260px;">
    <div v-if="isEmpty" class="flex flex-col items-center gap-2 text-gray-400">
      <Icon name="lucide:pie-chart" class="w-12 h-12 text-gray-300" />
      <p class="text-sm">Aucun budget défini</p>
    </div>
    <Doughnut v-else :data="chartData" :options="chartOptions" />
  </div>
</template>
