import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye, CheckCircle, XCircle, Clock, Search, X, Download, User } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'

type AppStatus = 'pending' | 'reviewing' | 'approved' | 'rejected'

interface Application {
  id: string
  childName: string
  dob: string
  grade: string
  parentName: string
  parentEmail: string
  parentPhone: string
  submittedDate: string
  status: AppStatus
  documents: string[]
  notes: string
}

const SEED: Application[] = [
  { id: 'APP-001', childName: 'Lena Muriithi',    dob: '2017-03-12', grade: 'PP1',    parentName: 'Alice Muriithi',   parentEmail: 'alice@email.com',  parentPhone: '0712-111-001', submittedDate: '2026-05-20', status: 'pending',   documents: ['Birth Certificate', 'Previous Report Card'], notes: '' },
  { id: 'APP-002', childName: 'Brian Kimani',      dob: '2015-07-22', grade: 'Grade 3', parentName: 'David Kimani',    parentEmail: 'david@email.com',  parentPhone: '0722-111-002', submittedDate: '2026-05-18', status: 'reviewing', documents: ['Birth Certificate', 'Report Card', 'Medical Form'], notes: 'Documents verified. Awaiting principal sign-off.' },
  { id: 'APP-003', childName: 'Sasha Odhiambo',   dob: '2013-11-05', grade: 'Grade 5', parentName: 'Ruth Odhiambo',   parentEmail: 'ruth@email.com',   parentPhone: '0733-111-003', submittedDate: '2026-05-15', status: 'approved',  documents: ['Birth Certificate', 'KCPE Results', 'Medical Form'], notes: 'Approved — starts Term 2.' },
  { id: 'APP-004', childName: 'Kevin Wanjiku',     dob: '2012-04-30', grade: 'Grade 7', parentName: 'Samuel Wanjiku',  parentEmail: 'sam@email.com',    parentPhone: '0744-111-004', submittedDate: '2026-05-14', status: 'rejected',  documents: ['Birth Certificate'], notes: 'Incomplete documents. Parent notified to resubmit.' },
  { id: 'APP-005', childName: 'Miriam Njeri',      dob: '2018-01-08', grade: 'PP2',    parentName: 'Joseph Njeri',    parentEmail: 'joseph@email.com', parentPhone: '0755-111-005', submittedDate: '2026-05-22', status: 'pending',   documents: ['Birth Certificate', 'Immunization Card'], notes: '' },
  { id: 'APP-006', childName: 'Timothy Achieng',   dob: '2016-09-17', grade: 'Grade 2', parentName: 'Faith Achieng',  parentEmail: 'faith@email.com',  parentPhone: '0766-111-006', submittedDate: '2026-05-21', status: 'reviewing', documents: ['Birth Certificate', 'Previous School Testimonial'], notes: 'Transfer student — awaiting conduct report.' },
  { id: 'APP-007', childName: 'Priscilla Kamau',   dob: '2011-06-03', grade: 'Form 1', parentName: 'George Kamau',    parentEmail: 'george@email.com', parentPhone: '0777-111-007', submittedDate: '2026-05-19', status: 'approved',  documents: ['Birth Certificate', 'KCPE Certificate', 'Medical'], notes: 'KCPE: 380/500. Admitted to Sapphire stream.' },
  { id: 'APP-008', childName: 'Dennis Mwenda',     dob: '2014-02-28', grade: 'Grade 4', parentName: 'Mary Mwenda',    parentEmail: 'mary@email.com',   parentPhone: '0788-111-008', submittedDate: '2026-05-23', status: 'pending',   documents: ['Birth Certificate'], notes: '' },
]

const STATUS_CONFIG: Record<AppStatus, { label: string; icon: typeof Clock; cls: string }> = {
  pending:   { label: 'Pending',   icon: Clock,        cls: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  reviewing: { label: 'Reviewing', icon: Eye,          cls: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'         },
  approved:  { label: 'Approved',  icon: CheckCircle,  cls: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'     },
  rejected:  { label: 'Rejected',  icon: XCircle,      cls: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'             },
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function AdmissionsManager() {
  const { showToast } = useToast()
  const [apps, setApps] = useState<Application[]>(SEED)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'all'>('all')
  const [selected, setSelected] = useState<Application | null>(null)
  const [notes, setNotes] = useState('')

  const filtered = apps.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = a.childName.toLowerCase().includes(q) || a.parentName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    reviewing: apps.filter(a => a.status === 'reviewing').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  }

  const updateStatus = (id: string, status: AppStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status, notes: notes || a.notes } : a))
    showToast(`Application ${status} ✓`)
    setSelected(null)
  }

  const openApp = (a: Application) => {
    setSelected(a)
    setNotes(a.notes)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admissions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{counts.all} applications · {counts.pending} pending review</p>
        </div>
        <button
          onClick={() => showToast('Export ready — CSV downloaded')}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Status filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(['all', 'pending', 'reviewing', 'approved', 'rejected'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${
              statusFilter === s
                ? 'bg-[#E8B84B] text-[#0d1b0d]'
                : 'border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_CONFIG[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className={`${INP} pl-9`} placeholder="Search by child, parent, or reference…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {(['pending', 'reviewing', 'approved', 'rejected'] as AppStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s]
          return (
            <div key={s} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{cfg.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{counts[s]}</p>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Ref', 'Child', 'Grade', 'Parent', 'Submitted', 'Documents', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filtered.map(a => {
                const cfg = STATUS_CONFIG[a.status]
                return (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{a.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15">
                          <User className="h-3.5 w-3.5 text-[#0d1b0d] dark:text-[#E8B84B]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{a.childName}</p>
                          <p className="text-[10px] text-gray-400">DOB: {a.dob}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{a.grade}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-gray-900 dark:text-white">{a.parentName}</p>
                      <p className="text-[10px] text-gray-400">{a.parentPhone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{a.submittedDate}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{a.documents.length} file{a.documents.length !== 1 ? 's' : ''}</td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit ${cfg.cls}`}>
                        <cfg.icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => openApp(a)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"
                        title="Review Application"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No applications found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Review Application — ${selected?.id}`}>
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Child</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.childName}</p>
                <p className="text-sm text-gray-400">DOB: {selected.dob} · Applying for: {selected.grade}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Parent / Guardian</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selected.parentName}</p>
                <p className="text-sm text-gray-400">{selected.parentEmail}</p>
                <p className="text-sm text-gray-400">{selected.parentPhone}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Submitted Documents</p>
              <div className="flex flex-wrap gap-2">
                {selected.documents.map(d => (
                  <span key={d} className="flex items-center gap-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" /> {d}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Notes</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none"
                placeholder="Add notes about this application…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => updateStatus(selected.id, 'reviewing')} className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition">Mark Reviewing</button>
                <button onClick={() => updateStatus(selected.id, 'approved')} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition">Approve</button>
                <button onClick={() => updateStatus(selected.id, 'pending')} className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Reset to Pending</button>
                <button onClick={() => updateStatus(selected.id, 'rejected')} className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition">Reject</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
