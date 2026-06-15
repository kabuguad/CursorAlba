import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, X, Check, Trophy, Search } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../../contexts/ToastContext'
import { contentService } from '../../../services/contentService'
import type { SportFixture, SportOffered, SportTrophy } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { cn } from '../../../lib/utils'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'

const STATUS_STYLES = {
  upcoming:  'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  live:      'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 animate-pulse',
  completed: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400',
}

type Tab = 'fixtures' | 'offered' | 'trophies'

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

// ── Fixtures Panel ────────────────────────────────────────────────────────────
type FixtureDraft = Omit<SportFixture, 'id'>
const BLANK_FIXTURE: FixtureDraft = { sport: '', opponent: '', date: '', venue: '', result: '—', status: 'upcoming' }

function FixturesPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<SportFixture | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<FixtureDraft>(BLANK_FIXTURE)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: fixtures = [], isLoading } = useQuery({
    queryKey: ['admin-sport-fixtures'],
    queryFn: () => contentService.listSportFixtures().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: FixtureDraft) => contentService.addSportFixture(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sport-fixtures'] }); qc.invalidateQueries({ queryKey: ['public-sports-fixtures'] }); showToast('Fixture added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<FixtureDraft> }) => contentService.updateSportFixture(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sport-fixtures'] }); qc.invalidateQueries({ queryKey: ['public-sports-fixtures'] }); showToast('Fixture updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteSportFixture(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sport-fixtures'] }); qc.invalidateQueries({ queryKey: ['public-sports-fixtures'] }); showToast('Fixture deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ ...BLANK_FIXTURE }); setIsNew(true); setEditing(null) }
  const openEdit = (f: SportFixture) => { setDraft({ sport: f.sport, opponent: f.opponent, date: f.date, venue: f.venue, result: f.result, status: f.status }); setEditing(f); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }

  const handleSave = () => {
    if (!draft.sport.trim() || !draft.opponent.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  const filtered = fixtures.filter(f =>
    [f.sport, f.opponent, f.venue].some(v => v.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className={INP + ' pl-9'} placeholder="Search fixtures…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Fixture</button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading fixtures…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">No fixtures found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  {['Sport', 'Opponent', 'Date', 'Venue', 'Result', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{f.sport}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{f.opponent}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{f.date}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{f.venue}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{f.result}</td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', STATUS_STYLES[f.status])}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {delConfirm === f.id ? (
                          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-2 py-1">
                            <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                            <button onClick={() => deleteMut.mutate(f.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                            <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDelConfirm(f.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Fixture' : 'Edit Fixture'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Sport <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.sport} onChange={e => setDraft(d => ({ ...d, sport: e.target.value }))} placeholder="e.g. Football" autoFocus />
            </div>
            <div>
              <label className={LABEL}>Opponent / Event <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.opponent} onChange={e => setDraft(d => ({ ...d, opponent: e.target.value }))} placeholder="e.g. Alliance High" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Date</label>
              <input type="date" className={INP} value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
            </div>
            <div>
              <label className={LABEL}>Venue</label>
              <input className={INP} value={draft.venue} onChange={e => setDraft(d => ({ ...d, venue: e.target.value }))} placeholder="Home / Away / Venue name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Result</label>
              <input className={INP} value={draft.result} onChange={e => setDraft(d => ({ ...d, result: e.target.value }))} placeholder="e.g. 2-1 or —" />
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select className={INP} value={draft.status} onChange={e => setDraft(d => ({ ...d, status: e.target.value as SportFixture['status'] }))}>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.sport.trim() || !draft.opponent.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />
              {createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Fixture' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Sports Offered Panel ──────────────────────────────────────────────────────
type OfferedDraft = Omit<SportOffered, 'id'>
const BLANK_OFFERED: OfferedDraft = { name: '', icon: '⚽', desc: '', sortOrder: 1 }

function SportsOfferedPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<SportOffered | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<OfferedDraft>(BLANK_OFFERED)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-sports-offered'],
    queryFn: () => contentService.listSportsOffered().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: OfferedDraft) => contentService.createSportOffered(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sports-offered'] }); qc.invalidateQueries({ queryKey: ['sports-offered'] }); showToast('Sport added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<OfferedDraft> }) => contentService.updateSportOffered(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sports-offered'] }); qc.invalidateQueries({ queryKey: ['sports-offered'] }); showToast('Sport updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteSportOffered(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sports-offered'] }); qc.invalidateQueries({ queryKey: ['sports-offered'] }); showToast('Sport deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ ...BLANK_OFFERED, sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (s: SportOffered) => { setDraft({ name: s.name, icon: s.icon, desc: s.desc, sortOrder: s.sortOrder }); setEditing(s); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.name.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Sports shown on the Sports page as feature cards.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Sport</button>
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">No sports added yet.</div>
        ) : (
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {['', 'Sport', 'Description', 'Order', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="pl-4 py-3 text-2xl w-10">{s.icon}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 max-w-xs"><p className="line-clamp-2">{s.desc}</p></td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"><Edit2 className="h-3.5 w-3.5" /></button>
                      {delConfirm === s.id ? (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-2 py-1">
                          <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                          <button onClick={() => deleteMut.mutate(s.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                          <button onClick={() => setDelConfirm(null)} className="text-xs text-gray-400">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDelConfirm(s.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"><Trash2 className="h-3.5 w-3.5" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Sport' : 'Edit Sport'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={INP + ' text-center text-xl'} value={draft.icon} onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))} />
            </div>
            <div>
              <label className={LABEL}>Sport Name <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Cricket" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={INP + ' resize-none'} value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} placeholder="Facilities, coaching, competition level…" />
          </div>
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={INP + ' w-24'} value={draft.sortOrder} onChange={e => setDraft(d => ({ ...d, sortOrder: Number(e.target.value) }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.name.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Sport' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Trophies Panel ────────────────────────────────────────────────────────────
type TrophyDraft = Omit<SportTrophy, 'id'>
const CY = String(new Date().getFullYear())
const BLANK_TROPHY: TrophyDraft = { year: CY, title: '', category: '', sortOrder: 1 }

function TrophiesPanel() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState<SportTrophy | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState<TrophyDraft>(BLANK_TROPHY)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-sport-trophies'],
    queryFn: () => contentService.listSportTrophies().then(unwrap),
    staleTime: 30_000,
  })

  const createMut = useMutation({
    mutationFn: (dto: TrophyDraft) => contentService.createSportTrophy(dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sport-trophies'] }); qc.invalidateQueries({ queryKey: ['sport-trophies'] }); showToast('Trophy added ✓'); closeForm() },
  })
  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<TrophyDraft> }) => contentService.updateSportTrophy(id, dto).then(unwrap),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sport-trophies'] }); qc.invalidateQueries({ queryKey: ['sport-trophies'] }); showToast('Trophy updated ✓'); closeForm() },
  })
  const deleteMut = useMutation({
    mutationFn: (id: string) => contentService.deleteSportTrophy(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-sport-trophies'] }); qc.invalidateQueries({ queryKey: ['sport-trophies'] }); showToast('Trophy deleted'); setDelConfirm(null) },
  })

  const openNew = () => { setDraft({ ...BLANK_TROPHY, sortOrder: items.length + 1 }); setIsNew(true); setEditing(null) }
  const openEdit = (t: SportTrophy) => { setDraft({ year: t.year, title: t.title, category: t.category, sortOrder: t.sortOrder }); setEditing(t); setIsNew(false) }
  const closeForm = () => { setEditing(null); setIsNew(false) }
  const handleSave = () => {
    if (!draft.title.trim()) return
    if (isNew) createMut.mutate(draft)
    else if (editing) updateMut.mutate({ id: editing.id, dto: draft })
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Championship achievements shown in the Trophy Cabinet.</p>
        <button onClick={openNew} className={BTN_GOLD}><Plus className="h-4 w-4" /> Add Trophy</button>
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">No trophies added yet.</div>
        ) : (
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {['Year', 'Achievement', 'Category', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#E8B84B] whitespace-nowrap">{t.year}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2"><span>🏆</span>{t.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">{t.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal open={isNew || !!editing} onClose={closeForm} title={isNew ? 'Add Trophy' : 'Edit Trophy'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <div>
              <label className={LABEL}>Year <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={draft.year} onChange={e => setDraft(d => ({ ...d, year: e.target.value }))} placeholder="2025" autoFocus />
            </div>
            <div>
              <label className={LABEL}>Category</label>
              <input className={INP} value={draft.category} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))} placeholder="e.g. Football" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Achievement Title <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="e.g. Kirinyaga County Football Champions" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button onClick={closeForm} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
            <button onClick={handleSave} disabled={!draft.title.trim() || createMut.isPending || updateMut.isPending} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              <Check className="h-4 w-4" />{createMut.isPending || updateMut.isPending ? 'Saving…' : isNew ? 'Add Trophy' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'fixtures', label: 'Fixtures & Results', icon: '📅' },
  { id: 'offered',  label: 'Sports Offered',     icon: '⚽' },
  { id: 'trophies', label: 'Trophy Cabinet',      icon: '🏆' },
]

export function SportsManager() {
  const [tab, setTab] = useState<Tab>('fixtures')

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8B84B]/15">
          <Trophy className="h-5 w-5 text-[#E8B84B]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sports & Athletics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage fixtures, sports offered, and the trophy cabinet.</p>
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

      {tab === 'fixtures'  && <FixturesPanel />}
      {tab === 'offered'   && <SportsOfferedPanel />}
      {tab === 'trophies'  && <TrophiesPanel />}
    </div>
  )
}
