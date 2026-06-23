import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, X, Check, Search, Users } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { contentService } from '../../../services/contentService'
import type { PublicTeacher } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { cn } from '../../../lib/utils'
import type { Department } from '../../../data/types'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition'

const DEPARTMENTS: Department[] = ['Sciences', 'Humanities', 'Languages', 'Music', 'Drama', 'Sports']

const DEPT_COLORS: Record<Department, string> = {
  Sciences:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Humanities: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Languages:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Music:      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Drama:      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Sports:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

type TeacherDraft = Omit<PublicTeacher, 'id'>

const BLANK: TeacherDraft = {
  name: '',
  title: '',
  department: 'Sciences',
  image: null,
  bio: '',
  credentials: [],
  qualifications: [],
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function PublicStaffManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PublicTeacher | null>(null)
  const [draft, setDraft] = useState<TeacherDraft>(BLANK)
  const [credText, setCredText] = useState('')
  const [qualText, setQualText] = useState('')
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all')

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['admin-public-teachers'],
    queryFn: () => contentService.listPublicTeachers().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: TeacherDraft) => contentService.addPublicTeacher(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-public-teachers'] }); showToast('Staff member added ✓'); closeModal() },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<TeacherDraft> }) => contentService.updatePublicTeacher(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-public-teachers'] }); showToast('Staff member updated ✓'); closeModal() },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deletePublicTeacher(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-public-teachers'] }); showToast('Staff member removed'); setDelConfirm(null) },
  })

  const openNew = () => {
    setDraft({ ...BLANK })
    setCredText('')
    setQualText('')
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (t: PublicTeacher) => {
    setDraft({ name: t.name, title: t.title, department: t.department, image: t.image, bio: t.bio, credentials: t.credentials, qualifications: t.qualifications })
    setCredText(t.credentials.join('\n'))
    setQualText(t.qualifications.join('\n'))
    setEditing(t)
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null) }

  const handleSave = () => {
    if (!draft.name.trim()) return showToast('Name is required')
    if (!draft.title.trim()) return showToast('Title is required')
    const credentials = credText.split('\n').map(s => s.trim()).filter(Boolean)
    const qualifications = qualText.split('\n').map(s => s.trim()).filter(Boolean)
    const finalDraft = { ...draft, credentials, qualifications }
    if (editing) {
      updateMut.mutate({ id: editing.id, dto: finalDraft })
    } else {
      createMut.mutate(finalDraft)
    }
  }

  const isPending = createMut.isPending || updateMut.isPending

  const filtered = teachers.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.department.toLowerCase().includes(q)
    const matchDept = deptFilter === 'all' || t.department === deptFilter
    return matchSearch && matchDept
  })

  const deptCounts = DEPARTMENTS.reduce((acc, d) => {
    acc[d] = teachers.filter(t => t.department === d).length
    return acc
  }, {} as Record<Department, number>)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Staff Directory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage public-facing staff profiles shown on the Staff page
          </p>
        </div>
        <button onClick={openNew} className={BTN_GOLD}>
          <Plus className="h-4 w-4" /> Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
          <p className="text-2xl font-bold text-[#E8B84B]">{teachers.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Staff</p>
        </div>
        {Object.entries(deptCounts).slice(0, 3).map(([dept, count]) => (
          <div key={dept} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-center">
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{count}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{dept}</p>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className={cn(INP, 'pl-9')}
            placeholder="Search by name, title, or department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setDeptFilter('all')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              deptFilter === 'all'
                ? 'bg-[#E8B84B] text-[#0d1b0d]'
                : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            All ({teachers.length})
          </button>
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                deptFilter === d
                  ? 'bg-[#E8B84B] text-[#0d1b0d]'
                  : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {d} ({deptCounts[d]})
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      )}

      {/* Teacher cards */}
      {!isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(t => (
            <div key={t.id} className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Users className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                <div className={cn(
                  'absolute bottom-2 left-2 rounded-lg px-2 py-0.5 text-[10px] font-bold',
                  DEPT_COLORS[t.department]
                )}>
                  {t.department}
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{t.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{t.title}</p>
                {t.bio && (
                  <p className="mt-2 text-[11px] text-gray-400 line-clamp-2">{t.bio}</p>
                )}
                <div className="mt-3 flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(t)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-600 py-1.5 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  {delConfirm === t.id ? (
                    <>
                      <button
                        onClick={() => deleteMut.mutate(t.id)}
                        disabled={deleteMut.isPending}
                        className="flex-1 rounded-lg bg-red-500 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60"
                      >
                        {deleteMut.isPending ? '…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setDelConfirm(null)}
                        className="rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDelConfirm(t.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />
          {teachers.length === 0 ? (
            <>
              <p className="text-sm font-semibold text-gray-500">No staff members yet</p>
              <button onClick={openNew} className={cn(BTN_GOLD, 'mt-4')}>
                <Plus className="h-4 w-4" /> Add First Staff Member
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">No staff match your search or filter</p>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? `Edit: ${editing.name}` : 'Add Staff Member'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Full Name <span className="text-[#E8B84B]">*</span></label>
              <input
                className={INP}
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Grace Wanjiku"
                autoFocus
              />
            </div>
            <div>
              <label className={LABEL}>Title / Role <span className="text-[#E8B84B]">*</span></label>
              <input
                className={INP}
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="e.g. Head of Department"
              />
            </div>
          </div>

          <div>
            <label className={LABEL}>Department</label>
            <select
              className={INP}
              value={draft.department}
              onChange={e => setDraft(d => ({ ...d, department: e.target.value as Department }))}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL}>Photo URL</label>
            <input
              className={INP}
              value={draft.image ?? ''}
              onChange={e => setDraft(d => ({ ...d, image: e.target.value || null }))}
              placeholder="https://…"
            />
            {draft.image && (
              <img
                src={draft.image}
                alt="preview"
                className="mt-2 h-24 w-24 rounded-xl object-cover object-top"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>

          <div>
            <label className={LABEL}>Bio</label>
            <textarea
              rows={3}
              className={cn(INP, 'resize-none')}
              value={draft.bio}
              onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
              placeholder="Short paragraph about this staff member…"
            />
          </div>

          <div>
            <label className={LABEL}>Credentials <span className="text-gray-400 normal-case font-normal">(one per line)</span></label>
            <textarea
              rows={3}
              className={cn(INP, 'resize-none')}
              value={credText}
              onChange={e => setCredText(e.target.value)}
              placeholder={`B.Ed (University of Nairobi)\nTSC Registered\nCBC Certified`}
            />
          </div>

          <div>
            <label className={LABEL}>Qualifications / Achievements <span className="text-gray-400 normal-case font-normal">(one per line)</span></label>
            <textarea
              rows={3}
              className={cn(INP, 'resize-none')}
              value={qualText}
              onChange={e => setQualText(e.target.value)}
              placeholder={`15+ years teaching experience\nNational exam marker\nAward-winning educator`}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={isPending || !draft.name.trim() || !draft.title.trim()}
              className={BTN_GOLD}
            >
              <Check className="h-3.5 w-3.5" />
              {isPending ? 'Saving…' : editing ? 'Save Changes' : 'Add Staff Member'}
            </button>
            <button onClick={closeModal} className={BTN_GHOST}>
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
