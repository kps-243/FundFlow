import { defineStore } from 'pinia'

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CHF'

export const currencies: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'USD', symbol: '$', label: 'Dollar US' },
  { code: 'GBP', symbol: '£', label: 'Livre sterling' },
  { code: 'CHF', symbol: 'CHF', label: 'Franc suisse' }
]

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    selected: 'EUR' as CurrencyCode,
    rates: {} as Record<string, number>,
    loading: false,
    error: ''
  }),

  getters: {
    currentCurrency: (state) =>
      currencies.find(c => c.code === state.selected) ?? currencies[0],

    rate: (state): number => {
      if (state.selected === 'EUR') return 1
      return state.rates[state.selected] ?? 1
    }
  },

  actions: {
    async fetchRates() {
      if (Object.keys(this.rates).length > 0) return

      this.loading = true
      this.error = ''

      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/EUR')
        const data = await res.json()
        this.rates = data.rates
      } catch {
        this.error = 'Impossible de récupérer les taux de change.'
      } finally {
        this.loading = false
      }
    },

    setCurrency(code: CurrencyCode) {
      this.selected = code
    },

    convert(amount: number): number {
      return amount * this.rate
    },

    format(amount: number): string {
      const converted = this.convert(amount)
      return `${converted.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${this.currentCurrency.symbol}`
    }
  }
})
