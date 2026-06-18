import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, GraduationCap, Users, BookOpen, UserCircle, ArrowRight, Eye, EyeOff, ChevronDown, Check } from 'lucide-react'
import { useAuth, type UserRole } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

const DEMOS: {
  role: UserRole
  label: string
  icon: typeof Shield
  email: string
  desc: string
  color: string
  iconBg: string
  bg: string
  darkBg: string
  accent: string
}[] = [
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    email: 'admin@alberschool.ke',
    desc: 'Full system access',
    color: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/50',
    bg: 'bg-violet-50 border-violet-200',
    darkBg: 'dark:bg-violet-950/40 dark:border-violet-700/50',
    accent: '#7c3aed',
  },
  {
    role: 'teacher',
    label: 'Teacher',
    icon: GraduationCap,
    email: 'teacher@alberschool.ke',
    desc: 'Grades & attendance',
    color: 'text-primary dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    bg: 'bg-green-50 border-green-200',
    darkBg: 'dark:bg-green-950/40 dark:border-green-700/50',
    accent: '#0f5c3f',
  },
  {
    role: 'parent',
    label: 'Parent',
    icon: Users,
    email: 'parent@alberschool.ke',
    desc: 'Progress & fees',
    color: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    bg: 'bg-blue-50 border-blue-200',
    darkBg: 'dark:bg-blue-950/40 dark:border-blue-700/50',
    accent: '#2563eb',
  },
  {
    role: 'student',
    label: 'Student',
    icon: UserCircle,
    email: 'student@alberschool.ke',
    desc: 'Via parent portal',
    color: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    bg: 'bg-amber-50 border-amber-200',
    darkBg: 'dark:bg-amber-950/40 dark:border-amber-700/50',
    accent: '#d97706',
  },
]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMOS[0].email)
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeDemo = DEMOS.find((d) => d.role === selectedRole)!

  const selectRole = (d: typeof DEMOS[number]) => {
    setSelectedRole(d.role)
    setEmail(d.email)
    setDropdownOpen(false)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(selectedRole, email || 'demo@alberschool.ke')
    navigate(`/dashboard/${selectedRole}`)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-dark">

      {/* ── Left panel (decorative) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-primary flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full bg-gold translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center font-bold text-xl text-dark shadow-lg">A</div>
            <div>
              <div className="text-white font-bold text-xl leading-none">Alber School</div>
              <div className="text-white/60 text-xs mt-0.5 tracking-widest uppercase">Kutus · Kirinyaga</div>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Your school,<br />
            <span className="text-gold">one portal.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Admins, teachers, parents, and students — everything you need, exactly where you need it.
          </p>
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
          {/* Heading (desktop only) */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted mt-1">Sign in to your school portal</p>
          </div>

          {/* Role selector label */}
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">I am a…</p>

          {/* ── Mobile dropdown (< sm) ── */}
          <div className="relative sm:hidden mb-6" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className={`
                w-full flex items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200
                ${activeDemo.bg} ${activeDemo.darkBg} ${activeDemo.color}
                shadow-sm active:scale-[0.98]
              `}
            >
              {/* Left: colored icon badge */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${activeDemo.iconBg}`}>
                <activeDemo.icon className="h-5 w-5" />
              </div>

              {/* Middle: label + desc */}
              <div className="flex-1 text-left">
                <div className="font-semibold text-sm">{activeDemo.label}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{activeDemo.desc}</div>
              </div>

              {/* Right: chevron */}
              <ChevronDown
                className={`h-4 w-4 opacity-60 transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-border bg-surface-elevated glass shadow-[0_8px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Header */}
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">Select your role</p>
                </div>

                {DEMOS.map((d, i) => {
                  const Icon = d.icon
                  const isActive = selectedRole === d.role
                  return (
                    <button
                      key={d.role}
                      type="button"
                      onClick={() => selectRole(d)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-150 text-left
                        ${i < DEMOS.length - 1 ? 'border-b border-border/50' : ''}
                        ${isActive
                          ? `${d.bg} ${d.darkBg}`
                          : 'hover:bg-foreground/[0.03] active:bg-foreground/[0.06]'
                        }
                      `}
                    >
                      {/* Accent strip */}
                      <div
                        className="w-1 h-9 rounded-full shrink-0"
                        style={{ backgroundColor: isActive ? d.accent : 'transparent' }}
                      />

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? d.iconBg : 'bg-foreground/5'}`}>
                        <Icon className={`h-4.5 w-4.5 ${isActive ? d.color : 'text-muted'}`} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm ${isActive ? d.color : 'text-foreground'}`}>{d.label}</div>
                        <div className="text-[11px] text-muted mt-0.5 truncate">{d.email}</div>
                      </div>

                      {/* Check */}
                      {isActive && (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${d.iconBg}`}>
                          <Check className={`h-3 w-3 ${d.color}`} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Desktop / tablet card grid (≥ sm) ── */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-2.5 mb-6">
            {DEMOS.map((d) => {
              const isSelected = selectedRole === d.role
              const Icon = d.icon
              return (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => selectRole(d)}
                  className={`
                    flex flex-col items-center gap-2 rounded-2xl p-3.5 border-2 text-xs font-medium
                    transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]
                    ${isSelected
                      ? `border-current shadow-md ${d.color} ${d.bg} ${d.darkBg}`
                      : 'border-border bg-surface glass glass-border text-muted hover:border-border/80'
                    }
                  `}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? d.iconBg : 'bg-foreground/5'}`}>
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

          {/* Quick-access row */}
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
