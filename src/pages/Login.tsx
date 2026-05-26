import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, GraduationCap, Users, BookOpen } from 'lucide-react'
import { useAuth, type UserRole } from '../contexts/AuthContext'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'

const DEMOS: { role: UserRole; label: string; icon: typeof Shield; email: string; desc: string }[] = [
  { role: 'admin', label: 'Admin', icon: Shield, email: 'admin@alberschool.ke', desc: 'Full system access' },
  { role: 'teacher', label: 'Teacher', icon: GraduationCap, email: 'teacher@alberschool.ke', desc: 'Grades & attendance' },
  { role: 'parent', label: 'Parent', icon: Users, email: 'parent@alberschool.ke', desc: 'Student progress & fees' },
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
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-gold font-bold text-2xl">A</div>
          <h1 className="text-3xl font-bold text-primary dark:text-gold">Alber School Portal</h1>
          <p className="mt-1 text-sm text-muted">Kutus · Kirinyaga County</p>
        </div>

        <GlassCard className="p-8">
          <p className="mb-4 text-sm font-semibold text-muted uppercase tracking-widest">Select Demo Role</p>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {DEMOS.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => {
                  setSelectedRole(d.role)
                  setEmail(d.email)
                }}
                className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 text-xs font-medium transition hover:scale-105 ${
                  selectedRole === d.role ? 'bg-primary text-white dark:bg-gold dark:text-dark' : 'glass glass-border'
                }`}
              >
                <d.icon className="h-5 w-5" />
                <span>{d.label}</span>
                <span className={`text-[10px] ${selectedRole === d.role ? 'text-white/70 dark:text-dark/70' : 'text-muted'}`}>{d.desc}</span>
              </button>
            ))}
          </div>

          <div className="mb-6 rounded-2xl bg-tint/50 px-4 py-3 text-xs text-muted dark:bg-dark-card">
            <BookOpen className="mb-1 h-4 w-4 text-gold inline mr-1" />
            <span className="font-semibold">Demo credentials:</span>{' '}
            {email || 'admin@alberschool.ke'} · any password
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="field"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (any value)"
              className="field"
            />
            <Button type="submit" variant="gold" className="w-full">
              Sign In as {selectedRole?.charAt(0).toUpperCase()}{selectedRole?.slice(1)}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  )
}
