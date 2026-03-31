'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate user from localStorage on first paint
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wallx_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  /** Mock sign-in — accepts any valid-looking credentials */
  const signIn = (email, password) => {
    const mockUser = {
      id: `u_${Date.now()}`,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}&backgroundColor=b6e3f4`,
      createdAt: new Date().toISOString(),
    }
    setUser(mockUser)
    localStorage.setItem('wallx_user', JSON.stringify(mockUser))
    return mockUser
  }

  /** Mock sign-up — persists the name the user typed */
  const signUp = (name, email, password) => {
    const mockUser = {
      id: `u_${Date.now()}`,
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}&backgroundColor=b6e3f4`,
      createdAt: new Date().toISOString(),
    }
    setUser(mockUser)
    localStorage.setItem('wallx_user', JSON.stringify(mockUser))
    return mockUser
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('wallx_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
