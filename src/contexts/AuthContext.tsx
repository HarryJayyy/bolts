import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, isLoading: false, user: action.payload, error: null }
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, user: null, error: null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('loveletter_token')
    const userData = localStorage.getItem('loveletter_user')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: 'LOGIN_SUCCESS', payload: { ...user, token } })
      } catch (error) {
        localStorage.removeItem('loveletter_token')
        localStorage.removeItem('loveletter_user')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Mock API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === 'demo@loveletter.com' && password === 'demo') {
        const user: User = {
          id: 'user-123',
          name: 'Demo User',
          email: 'demo@loveletter.com',
          plan: 'pro',
          token: 'mock-jwt-token'
        }
        
        localStorage.setItem('loveletter_token', user.token!)
        localStorage.setItem('loveletter_user', JSON.stringify(user))
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error instanceof Error ? error.message : 'Login failed' })
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Mock API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        plan: 'free',
        token: 'mock-jwt-token'
      }
      
      localStorage.setItem('loveletter_token', user.token!)
      localStorage.setItem('loveletter_user', JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' })
    }
  }

  const logout = () => {
    localStorage.removeItem('loveletter_token')
    localStorage.removeItem('loveletter_user')
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      clearError,
    }}>
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