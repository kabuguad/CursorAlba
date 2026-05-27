import { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student' | null

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextValue {
  user: AuthUser | null
  login: (role: UserRole, email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_USERS: Record<Exclude<UserRole, null>, AuthUser> = {
  admin:   { id: 'a1', name: 'Dr. Wanjiku Mwangi',  email: 'admin@alberschool.ke',   role: 'admin'   },
  teacher: { id: 't1', name: 'James Ochieng',        email: 'teacher@alberschool.ke', role: 'teacher' },
  parent:  { id: 'p1', name: 'Grace Njeri',          email: 'parent@alberschool.ke',  role: 'parent'  },
  student: { id: 's1', name: 'Amani Kariuki',        email: 'student@alberschool.ke', role: 'student' },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('alber-user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (role: UserRole, _email: string) => {
    if (!role) return
    const u = DEMO_USERS[role]
    setUser(u)
    sessionStorage.setItem('alber-user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('alber-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
