import { defineStore } from 'pinia'

function storageKey(userId: string) {
  return `fundflow_premium_${userId}`
}

function txKey(userId: string) {
  return `fundflow_premium_tx_${userId}`
}

export const usePremiumStore = defineStore('premium', {
  state: () => ({
    isPremium: false as boolean,
    transactionId: '' as string
  }),

  getters: {
    planLabel: (state) => state.isPremium ? 'Premium' : 'Gratuit'
  },

  actions: {
    init() {
      if (!import.meta.client) return
      const userId = useAuthStore().getUser?.id
      if (!userId) {
        this.isPremium = false
        this.transactionId = ''
        return
      }
      this.isPremium = localStorage.getItem(storageKey(userId)) === 'true'
      this.transactionId = localStorage.getItem(txKey(userId)) ?? ''
    },

    activate() {
      if (!import.meta.client) return
      const userId = useAuthStore().getUser?.id
      if (!userId) return
      const txId = crypto.randomUUID()
      this.isPremium = true
      this.transactionId = txId
      localStorage.setItem(storageKey(userId), 'true')
      localStorage.setItem(txKey(userId), txId)
    },

    deactivate() {
      if (!import.meta.client) return
      const userId = useAuthStore().getUser?.id
      if (!userId) return
      this.isPremium = false
      this.transactionId = ''
      localStorage.removeItem(storageKey(userId))
      localStorage.removeItem(txKey(userId))
    },

    clear() {
      this.isPremium = false
      this.transactionId = ''
    }
  }
})
