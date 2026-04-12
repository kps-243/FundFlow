export function useCurrency() {
  const currencyStore = useCurrencyStore()

  onMounted(() => {
    currencyStore.fetchRates()
  })

  const format = (amount: number) => currencyStore.format(amount)
  const convert = (amount: number) => currencyStore.convert(amount)
  const loading = computed(() => currencyStore.loading)
  const error = computed(() => currencyStore.error)
  const currentCurrency = computed(() => currencyStore.currentCurrency)

  return { format, convert, loading, error, currentCurrency }
}
