import { create } from 'zustand'
import { mmkvStorage } from '../utils/storage'

interface User {
  id: string
  username: string
  email: string
  name?: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: mmkvStorage.getString('token') || null,
  isAuthenticated: !!mmkvStorage.getString('token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch('https://betting-tracker.example.com/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        mmkvStorage.setString('token', data.token)
        set({
          token: data.token,
          isAuthenticated: true,
        })
      } else {
        throw new Error(data.error || 'Login failed')
      }
    } finally {
      set({ isLoading: false })
    }
  },

  signup: async (email: string, username: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch('https://betting-tracker.example.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        mmkvStorage.setString('token', data.token)
        set({
          token: data.token,
          isAuthenticated: true,
        })
      } else {
        throw new Error(data.error || 'Signup failed')
      }
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    mmkvStorage.delete('token')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  checkAuth: () => {
    const token = mmkvStorage.getString('token')
    set({
      token,
      isAuthenticated: !!token,
    })
  },
}))
