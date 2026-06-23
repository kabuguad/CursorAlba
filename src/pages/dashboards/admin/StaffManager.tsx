import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Search, Loader2, Users, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import {
  useApiTeachers, useApiDepartments,
  useCreateTeacher, useUpdateTeacher, useDeleteTeacher,
  useCreateDepartment, useUpdateDepartment, useDeleteDepartment,
} from '../../../hooks/useAdminData'
import type { ApiTeacher, ApiDepartment, TeacherCreateDto, DepartmentCreateDto } from '../../../services/staffApi'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const PAGE_SIZE = 12

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']

const BLANK_TEACHER: TeacherCreateDto = {
  firstName: '', lastName: '', email: '', title: 'Mr.',
  credentials: '', qualifications: '', profilePhoto: '',
  academicPortfolio: '', hireDate: '', departmentId: 0,
}

const BLANK_DEPT: DepartmentCreateDto = {
  name: '', description: '', icon: '', sortOrder: 1, isActive: true,
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
  const { data: teachers = [], isLoading: loadingTeachers } = useApiTeachers()
  const { data: departments = [], isLoading: loadingDepts } = useApiDepartments()
  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher()
  const deleteTeacher = useDeleteTeacher()
  const createDept = useCreateDepartment()
  const updateDept = useUpdateDepartment()
  const deleteDept = useDeleteDepartment()

  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [teacherModal, setTeacherModal] = useState<{ open: boolean; editing: ApiTeacher | null }>({ open: false, editing: null })
  const [teacherDraft, setTeacherDraft] = useState<TeacherCreateDto>(BLANK_TEACHER)
  const [delTeacher, setDelTeacher] = useState<ApiTeacher | null>(null)

  const [deptModal, setDeptModal] = useState<{ open: boolean; editing: ApiDepartment | null }>({ open: false, editing: null })
  const [deptDraft, setDeptDraft] = useState<DepartmentCreateDto>(BLANK_DEPT)
  const [delDept, setDelDept] = useState<ApiDepartment | null>(null)

  const displayedTeachers = teachers.filter(t => {
    const q = search.toLowerCase()
    const matchDept = selectedDeptId === null || t.departmentId === selectedDeptId
    const matchSearch = !q || t.fullName.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)
    return matchDept && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(displayedTeachers.length / PAGE_SIZE))
  const paged = displayedTeachers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openNewTeacher = () => {
    setTeacherDraft({ ...BLANK_TEACHER, departmentId: selectedDeptId ?? departments[0]?.id ?? 0 })
    setTeacherModal({ open: true, editing: null })
  }
  const openEditTeacher = (t: ApiTeacher) => {
    setTeacherDraft({
      firstName: t.firstName, lastName: t.lastName, email: t.email, title: t.title,
      credentials: t.credentials, qualifications: t.qualifications,
      profilePhoto: t.profilePhoto ?? '', academicPortfolio: t.academicPortfolio ?? '',
      hireDate: t.hireDate ? t.hireDate.split('T')[0] : '', departmentId: t.departmentId,
    })
    setTeacherModal({ open: true, editing: t })
  }
  const saveTeacher = async () => {
    if (!teacherDraft.firstName.trim() || !teacherDraft.lastName.trim()) return showToast('First and last name are required')
    if (!teacherDraft.email.trim()) return showToast('Email is required')
    if (!teacherDraft.departmentId) return showToast('Department is required')
    const dto: TeacherCreateDto = {
      ...teacherDraft,
      profilePhoto: teacherDraft.profilePhoto || null,
      academicPortfolio: teacherDraft.academicPortfolio || null,
      hireDate: teacherDraft.hireDate || null,
    }
    try {
      if (teacherModal.editing) {
        await updateTeacher.mutateAsync({ id: teacherModal.editing.id, dto })
        showToast('Teacher updated ✓')
      } else {
        await createTeacher.mutateAsync(dto)
        showToast('Teacher added ✓')
      }
      setTeacherModal({ open: false, editing: null })
    } catch {
      showToast('Failed to save teacher — check API connection')
    }
  }
  const confirmDeleteTeacher = async () => {
    if (!delTeacher) return
    try {
      await deleteTeacher.mutateAsync(delTeacher.id)
      showToast('Teacher removed')
    } catch {
      showToast('Failed to delete teacher')
    }
    setDelTeacher(null)
  }

  const openNewDept = () => { setDeptDraft({ ...BLANK_DEPT, sortOrder: (departments.length + 1) }); setDeptModal({ open: true, editing: null }) }
  const openEditDept = (d: ApiDepartment) => {
    setDeptDraft({ name: d.name, description: d.description ?? '', icon: d.icon ?? '', sortOrder: d.sortOrder, isActive: d.isActive })
    setDeptModal({ open: true, editing: d })
  }
  const saveDept = async () => {
    if (!deptDraft.name.trim()) return showToast('Department name is required')
    const dto: DepartmentCreateDto = { ...deptDraft, description: deptDraft.description || null, icon: deptDraft.icon || null }
    try {
      if (deptModal.editing) {
        await updateDept.mutateAsync({ id: deptModal.editing.id, dto })
        showToast('Department updated ✓')
      } else {
        await createDept.mutateAsync(dto)
        showToast('Department created ✓')
      }
      setDeptModal({ open: false, editing: null })
    } catch {
      showToast('Failed to save department — check API connection')
    }
  }
  const confirmDeleteDept = async () => {
    if (!delDept) return
    try {
      await deleteDept.mutateAsync(delDept.id)
      if (selectedDeptId === delDept.id) setSelectedDeptId(null)
      showToast('Department removed')
    } catch {
      showToast('Failed to delete department')
    }
    setDelDept(null)
  }

  const selectedDept = departments.find(d => d.id === selectedDeptId)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-4 px-6 pt-6 lg:px-8 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff & Teachers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{departments.length} departments · {teachers.length} teachers</p>
        </div>
        <button onClick={openNewTeacher} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> Add Teacher
        </button>
      </div>

      <div className="flex flex-1 min-h-0 gap-0 overflow-hidden">
        {/* ── Department sidebar ──────────────────────────────────────────── */}
        <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Departments</span>
            <button
              onClick={openNewDept}
              title="Add department"
              className="rounded-lg p-1 text-gray-400 hover:bg-[#E8B84B]/20 hover:text-[#0d1b0d] dark:hover:text-[#E8B84B] transition"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-1">
            {loadingDepts ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-4 w-4 animate-spin text-gray-400" /></div>
            ) : (
              <>
                <button
                  onClick={() => { setSelectedDeptId(null); setPage(1) }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${
                    selectedDeptId === null
                      ? 'bg-[#E8B84B]/15 text-[#0d1b0d] dark:text-[#E8B84B] font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> All Teachers</span>
                  <span className="text-xs tabular-nums">{teachers.length}</span>
                </button>

                {departments.map((dept, di) => {
                  const count = teachers.filter(t => t.departmentId === dept.id).length
                  const active = selectedDeptId === dept.id
                  return (
                    <div key={`dept-${dept.id}-${di}`} className="group relative">
                      <button
                        onClick={() => { setSelectedDeptId(dept.id); setPage(1) }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition pr-16 ${
                          active
                            ? 'bg-[#E8B84B]/15 text-[#0d1b0d] dark:text-[#E8B84B] font-semibold'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {dept.icon ? <span>{dept.icon}</span> : <Building2 className="h-3.5 w-3.5 shrink-0" />}
                          <span className="truncate">{dept.name}</span>
                        </span>
                        <span className="text-xs tabular-nums shrink-0">{count}</span>
                      </button>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-0.5">
                        <button onClick={() => openEditDept(dept)} className="rounded p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600"><Pencil className="h-3 w-3" /></button>
                        <button onClick={() => setDelDept(dept)} className="rounded p-1 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </aside>

        {/* ── Teacher list ────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                className={`${INP} pl-8 text-xs py-1.5`}
                placeholder="Search teachers…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            {selectedDept && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{selectedDept.name}</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingTeachers ? (
              <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading teachers…
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 sticky top-0 z-10">
                    <tr>
                      {['Teacher', 'Title', 'Department', 'Email', 'Hire Date', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {paged.map((t, ti) => (
                      <tr key={`teacher-${t.id}-${ti}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={t.profilePhoto ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=0d4a1f&color=E8B84B&size=80`}
                              alt={t.fullName}
                              className="h-8 w-8 rounded-full object-cover shrink-0"
                            />
                            <span className="font-medium text-gray-900 dark:text-white">{t.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{t.title}</td>
                        <td className="px-5 py-3.5">
                          <span className="rounded-full bg-[#E8B84B]/15 px-2.5 py-0.5 text-xs font-semibold text-[#0d1b0d] dark:text-[#E8B84B]">
                            {t.departmentName}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{t.email}</td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {t.hireDate ? new Date(t.hireDate).toLocaleDateString('en-KE', { year: 'numeric', month: 'short' }) : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2">
                            <button onClick={() => openEditTeacher(t)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => setDelTeacher(t)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paged.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 text-sm">No teachers found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400 shrink-0">
              <span>
                {displayedTeachers.length === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, displayedTeachers.length)}–{Math.min(page * PAGE_SIZE, displayedTeachers.length)} of {displayedTeachers.length}
              </span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="h-4 w-4" /></button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg p-1.5 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Teacher Modal ──────────────────────────────────────── */}
      <Modal
        open={teacherModal.open}
        onClose={() => setTeacherModal({ open: false, editing: null })}
        title={teacherModal.editing ? 'Edit Teacher' : 'Add Teacher'}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Title</label>
              <select className={INP} value={teacherDraft.title} onChange={e => setTeacherDraft({ ...teacherDraft, title: e.target.value })}>
                {TITLES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Department *</label>
              <select className={INP} value={teacherDraft.departmentId} onChange={e => setTeacherDraft({ ...teacherDraft, departmentId: Number(e.target.value) })}>
                <option value={0} disabled>— select —</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>First Name *</label>
              <input className={INP} value={teacherDraft.firstName} onChange={e => setTeacherDraft({ ...teacherDraft, firstName: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Last Name *</label>
              <input className={INP} value={teacherDraft.lastName} onChange={e => setTeacherDraft({ ...teacherDraft, lastName: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Email *</label>
              <input type="email" className={INP} value={teacherDraft.email} onChange={e => setTeacherDraft({ ...teacherDraft, email: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Credentials</label>
              <input className={INP} placeholder="e.g. B.Ed (Sci)" value={teacherDraft.credentials} onChange={e => setTeacherDraft({ ...teacherDraft, credentials: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Qualifications</label>
              <input className={INP} placeholder="e.g. M.Sc. Chemistry" value={teacherDraft.qualifications} onChange={e => setTeacherDraft({ ...teacherDraft, qualifications: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Hire Date</label>
              <input type="date" className={INP} value={teacherDraft.hireDate ?? ''} onChange={e => setTeacherDraft({ ...teacherDraft, hireDate: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Profile Photo URL</label>
              <input className={INP} placeholder="https://…" value={teacherDraft.profilePhoto ?? ''} onChange={e => setTeacherDraft({ ...teacherDraft, profilePhoto: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Academic Portfolio / Bio</label>
            <textarea
              rows={4}
              className={`${INP} resize-none`}
              value={teacherDraft.academicPortfolio ?? ''}
              onChange={e => setTeacherDraft({ ...teacherDraft, academicPortfolio: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setTeacherModal({ open: false, editing: null })} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button
              onClick={saveTeacher}
              disabled={createTeacher.isPending || updateTeacher.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60"
            >
              {(createTeacher.isPending || updateTeacher.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {teacherModal.editing ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Add / Edit Department Modal ───────────────────────────────────── */}
      <Modal
        open={deptModal.open}
        onClose={() => setDeptModal({ open: false, editing: null })}
        title={deptModal.editing ? 'Edit Department' : 'New Department'}
      >
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Name *</label>
            <input className={INP} value={deptDraft.name} onChange={e => setDeptDraft({ ...deptDraft, name: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Icon (emoji)</label>
              <input className={INP} placeholder="e.g. 🔬" value={deptDraft.icon ?? ''} onChange={e => setDeptDraft({ ...deptDraft, icon: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Sort Order</label>
              <input type="number" className={INP} min={1} value={deptDraft.sortOrder} onChange={e => setDeptDraft({ ...deptDraft, sortOrder: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={`${INP} resize-none`} value={deptDraft.description ?? ''} onChange={e => setDeptDraft({ ...deptDraft, description: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="deptActive" checked={deptDraft.isActive} onChange={e => setDeptDraft({ ...deptDraft, isActive: e.target.checked })} className="h-4 w-4 rounded accent-[#E8B84B]" />
            <label htmlFor="deptActive" className="text-sm text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setDeptModal({ open: false, editing: null })} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button
              onClick={saveDept}
              disabled={createDept.isPending || updateDept.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] disabled:opacity-60"
            >
              {(createDept.isPending || updateDept.isPending) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {deptModal.editing ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Teacher confirm ────────────────────────────────────────── */}
      <Modal open={!!delTeacher} onClose={() => setDelTeacher(null)} title="Remove Teacher?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Permanently remove <strong className="text-gray-900 dark:text-white">{delTeacher?.fullName}</strong> from the system?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelTeacher(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={confirmDeleteTeacher} disabled={deleteTeacher.isPending}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
            {deleteTeacher.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Remove
          </button>
        </div>
      </Modal>

      {/* ── Delete Department confirm ─────────────────────────────────────── */}
      <Modal open={!!delDept} onClose={() => setDelDept(null)} title="Remove Department?">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Permanently remove the <strong className="text-gray-900 dark:text-white">{delDept?.name}</strong> department?
          Teachers in this department will be unassigned.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelDept(null)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={confirmDeleteDept} disabled={deleteDept.isPending}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
            {deleteDept.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}
