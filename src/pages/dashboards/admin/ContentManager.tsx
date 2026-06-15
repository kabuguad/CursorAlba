import { useState, useEffect } from 'react'
import { Save, Home, Info, BookOpen, DollarSign, Plus, Trash2, Loader2, Edit2, X, Check, Layers, ChevronUp, ChevronDown } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import {
  useSiteSettings, useSaveSettings,
  useProgramLevels, useCreateProgramLevel, useUpdateProgramLevel, useDeleteProgramLevel,
  usePublicFees, useCreatePublicFeeRow, useUpdatePublicFeeRow, useDeletePublicFeeRow,
} from '../../../hooks/useAdminData'
import type { ApiProgramLevel, ApiPublicFeeRow } from '../../../services/adminApiService'
import { usePillars } from '../../../contexts/PillarsContext'
import { GRADIENT_MAP, type Pillar } from '../../../data/pillars'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const TEXTAREA = `${INP} resize-none`
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const TABS = [
  { id: 'home',     label: 'Home Page',       icon: Home     },
  { id: 'about',    label: 'About',           icon: Info     },
  { id: 'programs', label: 'Programs',        icon: BookOpen },
  { id: 'fees',     label: 'Fees Table',      icon: DollarSign },
  { id: 'pillars',  label: 'Teaching Pillars',icon: Layers   },
]

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function settingsToMap(settings: { key: string; value: string }[]) {
  return Object.fromEntries(settings.map(s => [s.key, s.value]))
}

export function ContentManager() {
  const { showToast } = useToast()

  const { data: rawSettings = [], isLoading: loadingSettings } = useSiteSettings()
  const { data: programs = [], isLoading: loadingPrograms }   = useProgramLevels()
  const { data: fees = [],     isLoading: loadingFees }       = usePublicFees()

  const saveSettings    = useSaveSettings()
  const createProgram   = useCreateProgramLevel()
  const updateProgram   = useUpdateProgramLevel()
  const deleteProgram   = useDeleteProgramLevel()
  const createFeeRow    = useCreatePublicFeeRow()
  const updateFeeRow    = useUpdatePublicFeeRow()
  const deleteFeeRow    = useDeletePublicFeeRow()

  const [tab, setTab] = useState('home')

  // ── Home ──
  const [hero, setHero] = useState({
    tagline: '', taglineGold: '', subtitle: '',
    directorName: '', directorTitle: '', directorQuote: '', directorCredential: '',
  })
  const [stats, setStats] = useState([
    { label: 'Students', value: '2,000+' },
    { label: 'Educators', value: '120+' },
    { label: 'School Buses', value: '8' },
    { label: 'Sports Codes', value: '12' },
  ])

  // ── About ──
  const [about, setAbout] = useState({ mission: '', vision: '', history: '', values: '' })

  // ── Programs framework text ──
  const [cbcText, setCbcText] = useState('')
  const [igcseText, setIgcseText] = useState('')

  // Populate local state from API data
  useEffect(() => {
    if (!rawSettings.length) return
    const m = settingsToMap(rawSettings)
    setHero({
      tagline:           m['home.hero.tagline']           ?? '',
      taglineGold:       m['home.hero.taglineGold']       ?? '',
      subtitle:          m['home.hero.subtitle']          ?? '',
      directorName:      m['home.hero.directorName']      ?? '',
      directorTitle:     m['home.hero.directorTitle']     ?? '',
      directorQuote:     m['home.hero.directorQuote']     ?? '',
      directorCredential:m['home.hero.directorCredential']?? '',
    })
    setStats([
      { label: m['home.stats.0.label'] ?? 'Students',    value: m['home.stats.0.value'] ?? '2,000+' },
      { label: m['home.stats.1.label'] ?? 'Educators',   value: m['home.stats.1.value'] ?? '120+' },
      { label: m['home.stats.2.label'] ?? 'School Buses',value: m['home.stats.2.value'] ?? '8' },
      { label: m['home.stats.3.label'] ?? 'Sports Codes',value: m['home.stats.3.value'] ?? '12' },
    ])
    setAbout({
      mission: m['about.mission'] ?? '',
      vision:  m['about.vision']  ?? '',
      history: m['about.history'] ?? '',
      values:  m['about.values']  ?? '',
    })
    setCbcText(m['programs.cbcFramework'] ?? '')
    setIgcseText(m['programs.igcseFramework'] ?? '')
  }, [rawSettings])

  // ── Save All (settings) ──
  const saveAll = async () => {
    const settings = [
      { key: 'home.hero.tagline',            value: hero.tagline },
      { key: 'home.hero.taglineGold',        value: hero.taglineGold },
      { key: 'home.hero.subtitle',           value: hero.subtitle },
      { key: 'home.hero.directorName',       value: hero.directorName },
      { key: 'home.hero.directorTitle',      value: hero.directorTitle },
      { key: 'home.hero.directorQuote',      value: hero.directorQuote },
      { key: 'home.hero.directorCredential', value: hero.directorCredential },
      { key: 'home.stats.0.label',           value: stats[0].label },
      { key: 'home.stats.0.value',           value: stats[0].value },
      { key: 'home.stats.1.label',           value: stats[1].label },
      { key: 'home.stats.1.value',           value: stats[1].value },
      { key: 'home.stats.2.label',           value: stats[2].label },
      { key: 'home.stats.2.value',           value: stats[2].value },
      { key: 'home.stats.3.label',           value: stats[3].label },
      { key: 'home.stats.3.value',           value: stats[3].value },
      { key: 'about.mission',                value: about.mission },
      { key: 'about.vision',                 value: about.vision },
      { key: 'about.history',                value: about.history },
      { key: 'about.values',                 value: about.values },
      { key: 'programs.cbcFramework',        value: cbcText },
      { key: 'programs.igcseFramework',      value: igcseText },
    ]
    try {
      await saveSettings.mutateAsync(settings)
      showToast('Content saved successfully ✓')
    } catch {
      showToast('Save failed', 'error')
    }
  }

  const isLoading = loadingSettings || loadingPrograms || loadingFees
  const isSaving  = saveSettings.isPending

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Edit text, descriptions, and values displayed on the public site.</p>
        </div>
        {(tab === 'home' || tab === 'about' || tab === 'programs') && (
          <button
            onClick={saveAll}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading content…
        </div>
      )}

      {!isLoading && (
        <>
          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* ── HOME ── */}
          {tab === 'home' && (
            <div className="space-y-6">
              <Card title="Hero Section">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>Tagline (white text)</label>
                    <input className={INP} value={hero.tagline} onChange={e => setHero({ ...hero, tagline: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>Tagline (gold text)</label>
                    <input className={INP} value={hero.taglineGold} onChange={e => setHero({ ...hero, taglineGold: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}>Hero Subtitle</label>
                    <textarea rows={3} className={TEXTAREA} value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} />
                  </div>
                </div>
              </Card>

              <Card title="School Stats Counter">
                <div className="grid gap-3 sm:grid-cols-2">
                  {stats.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <input placeholder="Value" className={`${INP} w-24`} value={s.value} onChange={e => { const ns = [...stats]; ns[i] = { ...s, value: e.target.value }; setStats(ns) }} />
                      <input placeholder="Label" className={INP} value={s.label} onChange={e => { const ns = [...stats]; ns[i] = { ...s, label: e.target.value }; setStats(ns) }} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Director's Welcome Card">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={LABEL}>Director's Name</label>
                    <input className={INP} value={hero.directorName} onChange={e => setHero({ ...hero, directorName: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>Title / Role</label>
                    <input className={INP} value={hero.directorTitle} onChange={e => setHero({ ...hero, directorTitle: e.target.value })} />
                  </div>
                  <div>
                    <label className={LABEL}>Credential (e.g. M.Ed., UoN)</label>
                    <input className={INP} value={hero.directorCredential} onChange={e => setHero({ ...hero, directorCredential: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}>Welcome Quote</label>
                    <textarea rows={4} className={TEXTAREA} value={hero.directorQuote} onChange={e => setHero({ ...hero, directorQuote: e.target.value })} />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ── ABOUT ── */}
          {tab === 'about' && (
            <div className="space-y-6">
              <Card title="Mission Statement">
                <textarea rows={4} className={TEXTAREA} value={about.mission} onChange={e => setAbout({ ...about, mission: e.target.value })} />
              </Card>
              <Card title="Vision Statement">
                <textarea rows={4} className={TEXTAREA} value={about.vision} onChange={e => setAbout({ ...about, vision: e.target.value })} />
              </Card>
              <Card title="School History">
                <textarea rows={5} className={TEXTAREA} value={about.history} onChange={e => setAbout({ ...about, history: e.target.value })} />
              </Card>
              <Card title="Core Values (comma or · separated)">
                <input className={INP} value={about.values} onChange={e => setAbout({ ...about, values: e.target.value })} />
              </Card>
            </div>
          )}

          {/* ── PROGRAMS ── */}
          {tab === 'programs' && (
            <ProgramsTab
              programs={programs}
              cbcText={cbcText}
              igcseText={igcseText}
              onCbcChange={setCbcText}
              onIgcseChange={setIgcseText}
              onCreate={async dto => {
                await createProgram.mutateAsync(dto)
                showToast('Program level added ✓')
              }}
              onUpdate={async (id, dto) => {
                await updateProgram.mutateAsync({ id, dto })
                showToast('Program level updated ✓')
              }}
              onDelete={async id => {
                await deleteProgram.mutateAsync(id)
                showToast('Program level deleted')
              }}
            />
          )}

          {/* ── FEES ── */}
          {tab === 'fees' && (
            <FeesTab
              fees={fees}
              onCreate={async dto => {
                await createFeeRow.mutateAsync(dto)
                showToast('Fee row added ✓')
              }}
              onUpdate={async (id, dto) => {
                await updateFeeRow.mutateAsync({ id, dto })
                showToast('Fee row updated ✓')
              }}
              onDelete={async id => {
                await deleteFeeRow.mutateAsync(id)
                showToast('Fee row deleted')
              }}
            />
          )}

          {/* ── PILLARS ── */}
          {tab === 'pillars' && <PillarsTab />}
        </>
      )}
    </div>
  )
}

// ── Programs Tab ────────────────────────────────────────────────────────────

type ProgramDto = { slug: string; name: string; ages: string; description: string; imageUrl?: string; sortOrder: number }

function ProgramsTab({
  programs, cbcText, igcseText, onCbcChange, onIgcseChange, onCreate, onUpdate, onDelete,
}: {
  programs: ApiProgramLevel[]
  cbcText: string
  igcseText: string
  onCbcChange: (v: string) => void
  onIgcseChange: (v: string) => void
  onCreate: (dto: ProgramDto) => Promise<void>
  onUpdate: (id: number, dto: ProgramDto) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<ProgramDto>({ slug: '', name: '', ages: '', description: '', imageUrl: '', sortOrder: 0 })
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setForm({ slug: '', name: '', ages: '', description: '', imageUrl: '', sortOrder: programs.length + 1 })
    setEditing('new')
  }
  const openEdit = (p: ApiProgramLevel) => {
    setForm({ slug: p.slug, name: p.name, ages: p.ages, description: p.description, imageUrl: p.imageUrl ?? '', sortOrder: p.sortOrder })
    setEditing(p.id)
  }
  const close = () => setEditing(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      const dto = { ...form, imageUrl: form.imageUrl || undefined }
      if (editing === 'new') await onCreate(dto)
      else if (typeof editing === 'number') await onUpdate(editing, dto)
      close()
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      {programs.map(p => (
        <div key={p.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {editing === p.id ? (
            <div className="p-6 space-y-4">
              <ProgramForm form={form} onChange={setForm} />
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
                </button>
                <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4 px-6 py-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
                <p className="text-sm text-gray-400">{p.ages} · {p.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => openEdit(p)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => confirm('Delete this program level?') && onDelete(p.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {editing === 'new' && (
        <div className="rounded-2xl border-2 border-dashed border-[#E8B84B]/50 bg-[#E8B84B]/5 p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Program Level</p>
          <ProgramForm form={form} onChange={setForm} />
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Add Level
            </button>
            <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
          </div>
        </div>
      )}

      {editing === null && (
        <button onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-[#E8B84B] hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add Program Level
        </button>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">CBC Framework Points (one per line)</h3>
        </div>
        <div className="p-6">
          <textarea rows={5} className={`${INP} resize-none`} value={cbcText} onChange={e => onCbcChange(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">IGCSE Framework Points (one per line)</h3>
        </div>
        <div className="p-6">
          <textarea rows={5} className={`${INP} resize-none`} value={igcseText} onChange={e => onIgcseChange(e.target.value)} />
        </div>
      </div>
    </div>
  )
}

function ProgramForm({ form, onChange }: { form: ProgramDto; onChange: (f: ProgramDto) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className={LABEL}>Level Name</label>
        <input className={INP} value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} placeholder="e.g. Primary School" />
      </div>
      <div>
        <label className={LABEL}>Slug (URL-safe)</label>
        <input className={INP} value={form.slug} onChange={e => onChange({ ...form, slug: e.target.value })} placeholder="e.g. primary" />
      </div>
      <div>
        <label className={LABEL}>Age Range</label>
        <input className={INP} value={form.ages} onChange={e => onChange({ ...form, ages: e.target.value })} placeholder="e.g. 6–12 years" />
      </div>
      <div>
        <label className={LABEL}>Sort Order</label>
        <input type="number" className={INP} value={form.sortOrder} onChange={e => onChange({ ...form, sortOrder: +e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL}>Description</label>
        <textarea rows={2} className={`${INP} resize-none`} value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL}>Image URL (optional)</label>
        <input className={INP} value={form.imageUrl ?? ''} onChange={e => onChange({ ...form, imageUrl: e.target.value })} placeholder="https://…" />
      </div>
    </div>
  )
}

// ── Fees Tab ────────────────────────────────────────────────────────────────

type FeeRowDto = { level: string; tuition: number; transport: number; activities: number; sortOrder: number }

function FeesTab({
  fees, onCreate, onUpdate, onDelete,
}: {
  fees: ApiPublicFeeRow[]
  onCreate: (dto: FeeRowDto) => Promise<void>
  onUpdate: (id: number, dto: FeeRowDto) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<FeeRowDto>({ level: '', tuition: 0, transport: 0, activities: 0, sortOrder: 0 })
  const [saving, setSaving] = useState(false)

  const openNew = () => {
    setForm({ level: '', tuition: 0, transport: 0, activities: 0, sortOrder: fees.length + 1 })
    setEditing('new')
  }
  const openEdit = (f: ApiPublicFeeRow) => {
    setForm({ level: f.level, tuition: f.tuition, transport: f.transport, activities: f.activities, sortOrder: f.sortOrder })
    setEditing(f.id)
  }
  const close = () => setEditing(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing === 'new') await onCreate(form)
      else if (typeof editing === 'number') await onUpdate(editing, form)
      close()
    } finally { setSaving(false) }
  }

  const INP_N = `${INP} w-28`

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Fee Structure (KES per term)</h3>
        {editing === null && (
          <button onClick={openNew}
            className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B]/10 border border-[#E8B84B]/30 px-3 py-1.5 text-xs font-semibold text-[#0d1b0d] dark:text-[#E8B84B] hover:bg-[#E8B84B]/20 transition">
            <Plus className="h-3.5 w-3.5" /> Add Row
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {['Level', 'Tuition (KES)', 'Transport', 'Activities', 'Total', ''].map(h => (
                <th key={h} className="pb-3 pt-4 px-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {fees.map(f => (
              <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                {editing === f.id ? (
                  <td colSpan={6} className="px-5 py-3">
                    <FeeRowForm form={form} onChange={setForm} />
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
                      </button>
                      <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{f.level}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{f.tuition.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{f.transport.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{f.activities.toLocaleString()}</td>
                    <td className="px-5 py-3 font-semibold text-[#0d1b0d] dark:text-[#E8B84B]">{f.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(f)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => confirm('Delete this fee row?') && onDelete(f.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {editing === 'new' && (
              <tr>
                <td colSpan={6} className="px-5 py-3 bg-[#E8B84B]/5">
                  <FeeRowForm form={form} onChange={setForm} />
                  <div className="flex gap-2 mt-3">
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60">
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} Add
                    </button>
                    <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
                  </div>
                </td>
              </tr>
            )}

            {fees.length === 0 && editing !== 'new' && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No fee rows yet. Click "Add Row" to start.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FeeRowForm({ form, onChange }: { form: FeeRowDto; onChange: (f: FeeRowDto) => void }) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className={LABEL}>Level Name</label>
        <input className={INP} style={{ width: 160 }} value={form.level} onChange={e => onChange({ ...form, level: e.target.value })} placeholder="e.g. Primary" />
      </div>
      <div>
        <label className={LABEL}>Tuition</label>
        <input type="number" className={INP} style={{ width: 110 }} value={form.tuition} onChange={e => onChange({ ...form, tuition: +e.target.value })} />
      </div>
      <div>
        <label className={LABEL}>Transport</label>
        <input type="number" className={INP} style={{ width: 100 }} value={form.transport} onChange={e => onChange({ ...form, transport: +e.target.value })} />
      </div>
      <div>
        <label className={LABEL}>Activities</label>
        <input type="number" className={INP} style={{ width: 100 }} value={form.activities} onChange={e => onChange({ ...form, activities: +e.target.value })} />
      </div>
      <div>
        <label className={LABEL}>Sort</label>
        <input type="number" className={INP} style={{ width: 70 }} value={form.sortOrder} onChange={e => onChange({ ...form, sortOrder: +e.target.value })} />
      </div>
    </div>
  )
}

// ── Teaching Pillars Tab ─────────────────────────────────────────────────────

const BLANK_PILLAR: Omit<Pillar, 'id'> = { icon: '📌', title: '', desc: '', gradient: 'green' }

function PillarsTab() {
  const { showToast } = useToast()
  const { pillars, updatePillars } = usePillars()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<Omit<Pillar, 'id'>>(BLANK_PILLAR)

  const openEdit = (p: Pillar) => {
    setDraft({ icon: p.icon, title: p.title, desc: p.desc, gradient: p.gradient })
    setEditing(p.id)
  }
  const openNew = () => { setDraft({ ...BLANK_PILLAR }); setEditing('new') }
  const close = () => setEditing(null)

  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    let next: Pillar[]
    if (editing === 'new') {
      next = [...pillars, { ...draft, id: `p-${Date.now()}` }]
    } else {
      next = pillars.map(p => p.id === editing ? { ...draft, id: p.id } : p)
    }
    updatePillars(next)
    showToast(editing === 'new' ? 'Pillar added ✓' : 'Pillar updated ✓')
    close()
  }

  const del = (id: string) => {
    if (!confirm('Delete this pillar?')) return
    updatePillars(pillars.filter(p => p.id !== id))
    showToast('Pillar deleted')
  }

  const move = (id: string, dir: -1 | 1) => {
    const idx = pillars.findIndex(p => p.id === id)
    const next = [...pillars]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    updatePillars(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {pillars.length} pillar{pillars.length !== 1 ? 's' : ''} · changes save instantly and appear on the public Academics page.
        </p>
        {editing === null && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition"
          >
            <Plus className="h-4 w-4" /> Add Pillar
          </button>
        )}
      </div>

      {/* Pillar list */}
      {pillars.map((p, i) => {
        const g = GRADIENT_MAP[p.gradient] ?? GRADIENT_MAP.green
        return (
          <div key={p.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {editing === p.id ? (
              <div className="p-6">
                <PillarForm draft={draft} onChange={setDraft} />
                <div className="mt-4 flex gap-2">
                  <button onClick={save} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                  <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 p-5">
                {/* Preview swatch */}
                <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl border bg-gradient-to-br text-3xl ${g.color} ${g.border}`}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10 flex-shrink-0"
                      style={{ backgroundColor: GRADIENT_MAP[p.gradient]?.preview }}
                      title={GRADIENT_MAP[p.gradient]?.label}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.desc}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button onClick={() => move(p.id, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition" title="Move up">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button onClick={() => move(p.id, 1)} disabled={i === pillars.length - 1} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition" title="Move down">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => del(p.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* New pillar form */}
      {editing === 'new' && (
        <div className="rounded-2xl border-2 border-dashed border-[#E8B84B]/50 bg-[#E8B84B]/5 p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#E8B84B]" /> New Teaching Pillar
          </p>
          <PillarForm draft={draft} onChange={setDraft} />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
              <Plus className="h-3.5 w-3.5" /> Add Pillar
            </button>
            <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
          </div>
        </div>
      )}

      {/* Add button when list is empty */}
      {pillars.length === 0 && editing === null && (
        <button
          onClick={openNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 py-8 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-[#E8B84B] hover:text-[#E8B84B] transition"
        >
          <Plus className="h-4 w-4" /> Add your first teaching pillar
        </button>
      )}
    </div>
  )
}

function PillarForm({
  draft,
  onChange,
}: {
  draft: Omit<Pillar, 'id'>
  onChange: (d: Omit<Pillar, 'id'>) => void
}) {
  const selectedGradient = GRADIENT_MAP[draft.gradient] ?? GRADIENT_MAP.green
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Icon */}
        <div>
          <label className={LABEL}>Icon (emoji)</label>
          <input
            className={INP}
            value={draft.icon}
            onChange={e => onChange({ ...draft, icon: e.target.value })}
            placeholder="🌱"
            style={{ fontSize: 20 }}
          />
          <p className="mt-1 text-[10px] text-gray-400">Paste or type any emoji — shown large on the card.</p>
        </div>
        {/* Title */}
        <div>
          <label className={LABEL}>Title *</label>
          <input
            className={INP}
            value={draft.title}
            onChange={e => onChange({ ...draft, title: e.target.value })}
            placeholder="e.g. Holistic Development"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={LABEL}>Description</label>
        <textarea
          rows={3}
          className={`${INP} resize-none`}
          value={draft.desc}
          onChange={e => onChange({ ...draft, desc: e.target.value })}
          placeholder="Describe what this pillar means for learners at Alber School…"
        />
      </div>

      {/* Gradient colour picker */}
      <div>
        <label className={LABEL}>Card Gradient Colour</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(GRADIENT_MAP).map(([key, g]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ ...draft, gradient: key })}
              title={g.label}
              className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition ${
                draft.gradient === key
                  ? 'border-gray-800 dark:border-white scale-105 shadow-sm'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: g.preview }}
              />
              {g.label}
            </button>
          ))}
        </div>
        {/* Live preview */}
        <div className={`mt-3 flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-5 ${selectedGradient.color} ${selectedGradient.border}`}>
          <span className="text-3xl">{draft.icon || '📌'}</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{draft.title || 'Pillar Title'}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{draft.desc || 'Pillar description will appear here.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
