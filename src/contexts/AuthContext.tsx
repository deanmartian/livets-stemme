"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthService } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const signIn = async (email: string) => {
    setLoading(true)
    try {
      const user = await AuthService.signInWithEmail(email)
      setUser(user)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await AuthService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    setLoading(true)
    try {
      const updatedUser = await AuthService.updateProfile(updates)
      setUser(updatedUser)
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
