import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { useAuth } from '../../../contexts/AuthContext'
import { User, Bell, Lock, Users, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

type Tab = 'profile' | 'notifications' | 'security' | 'children'

interface NotifSetting {
  id: string
  label: string
  description: string
  email: boolean
  sms: boolean
  push: boolean
}

const INITIAL_NOTIFS: NotifSetting[] = [
  { id: 'attendance',  label: 'Attendance Alerts',     description: 'Notify me when my child is marked absent',      email: true,  sms: true,  push: true  },
  { id: 'grades',      label: 'Grade Updates',          description: 'When new CAT or exam results are posted',        email: true,  sms: false, push: true  },
  { id: 'fees',        label: 'Fee Reminders',          description: 'Due dates, payments received, balance updates',  email: true,  sms: true,  push: false },
  { id: 'homework',    label: 'Homework Alerts',        description: 'New assignments and overdue reminders',           email: false, sms: false, push: true  },
  { id: 'notices',     label: 'School Notices',         description: 'General announcements from the school',          email: true,  sms: false, push: true  },
  { id: 'events',      label: 'Event Reminders',        description: 'Events, sports days, exams, meetings',           email: true,  sms: false, push: true  },
  { id: 'messages',    label: 'New Messages',           description: 'Messages from teachers or administration',       email: true,  sms: true,  push: true  },
  { id: 'reports',     label: 'Report Cards',           description: 'When end-of-term report cards are published',    email: true,  sms: true,  push: true  },
]

const CHILDREN = [
  {
    id: 's-1',
    name: 'Amani Kariuki',
    admNo: 'AS/2019/0847',
    class: 'Grade 5 Gold',
    dob: '14 March 2016',
    stream: 'Gold',
    photo: null,
    active: true,
  },
]

export function ParentSettings() {
  const { showToast } = useToast()
  const { user: authUser } = useAuth()

  const [tab, setTab] = useState<Tab>('profile')
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS)

  const [profile, setProfile] = useState({
    name:           authUser?.name ?? 'Jane Kariuki',
    email:          authUser?.email ?? 'j.kariuki@gmail.com',
    phone:          '0712-345-678',
    altPhone:       '',
    relationship:   'Mother',
    nationalId:     '12345678',
    occupation:     'Accountant',
    employer:       'Equity Bank Kenya',
    address:        'P.O. Box 123, Kutus, Kirinyaga County',
    emergencyName:  'Mr. David Kariuki',
    emergencyPhone: '0722-987-654',
    emergencyRel:   'Father',
  })

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false })
  const [passErrors, setPassErrors] = useState<Record<string, string>>({})

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile',       label: 'My Profile',    icon: User  },
    { id: 'notifications', label: 'Notifications', icon: Bell  },
    { id: 'security',      label: 'Security',      icon: Lock  },
    { id: 'children',      label: 'Children',      icon: Users },
  ]

  const setP = (k: string, v: string) => setProfile(p => ({ ...p, [k]: v }))

  const handleSaveProfile = () => showToast('Profile updated successfully')

  const toggleNotif = (id: string, channel: 'email' | 'sms' | 'push') => {
    setNotifs(n => n.map(s => s.id === id ? { ...s, [channel]: !s[channel] } : s))
  }

  const handleSavePassword = () => {
    const e: Record<string, string> = {}
    if (!passwords.current)              e.current = 'Enter your current password'
    if (passwords.next.length < 8)      e.next    = 'Password must be at least 8 characters'
    if (passwords.next !== passwords.confirm) e.confirm = 'Passwords do not match'
    setPassErrors(e)
    if (Object.keys(e).length > 0) return
    setPasswords({ current: '', next: '', confirm: '' })
    showToast('Password changed successfully')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile, notifications and security</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                tab === t.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── PROFILE ── */}
      {tab === 'profile' && (
        <div className="space-y-5">
          <GlassCard className="p-6 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input className="field w-full" value={profile.name} onChange={e => setP('name', e.target.value)} />
              </div>
              <div>
                <label className="label">Relationship to Student</label>
                <select className="field w-full" value={profile.relationship} onChange={e => setP('relationship', e.target.value)}>
                  {['Mother','Father','Guardian','Grandparent','Other'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="field w-full" value={profile.email} onChange={e => setP('email', e.target.value)} />
              </div>
              <div>
                <label className="label">National ID / Passport No.</label>
                <input className="field w-full" value={profile.nationalId} onChange={e => setP('nationalId', e.target.value)} />
              </div>
              <div>
                <label className="label">Primary Phone</label>
                <input type="tel" className="field w-full" value={profile.phone} onChange={e => setP('phone', e.target.value)} />
              </div>
              <div>
                <label className="label">Alternative Phone (optional)</label>
                <input type="tel" className="field w-full" placeholder="e.g. 0733-xxx-xxx" value={profile.altPhone} onChange={e => setP('altPhone', e.target.value)} />
              </div>
              <div>
                <label className="label">Occupation</label>
                <input className="field w-full" value={profile.occupation} onChange={e => setP('occupation', e.target.value)} />
              </div>
              <div>
                <label className="label">Employer / Business</label>
                <input className="field w-full" value={profile.employer} onChange={e => setP('employer', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Postal Address</label>
                <input className="field w-full" value={profile.address} onChange={e => setP('address', e.target.value)} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Emergency Contact</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Name</label>
                <input className="field w-full" value={profile.emergencyName} onChange={e => setP('emergencyName', e.target.value)} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" className="field w-full" value={profile.emergencyPhone} onChange={e => setP('emergencyPhone', e.target.value)} />
              </div>
              <div>
                <label className="label">Relationship</label>
                <input className="field w-full" value={profile.emergencyRel} onChange={e => setP('emergencyRel', e.target.value)} />
              </div>
            </div>
          </GlassCard>

          <Button variant="primary" onClick={handleSaveProfile} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {tab === 'notifications' && (
        <GlassCard className="overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 text-xs font-bold uppercase tracking-wide text-gray-400">
              <span>Notification</span>
              <span className="w-12 text-center">Email</span>
              <span className="w-12 text-center">SMS</span>
              <span className="w-12 text-center">Push</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {notifs.map(n => (
              <div key={n.id} className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 items-center px-5 py-4">
                <div>
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{n.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{n.description}</p>
                </div>
                {(['email', 'sms', 'push'] as const).map(channel => (
                  <div key={channel} className="flex sm:justify-center items-center gap-2">
                    <span className="text-xs text-gray-400 sm:hidden capitalize">{channel}</span>
                    <button
                      onClick={() => toggleNotif(n.id, channel)}
                      className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${n[channel] ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${n[channel] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="primary" onClick={() => showToast('Notification preferences saved')}>
              Save Preferences
            </Button>
          </div>
        </GlassCard>
      )}

      {/* ── SECURITY ── */}
      {tab === 'security' && (
        <div className="space-y-5">
          <GlassCard className="p-6 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Change Password</h2>
            {[
              { key: 'current', label: 'Current Password' },
              { key: 'next',    label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <div className="relative">
                  <input
                    type={showPass[key as keyof typeof showPass] ? 'text' : 'password'}
                    value={passwords[key as keyof typeof passwords]}
                    onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    className={`field w-full pr-10 ${passErrors[key] ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => ({ ...s, [key]: !s[key as keyof typeof showPass] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPass[key as keyof typeof showPass] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passErrors[key] && <p className="mt-1 text-xs text-red-500">{passErrors[key]}</p>}
              </div>
            ))}
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3 space-y-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Password requirements:</p>
              {['At least 8 characters', 'Mix of letters and numbers recommended', 'Do not share your password with anyone'].map(r => (
                <p key={r} className="text-xs text-gray-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> {r}
                </p>
              ))}
            </div>
            <Button variant="primary" onClick={handleSavePassword}>Change Password</Button>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <h2 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Login Activity</h2>
            {[
              { device: 'Chrome on Windows', location: 'Kutus, Kenya', time: 'Today, 8:32 AM', current: true },
              { device: 'Safari on iPhone',  location: 'Nairobi, Kenya', time: 'Yesterday, 7:15 PM', current: false },
              { device: 'Chrome on Android', location: 'Kutus, Kenya', time: '24 May, 6:03 PM', current: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.device}</p>
                  <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                </div>
                {s.current
                  ? <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-full px-2 py-0.5">Current</span>
                  : <button className="text-xs text-red-500 hover:underline">Revoke</button>
                }
              </div>
            ))}
          </GlassCard>
        </div>
      )}

      {/* ── CHILDREN ── */}
      {tab === 'children' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Children linked to your account. Contact the school office to add or remove a child.
          </p>
          {CHILDREN.map(child => (
            <GlassCard key={child.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E8B84B] text-xl font-bold text-[#0d1b0d]">
                  {child.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{child.name}</h3>
                    {child.active && (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-full px-2 py-0.5">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span><span className="font-semibold text-gray-600 dark:text-gray-300">Adm No:</span> {child.admNo}</span>
                    <span><span className="font-semibold text-gray-600 dark:text-gray-300">Class:</span> {child.class}</span>
                    <span><span className="font-semibold text-gray-600 dark:text-gray-300">Date of Birth:</span> {child.dob}</span>
                    <span><span className="font-semibold text-gray-600 dark:text-gray-300">Stream:</span> {child.stream}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
            <p className="text-sm text-gray-400">Need to link another child?</p>
            <p className="text-xs text-gray-400 mt-1">
              Visit the school office or call <strong className="text-gray-600 dark:text-gray-300">0712-345-678</strong> to request account linking.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
