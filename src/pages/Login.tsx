import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, GraduationCap, Users } from 'lucide-react'
import { useAuth, type UserRole } from '../contexts/AuthContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'

const DEMOS: { role: UserRole; label: string; icon: typeof Shield; email: string }[] = [
  { role: 'admin', label: 'Admin', icon: Shield, email: 'admin@alberschool.ke' },
  { role: 'teacher', label: 'Teacher', icon: GraduationCap, email: 'teacher@alberschool.ke' },
  { role: 'parent', label: 'Parent', icon: Users, email: 'parent@alberschool.ke' },
]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(selectedRole, email || 'demo@alberschool.ke')
    navigate(`/dashboard/${selectedRole}`)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8">
        <h1 className="mb-2 text-3xl font-bold text-primary dark:text-gold">Portal Login</h1>
        <p className="mb-6 text-sm text-muted">Demo mode — any password works</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {DEMOS.map((d) => (
            <button
              key={d.role}
              type="button"
              onClick={() => {
                setSelectedRole(d.role)
                setEmail(d.email)
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition hover:scale-105 ${
                selectedRole === d.role ? 'bg-primary text-white' : 'glass glass-border'
              }`}
            >
              <d.icon className="h-4 w-4" />
              {d.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (any)"
            className="field"
          />
          <Button type="submit" variant="gold" className="w-full">
            Sign In as {selectedRole}
          </Button>
        </form>
      </GlassCard>
    </div>
  )
}
