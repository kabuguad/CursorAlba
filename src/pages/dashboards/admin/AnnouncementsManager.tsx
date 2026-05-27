import { useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Megaphone } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const TYPES = ['General', 'Academic', 'Sports', 'Finance', 'Emergency', 'Events']

interface Announcement {
  id: string
  title: string
  body: string
  type: string
  audience: 'All' | 'Parents' | 'Students' | 'Staff'
  date: string
  active: boolean
}

const SEED: Announcement[] = [
  { id: 'a1', title: 'Term 2 Reopening Date Confirmed', body: 'Term 2 will commence on Monday, 27 April 2026. All students should report by 7:00 AM.', type: 'Academic', audience: 'All', date: '2026-04-10', active: true },
  { id: 'a2', title: 'M-Pesa Fee Payment Reminder', body: 'All Term 1 fee balances should be cleared by 15 April 2026. Paybill: 522522, Account: ALBER + Student ID.', type: 'Finance', audience: 'Parents', date: '2026-04-01', active: true },
  { id: 'a3', title: 'Inter-House Athletics Day — Volunteers Needed', body: 'We invite parents to volunteer as timekeepers and marshals for the Annual Inter-House Athletics on 15 March 2026.', type: 'Sports', audience: 'Parents', date: '2026-03-01', active: false },
  { id: 'a4', title: 'New Music Studio Hours', body: 'The Music Academy is now open for individual practice from 4 PM – 6 PM on weekdays.', type: 'General', audience: 'Students', date: '2026-02-15', active: false },
]

const AUDIENCE_COLOR: Record<string, string> = {
  All:      'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Parents:  'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Students: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Staff:    'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
}

export function AnnouncementsManager() {
  const { showToast } = useToast()
  const [items, setItems] = useState<Announcement[]>(SEED)
  const [draft, setDraft] = useState({ title: '', body: '', type: 'General', audience: 'All' as Announcement['audience'] })
  const [showForm, setShowForm] = useState(false)

  const post = () => {
    if (!draft.title.trim() || !draft.body.trim()) return showToast('Title and body are required')
    const newItem: Announcement = {
      id: `a-${Date.now()}`,
      ...draft,
      date: new Date().toISOString().slice(0, 10),
      active: true,
    }
    setItems(prev => [newItem, ...prev])
    setDraft({ title: '', body: '', type: 'General', audience: 'All' })
    setShowForm(false)
    showToast('Announcement posted ✓')
  }

  const toggle = (id: string) => setItems(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  const del = (id: string) => { setItems(prev => prev.filter(a => a.id !== id)); showToast('Announcement removed') }

  const activeCount = items.filter(a => a.active).length

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{activeCount} active · {items.length} total</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Plus className="h-4 w-4" /> New Announcement
        </button>
      </div>

      {/* Compose form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-[#E8B84B]/40 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-[#E8B84B]" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Compose Announcement</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={LABEL}>Title *</label>
              <input className={INP} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="Announcement headline…" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL}>Type</label>
                <select className={INP} value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL}>Audience</label>
                <select className={INP} value={draft.audience} onChange={e => setDraft({ ...draft, audience: e.target.value as Announcement['audience'] })}>
                  {['All', 'Parents', 'Students', 'Staff'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL}>Message Body *</label>
              <textarea rows={4} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none"
                value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} placeholder="Full announcement text…" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
              <button onClick={post} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">Post Announcement</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {items.map(a => (
          <div key={a.id} className={`rounded-2xl border bg-white dark:bg-gray-800 p-5 transition ${a.active ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {a.active && <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400"><span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />Live</span>}
                  {!a.active && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Archived</span>}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${AUDIENCE_COLOR[a.audience]}`}>{a.audience}</span>
                  <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-500">{a.type}</span>
                  <span className="text-[10px] text-gray-400">{a.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{a.body}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => toggle(a.id)} title={a.active ? 'Deactivate' : 'Activate'}
                  className={`rounded-lg p-1.5 transition ${a.active ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  {a.active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                </button>
                <button onClick={() => del(a.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-16 text-center text-gray-400">No announcements yet</div>
        )}
      </div>
    </div>
  )
}
