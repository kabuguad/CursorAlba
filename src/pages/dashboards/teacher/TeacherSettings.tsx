import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { useAuth } from '../../../contexts/AuthContext'
import { User, Bell, Lock, Eye, EyeOff, CheckCircle2, Shield } from 'lucide-react'

type Tab = 'profile' | 'notifications' | 'security'

interface NotifSetting {
  id: string
  label: string
  description: string
  email: boolean
  sms: boolean
  push: boolean
}

const INITIAL_NOTIFS: NotifSetting[] = [
  { id: 'parent_msg',    label: 'Parent Message',         description: 'When a parent sends you a message',            email: true,  sms: true,  push: true  },
  { id: 'admin_notice',  label: 'Admin Notice',           description: 'When admin posts a new staff notice',          email: true,  sms: false, push: true  },
  { id: 'grade_lock',    label: 'Grade Deadline Reminder', description: '3 days before grade entry deadline',          email: true,  sms: true,  push: false },
  { id: 'leave_update',  label: 'Leave Application Update', description: 'When admin approves or rejects your leave',  email: true,  sms: true,  push: true  },
  { id: 'meeting_remind', label: 'PT Meeting Reminder',   description: '1 day before a scheduled parent meeting',     email: true,  sms: false, push: true  },
  { id: 'sub_assigned',  label: 'Substitution Assigned',  description: 'When you are assigned to cover a class',      email: true,  sms: true,  push: true  },
]

const SESSIONS = [
  { device: 'Chrome on Windows 11', location: 'Kutus, Kirinyaga', time: 'Active now',       current: true  },
  { device: 'Safari on iPhone 14',  location: 'Nairobi, Kenya',   time: '2 days ago',       current: false },
  { device: 'Firefox on Ubuntu',    location: 'Kutus, Kirinyaga', time: '5 days ago',       current: false },
]

export function TeacherSettings() {
  const { showToast } = useToast()
  const { user: authUser } = useAuth()
  const [tab, setTab] = useState<Tab>('profile')
  const [notifs, setNotifs] = useState<NotifSetting[]>(INITIAL_NOTIFS)
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passErrors, setPassErrors] = useState<Record<string, string>>({})

  const [profile, setProfile] = useState({
    firstName:    'Jane',
    lastName:     'Wanjiku',
    email:        authUser?.email ?? 'teacher@alberschool.ke',
    phone:        '0712-345-678',
    altPhone:     '',
    tscNumber:    'KE-TSC-2847',
    staffId:      'ALB-TCH-014',
    department:   'Mathematics',
    qualification: 'B.Ed (Mathematics & Physics), University of Nairobi, 2014',
    subjects:     'Mathematics (Grades 4–7)',
    classTeacher: 'Grade 5 Gold',
    signature:    'Mrs. J. Wanjiku (B.Ed)',
    bio:          'Mathematics teacher with 10 years of experience. Passionate about making numbers accessible to every learner.',
  })

  function handleProfileSave() {
    showToast('Profile updated successfully', 'success')
  }

  function toggleNotif(id: string, channel: 'email' | 'sms' | 'push') {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, [channel]: !n[channel] } : n))
  }

  function handlePasswordSave() {
    const errs: Record<string, string> = {}
    if (!passwords.current) errs.current = 'Enter your current password'
    if (passwords.next.length < 8) errs.next = 'Must be at least 8 characters'
    if (passwords.next !== passwords.confirm) errs.confirm = 'Passwords do not match'
    setPassErrors(errs)
    if (Object.keys(errs).length) return
    showToast('Password changed successfully', 'success')
    setPasswords({ current: '', next: '', confirm: '' })
  }

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile',       label: 'My Profile',     icon: User   },
    { key: 'notifications', label: 'Notifications',  icon: Bell   },
    { key: 'security',      label: 'Security',       icon: Shield },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile, notification preferences and account security</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" /> Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input className="field" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div>
                <label className="label">Last Name / Surname</label>
                <input className="field" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="field" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input className="field" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="label">Alternative Phone</label>
                <input className="field" placeholder="Optional" value={profile.altPhone} onChange={e => setProfile(p => ({ ...p, altPhone: e.target.value }))} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">TSC Registration Number</label>
                <input className="field bg-gray-50 dark:bg-gray-800" readOnly value={profile.tscNumber} />
              </div>
              <div>
                <label className="label">Staff ID</label>
                <input className="field bg-gray-50 dark:bg-gray-800" readOnly value={profile.staffId} />
              </div>
              <div>
                <label className="label">Department</label>
                <input className="field bg-gray-50 dark:bg-gray-800" readOnly value={profile.department} />
              </div>
              <div>
                <label className="label">Subjects Taught</label>
                <input className="field bg-gray-50 dark:bg-gray-800" readOnly value={profile.subjects} />
              </div>
              <div>
                <label className="label">Class Teacher Of</label>
                <input className="field bg-gray-50 dark:bg-gray-800" readOnly value={profile.classTeacher} />
              </div>
              <div>
                <label className="label">Qualifications</label>
                <input className="field" value={profile.qualification} onChange={e => setProfile(p => ({ ...p, qualification: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Report Card Signature Text</label>
                <input className="field" placeholder="e.g. Mrs. J. Wanjiku (B.Ed)" value={profile.signature} onChange={e => setProfile(p => ({ ...p, signature: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1">This text appears on generated student report cards as your digital signature.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="label">Short Bio</label>
                <textarea rows={2} className="field resize-none" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleProfileSave} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" /> Notification Preferences
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose how and when you want to be notified.</p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event</th>
                  <th className="text-center pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Email</th>
                  <th className="text-center pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">SMS</th>
                  <th className="text-center pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Push</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {notifs.map(n => (
                  <tr key={n.id}>
                    <td className="py-3 pr-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.description}</p>
                    </td>
                    {(['email', 'sms', 'push'] as const).map(ch => (
                      <td key={ch} className="py-3 text-center">
                        <button
                          onClick={() => toggleNotif(n.id, ch)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${n[ch] ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${n[ch] ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Button onClick={() => showToast('Notification preferences saved', 'success')} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Save Preferences
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" /> Change Password
            </h2>
            <div className="space-y-4 max-w-sm">
              {(['current', 'next', 'confirm'] as const).map(key => (
                <div key={key}>
                  <label className="label">
                    {key === 'current' ? 'Current Password' : key === 'next' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPass[key] ? 'text' : 'password'}
                      className={`field pr-10 ${passErrors[key] ? 'border-red-400' : ''}`}
                      value={passwords[key]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={key === 'current' ? 'Enter current password' : key === 'next' ? 'Min. 8 characters' : 'Repeat new password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => ({ ...s, [key]: !s[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPass[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passErrors[key] && <p className="text-xs text-red-500 mt-1">{passErrors[key]}</p>}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={handlePasswordSave} className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Change Password
              </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Active Sessions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Devices currently logged in to your account.</p>
            <div className="space-y-3">
              {SESSIONS.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                      {s.device}
                      {s.current && <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">Current</span>}
                    </p>
                    <p className="text-xs text-gray-500">{s.location} · {s.time}</p>
                  </div>
                  {!s.current && (
                    <button
                      className="text-xs text-red-500 hover:underline"
                      onClick={() => showToast('Session revoked', 'success')}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => showToast('All other sessions revoked', 'success')}
              >
                Sign out all other sessions
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
