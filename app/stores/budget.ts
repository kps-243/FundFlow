import { defineStore } from 'pinia'

export const categories = [
  { key: 'transport', label: 'Transport', icon: '🚗' },
  { key: 'loisirs', label: 'Loisirs', icon: '🎮' },
  { key: 'sante', label: 'Santé', icon: '❤️' },
  { key: 'logement', label: 'Logement', icon: '🏠' },
  { key: 'alimentaire', label: 'Alimentaire', icon: '🛒' },
  { key: 'education', label: 'Éducation', icon: '📚' },
] as const

export type CategoryKey = typeof categories[number]['key']

export type BudgetData = Record<CategoryKey, number>

const defaultBudget: BudgetData = {
  transport: 0,
  loisirs: 0,
  sante: 0,
  logement: 0,
  alimentaire: 0,
  education: 0,
}

function getStorageKey(userId: string): string {
  return `fundflow_budget_${userId}`
}

export const useBudgetStore = defineStore('budget', {
  state: () => ({
    budgets: { ...defaultBudget } as BudgetData,
  }),

  getters: {
    totalBudget: (state): number => {
      return Object.values(state.budgets).reduce((sum, val) => sum + val, 0)
    },

    budgetByCategory: (state) => (key: CategoryKey): number => {
      return state.budgets[key]
    },

    hasAnyBudget: (state): boolean => {
      return Object.values(state.budgets).some(v => v > 0)
    }
  },

  actions: {
    init() {
      if (import.meta.client) {
        const authStore = useAuthStore()
        const userId = authStore.getUser?.id
        if (!userId) return

        const stored = localStorage.getItem(getStorageKey(userId))
        this.budgets = stored
          ? { ...defaultBudget, ...JSON.parse(stored) }
          : { ...defaultBudget }
      }
    },

    setCategoryBudget(key: CategoryKey, amount: number) {
      this.budgets[key] = Math.max(0, amount)
      this.save()
    },

    save() {
      if (import.meta.client) {
        const authStore = useAuthStore()
        const userId = authStore.getUser?.id
        if (!userId) return

        localStorage.setItem(getStorageKey(userId), JSON.stringify(this.budgets))
      }
    },

    reset() {
      if (import.meta.client) {
        const authStore = useAuthStore()
        const userId = authStore.getUser?.id
        if (userId) {
          localStorage.removeItem(getStorageKey(userId))
        }
      }
      this.budgets = { ...defaultBudget }
    },

    clear() {
      this.budgets = { ...defaultBudget }
    }
  }
})
