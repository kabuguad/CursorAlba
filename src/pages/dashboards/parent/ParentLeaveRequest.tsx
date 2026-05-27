import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { AlertCircle, CheckCircle2, Clock, XCircle, Plus, FileText } from 'lucide-react'

interface LeaveRequest {
  id: number
  type: string
  from: string
  to: string
  reason: string
  note: string
  status: 'Approved' | 'Pending' | 'Rejected'
  submittedOn: string
  reviewedBy?: string
  reviewNote?: string
}

const HISTORY: LeaveRequest[] = [
  {
    id: 1, type: 'Medical', from: '2026-03-10', to: '2026-03-11',
    reason: 'Child was unwell with high fever',
    note: 'Doctor\'s note attached.',
    status: 'Approved', submittedOn: '2026-03-09',
    reviewedBy: 'Mrs. Grace Kamau',
    reviewNote: 'Approved. Please ensure Amani catches up on missed work.',
  },
  {
    id: 2, type: 'Family Event', from: '2026-04-18', to: '2026-04-18',
    reason: 'Family burial — paternal grandmother',
    note: 'We will be travelling to Meru.',
    status: 'Approved', submittedOn: '2026-04-16',
    reviewedBy: 'Mrs. Grace Kamau',
    reviewNote: 'Condolences. Approved. Please collect the day\'s assignment on return.',
  },
  {
    id: 3, type: 'Other', from: '2026-05-05', to: '2026-05-05',
    reason: 'Immigration appointment — passport renewal',
    note: 'Appointment is at 10 AM at the Nairobi offices.',
    status: 'Rejected', submittedOn: '2026-05-03',
    reviewedBy: 'Mrs. Grace Kamau',
    reviewNote: 'Please schedule appointments outside school hours when possible.',
  },
]

const LEAVE_TYPES = ['Medical', 'Family Event', 'Religious', 'Sports / Competition', 'Official Appointment', 'Other']

const STATUS_ICONS = {
  Approved: <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />,
  Pending:  <Clock className="h-4 w-4 text-yellow-500" />,
  Rejected: <XCircle className="h-4 w-4 text-red-500" />,
}
const STATUS_STYLES: Record<string, string> = {
  Approved: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Pending:  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Rejected: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function ParentLeaveRequest() {
  const { showToast } = useToast()
  const [history, setHistory] = useState(HISTORY)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: '', from: '', to: '', reason: '', note: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.type)   e.type   = 'Please select a leave type'
    if (!form.from)   e.from   = 'Start date is required'
    if (!form.to)     e.to     = 'End date is required'
    if (!form.reason) e.reason = 'Please state the reason'
    if (form.from && form.to && form.to < form.from) e.to = 'End date must be on or after start date'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const newReq: LeaveRequest = {
      id: Date.now(),
      ...form,
      status: 'Pending',
      submittedOn: new Date().toISOString().slice(0, 10),
    }
    setHistory(h => [newReq, ...h])
    setForm({ type: '', from: '', to: '', reason: '', note: '' })
    setErrors({})
    setShowForm(false)
    showToast('Leave request submitted — the class teacher will review it shortly')
  }

  const pending  = history.filter(h => h.status === 'Pending').length
  const approved = history.filter(h => h.status === 'Approved').length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Amani Kariuki · {history.length} requests · {approved} approved · {pending} pending
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(v => !v)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Submit requests at least <strong>2 school days</strong> in advance for planned absences. For medical emergencies, submit on the day and attach a doctor's note upon return.
        </p>
      </div>

      {/* New request form */}
      {showForm && (
        <GlassCard className="p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            New Absence / Leave Request
          </h2>

          <div>
            <label className="label">Leave Type <span className="text-red-500">*</span></label>
            <select
              value={form.type}
              onChange={e => set('type', e.target.value)}
              className={`field w-full ${errors.type ? 'border-red-400' : ''}`}
            >
              <option value="">Select type…</option>
              {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">From Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.from}
                onChange={e => set('from', e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className={`field w-full ${errors.from ? 'border-red-400' : ''}`}
              />
              {errors.from && <p className="mt-1 text-xs text-red-500">{errors.from}</p>}
            </div>
            <div>
              <label className="label">To Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.to}
                onChange={e => set('to', e.target.value)}
                min={form.from || new Date().toISOString().slice(0, 10)}
                className={`field w-full ${errors.to ? 'border-red-400' : ''}`}
              />
              {errors.to && <p className="mt-1 text-xs text-red-500">{errors.to}</p>}
            </div>
          </div>

          <div>
            <label className="label">Reason for Absence <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={e => set('reason', e.target.value)}
              placeholder="Briefly explain why your child will be absent…"
              className={`field w-full resize-none ${errors.reason ? 'border-red-400' : ''}`}
            />
            {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
          </div>

          <div>
            <label className="label">Additional Notes (optional)</label>
            <textarea
              rows={2}
              value={form.note}
              onChange={e => set('note', e.target.value)}
              placeholder="E.g. doctor's note will be provided on return, homework arrangements needed…"
              className="field w-full resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={handleSubmit} className="flex-1">Submit Request</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setErrors({}) }}>Cancel</Button>
          </div>
        </GlassCard>
      )}

      {/* Request history */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">Request History</h2>
        {history.length === 0 && (
          <GlassCard className="p-8 text-center">
            <p className="text-gray-400">No leave requests yet.</p>
          </GlassCard>
        )}
        {history.map(req => (
          <GlassCard key={req.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                {STATUS_ICONS[req.status]}
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{req.type}</span>
                  <span className="ml-2 text-xs text-gray-400">{req.from === req.to ? req.from : `${req.from} → ${req.to}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[req.status]}`}>
                  {req.status}
                </span>
                <span className="text-xs text-gray-400">Submitted {req.submittedOn}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{req.reason}</p>
            {req.note && <p className="text-xs text-gray-500 dark:text-gray-400 italic">{req.note}</p>}

            {(req.reviewedBy || req.reviewNote) && (
              <div className={`mt-3 rounded-xl px-4 py-3 ${STATUS_STYLES[req.status]} bg-opacity-50`}>
                <p className="text-xs font-semibold mb-0.5">{req.reviewedBy}</p>
                <p className="text-xs">{req.reviewNote}</p>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
