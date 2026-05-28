import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import {
  useStudents, useCreateStudent, useUpdateStudent,
  useDeleteStudent, useUpdateStudentStatus,
} from '../../../hooks/useAdminData'
import type { Student } from '../../../services/studentService'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const GRADES = ['PP1','PP2','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Form 1','Form 2','Form 3','Form 4']
const PAGE_SIZE = 15

const BLANK = {
  firstName: '', lastName: '', dob: '', gender: 'Male' as const,
  grade: 'Grade 1', classId: '', address: '', medicalNotes: '',
  specialNeeds: '', previousSchool: '', documents: [],
  transportRouteId: null,
  emergencyContact: { name: '', phone: '', relation: '' },
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

export function StudentsManager() {
  const { showToast } = useToast()
  const { data: students = [], isLoading } = useStudents()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const updateStatus  = useUpdateStudentStatus()

  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Student | null>(null)
  const [draft, setDraft] = useState(BLANK)
  const [isNew, setIsNew] = useState(false)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const fullName = (s: Student) => `${s.firstName} ${s.lastName}`

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = fullName(s).toLowerCase().includes(q) || s.grade.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q)
    const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter
    return matchSearch && matchGrade
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNew = () => { setDraft({ ...BLANK }); setIsNew(true); setEditing(null) }
  const openEdit = (s: Student) => {
    setDraft({
      firstName: s.firstName, lastName: s.lastName, dob: s.dob, gender: s.gender,
      grade: s.grade, classId: s.classId, address: s.address, medicalNotes: s.medicalNotes,
      specialNeeds: s.specialNeeds, previousSchool: s.previousSchool, documents: s.documents,
      transportRouteId: s.transportRouteId,
      emergencyContact: { ...s.emergencyContact },
    })
    setEditing(s); setIsNew(false)
  }

  const save = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) return showToast('First and last name are required')
    if (isNew) {
      await createStudent.mutateAsync(draft)
      showToast('Student enrolled ✓')
    } else if (editing) {
      await updateStudent.mutateAsync({ id: editing.id, dto: draft })
      showToast('Student record updated ✓')
    }
    setEditing(null); setIsNew(false)
  }

  const del = async (id: string) => {
    await deleteStudent.mutateAsync(id)
    setDelConfirm(null)
    showToast('Student record removed')
  }

  const toggleStatus = async (s: Student) => {
    const next = s.status === 'active' ? 'inactive' : 'active'
    await updateStatus.mutateAsync({ id: s.id, status: next })
  }

  const FORM_OPEN = isNew || !!editing
  const activeCount = students.filter(s => s.status === 'active').length

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

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className={`${INP} pl-9`} placeholder="Search by name, grade, or adm no…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <select className={`${INP} w-auto`} value={gradeFilter} onChange={e => { setGradeFilter(e.target.value); setPage(1) }}>
          <option value="All">All Grades</option>
          {GRADES.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Adm No', 'Name', 'Grade', 'Emergency Contact', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-5 py-3.5"><div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" /></td></tr>
                  ))
                : paginated.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-gray-400">{s.admNo}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15 text-[10px] font-bold text-[#0d1b0d] dark:text-[#E8B84B]">
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{fullName(s)}</div>
                            <div className="text-xs text-gray-400">{s.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{s.grade}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs text-gray-600 dark:text-gray-300">{s.emergencyContact.name}</div>
                        <div className="text-xs text-gray-400">{s.emergencyContact.phone}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleStatus(s)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition capitalize
                            ${s.status === 'active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : s.status === 'suspended' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
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
                  ))
              }
              {!isLoading && paginated.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No students found</td></tr>
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

      <Modal open={FORM_OPEN} onClose={() => { setEditing(null); setIsNew(false) }} title={isNew ? 'Enrol New Student' : 'Edit Student Record'}>
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
              <label className={LABEL}>Date of Birth</label>
              <input type="date" className={INP} value={draft.dob} onChange={e => setDraft({ ...draft, dob: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Gender</label>
              <select className={INP} value={draft.gender} onChange={e => setDraft({ ...draft, gender: e.target.value as 'Male' | 'Female' })}>
                <option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Grade</label>
              <select className={INP} value={draft.grade} onChange={e => setDraft({ ...draft, grade: e.target.value })}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Previous School</label>
              <input className={INP} value={draft.previousSchool} onChange={e => setDraft({ ...draft, previousSchool: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Address</label>
            <input className={INP} value={draft.address} onChange={e => setDraft({ ...draft, address: e.target.value })} />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className={LABEL}>Emergency Contact</label>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              <input className={INP} placeholder="Name" value={draft.emergencyContact.name} onChange={e => setDraft({ ...draft, emergencyContact: { ...draft.emergencyContact, name: e.target.value } })} />
              <input className={INP} placeholder="Phone" value={draft.emergencyContact.phone} onChange={e => setDraft({ ...draft, emergencyContact: { ...draft.emergencyContact, phone: e.target.value } })} />
              <input className={INP} placeholder="Relation" value={draft.emergencyContact.relation} onChange={e => setDraft({ ...draft, emergencyContact: { ...draft.emergencyContact, relation: e.target.value } })} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Medical Notes</label>
            <textarea rows={2} className={`${INP} resize-none`} value={draft.medicalNotes} onChange={e => setDraft({ ...draft, medicalNotes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setEditing(null); setIsNew(false) }} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={save} disabled={createStudent.isPending || updateStudent.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60">
              {(createStudent.isPending || updateStudent.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isNew ? 'Enrol' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Remove Student?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This permanently removes the student record. Consider setting the status to Inactive instead.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={() => delConfirm && del(delConfirm)} disabled={deleteStudent.isPending}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
            {deleteStudent.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}
