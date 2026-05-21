import { defineStore } from 'pinia'
import { useBudgetStore } from '~/stores/budget'
import { useTransactionStore } from '~/stores/transaction'

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface SessionUser {
  id: string
  name: string
  email: string
}

export interface AuthState {
  currentUser: SessionUser | null
  users: User[]
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    currentUser: null,
    users: []
  }),

  getters: {
    isAuthenticated: (state): boolean => state.currentUser !== null,
    getUser: (state) => state.currentUser
  },

  actions: {
    init() {
      if (import.meta.client) {
        const stored = localStorage.getItem('fundflow_users')
        if (stored) {
          this.users = JSON.parse(stored)
        }
        const session = localStorage.getItem('fundflow_session')
        if (session) {
          this.currentUser = JSON.parse(session)
        }
      }
    },

    register(name: string, email: string, password: string): { success: boolean; error?: string } {
      const exists = this.users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (exists) {
        return { success: false, error: 'Un compte avec cet email existe déjà.' }
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        password
      }
      this.users.push(newUser)

      if (import.meta.client) {
        localStorage.setItem('fundflow_users', JSON.stringify(this.users))
      }

      this.currentUser = { id: newUser.id, name, email }

      if (import.meta.client) {
        localStorage.setItem('fundflow_session', JSON.stringify(this.currentUser))
      }

      return { success: true }
    },

    login(email: string, password: string): { success: boolean; error?: string } {
      const user = this.users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      if (!user) {
        return { success: false, error: 'Email ou mot de passe incorrect.' }
      }

      this.currentUser = { id: user.id, name: user.name, email: user.email }

      if (import.meta.client) {
        localStorage.setItem('fundflow_session', JSON.stringify(this.currentUser))
      }

      return { success: true }
    },

    logout() {
      this.currentUser = null
      if (import.meta.client) {
        localStorage.removeItem('fundflow_session')
      }
      const budgetStore = useBudgetStore()
      budgetStore.clear()
      const transactionStore = useTransactionStore()
      transactionStore.clear()
      const premiumStore = usePremiumStore()
      premiumStore.clear()
    }
  }
})
