import { defineStore } from 'pinia'

export const categories = [
  { key: 'transport', label: 'Transport', icon: 'lucide:car' },
  { key: 'loisirs', label: 'Loisirs', icon: 'lucide:gamepad-2' },
  { key: 'sante', label: 'Santé', icon: 'lucide:heart' },
  { key: 'logement', label: 'Logement', icon: 'lucide:home' },
  { key: 'alimentaire', label: 'Alimentaire', icon: 'lucide:shopping-cart' },
  { key: 'education', label: 'Éducation', icon: 'lucide:book-open' },
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

    applyTransaction(key: CategoryKey, amount: number, type: 'depense' | 'benefice') {
      if (type === 'depense') {
        this.budgets[key] -= amount
      } else {
        this.budgets[key] += amount
      }
      this.save()
    },

    reverseTransaction(key: CategoryKey, amount: number, type: 'depense' | 'benefice') {
      if (type === 'depense') {
        this.budgets[key] += amount
      } else {
        this.budgets[key] -= amount
      }
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
