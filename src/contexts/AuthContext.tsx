import { createContext, useContext, useState, type ReactNode } from 'react'
import { apiClient } from '../services/apiClient'

export type UserRole = 'admin' | null

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  linkedId?: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (role: UserRole, email: string) => void
  loginWithCredentials: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoggingIn: boolean
  loginError: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_USERS: Record<Exclude<UserRole, null>, AuthUser> = {
  admin: { id: 'a1', name: 'Dr. Wanjiku Mwangi', email: 'admin@alberschool.ke', role: 'admin' },
}

function normaliseRole(raw: string): UserRole {
  const lower = raw.toLowerCase()
  if (lower === 'admin') return 'admin'
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('alber-user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const login = (role: UserRole, _email: string) => {
    if (!role) return
    const u = DEMO_USERS[role]
    setUser(u)
    sessionStorage.setItem('alber-user', JSON.stringify(u))
    setLoginError(null)
  }

  const loginWithCredentials = async (email: string, password: string) => {
    setIsLoggingIn(true)
    setLoginError(null)
    try {
      const tokenRes = await apiClient.post<{ token: string }>('/auth/login', { email, password })
      const token = tokenRes.data.token
      if (!token) throw new Error('No token received')

      sessionStorage.setItem('alber-token', token)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const meRes = await apiClient.get<{
        id: number; firstName: string; lastName: string
        email: string; role: string; linkedId?: number
      }>('/auth/me')
      const me = meRes.data

      const u: AuthUser = {
        id: me.id.toString(),
        name: `${me.firstName} ${me.lastName}`,
        email: me.email,
        role: normaliseRole(me.role),
        linkedId: me.linkedId?.toString() ?? me.id.toString(),
      }

      setUser(u)
      sessionStorage.setItem('alber-user', JSON.stringify(u))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Invalid email or password'
      setLoginError(msg)
      sessionStorage.removeItem('alber-token')
      throw err
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('alber-user')
    sessionStorage.removeItem('alber-token')
    delete apiClient.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, logout, isLoggingIn, loginError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
