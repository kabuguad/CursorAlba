import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { teachers as SEED, departments } from '../../../data/teachers'
import type { Teacher, Department } from '../../../data/types'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const PAGE_SIZE = 12

const TITLES = ['Head of Department', 'Senior Teacher', 'Subject Lead', 'Coordinator', 'Specialist Instructor', 'Academic Mentor']

const BLANK: Omit<Teacher, 'id'> = {
  name: '', title: 'Senior Teacher', department: 'Sciences', image: '',
  bio: '', credentials: [], qualifications: [],
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

const DEPT_COLORS: Record<Department, string> = {
  Sciences:   'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Humanities: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Languages:  'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Music:      'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  Drama:      'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  Sports:     'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
}

export function StaffManager() {
  const { showToast } = useToast()
  const [staff, setStaff] = useState<Teacher[]>(SEED.slice(0, 50).map(t => ({ ...t })))
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [draft, setDraft] = useState<Omit<Teacher, 'id'>>(BLANK)
  const [isNew, setIsNew] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const filtered = staff.filter(t => {
    const q = search.toLowerCase()
    return (t.name.toLowerCase().includes(q) || t.department.toLowerCase().includes(q)) &&
      (deptFilter === 'All' || t.department === deptFilter)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNew = () => { setDraft({ ...BLANK, credentials: [], qualifications: [] }); setIsNew(true); setEditing(null) }
  const openEdit = (t: Teacher) => { setDraft({ name: t.name, title: t.title, department: t.department, image: t.image, bio: t.bio, credentials: [...t.credentials], qualifications: [...t.qualifications] }); setEditing(t); setIsNew(false) }

  const save = () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (isNew) {
      setStaff(prev => [{ ...draft, id: `t-${Date.now()}` }, ...prev])
      showToast('Staff member added ✓')
    } else if (editing) {
      setStaff(prev => prev.map(t => t.id === editing.id ? { ...draft, id: t.id } : t))
      showToast('Staff record updated ✓')
    }
    setEditing(null); setIsNew(false)
  }

  const del = (id: string) => { setStaff(prev => prev.filter(t => t.id !== id)); setDelConfirm(null); showToast('Staff record removed') }
  const FORM_OPEN = isNew || !!editing

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff & Teachers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{staff.length} staff members across {departments.length} departments</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      </div>

      {/* Dept summary chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(['All', ...departments] as (Department | 'All')[]).map(d => (
          <button key={d} onClick={() => { setDeptFilter(d); setPage(1) }}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${deptFilter === d ? 'bg-[#E8B84B] text-[#0d1b0d]' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#E8B84B]/50'}`}>
            {d} {d !== 'All' ? `(${staff.filter(t => t.department === d).length})` : `(${staff.length})`}
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className={`${INP} pl-9`} placeholder="Search staff…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Staff Member', 'Department', 'Title', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {paginated.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt={t.name} className="h-8 w-8 rounded-full object-cover bg-gray-200" />
                      <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DEPT_COLORS[t.department]}`}>{t.department}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{t.title}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDelConfirm(t.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">No staff found</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <Modal open={FORM_OPEN} onClose={() => { setEditing(null); setIsNew(false) }} title={isNew ? 'Add Staff Member' : 'Edit Staff Record'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Full Name *</label>
            <input className={INP} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Department</label>
              <select className={INP} value={draft.department} onChange={e => setDraft({ ...draft, department: e.target.value as Department })}>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Title</label>
              <select className={INP} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}>
                {TITLES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL}>Profile Photo URL</label>
            <input className={INP} placeholder="https://…" value={draft.image} onChange={e => setDraft({ ...draft, image: e.target.value })} />
          </div>
          <div>
            <label className={LABEL}>Short Bio</label>
            <textarea rows={3} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none" value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} />
          </div>
          <div>
            <label className={LABEL}>Credentials (one per line)</label>
            <textarea rows={2} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none" value={draft.credentials.join('\n')} onChange={e => setDraft({ ...draft, credentials: e.target.value.split('\n').filter(Boolean) })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{isNew ? 'Add' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Remove Staff Member?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This will permanently remove the staff member from the directory.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={() => delConfirm && del(delConfirm)} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">Remove</button>
        </div>
      </Modal>
    </div>
  )
}
