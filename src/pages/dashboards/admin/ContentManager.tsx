import { useState } from 'react'
import { Save, Home, Info, BookOpen, DollarSign } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { feeStructure, programLevels, cbcFramework, igcseFramework } from '../../../data/programs'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const TEXTAREA = `${INP} resize-none`
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const TABS = [
  { id: 'home',     label: 'Home Page',  icon: Home     },
  { id: 'about',    label: 'About',      icon: Info     },
  { id: 'programs', label: 'Programs',   icon: BookOpen },
  { id: 'fees',     label: 'Fees Table', icon: DollarSign },
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

export function ContentManager() {
  const { showToast } = useToast()
  const [tab, setTab] = useState('home')

  /* ── Home content ── */
  const [hero, setHero] = useState({
    tagline: 'Where Excellence',
    taglineGold: 'Meets Tomorrow',
    subtitle: 'Premium private education in the heart of Kirinyaga. 2,000+ learners, 120+ expert educators — academics, sports, music, and performing arts under one roof.',
    directorName: 'Mr. Albert Njeru',
    directorTitle: 'Founder & Director',
    directorQuote: 'Every child in Kirinyaga deserves an education that changes the trajectory of a family for generations. That is the promise we keep, every single day.',
    directorCredential: 'M.Ed., UoN',
  })
  const [stats, setStats] = useState([
    { label: 'Students', value: '2,000+' },
    { label: 'Educators', value: '120+'  },
    { label: 'School Buses', value: '8'  },
    { label: 'Sports Codes', value: '12' },
  ])

  /* ── About content ── */
  const [about, setAbout] = useState({
    mission: 'To provide world-class holistic education that develops academically excellent, morally upright, and socially responsible citizens who will transform Kenya and the world.',
    vision: 'To be the leading center of educational excellence in East Africa, recognised for outstanding academic outcomes, character formation, and innovation.',
    history: 'Alber School was founded in Kutus, Kirinyaga County, adjacent to the Governor\'s Offices. Starting with a handful of students, the school has grown to over 2,000 learners and 120 expert educators, offering both the CBC national framework and Cambridge IGCSE & A-Level pathways.',
    values: 'Excellence · Integrity · Innovation · Compassion · Patriotism',
  })

  /* ── Programs ── */
  const [programs, setPrograms] = useState(programLevels.map(p => ({ ...p })))

  /* ── Fees ── */
  const [fees, setFees] = useState(feeStructure.map(f => ({ ...f })))

  const save = () => showToast('Content saved successfully ✓')

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Edit text, descriptions, and values displayed on the public site.</p>
        </div>
        <button onClick={save} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>

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
        <div className="space-y-4">
          {programs.map((p, i) => (
            <Card key={p.id} title={p.name}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>Level Name</label>
                  <input className={INP} value={p.name} onChange={e => { const np = [...programs]; np[i] = { ...p, name: e.target.value }; setPrograms(np) }} />
                </div>
                <div>
                  <label className={LABEL}>Age Range</label>
                  <input className={INP} value={p.ages} onChange={e => { const np = [...programs]; np[i] = { ...p, ages: e.target.value }; setPrograms(np) }} />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Description</label>
                  <textarea rows={2} className={TEXTAREA} value={p.description} onChange={e => { const np = [...programs]; np[i] = { ...p, description: e.target.value }; setPrograms(np) }} />
                </div>
              </div>
            </Card>
          ))}
          <Card title="CBC Framework Points (one per line)">
            <textarea rows={5} className={TEXTAREA} defaultValue={cbcFramework.join('\n')} />
          </Card>
          <Card title="IGCSE Framework Points (one per line)">
            <textarea rows={5} className={TEXTAREA} defaultValue={igcseFramework.join('\n')} />
          </Card>
        </div>
      )}

      {/* ── FEES ── */}
      {tab === 'fees' && (
        <Card title="Fee Structure (KES per term)">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Level</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Tuition (KES)</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Transport</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Activities</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {fees.map((f, i) => (
                  <tr key={f.level}>
                    <td className="py-3 font-medium text-gray-900 dark:text-white pr-4">{f.level}</td>
                    <td className="py-3 pr-2">
                      <input type="number" className={`${INP} w-28`} value={f.tuition}
                        onChange={e => { const nf = [...fees]; nf[i] = { ...f, tuition: +e.target.value }; setFees(nf) }} />
                    </td>
                    <td className="py-3 pr-2">
                      <input type="number" className={`${INP} w-24`} value={f.transport}
                        onChange={e => { const nf = [...fees]; nf[i] = { ...f, transport: +e.target.value }; setFees(nf) }} />
                    </td>
                    <td className="py-3 pr-2">
                      <input type="number" className={`${INP} w-24`} value={f.activities}
                        onChange={e => { const nf = [...fees]; nf[i] = { ...f, activities: +e.target.value }; setFees(nf) }} />
                    </td>
                    <td className="py-3 font-semibold text-[#0d1b0d] dark:text-[#E8B84B]">
                      {(f.tuition + f.transport + f.activities).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
