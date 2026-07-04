import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Search, Trash2, X, Loader2, FileText, Upload, Eye, ChevronLeft,
  ChevronRight, CheckCircle2, Clock, RefreshCw, XCircle, User, Mail,
  Phone, Calendar, BookOpen, Download,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import {
  admissionsService,
  STATUS_LABEL_TO_INT,
  APPLICATION_STATUS_LABELS,
} from '../../../services/admissionsService'
import type {
  AdmissionApplication,
  AdmissionDocument,
  ApplicationStatusLabel,
} from '../../../services/admissionsService'

// ── Styles ───────────────────────────────────────────────────────────────────
const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const PAGE_SIZE = 15

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_STYLE: Record<ApplicationStatusLabel, string> = {
  Pending:   'bg-yellow-50 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-400/20',
  Reviewing: 'bg-blue-50 dark:bg-blue-400/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-400/20',
  Approved:  'bg-green-50 dark:bg-green-400/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-400/20',
  Rejected:  'bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-400/20',
}
const STATUS_ICON: Record<ApplicationStatusLabel, React.ElementType> = {
  Pending: Clock, Reviewing: RefreshCw, Approved: CheckCircle2, Rejected: XCircle,
}

function StatusBadge({ status }: { status: ApplicationStatusLabel }) {
  const Icon = STATUS_ICON[status] ?? Clock
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status] ?? ''}`}>
      <Icon className="h-3 w-3" /> {status}
    </span>
  )
}

function fmtDate(s?: string | null) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

// ── Confirm delete modal ─────────────────────────────────────────────────────
function ConfirmModal({ open, title, body, onConfirm, onClose, busy }: {
  open: boolean; title: string; body: string; onConfirm: () => void; onClose: () => void; busy: boolean
}) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 shadow-2xl p-6">
        <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{body}</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={busy} className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={busy} className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ── Document row ─────────────────────────────────────────────────────────────
function DocRow({ doc, onDelete }: { doc: AdmissionDocument; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2">
      <FileText className="h-4 w-4 shrink-0 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{doc.originalFileName}</p>
        <p className="text-xs text-gray-400">
          {doc.documentType} · {fmtBytes(doc.fileSizeBytes)} · {fmtDate(doc.uploadedAt)}
        </p>
      </div>
      {doc.filePath && (
        <a
          href={doc.filePath}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </a>
      )}
      <button
        onClick={onDelete}
        className="rounded p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
        title="Delete document"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── Detail panel ─────────────────────────────────────────────────────────────
// Fetches the full ApplicationResponseDto (including embedded documents) itself.
function DetailPanel({
  appId,
  onClose,
}: {
  appId: number
  onClose: () => void
}) {
  const { showToast } = useToast()
  const qc = useQueryClient()

  // Full detail — includes documents (EF eager-loaded by the server)
  const { data: detail, isLoading } = useQuery({
    queryKey: ['admissions', 'detail', appId],
    queryFn: () => admissionsService.getById(appId),
  })

  // Form state — initialised once when detail first loads
  const [statusDraft, setStatusDraft] = useState<ApplicationStatusLabel | null>(null)
  const [notesDraft, setNotesDraft]   = useState<string | null>(null)
  const [reviewedBy, setReviewedBy]   = useState<string | null>(null)

  useEffect(() => {
    if (detail && statusDraft === null) {
      setStatusDraft(detail.status)
      setNotesDraft(detail.adminNotes ?? '')
      setReviewedBy(detail.reviewedBy ?? '')
    }
  }, [detail, statusDraft])

  const updateStatus = useMutation({
    mutationFn: () => admissionsService.updateStatus(appId, {
      status: STATUS_LABEL_TO_INT[statusDraft ?? 'Pending'],
      notes: notesDraft || null,
      reviewedBy: reviewedBy || null,
    }),
    onSuccess: () => {
      // Refresh both the list (summary counts) and the detail (panel data)
      qc.invalidateQueries({ queryKey: ['admissions'] })
      qc.invalidateQueries({ queryKey: ['admissions', 'detail', appId] })
      showToast('Status updated')
    },
    onError: () => showToast('Failed to update status'),
  })

  // Document upload
  const fileRef = useRef<HTMLInputElement>(null)
  const [docType, setDocType] = useState('')

  const uploadDoc = useMutation({
    mutationFn: async () => {
      const file = fileRef.current?.files?.[0]
      if (!file) throw new Error('No file selected')
      if (!docType.trim()) throw new Error('Enter a document type')
      return admissionsService.uploadDocument(appId, docType.trim(), file)
    },
    onSuccess: () => {
      // Refresh detail so the documents list updates
      qc.invalidateQueries({ queryKey: ['admissions', 'detail', appId] })
      // Also refresh the list so documentCount stays in sync
      qc.invalidateQueries({ queryKey: ['admissions'] })
      showToast('Document uploaded')
      setDocType('')
      if (fileRef.current) fileRef.current.value = ''
    },
    onError: (e: Error) => showToast(e.message || 'Upload failed'),
  })

  const deleteDoc = useMutation({
    mutationFn: (docId: number) => admissionsService.deleteDocument(appId, docId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admissions', 'detail', appId] })
      qc.invalidateQueries({ queryKey: ['admissions'] })
      showToast('Document removed')
    },
    onError: () => showToast('Failed to remove document'),
  })

  // Small helper component (defined outside render to avoid re-creation)
  const docs = detail?.documents ?? []

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div className="w-full max-w-xl flex flex-col bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Application</p>
            {detail ? (
              <>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {detail.childFirstName} {detail.childLastName}
                </h2>
                <p className="text-xs text-gray-400">{detail.referenceNumber ?? `#${appId}`}</p>
              </>
            ) : (
              <h2 className="font-bold text-gray-400">#{appId}</h2>
            )}
          </div>
          <div className="flex items-center gap-3">
            {detail && <StatusBadge status={detail.status} />}
            <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading || !detail ? (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading application…
            </div>
          ) : (
            <div className="space-y-6">
              {/* Child */}
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-yellow-500">Child</p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={User}     label="Name"        value={`${detail.childFirstName} ${detail.childLastName}`} />
                  <InfoRow icon={Calendar} label="DOB"         value={fmtDate(detail.dateOfBirth)} />
                  <InfoRow icon={BookOpen} label="Grade"       value={detail.applyingForGrade} />
                  <InfoRow icon={BookOpen} label="Prev School" value={detail.previousSchool} />
                </div>
              </section>

              {/* Parent */}
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-yellow-500">Parent / Guardian</p>
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={User}  label="Name"          value={`${detail.parentFirstName} ${detail.parentLastName}`} />
                  <InfoRow icon={User}  label="Relationship"  value={detail.parentRelationship} />
                  <InfoRow icon={Mail}  label="Email"         value={detail.parentEmail} />
                  <InfoRow icon={Phone} label="Phone"         value={detail.parentPhone} />
                  <InfoRow icon={User}  label="ID / Passport" value={detail.parentIdNumber} />
                </div>
              </section>

              {/* Status update */}
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-yellow-500">Update Status</p>
                <div className="space-y-3">
                  <div>
                    <label className={LABEL}>Status</label>
                    <select
                      className={INP}
                      value={statusDraft ?? detail.status}
                      onChange={e => setStatusDraft(e.target.value as ApplicationStatusLabel)}
                    >
                      {APPLICATION_STATUS_LABELS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Notes</label>
                    <textarea
                      className={`${INP} min-h-[80px] resize-y`}
                      value={notesDraft ?? ''}
                      onChange={e => setNotesDraft(e.target.value)}
                      placeholder="Internal notes about this application…"
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Reviewed By</label>
                    <input
                      className={INP}
                      value={reviewedBy ?? ''}
                      onChange={e => setReviewedBy(e.target.value)}
                      placeholder="Staff member name"
                    />
                  </div>
                  <button
                    onClick={() => updateStatus.mutate()}
                    disabled={updateStatus.isPending}
                    className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-50"
                  >
                    {updateStatus.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Save Status
                  </button>
                </div>
              </section>

              {/* Documents */}
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-yellow-500">
                  Documents{docs.length > 0 && <span className="ml-1 font-normal normal-case text-gray-400">({docs.length})</span>}
                </p>

                {docs.length === 0 ? (
                  <p className="text-sm text-gray-400">No documents uploaded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {docs.map(doc => (
                      <DocRow
                        key={doc.id}
                        doc={doc}
                        onDelete={() => deleteDoc.mutate(doc.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Upload */}
                <div className="mt-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Upload Document</p>
                  <input
                    className={INP}
                    placeholder="Document type (BirthCertificate | SchoolReport | ParentId)"
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={`${INP} file:mr-3 file:rounded file:border-0 file:bg-yellow-400/10 file:px-2 file:py-1 file:text-xs file:font-bold file:text-yellow-600 cursor-pointer`}
                  />
                  <button
                    onClick={() => uploadDoc.mutate()}
                    disabled={uploadDoc.isPending}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-white px-4 py-2 text-sm font-bold text-white dark:text-gray-900 hover:opacity-90 disabled:opacity-50"
                  >
                    {uploadDoc.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ── Info row helper (module-level so reference is stable) ────────────────────
function InfoRow({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value?: string | null
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="text-sm text-gray-800 dark:text-white">{value || '—'}</p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function AdminAdmissions() {
  const { showToast } = useToast()
  const qc = useQueryClient()

  const { data: rawData, isLoading } = useQuery({
    queryKey: ['admissions'],
    queryFn: admissionsService.list,
  })
  const applications: AdmissionApplication[] = Array.isArray(rawData) ? rawData : []

  const deleteApp = useMutation({
    mutationFn: admissionsService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admissions'] }); showToast('Application deleted') },
    onError: () => showToast('Delete failed'),
  })

  // ── Filters & pagination ──────────────────────────────────────────────────
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatusLabel>('all')
  const [page, setPage]                 = useState(1)
  // Storing only the ID keeps the panel in sync with refetched detail data
  const [selectedId, setSelectedId]     = useState<number | null>(null)
  const [delTarget, setDelTarget]       = useState<AdmissionSummary | null>(null)

  const filtered = applications.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q
      || a.childFullName.toLowerCase().includes(q)
      || a.parentEmail.toLowerCase().includes(q)
      || a.parentPhone.includes(q)
      || (a.referenceNumber ?? '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Stats
  const stats = APPLICATION_STATUS_LABELS.map(label => ({
    label,
    count: applications.filter(a => a.status === label).length,
  }))

  const filterTab = (label: 'all' | ApplicationStatusLabel) => {
    setStatusFilter(label)
    setPage(1)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admissions</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {applications.length} total application{applications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, count }) => {
          const Icon = STATUS_ICON[label]
          return (
            <button
              key={label}
              onClick={() => filterTab(label)}
              className={`rounded-xl border p-4 text-left transition hover:shadow-md ${
                statusFilter === label
                  ? 'border-yellow-400/50 bg-yellow-50 dark:bg-yellow-400/10 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{count}</p>
            </button>
          )
        })}
      </div>

      {/* Search + filter tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
            placeholder="Search by name, email, phone or reference…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['all', ...APPLICATION_STATUS_LABELS] as const).map(f => (
            <button
              key={f}
              onClick={() => filterTab(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === f
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading applications…
          </div>
        ) : paged.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FileText className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p className="font-medium">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Child</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Parent Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Docs</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {paged.map(app => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition cursor-pointer"
                    onClick={() => setSelectedId(app.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {app.referenceNumber ?? `#${app.id}`}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {app.childFullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{app.applyingForGrade}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{app.parentEmail}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{app.parentPhone}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center h-5 min-w-5 rounded-full px-1.5 text-xs font-bold ${
                        app.documentCount > 0
                          ? 'bg-green-100 dark:bg-green-400/10 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}>
                        {app.documentCount}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{fmtDate(app.submittedAt)}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedId(app.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-500 transition"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDelTarget(app)}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail slide-over — fetches full ApplicationResponseDto internally */}
      {selectedId != null && (
        <DetailPanel
          key={selectedId}
          appId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* Delete confirm */}
      <ConfirmModal
        open={!!delTarget}
        title="Delete Application"
        body={`Remove the application from ${delTarget?.childFullName}? This cannot be undone.`}
        busy={deleteApp.isPending}
        onClose={() => setDelTarget(null)}
        onConfirm={() => {
          if (!delTarget) return
          deleteApp.mutate(delTarget.id, { onSuccess: () => setDelTarget(null) })
        }}
      />
    </div>
  )
}
