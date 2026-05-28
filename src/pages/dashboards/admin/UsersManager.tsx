import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Search, Shield, Loader2, X, Pencil, ToggleLeft, ToggleRight, Trash2, ChevronDown } from 'lucide-react'
import { useUsers, useCreateUser, useUpdateUser, useUpdateUserStatus, useDeleteUser } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import { unwrap } from '../../../services/mockApi'
import type { SystemUser, UserRole, UserStatus } from '../../../services/db'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const ROLE_COLORS: Record<UserRole, string> = {
  admin:   'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  teacher: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  parent:  'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  student: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const STATUS_COLORS: Record<UserStatus, string> = {
  active:    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  inactive:  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  suspended: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const BLANK = { name: '', email: '', role: 'teacher' as UserRole, phone: '', status: 'active' as UserStatus, permissions: [] as string[], linkedId: null as string | null }

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
    </div>,
    document.body,
  )
}

export function UsersManager() {
  const { showToast } = useToast()
  const { data: users = [], isLoading } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const updateStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SystemUser | null>(null)
  const [draft, setDraft] = useState(BLANK)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (roleFilter === 'all' || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  })

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    parent: users.filter(u => u.role === 'parent').length,
    student: users.filter(u => u.role === 'student').length,
  }

  const openNew = () => { setDraft(BLANK); setEditing(null); setShowForm(true) }
  const openEdit = (u: SystemUser) => { setDraft({ name: u.name, email: u.email, role: u.role, phone: u.phone, status: u.status, permissions: u.permissions, linkedId: u.linkedId }); setEditing(u); setShowForm(true) }

  const save = async () => {
    try {
      if (editing) {
        await updateUser.mutateAsync({ id: editing.id, dto: draft }).then(unwrap)
        showToast('User updated ✓')
      } else {
        await createUser.mutateAsync(draft).then(unwrap)
        showToast('User account created ✓')
      }
      setShowForm(false)
    } catch (e) { showToast((e as Error).message) }
  }

  const toggleStatus = async (u: SystemUser) => {
    const next: UserStatus = u.status === 'active' ? 'inactive' : 'active'
    await updateStatus.mutateAsync({ id: u.id, status: next }).then(unwrap)
    showToast(`User ${next === 'active' ? 'activated' : 'deactivated'} ✓`)
  }

  const del = async (id: string) => {
    await deleteUser.mutateAsync(id)
    setDelConfirm(null)
    showToast('User deleted')
  }

  const timeAgo = (iso: string | null) => {
    if (!iso) return 'Never'
    const diff = Date.now() - new Date(iso).getTime()
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 1) return 'Just now'
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} accounts — admins, teachers, parents, students</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> New User
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-5 grid gap-3 grid-cols-2 sm:grid-cols-5">
        {(['all', 'admin', 'teacher', 'parent', 'student'] as const).map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`rounded-xl p-3 text-left border transition ${roleFilter === r ? 'border-[#E8B84B] bg-[#E8B84B]/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
            <p className="text-xs font-semibold text-gray-400 uppercase">{r}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{counts[r]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className={`${INP} pl-9`} placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading users…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <tr>{['Name', 'Email', 'Role', 'Status', 'Last Login', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15 text-xs font-bold text-[#0d1b0d] dark:text-[#E8B84B]">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                          {u.phone && <p className="text-[10px] text-gray-400">{u.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit capitalize ${ROLE_COLORS[u.role]}`}>
                        <Shield className="h-3 w-3" />{u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{timeAgo(u.lastLogin)}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{u.createdAt.slice(0, 10)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition" title="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => toggleStatus(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition" title="Toggle status">
                          {u.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button onClick={() => setDelConfirm(u.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No users found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Form Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit User' : 'Create User Account'}>
        <div className="space-y-4">
          <div><label className={LABEL}>Full Name</label><input className={INP} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><label className={LABEL}>Email Address</label><input type="email" className={INP} value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Role</label>
              <select className={INP} value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value as UserRole })}>
                {(['admin', 'teacher', 'parent', 'student'] as UserRole[]).map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select className={INP} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as UserStatus })}>
                {(['active', 'inactive', 'suspended'] as UserStatus[]).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
          <div><label className={LABEL}>Phone</label><input className={INP} value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} disabled={createUser.isPending || updateUser.isPending} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60 transition">
              {(createUser.isPending || updateUser.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editing ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete User?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">This will permanently remove the user account. This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={() => delConfirm && del(delConfirm)} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
