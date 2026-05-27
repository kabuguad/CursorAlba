import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { students as SEED } from '../../../data/students'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const GRADES = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Form 1', 'Form 2', 'Form 3', 'Form 4']
const CLASSES = ['Emerald', 'Gold', 'Jade', 'Onyx', 'Pearl', 'Ruby', 'Sapphire', 'Topaz']
const PAGE_SIZE = 15

interface StudentRow { id: string; name: string; grade: string; className: string; status: 'Active' | 'Inactive' }

const BLANK: Omit<StudentRow, 'id'> = { name: '', grade: 'Grade 1', className: 'Emerald Grade 1', status: 'Active' }

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
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

export function StudentsManager() {
  const { showToast } = useToast()
  const [students, setStudents] = useState<StudentRow[]>(
    SEED.map(s => ({ ...s, status: 'Active' as const })),
  )
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<StudentRow | null>(null)
  const [draft, setDraft] = useState<Omit<StudentRow, 'id'>>(BLANK)
  const [isNew, setIsNew] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.name.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q)
    const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter
    return matchSearch && matchGrade
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNew = () => { setDraft({ ...BLANK }); setIsNew(true); setEditing(null) }
  const openEdit = (s: StudentRow) => { setDraft({ name: s.name, grade: s.grade, className: s.className, status: s.status }); setEditing(s); setIsNew(false) }

  const save = () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (isNew) {
      setStudents(prev => [{ ...draft, id: `s-${Date.now()}` }, ...prev])
      showToast('Student enrolled ✓')
    } else if (editing) {
      setStudents(prev => prev.map(s => s.id === editing.id ? { ...draft, id: s.id } : s))
      showToast('Student record updated ✓')
    }
    setEditing(null); setIsNew(false)
  }

  const del = (id: string) => { setStudents(prev => prev.filter(s => s.id !== id)); setDelConfirm(null); showToast('Student record removed') }
  const toggleStatus = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
  }

  const FORM_OPEN = isNew || !!editing

  const activeCount = students.filter(s => s.status === 'Active').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{students.length} enrolled · {activeCount} active</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> Enrol Student
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className={`${INP} pl-9`} placeholder="Search students…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className={`${INP} w-auto`} value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setPage(1) }}>
          <option value="All">All Grades</option>
          {GRADES.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Name', 'Grade', 'Class', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {paginated.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15 text-[10px] font-bold text-[#0d1b0d] dark:text-[#E8B84B]">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{s.grade}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{s.className}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleStatus(s.id)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${s.status === 'Active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                      {s.status}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setDelConfirm(s.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <Modal open={FORM_OPEN} onClose={() => { setEditing(null); setIsNew(false) }} title={isNew ? 'Enrol New Student' : 'Edit Student Record'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Full Name *</label>
            <input className={INP} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Grade</label>
              <select className={INP} value={draft.grade} onChange={e => setDraft({ ...draft, grade: e.target.value })}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Class Stream</label>
              <select className={INP} value={draft.className.split(' ')[0]} onChange={e => setDraft({ ...draft, className: `${e.target.value} ${draft.grade}` })}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select className={INP} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as 'Active' | 'Inactive' })}>
                <option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{isNew ? 'Enrol' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Remove Student?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This permanently removes the student record. Consider setting them to Inactive instead.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={() => delConfirm && del(delConfirm)} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">Remove</button>
        </div>
      </Modal>
    </div>
  )
}
