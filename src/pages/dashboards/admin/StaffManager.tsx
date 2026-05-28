import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from '../../../hooks/useAdminData'
import type { StaffMember } from '../../../services/staffService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const PAGE_SIZE = 12

const DEPARTMENTS = ['Sciences', 'Humanities', 'Languages', 'Mathematics', 'ICT', 'Music', 'Drama', 'Sports', 'Administration', 'Support']
const CONTRACT_TYPES = ['permanent', 'temporary', 'intern'] as const

const BLANK = {
  firstName: '', lastName: '', email: '', phone: '',
  dob: '', gender: 'Male' as const, role: 'teacher' as StaffMember['role'],
  department: 'Sciences', subjects: [], classIds: [],
  tscNo: '', nationalId: '', qualification: 'B.Ed',
  contractType: 'permanent' as StaffMember['contractType'], contractEnd: null,
  salaryGrade: 'G7', address: '',
}

const DEPT_COLORS: Record<string, string> = {
  Sciences:      'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Humanities:    'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Languages:     'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Mathematics:   'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  ICT:           'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  Music:         'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  Drama:         'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  Sports:        'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  Administration:'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  Support:       'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
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

export function StaffManager() {
  const { showToast } = useToast()
  const { data: staff = [], isLoading } = useStaff()
  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()
  const deleteStaff = useDeleteStaff()

  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [draft, setDraft] = useState(BLANK)
  const [isNew, setIsNew] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const fullName = (s: StaffMember) => `${s.firstName} ${s.lastName}`
  const initials = (s: StaffMember) => `${s.firstName[0] ?? ''}${s.lastName[0] ?? ''}`

  const depts = [...new Set(staff.map(s => s.department))]

  const filtered = staff.filter(s => {
    const q = search.toLowerCase()
    return (fullName(s).toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.staffNo.toLowerCase().includes(q)) &&
      (deptFilter === 'All' || s.department === deptFilter)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNew = () => { setDraft({ ...BLANK }); setIsNew(true); setEditing(null) }
  const openEdit = (s: StaffMember) => {
    setDraft({
      firstName: s.firstName, lastName: s.lastName, email: s.email, phone: s.phone,
      dob: s.dob, gender: s.gender, role: s.role,
      department: s.department, subjects: s.subjects, classIds: s.classIds,
      tscNo: s.tscNo, nationalId: s.nationalId, qualification: s.qualification,
      contractType: s.contractType, contractEnd: s.contractEnd,
      salaryGrade: s.salaryGrade, address: s.address,
    })
    setEditing(s); setIsNew(false)
  }

  const save = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) return showToast('First and last name are required')
    if (!draft.email.trim()) return showToast('Email is required')
    if (isNew) {
      await createStaff.mutateAsync(draft)
      showToast('Staff member added ✓')
    } else if (editing) {
      await updateStaff.mutateAsync({ id: editing.id, dto: draft })
      showToast('Staff record updated ✓')
    }
    setEditing(null); setIsNew(false)
  }

  const del = async (id: string) => {
    await deleteStaff.mutateAsync(id)
    setDelConfirm(null)
    showToast('Staff record removed')
  }

  const FORM_OPEN = isNew || !!editing

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff & Teachers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{staff.length} staff members · {staff.filter(s => s.role === 'teacher').length} teachers</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      </div>

      {/* Dept chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(['All', ...depts] as string[]).map(d => (
          <button key={d} onClick={() => { setDeptFilter(d); setPage(1) }}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${deptFilter === d ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#E8B84B]/50'}`}>
            {d} ({d === 'All' ? staff.length : staff.filter(s => s.department === d).length})
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className={`${INP} pl-9`} placeholder="Search by name, department, or staff no…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Staff Member', 'Staff No', 'Department', 'Role', 'Contract', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-5 py-3.5"><div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" /></td></tr>
                  ))
                : paginated.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15 text-[10px] font-bold text-[#0d1b0d] dark:text-[#E8B84B]">
                            {initials(s)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{fullName(s)}</div>
                            <div className="text-xs text-gray-400">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-gray-400">{s.staffNo}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DEPT_COLORS[s.department] ?? 'bg-gray-100 text-gray-600'}`}>{s.department}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 capitalize">{s.role.replace('_', ' ')}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 capitalize">{s.contractType}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
                          ${s.status === 'active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : s.status === 'on_leave' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => setDelConfirm(s.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && paginated.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No staff found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          <span>Showing {filtered.length === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <Modal open={FORM_OPEN} onClose={() => { setEditing(null); setIsNew(false) }} title={isNew ? 'Add Staff Member' : 'Edit Staff Record'}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>First Name *</label>
              <input className={INP} value={draft.firstName} onChange={e => setDraft({ ...draft, firstName: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Last Name *</label>
              <input className={INP} value={draft.lastName} onChange={e => setDraft({ ...draft, lastName: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Email *</label>
              <input type="email" className={INP} value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Phone</label>
              <input className={INP} value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Gender</label>
              <select className={INP} value={draft.gender} onChange={e => setDraft({ ...draft, gender: e.target.value as 'Male' | 'Female' })}>
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Date of Birth</label>
              <input type="date" className={INP} value={draft.dob} onChange={e => setDraft({ ...draft, dob: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Role</label>
              <select className={INP} value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value as StaffMember['role'] })}>
                <option value="teacher">Teacher</option>
                <option value="admin_staff">Admin Staff</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Department</label>
              <select className={INP} value={draft.department} onChange={e => setDraft({ ...draft, department: e.target.value })}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Qualification</label>
              <input className={INP} value={draft.qualification} onChange={e => setDraft({ ...draft, qualification: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Contract Type</label>
              <select className={INP} value={draft.contractType} onChange={e => setDraft({ ...draft, contractType: e.target.value as StaffMember['contractType'] })}>
                {CONTRACT_TYPES.map(c => <option key={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>TSC / Staff No</label>
              <input className={INP} value={draft.tscNo} onChange={e => setDraft({ ...draft, tscNo: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>National ID</label>
              <input className={INP} value={draft.nationalId} onChange={e => setDraft({ ...draft, nationalId: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Address</label>
            <input className={INP} value={draft.address} onChange={e => setDraft({ ...draft, address: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} disabled={createStaff.isPending || updateStaff.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
              {(createStaff.isPending || updateStaff.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isNew ? 'Add' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Remove Staff Member?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This permanently removes the staff member record.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={() => delConfirm && del(delConfirm)} disabled={deleteStaff.isPending}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
            {deleteStaff.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}
