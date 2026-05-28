import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Clock, CheckCircle, XCircle, Loader2, X, User } from 'lucide-react'
import { useLeaveRequests, useReviewLeave } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import { useAuth } from '../../../contexts/AuthContext'
import { unwrap } from '../../../services/mockApi'
import type { LeaveRequest } from '../../../services/staffService'

const LEAVE_TYPES = { annual: 'Annual Leave', sick: 'Sick Leave', maternity: 'Maternity/Paternity', emergency: 'Emergency', study: 'Study Leave' }

const STATUS_CFG = {
  pending:  { label: 'Pending',  cls: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',   icon: Clock },
  approved: { label: 'Approved', cls: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',       icon: CheckCircle },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',               icon: XCircle },
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>, document.body,
  )
}

function daysBetween(start: string, end: string): number {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1
}

export function LeaveApprovalsManager() {
  const { showToast } = useToast()
  const { user } = useAuth()
  const { data: leaves = [], isLoading } = useLeaveRequests()
  const reviewLeave = useReviewLeave()

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [reviewing, setReviewing] = useState<LeaveRequest | null>(null)
  const [notes, setNotes] = useState('')

  const filtered = leaves.filter(l => filter === 'all' || l.status === filter)
  const counts = { all: leaves.length, pending: leaves.filter(l => l.status === 'pending').length, approved: leaves.filter(l => l.status === 'approved').length, rejected: leaves.filter(l => l.status === 'rejected').length }

  const review = async (status: 'approved' | 'rejected') => {
    if (!reviewing) return
    try {
      await reviewLeave.mutateAsync({ id: reviewing.id, status, notes, reviewer: user?.name ?? 'Admin' }).then(unwrap)
      showToast(`Leave request ${status} ✓`)
      setReviewing(null); setNotes('')
    } catch (e) { showToast((e as Error).message) }
  }

  const timeAgo = (iso: string) => {
    const d = Date.now() - new Date(iso).getTime()
    const days = Math.floor(d / 86400000)
    return days === 0 ? 'Today' : `${days}d ago`
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Approvals</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{counts.pending} pending · {counts.approved} approved · {counts.rejected} rejected</p>
      </div>

      {/* Filter pills */}
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => {
          const cfg = f === 'all' ? null : STATUS_CFG[f]
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-xl p-3 text-left border transition ${filter === f ? 'border-[#E8B84B] bg-[#E8B84B]/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
              <p className="text-xs font-semibold text-gray-400 uppercase capitalize">{f}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts[f]}</p>
            </button>
          )
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => {
            const cfg = STATUS_CFG[l.status]
            const days = daysBetween(l.startDate, l.endDate)
            return (
              <div key={l.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15">
                      <User className="h-5 w-5 text-[#E8B84B]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{l.staffName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{LEAVE_TYPES[l.type]} · {days} day{days !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.cls}`}>
                      <cfg.icon className="h-3 w-3" />{cfg.label}
                    </span>
                    {l.status === 'pending' && (
                      <button onClick={() => { setReviewing(l); setNotes('') }}
                        className="rounded-xl bg-[#E8B84B] px-3 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
                        Review
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-4 text-xs">
                  <div><p className="text-gray-400">Start Date</p><p className="font-medium text-gray-700 dark:text-gray-300">{l.startDate}</p></div>
                  <div><p className="text-gray-400">End Date</p><p className="font-medium text-gray-700 dark:text-gray-300">{l.endDate}</p></div>
                  <div><p className="text-gray-400">Submitted</p><p className="font-medium text-gray-700 dark:text-gray-300">{timeAgo(l.submittedAt)}</p></div>
                  {l.reviewedBy && <div><p className="text-gray-400">Reviewed by</p><p className="font-medium text-gray-700 dark:text-gray-300">{l.reviewedBy}</p></div>}
                </div>
                <div className="mt-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 px-4 py-2.5">
                  <p className="text-xs text-gray-400 mb-1">Reason</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{l.reason}</p>
                </div>
                {l.reviewNotes && (
                  <div className="mt-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 px-4 py-2.5">
                    <p className="text-xs text-gray-400 mb-1">Review Notes</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{l.reviewNotes}</p>
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-12 text-center text-gray-400">
              No leave requests found
            </div>
          )}
        </div>
      )}

      {/* Review modal */}
      <Modal open={!!reviewing} onClose={() => setReviewing(null)} title={`Review: ${reviewing?.staffName}`}>
        {reviewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-gray-400">Type</p><p className="font-semibold text-gray-900 dark:text-white">{LEAVE_TYPES[reviewing.type]}</p></div>
              <div><p className="text-xs text-gray-400">Duration</p><p className="font-semibold text-gray-900 dark:text-white">{daysBetween(reviewing.startDate, reviewing.endDate)} days</p></div>
              <div><p className="text-xs text-gray-400">From</p><p className="text-gray-700 dark:text-gray-300">{reviewing.startDate}</p></div>
              <div><p className="text-xs text-gray-400">To</p><p className="text-gray-700 dark:text-gray-300">{reviewing.endDate}</p></div>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-700/40 px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Reason</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{reviewing.reason}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Notes</label>
              <textarea rows={3} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none"
                placeholder="Add notes for the staff member…" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setReviewing(null)} className="flex-1 rounded-lg py-2 text-sm font-medium text-gray-600 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button onClick={() => review('rejected')} disabled={reviewLeave.isPending}
                className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 flex items-center justify-center gap-1.5">
                {reviewLeave.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button onClick={() => review('approved')} disabled={reviewLeave.isPending}
                className="flex-1 rounded-xl bg-green-500 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-60 flex items-center justify-center gap-1.5">
                {reviewLeave.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <CheckCircle className="h-4 w-4" /> Approve
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
