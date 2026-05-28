import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import {
  Plus, Calendar, CheckCircle2, XCircle, Clock,
  ChevronDown, AlertCircle, User,
} from 'lucide-react'

type LeaveType = 'sick' | 'personal' | 'official' | 'training' | 'maternity' | 'bereavement'
type LeaveStatus = 'pending' | 'approved' | 'rejected'

interface LeaveApplication {
  id: string
  type: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  submittedOn: string
  status: LeaveStatus
  adminComment: string
  coverTeacher: string
}

const LEAVE_TYPES: { value: LeaveType; label: string }[] = [
  { value: 'sick',        label: 'Sick Leave'            },
  { value: 'personal',    label: 'Personal Leave'        },
  { value: 'official',    label: 'Official Duty'         },
  { value: 'training',    label: 'Training / Workshop'   },
  { value: 'maternity',   label: 'Maternity / Paternity' },
  { value: 'bereavement', label: 'Bereavement'           },
]

const HISTORY: LeaveApplication[] = [
  {
    id: 'la1', type: 'sick', startDate: '2025-03-10', endDate: '2025-03-11', days: 2,
    reason: 'Influenza — visited KNH and was advised to rest for 2 days.',
    submittedOn: '2025-03-10', status: 'approved', adminComment: 'Get well soon. Mrs. Njoki will cover your classes.',
    coverTeacher: 'Mrs. Priscilla Njoki',
  },
  {
    id: 'la2', type: 'training', startDate: '2025-04-07', endDate: '2025-04-09', days: 3,
    reason: 'CBC Curriculum Integration Workshop — organized by KICD, Nairobi.',
    submittedOn: '2025-03-28', status: 'approved', adminComment: 'Approved. Please bring training certificate on return.',
    coverTeacher: 'Mr. Peter Gitau',
  },
  {
    id: 'la3', type: 'personal', startDate: '2025-05-02', endDate: '2025-05-02', days: 1,
    reason: 'Family commitment — unable to disclose further details.',
    submittedOn: '2025-04-30', status: 'rejected', adminComment: 'Insufficient notice period. Please submit at least 3 working days in advance.',
    coverTeacher: '',
  },
  {
    id: 'la4', type: 'official', startDate: '2025-06-16', endDate: '2025-06-16', days: 1,
    reason: 'Madaraka Day — national holiday. Representing school at county celebrations.',
    submittedOn: '2025-06-01', status: 'pending', adminComment: '',
    coverTeacher: '',
  },
]

const STATUS_CONFIG: Record<LeaveStatus, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  approved: { icon: CheckCircle2, label: 'Approved', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  pending:  { icon: Clock,        label: 'Pending',  color: 'text-amber-700 dark:text-amber-300',     bg: 'bg-amber-100 dark:bg-amber-900/40'     },
  rejected: { icon: XCircle,      label: 'Rejected', color: 'text-red-700 dark:text-red-300',         bg: 'bg-red-100 dark:bg-red-900/40'         },
}

const TYPE_LABELS: Record<LeaveType, string> = {
  sick: 'Sick Leave', personal: 'Personal', official: 'Official Duty',
  training: 'Training', maternity: 'Maternity/Paternity', bereavement: 'Bereavement',
}

const LEAVE_BALANCE = [
  { type: 'Annual Leave',       used: 3,  total: 21 },
  { type: 'Sick Leave',         used: 2,  total: 14 },
  { type: 'Training Days',      used: 3,  total: 5  },
  { type: 'Maternity/Paternity', used: 0, total: 90 },
]

export function TeacherLeaveRequest() {
  const { showToast } = useToast()
  const [applications, setApplications] = useState<LeaveApplication[]>(HISTORY)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: 'sick' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  })

  function calcDays(start: string, end: string) {
    if (!start || !end) return 0
    const s = new Date(start), e = new Date(end)
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return diff > 0 ? diff : 0
  }

  function handleSubmit() {
    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      showToast('Please fill in all required fields', 'error')
      return
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      showToast('End date must be on or after start date', 'error')
      return
    }
    const days = calcDays(form.startDate, form.endDate)
    const newApp: LeaveApplication = {
      id: `la${Date.now()}`,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
      submittedOn: new Date().toISOString().split('T')[0],
      status: 'pending',
      adminComment: '',
      coverTeacher: '',
    }
    setApplications(prev => [newApp, ...prev])
    setForm({ type: 'sick', startDate: '', endDate: '', reason: '' })
    setShowForm(false)
    showToast('Leave application submitted successfully', 'success')
  }

  const days = calcDays(form.startDate, form.endDate)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mrs. Jane Wanjiku · TSC No. KE-TSC-2847</p>
        </div>
        <Button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Apply for Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {LEAVE_BALANCE.map(b => (
          <GlassCard key={b.type} className="p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{b.type}</p>
            <div className="flex items-end gap-1 mt-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{b.total - b.used}</p>
              <p className="text-sm text-gray-400 mb-0.5">/ {b.total} days remaining</p>
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(b.used / b.total) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{b.used} used</p>
          </GlassCard>
        ))}
      </div>

      {/* Application Form */}
      {showForm && (
        <GlassCard className="p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" /> New Leave Application
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">Leave Type *</label>
              <div className="relative">
                <select
                  className="field pr-8 appearance-none"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as LeaveType }))}
                >
                  {LEAVE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">Start Date *</label>
              <input
                type="date"
                className="field"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">End Date *</label>
              <input
                type="date"
                className="field"
                value={form.endDate}
                min={form.startDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>
          {days > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>This application covers <strong>{days} working day{days !== 1 ? 's' : ''}</strong></span>
            </div>
          )}
          <div className="mt-4">
            <label className="label">Reason / Justification *</label>
            <textarea
              rows={3}
              className="field resize-none"
              placeholder="Provide a brief reason for your leave application…"
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
            />
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Leave applications should be submitted at least <strong>3 working days in advance</strong> (except sick leave). Emergency leave must be followed up with relevant documentation.</span>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit}>Submit Application</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Applications History */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Application History</h2>
        <div className="space-y-3">
          {applications.map(app => {
            const st = STATUS_CONFIG[app.status]
            return (
              <GlassCard key={app.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className={`self-start p-2 rounded-lg ${st.bg}`}>
                    <st.icon className={`w-4 h-4 ${st.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{TYPE_LABELS[app.type]}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {app.startDate === app.endDate ? app.startDate : `${app.startDate} → ${app.endDate}`}
                      <span className="text-gray-400">· {app.days} day{app.days !== 1 ? 's' : ''}</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{app.reason}</p>
                    {app.adminComment && (
                      <div className={`mt-3 p-3 rounded-lg ${app.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> Admin Response
                        </p>
                        <p className={`text-sm ${app.status === 'approved' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                          {app.adminComment}
                        </p>
                      </div>
                    )}
                    {app.coverTeacher && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Cover teacher: <strong>{app.coverTeacher}</strong>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Submitted: {app.submittedOn}</p>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
