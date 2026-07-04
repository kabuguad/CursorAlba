import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, Eye, EyeOff, BookOpen } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

const ADMIN_EMAIL = 'admin@alberschool.ke'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login('admin', email || ADMIN_EMAIL)
    navigate('/dashboard/admin')
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
              <div className="text-white font-bold text-xl leading-none">Demo School</div>
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
            Manage every part of Demo School from a single, powerful admin dashboard.
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
          © {new Date().getFullYear()} Demo School. Est. 2005.
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:py-12">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-bold text-2xl text-gold shadow-lg">A</div>
          <h1 className="text-2xl font-bold text-primary dark:text-gold">Demo School Portal</h1>
          <p className="text-xs text-muted mt-1 tracking-widest uppercase">Kutus · Kirinyaga County</p>
        </div>

        <div className="w-full max-w-md">
          {/* Heading (desktop only) */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted mt-1">Sign in to the admin portal</p>
          </div>

          {/* Role badge */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border-2 border-violet-200 dark:border-violet-700/50 bg-violet-50 dark:bg-violet-950/40 p-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-violet-100 dark:bg-violet-900/50">
              <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-sm text-violet-600 dark:text-violet-400">Admin</div>
              <div className="text-[11px] opacity-70 mt-0.5">Full system access</div>
            </div>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-gold/10 dark:bg-gold/5 border border-gold/30 px-4 py-3">
            <BookOpen className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <div className="text-xs text-foreground">
              <span className="font-semibold text-gold">Demo mode</span>
              <span className="text-muted"> — logging in as </span>
              <span className="font-medium">Admin</span>
              <br />
              <span className="text-muted font-mono text-[11px]">{ADMIN_EMAIL}</span>
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
              Sign in as Admin
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
