import { defineStore } from 'pinia'
import type { CategoryKey } from '~/stores/budget'
import { useBudgetStore } from '~/stores/budget'

export type TransactionType = 'depense' | 'benefice'

export interface Transaction {
  id: string
  montant: number
  categorie: CategoryKey
  type: TransactionType
  description: string
  date: string
}

function getStorageKey(userId: string): string {
  return `fundflow_transactions_${userId}`
}

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [] as Transaction[]
  }),

  getters: {
    sortedTransactions: (state): Transaction[] => {
      return [...state.transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    },

    spentByCategory: (state): Record<string, number> => {
      return state.transactions
        .filter(t => t.type === 'depense')
        .reduce((acc, t) => {
          acc[t.categorie] = (acc[t.categorie] ?? 0) + t.montant
          return acc
        }, {} as Record<string, number>)
    },

    beneficeByCategory: (state): Record<string, number> => {
      return state.transactions
        .filter(t => t.type === 'benefice')
        .reduce((acc, t) => {
          acc[t.categorie] = (acc[t.categorie] ?? 0) + t.montant
          return acc
        }, {} as Record<string, number>)
    },

    totalDepenses: (state): number => {
      return state.transactions
        .filter(t => t.type === 'depense')
        .reduce((sum, t) => sum + t.montant, 0)
    },

    totalBenefices: (state): number => {
      return state.transactions
        .filter(t => t.type === 'benefice')
        .reduce((sum, t) => sum + t.montant, 0)
    }
  },

  actions: {
    init() {
      if (import.meta.client) {
        const authStore = useAuthStore()
        const userId = authStore.getUser?.id
        if (!userId) return

        const stored = localStorage.getItem(getStorageKey(userId))
        this.transactions = stored ? JSON.parse(stored) : []
      }
    },

    addTransaction(data: Omit<Transaction, 'id' | 'date'>) {
      const transaction: Transaction = {
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString()
      }
      this.transactions.push(transaction)
      this.save()

      const budgetStore = useBudgetStore()
      budgetStore.applyTransaction(transaction.categorie, transaction.montant, transaction.type)
    },

    deleteTransaction(id: string) {
      const transaction = this.transactions.find(t => t.id === id)
      if (!transaction) return

      this.transactions = this.transactions.filter(t => t.id !== id)
      this.save()

      const budgetStore = useBudgetStore()
      budgetStore.reverseTransaction(transaction.categorie, transaction.montant, transaction.type)
    },

    save() {
      if (import.meta.client) {
        const authStore = useAuthStore()
        const userId = authStore.getUser?.id
        if (!userId) return

        localStorage.setItem(getStorageKey(userId), JSON.stringify(this.transactions))
      }
    },

    clear() {
      this.transactions = []
    }
  }
})
