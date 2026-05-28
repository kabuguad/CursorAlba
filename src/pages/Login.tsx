import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, GraduationCap, Users, BookOpen, UserCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth, type UserRole } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

const DEMOS: {
  role: UserRole
  label: string
  icon: typeof Shield
  email: string
  desc: string
  color: string
  bg: string
  darkBg: string
}[] = [
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    email: 'admin@alberschool.ke',
    desc: 'Full system access',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 border-violet-200',
    darkBg: 'dark:bg-violet-950/40 dark:border-violet-700/50',
  },
  {
    role: 'teacher',
    label: 'Teacher',
    icon: GraduationCap,
    email: 'teacher@alberschool.ke',
    desc: 'Grades & attendance',
    color: 'text-primary dark:text-green-400',
    bg: 'bg-green-50 border-green-200',
    darkBg: 'dark:bg-green-950/40 dark:border-green-700/50',
  },
  {
    role: 'parent',
    label: 'Parent',
    icon: Users,
    email: 'parent@alberschool.ke',
    desc: 'Progress & fees',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 border-blue-200',
    darkBg: 'dark:bg-blue-950/40 dark:border-blue-700/50',
  },
  {
    role: 'student',
    label: 'Student',
    icon: UserCircle,
    email: 'student@alberschool.ke',
    desc: 'Classes & homework',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 border-amber-200',
    darkBg: 'dark:bg-amber-950/40 dark:border-amber-700/50',
  },
]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMOS[0].email)
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [showPassword, setShowPassword] = useState(false)

  const activeDemo = DEMOS.find((d) => d.role === selectedRole)!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(selectedRole, email || 'demo@alberschool.ke')
    navigate(`/dashboard/${selectedRole}`)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-dark">

      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-primary flex-col justify-between p-12 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Top logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center font-bold text-xl text-dark shadow-lg">A</div>
            <div>
              <div className="text-white font-bold text-xl leading-none">Alber School</div>
              <div className="text-white/60 text-xs mt-0.5 tracking-widest uppercase">Kutus · Kirinyaga</div>
            </div>
          </div>
        </div>

        {/* Middle content */}
        <div className="relative z-10">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Your school,<br />
            <span className="text-gold">one portal.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Admins, teachers, parents, and students — everything you need, exactly where you need it.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '2,000+', label: 'Learners' },
              { value: '120+', label: 'Educators' },
              { value: 'Est. 2005', label: 'Founded' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 border border-white/10">
                <div className="text-gold font-bold text-xl">{s.value}</div>
                <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 text-white/40 text-sm">
          © {new Date().getFullYear()} Alber School. Est. 2005.
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:py-12">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-bold text-2xl text-gold shadow-lg">A</div>
          <h1 className="text-2xl font-bold text-primary dark:text-gold">Alber School Portal</h1>
          <p className="text-xs text-muted mt-1 tracking-widest uppercase">Kutus · Kirinyaga County</p>
        </div>

        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted mt-1">Sign in to your school portal</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">I am a…</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DEMOS.map((d) => {
                const isSelected = selectedRole === d.role
                const Icon = d.icon
                return (
                  <button
                    key={d.role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(d.role)
                      setEmail(d.email)
                    }}
                    className={`
                      flex flex-col items-center gap-2 rounded-2xl p-3.5 border-2 text-xs font-medium
                      transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]
                      ${isSelected
                        ? `border-current shadow-md ${d.color} ${d.bg} ${d.darkBg}`
                        : 'border-border bg-surface glass glass-border text-muted hover:border-border/80'
                      }
                    `}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                      ${isSelected ? 'bg-current/10' : 'bg-foreground/5'}
                    `}>
                      <Icon className={`h-5 w-5 ${isSelected ? '' : 'text-muted'}`} />
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${isSelected ? '' : 'text-foreground'}`}>{d.label}</div>
                      <div className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'opacity-70' : 'text-muted'}`}>{d.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-gold/10 dark:bg-gold/5 border border-gold/30 px-4 py-3">
            <BookOpen className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <div className="text-xs text-foreground">
              <span className="font-semibold text-gold">Demo mode</span>
              <span className="text-muted"> — logging in as </span>
              <span className="font-medium">{activeDemo.label}</span>
              <br />
              <span className="text-muted font-mono text-[11px]">{activeDemo.email}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@alberschool.ke"
                autoComplete="email"
                className="field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Any value for demo"
                  autoComplete="current-password"
                  className="field text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full mt-1 py-3.5 text-sm font-semibold gap-2"
            >
              Sign in as {activeDemo.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick-access row for other roles */}
          <div className="mt-6 pt-5 border-t border-theme">
            <p className="text-xs text-muted text-center mb-3">Or jump straight in as another role</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {DEMOS.filter((d) => d.role !== selectedRole).map((d) => {
                const Icon = d.icon
                return (
                  <button
                    key={d.role}
                    type="button"
                    onClick={() => {
                      login(d.role, d.email)
                      navigate(`/dashboard/${d.role}`)
                    }}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium glass glass-border text-muted hover:text-foreground hover:scale-105 transition-all duration-200"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
