import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight,
  Loader2, GraduationCap, Phone, Mail, Clock, ShieldCheck, ShieldOff,
} from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useUpdateUserStatus, useStudents } from '../../../hooks/useAdminData'
import type { SystemUser } from '../../../services/db'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const PAGE_SIZE = 15

type ParentUser = SystemUser & { role: 'parent' }

const BLANK = { name: '', email: '', phone: '' }

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function ParentsManager() {
  const { showToast } = useToast()
  const { data: allUsers = [], isLoading: usersLoading } = useUsers()
  const { data: students = [] } = useStudents()
  const createUser   = useCreateUser()
  const updateUser   = useUpdateUser()
  const deleteUser   = useDeleteUser()
  const updateStatus = useUpdateUserStatus()

  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page,       setPage]       = useState(1)
  const [editing,    setEditing]    = useState<ParentUser | null>(null)
  const [isNew,      setIsNew]      = useState(false)
  const [draft,      setDraft]      = useState(BLANK)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const parents = useMemo(
    () => allUsers.filter((u): u is ParentUser => u.role === 'parent'),
    [allUsers],
  )

  // For each parent, find their linked students
  const childrenMap = useMemo(() => {
    const map = new Map<string, typeof students>()
    for (const p of parents) {
      const linked = students.filter(s => s.parentIds.includes(p.id))
      map.set(p.id, linked)
    }
    return map
  }, [parents, students])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return parents.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q)
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.status === 'active') ||
        (statusFilter === 'inactive' && p.status !== 'active')
      return matchSearch && matchStatus
    })
  }, [parents, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNew = () => { setDraft({ ...BLANK }); setIsNew(true); setEditing(null) }
  const openEdit = (p: ParentUser) => {
    setDraft({ name: p.name, email: p.email, phone: p.phone })
    setEditing(p)
    setIsNew(false)
  }

  const save = async () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (!draft.email.trim()) return showToast('Email is required')
    if (isNew) {
      await createUser.mutateAsync({ ...draft, role: 'parent', status: 'active', permissions: ['fees:read', 'grades:read', 'attendance:read'] })
      showToast('Parent account created ✓')
    } else if (editing) {
      await updateUser.mutateAsync({ id: editing.id, dto: { name: draft.name, email: draft.email, phone: draft.phone } })
      showToast('Parent account updated ✓')
    }
    setEditing(null); setIsNew(false)
  }

  const del = async (id: string) => {
    await deleteUser.mutateAsync(id)
    setDelConfirm(null)
    showToast('Parent account removed')
  }

  const toggleStatus = async (p: ParentUser) => {
    const next = p.status === 'active' ? 'inactive' : 'active'
    await updateStatus.mutateAsync({ id: p.id, status: next })
    showToast(`Account ${next === 'active' ? 'activated' : 'deactivated'}`)
  }

  const isLoading = usersLoading
  const activeCount = parents.filter(p => p.status === 'active').length
  const FORM_OPEN = isNew || !!editing

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parents & Guardians</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {parents.length} accounts · {activeCount} active
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition"
        >
          <Plus className="h-4 w-4" /> Add Parent
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className={`${INP} pl-9`}
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select
          className={`${INP} w-auto`}
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1) }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive / Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Parent / Guardian', 'Contact', 'Children', 'Last Login', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-5 py-3.5">
                        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      </td>
                    </tr>
                  ))
                : paginated.map(p => {
                    const children = childrenMap.get(p.id) ?? []
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                        {/* Name / avatar */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15 text-[11px] font-bold text-[#0d1b0d] dark:text-[#E8B84B]">
                              {initials(p.name)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{p.name}</div>
                              <div className="text-xs text-gray-400 font-mono">{p.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{p.email}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{p.phone || '—'}</span>
                          </div>
                        </td>

                        {/* Children chips */}
                        <td className="px-5 py-3.5">
                          {children.length === 0 ? (
                            <span className="text-xs text-gray-300 dark:text-gray-600 italic">No link</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {children.map(s => (
                                <span
                                  key={s.id}
                                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:text-blue-400"
                                >
                                  <GraduationCap className="h-2.5 w-2.5" />
                                  {s.firstName} {s.lastName}
                                  <span className="text-blue-400 dark:text-blue-500">· {s.grade}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Last login */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 shrink-0" />
                            {relativeTime(p.lastLogin)}
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
                            ${p.status === 'active'
                              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : p.status === 'suspended'
                              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`
                          }>
                            {p.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEdit(p)}
                              title="Edit"
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleStatus(p)}
                              title={p.status === 'active' ? 'Deactivate' : 'Activate'}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 transition"
                            >
                              {p.status === 'active'
                                ? <ShieldOff className="h-4 w-4" />
                                : <ShieldCheck className="h-4 w-4" />
                              }
                            </button>
                            <button
                              onClick={() => setDelConfirm(p.id)}
                              title="Remove"
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
              {!isLoading && paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No parents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit / Add modal */}
      <Modal open={FORM_OPEN} onClose={() => { setEditing(null); setIsNew(false) }} title={isNew ? 'Add Parent Account' : 'Edit Parent Account'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Full Name *</label>
            <input
              className={INP}
              placeholder="e.g. Grace Njeri"
              value={draft.name}
              onChange={e => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div>
            <label className={LABEL}>Email Address *</label>
            <input
              type="email"
              className={INP}
              placeholder="e.g. grace.njeri@gmail.com"
              value={draft.email}
              onChange={e => setDraft({ ...draft, email: e.target.value })}
            />
          </div>
          <div>
            <label className={LABEL}>Phone Number</label>
            <input
              type="tel"
              className={INP}
              placeholder="e.g. 0712-111-001"
              value={draft.phone}
              onChange={e => setDraft({ ...draft, phone: e.target.value })}
            />
          </div>

          {/* Linked children (read-only, shown when editing) */}
          {editing && (() => {
            const children = childrenMap.get(editing.id) ?? []
            return children.length > 0 ? (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Linked Children</p>
                <div className="flex flex-wrap gap-2">
                  {children.map(s => (
                    <div key={s.id} className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 dark:bg-blue-700 text-[9px] font-bold text-blue-800 dark:text-blue-100">
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-blue-800 dark:text-blue-300">{s.firstName} {s.lastName}</div>
                        <div className="text-[10px] text-blue-500">{s.grade} · {s.admNo}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-gray-400">Manage student links from the Students page.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center text-xs text-gray-400">
                No students linked to this account yet
              </div>
            )
          })()}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => { setEditing(null); setIsNew(false) }}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={createUser.isPending || updateUser.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60"
            >
              {(createUser.isPending || updateUser.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isNew ? 'Create Account' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Remove Parent Account?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          This permanently removes the parent portal account. Their linked students will not be affected. Consider deactivating the account instead.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDelConfirm(null)}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => delConfirm && del(delConfirm)}
            disabled={deleteUser.isPending}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {deleteUser.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Remove Account
          </button>
        </div>
      </Modal>
    </div>
  )
}
