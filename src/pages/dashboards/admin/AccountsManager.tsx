import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus, Pencil, Trash2, X, Search, Shield, GraduationCap,
  Users, UserCircle, KeyRound, Ban, CheckCircle, Loader2,
  UserCog, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { useAuth } from '../../../contexts/AuthContext'
import {
  useUsers, useUserStats, useCreateUser, useUpdateUser,
  useDeleteUser, useUpdateUserStatus,
} from '../../../hooks/useAdminData'
import type { SystemUser } from '../../../services/userService'
import type { UserRole, UserStatus } from '../../../services/db'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const PAGE_SIZE = 15

const ROLE_META: Record<UserRole, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  admin:   { label: 'Admin',   icon: Shield,        color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/30' },
  teacher: { label: 'Teacher', icon: GraduationCap, color: 'text-green-700 dark:text-green-400',   bg: 'bg-green-50 dark:bg-green-900/30'   },
  parent:  { label: 'Parent',  icon: Users,         color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-900/30'     },
  student: { label: 'Student', icon: UserCircle,    color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-900/30'   },
}

const STATUS_META: Record<UserStatus, { label: string; color: string }> = {
  active:    { label: 'Active',    color: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  inactive:  { label: 'Inactive',  color: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'      },
  suspended: { label: 'Suspended', color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'        },
}

const PERMISSIONS_ALL = [
  'manage_users', 'manage_students', 'manage_staff',
  'manage_finance', 'manage_content', 'view_reports',
  'manage_settings', 'send_announcements',
]

const BLANK = {
  name: '', email: '', phone: '',
  role: 'teacher' as UserRole,
  status: 'active' as UserStatus,
  permissions: [] as string[],
  linkedId: null as string | null,
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function AccountsManager() {
  const { user: currentUser } = useAuth()
  const { showToast } = useToast()
  const { data: users = [], isLoading } = useUsers()
  const { data: stats } = useUserStats()
  const createUser    = useCreateUser()
  const updateUser    = useUpdateUser()
  const deleteUser    = useDeleteUser()
  const updateStatus  = useUpdateUserStatus()

  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [page, setPage]             = useState(1)
  const [editing, setEditing]       = useState<SystemUser | null>(null)
  const [draft, setDraft]           = useState(BLANK)
  const [isNew, setIsNew]           = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [resetConfirm, setResetConfirm] = useState<SystemUser | null>(null)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNew = () => {
    setDraft({ ...BLANK })
    setIsNew(true); setEditing(null)
  }

  const openEdit = (u: SystemUser) => {
    setDraft({
      name: u.name, email: u.email, phone: u.phone,
      role: u.role, status: u.status,
      permissions: [...u.permissions],
      linkedId: u.linkedId,
    })
    setEditing(u); setIsNew(false)
  }

  const save = async () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (!draft.email.trim()) return showToast('Email is required')
    if (isNew) {
      await createUser.mutateAsync(draft)
      showToast('Account created ✓')
    } else if (editing) {
      await updateUser.mutateAsync({ id: editing.id, dto: draft })
      showToast('Account updated ✓')
    }
    setEditing(null); setIsNew(false)
  }

  const del = async (id: string) => {
    await deleteUser.mutateAsync(id)
    setDelConfirm(null)
    showToast('Account deleted')
  }

  const toggleStatus = async (u: SystemUser) => {
    const next: UserStatus = u.status === 'active' ? 'suspended' : 'active'
    await updateStatus.mutateAsync({ id: u.id, status: next })
    showToast(next === 'active' ? `${u.name} reactivated` : `${u.name} suspended`)
  }

  const doPasswordReset = (u: SystemUser) => {
    setResetConfirm(null)
    showToast(`Password reset link sent to ${u.email}`)
  }

  const togglePermission = (perm: string) => {
    setDraft(d => ({
      ...d,
      permissions: d.permissions.includes(perm)
        ? d.permissions.filter(p => p !== perm)
        : [...d.permissions, perm],
    }))
  }

  const FORM_OPEN = isNew || !!editing

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage portal logins, roles, and permissions for all users</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> New Account
        </button>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.entries(ROLE_META) as [UserRole, typeof ROLE_META[UserRole]][]).map(([role, meta]) => {
            const Icon = meta.icon
            return (
              <button key={role} onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
                className={`rounded-2xl border-2 p-4 text-left transition hover:scale-[1.02]
                  ${roleFilter === role
                    ? `${meta.bg} border-current ${meta.color}`
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#E8B84B]/40'
                  }`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-4 w-4 ${roleFilter === role ? meta.color : 'text-gray-400'}`} />
                  <span className={`text-2xl font-bold ${roleFilter === role ? meta.color : 'text-gray-900 dark:text-white'}`}>
                    {stats.byRole[role]}
                  </span>
                </div>
                <p className={`text-xs font-medium ${roleFilter === role ? meta.color : 'text-gray-500 dark:text-gray-400'}`}>
                  {meta.label}s
                </p>
              </button>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className={`${INP} pl-9`} placeholder="Search by name or email…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className={`${INP} w-auto`} value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value as UserRole | 'all'); setPage(1) }}>
          <option value="all">All Roles</option>
          {(Object.keys(ROLE_META) as UserRole[]).map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Account', 'Role', 'Status', 'Last Login', 'Permissions', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-3.5">
                      <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </td></tr>
                  ))
                : paginated.map(u => {
                    const roleMeta = ROLE_META[u.role]
                    const statusMeta = STATUS_META[u.status]
                    const Icon = roleMeta.icon
                    const isSelf = u.email === currentUser?.email
                    return (
                      <tr key={u.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition ${isSelf ? 'bg-[#E8B84B]/5' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${roleMeta.bg} ${roleMeta.color}`}>
                              {u.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                                {u.name}
                                {isSelf && <span className="rounded-full bg-[#E8B84B]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#d4a43a]">YOU</span>}
                              </div>
                              <div className="text-xs text-gray-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleMeta.bg} ${roleMeta.color}`}>
                            <Icon className="h-3 w-3" /> {roleMeta.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMeta.color}`}>{statusMeta.label}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-GB') : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {u.permissions.length > 0 ? `${u.permissions.length} permission${u.permissions.length > 1 ? 's' : ''}` : 'Default'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(u)} title="Edit account"
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => setResetConfirm(u)} title="Reset password"
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 transition">
                              <KeyRound className="h-4 w-4" />
                            </button>
                            <button onClick={() => toggleStatus(u)} title={u.status === 'active' ? 'Suspend' : 'Activate'}
                              disabled={isSelf}
                              className={`rounded-lg p-1.5 transition disabled:opacity-40
                                ${u.status === 'active'
                                  ? 'text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
                                  : 'text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600'}`}>
                              {u.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                            <button onClick={() => setDelConfirm(u.id)} title="Delete account"
                              disabled={isSelf}
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition disabled:opacity-40">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
              {!isLoading && paginated.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                  <UserCog className="mx-auto h-8 w-8 mb-2 opacity-30" />
                  No accounts found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {filtered.length === 0 ? 'No results' : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal open={FORM_OPEN} onClose={() => { setEditing(null); setIsNew(false) }}
        title={isNew ? 'Create Account' : 'Edit Account'}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LABEL}>Full Name *</label>
              <input className={INP} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Jane Mwangi" />
            </div>
            <div>
              <label className={LABEL}>Email *</label>
              <input type="email" className={INP} value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} placeholder="jane@alberschool.ke" />
            </div>
            <div>
              <label className={LABEL}>Phone</label>
              <input className={INP} value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} placeholder="+254 7…" />
            </div>
            <div>
              <label className={LABEL}>Role</label>
              <select className={INP} value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value as UserRole })}>
                {(Object.keys(ROLE_META) as UserRole[]).map(r => (
                  <option key={r} value={r}>{ROLE_META[r].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select className={INP} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as UserStatus })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className={LABEL}>Additional Permissions</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {PERMISSIONS_ALL.map(perm => (
                <label key={perm} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#E8B84B]"
                    checked={draft.permissions.includes(perm)}
                    onChange={() => togglePermission(perm)} />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{perm.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setEditing(null); setIsNew(false) }}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button onClick={save} disabled={createUser.isPending || updateUser.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
              {(createUser.isPending || updateUser.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isNew ? 'Create Account' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Password reset confirmation */}
      <Modal open={!!resetConfirm} onClose={() => setResetConfirm(null)} title="Reset Password">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Send a password reset link to <strong>{resetConfirm?.name}</strong>?
        </p>
        <p className="text-xs text-gray-400 mb-5 font-mono">{resetConfirm?.email}</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setResetConfirm(null)}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button onClick={() => resetConfirm && doPasswordReset(resetConfirm)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600">
            <KeyRound className="h-4 w-4" /> Send Reset Link
          </button>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Account?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          This permanently deletes the account. The user will lose all portal access immediately. Consider suspending instead.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button onClick={() => delConfirm && del(delConfirm)} disabled={deleteUser.isPending}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
            {deleteUser.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete Account
          </button>
        </div>
      </Modal>
    </div>
  )
}
