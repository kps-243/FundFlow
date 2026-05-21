export interface TrackingProduct {
  id: string
  name: string
  price: number
  currency?: string
}

export interface TrackingEvent {
  event: string
  timestamp: string
  [key: string]: unknown
}

export const PREMIUM_PRODUCT: TrackingProduct = {
  id: 'premium-monthly',
  name: 'FundFlow Premium',
  price: 9.99,
  currency: 'EUR'
}

declare global {
  interface Window {
    dataLayer: TrackingEvent[]
  }
}

export function useTracking() {
  function push(eventName: string, payload: Record<string, unknown> = {}) {
    const data: TrackingEvent = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...payload
    }

    if (import.meta.client) {
      window.dataLayer = window.dataLayer ?? []
      window.dataLayer.push(data)
    }

    if (import.meta.dev) {
      console.log(`%c[Tracking] ${eventName}`, 'color:#7662ea;font-weight:bold', data)
    }
  }

  /**
   * Étape 1 — L'utilisateur consulte la fiche produit.
   */
  function viewProduct(product: TrackingProduct) {
    push('view_product', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      currency: product.currency ?? 'EUR'
    })
  }

  /**
   * Étape 2 — L'utilisateur ajoute le produit au panier.
   */
  function addToCart(product: TrackingProduct, quantity = 1) {
    push('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      currency: product.currency ?? 'EUR',
      quantity
    })
  }

  /**
   * Étape 3 — L'utilisateur accède au formulaire de paiement.
   */
  function checkoutStart(product: TrackingProduct) {
    push('checkout_start', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      currency: product.currency ?? 'EUR'
    })
  }

  /**
   * Étape 4 — Paiement réussi, arrivée sur la page de confirmation.
   */
  function checkoutSuccess(product: TrackingProduct, transactionId: string) {
    push('checkout_success', {
      transaction_id: transactionId,
      product_id: product.id,
      product_name: product.name,
      revenue: product.price,
      currency: product.currency ?? 'EUR'
    })
  }

  return { viewProduct, addToCart, checkoutStart, checkoutSuccess, push }
}
