import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, X, Check, Music } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { contentService } from '../../../services/contentService'
import type { MusicInstrument, MusicTeacher, MusicScheduleSlot } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { cn } from '../../../lib/utils'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'

type Tab = 'instruments' | 'faculty' | 'schedule'
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'instruments', label: 'Instruments', icon: '🎹' },
  { id: 'faculty',     label: 'Faculty',     icon: '👩‍🎤' },
  { id: 'schedule',    label: 'Schedule',    icon: '📅' },
]

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

// ── Instruments Panel ─────────────────────────────────────────────────────────
type InstDraft = Omit<MusicInstrument, 'id'>

function InstrumentsPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<MusicInstrument | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<InstDraft>({ name: '', icon: '🎵', desc: '', sortOrder: 1 })
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-music-instruments'],
    queryFn: () => contentService.listMusicInstruments().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: InstDraft) => contentService.createMusicInstrument(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-instruments'] }); qc.invalidateQueries({ queryKey: ['music-instruments'] }); showToast('Instrument added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<InstDraft> }) => contentService.updateMusicInstrument(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-instruments'] }); qc.invalidateQueries({ queryKey: ['music-instruments'] }); showToast('Instrument updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteMusicInstrument(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-instruments'] }); qc.invalidateQueries({ queryKey: ['music-instruments'] }); showToast('Instrument deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ name: '', icon: '🎵', desc: '', sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (m: MusicInstrument) => { setDraft({ name: m.name, icon: m.icon, desc: m.desc, sortOrder: m.sortOrder }); setEditing(m); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.name.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Instruments shown as feature cards on the Music Academy page.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Instrument</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
        ) : items.length === 0 ? (
          <div className="col-span-3 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
            No instruments yet. <button onClick={openNew} className="font-semibold text-[#E8B84B] hover:underline">Add one →</button>
          </div>
        ) : items.map(m => (
          <div key={m.id} className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-md transition-shadow">
            <span className="mb-3 block text-4xl">{m.icon}</span>
            <p className="font-bold text-gray-900 dark:text-white">{m.name}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{m.desc}</p>
            <div className="absolute top-3 right-3 flex gap-1">
              <button onClick={() => openEdit(m)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
              {delConfirm === m.id ? (
                <div className="absolute right-0 top-8 z-10 flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 shadow-lg px-3 py-2">
                  <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                  <button onClick={() => deleteMut.mutate(m.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                  <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                </div>
              ) : (
                <button onClick={() => setDelConfirm(m.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Instrument' : 'Edit Instrument'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={INP + ' text-center text-xl'} value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} />
            </div>
            <div>
              <label className={LABEL}>Instrument <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Cello" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={INP + ' resize-none'} value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} placeholder="What's offered — level, exam boards, ensemble opportunities…" />
          </div>
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={INP + ' w-24'} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.name.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Instrument' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Faculty Panel ─────────────────────────────────────────────────────────────
type TeacherDraft = Omit<MusicTeacher, 'id'>

function FacultyPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<MusicTeacher | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<TeacherDraft>({ name: '', subject: '', img: '', credentials: '', sortOrder: 1 })
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-music-teachers'],
    queryFn: () => contentService.listMusicTeachers().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: TeacherDraft) => contentService.createMusicTeacher(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-teachers'] }); qc.invalidateQueries({ queryKey: ['music-teachers'] }); showToast('Teacher added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<TeacherDraft> }) => contentService.updateMusicTeacher(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-teachers'] }); qc.invalidateQueries({ queryKey: ['music-teachers'] }); showToast('Teacher updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteMusicTeacher(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-teachers'] }); qc.invalidateQueries({ queryKey: ['music-teachers'] }); showToast('Teacher deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ name: '', subject: '', img: '', credentials: '', sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (t: MusicTeacher) => { setDraft({ name: t.name, subject: t.subject, img: t.img, credentials: t.credentials, sortOrder: t.sortOrder }); setEditing(t); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.name.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Music faculty profiles shown on the Music Academy page.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Teacher</button>
      </div>
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
        ) : items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
            No faculty added yet. <button onClick={openNew} className="font-semibold text-[#E8B84B] hover:underline">Add one →</button>
          </div>
        ) : items.map(t => (
          <div key={t.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            {t.img
              ? <img src={t.img} alt={t.name} className="h-14 w-14 rounded-full object-cover object-top flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              : <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-2xl">👤</div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
              <p className="text-xs font-semibold text-[#E8B84B]">{t.subject}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">{t.credentials}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
              {delConfirm === t.id ? (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-2 py-1">
                  <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                  <button onClick={() => deleteMut.mutate(t.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                  <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                </div>
              ) : (
                <button onClick={() => setDelConfirm(t.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Teacher' : 'Edit Teacher'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Full Name <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Ms. Jane Doe" autoFocus />
            </div>
            <div>
              <label className={LABEL}>Subject / Speciality</label>
              <input className={INP} value={draft.subject} onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))} placeholder="Piano & Theory" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Photo URL</label>
            <input type="url" className={INP} value={draft.img} onChange={e => setDraft(d => ({ ...d, img: e.target.value }))} placeholder="https://example.com/photo.jpg" />
            {draft.img && <img src={draft.img} alt="preview" className="mt-2 h-16 w-16 rounded-full object-cover object-top" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          </div>
          <div>
            <label className={LABEL}>Credentials / Bio Line</label>
            <input className={INP} value={draft.credentials} onChange={e => setDraft(d => ({ ...d, credentials: e.target.value }))} placeholder="B.Mus (Nairobi) · ABRSM Grade 8" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.name.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Teacher' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Schedule Panel ────────────────────────────────────────────────────────────
type SlotDraft = Omit<MusicScheduleSlot, 'id'>

function SchedulePanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<MusicScheduleSlot | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<SlotDraft>({ day: '', slots: '', sortOrder: 1 })
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-music-schedule'],
    queryFn: () => contentService.listMusicScheduleSlots().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: SlotDraft) => contentService.createMusicScheduleSlot(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-schedule'] }); qc.invalidateQueries({ queryKey: ['music-schedule'] }); showToast('Day added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<SlotDraft> }) => contentService.updateMusicScheduleSlot(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-schedule'] }); qc.invalidateQueries({ queryKey: ['music-schedule'] }); showToast('Schedule updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteMusicScheduleSlot(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-music-schedule'] }); qc.invalidateQueries({ queryKey: ['music-schedule'] }); showToast('Day removed'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ day: '', slots: '', sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (s: MusicScheduleSlot) => { setDraft({ day: s.day, slots: s.slots, sortOrder: s.sortOrder }); setEditing(s); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.day.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Weekly rehearsal schedule shown on the Music Academy page.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Day</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
          : items.length === 0
            ? (
              <div className="col-span-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 text-center text-sm text-gray-400">
                No schedule entries yet.
              </div>
            )
            : items.map(s => (
              <div key={s.id} className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <p className="mb-2 font-bold text-[#E8B84B]">{s.day}</p>
                <ul className="space-y-1.5">
                  {s.slots.split('\n').filter(Boolean).map((slot, i) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{slot}</li>
                  ))}
                </ul>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button onClick={() => openEdit(s)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Edit2 className="h-3 w-3" /></button>
                  {delConfirm === s.id ? (
                    <div className="absolute right-0 top-6 z-10 flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 shadow-lg px-3 py-2">
                      <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                      <button onClick={() => deleteMut.mutate(s.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                      <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDelConfirm(s.id)} className="rounded-lg p-1 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3 w-3" /></button>
                  )}
                </div>
              </div>
            ))
        }
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Schedule Day' : 'Edit Schedule Day'}>
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Day <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={draft.day} onChange={e => setDraft(d => ({ ...d, day: e.target.value }))} placeholder="e.g. Monday" autoFocus />
          </div>
          <div>
            <label className={LABEL}>Sessions <span className="text-gray-400 font-normal">(one per line)</span></label>
            <textarea
              rows={5}
              className={INP + ' resize-none font-mono text-xs'}
              value={draft.slots}
              onChange={e => setDraft(d => ({ ...d, slots: e.target.value }))}
              placeholder={'Piano — 3:30–5:00 PM\nChoir Rehearsal — 4:00–5:30 PM'}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.day.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Day' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function MusicManager() {
  const [tab, setTab] = useState<Tab>('instruments')

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
          <Music className="h-5 w-5 text-purple-500 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Music Academy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage instruments, faculty profiles, and the weekly rehearsal schedule.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-1 w-fit">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all', tab === t.id
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
          >
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === 'instruments' && <InstrumentsPanel />}
      {tab === 'faculty'     && <FacultyPanel />}
      {tab === 'schedule'    && <SchedulePanel />}
    </div>
  )
}
