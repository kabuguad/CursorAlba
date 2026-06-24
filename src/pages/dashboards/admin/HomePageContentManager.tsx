import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, ExternalLink, ArrowLeft, Image, BarChart2, BookOpen, Megaphone, Loader2, CheckCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { homePageContentApi, type HomePageContentDto, type UpdateHomePageContentDto } from '../../../services/homePageContentApi'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'

const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const SECTION = 'text-[10px] font-bold uppercase tracking-widest text-[#E8B84B] pt-2 pb-1'

type Tab = 'hero' | 'stats' | 'foundation' | 'cta'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'hero',       label: 'Hero',       icon: Image      },
  { id: 'stats',      label: 'Stats Bar',  icon: BarChart2  },
  { id: 'foundation', label: 'Foundation', icon: BookOpen   },
  { id: 'cta',        label: 'Final CTA',  icon: Megaphone  },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
    </div>
  )
}

function ImagePreview({ url }: { url: string }) {
  if (!url) return null
  return (
    <img
      src={url}
      alt="Preview"
      className="mt-2 h-24 w-full rounded-lg object-cover"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
    />
  )
}

export function HomePageContentManager() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>('hero')
  const [form, setForm] = useState<UpdateHomePageContentDto | null>(null)
  const [saved, setSaved] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-homepage-content'],
    queryFn: () => homePageContentApi.get(),
    staleTime: 30_000,
  })

  useEffect(() => {
    if (data && !form) {
      const { homePageContentId: _, ...rest } = data
      setForm(rest)
    }
  }, [data])

  const mut = useMutation({
    mutationFn: () => {
      if (!data || !form) throw new Error('No data')
      return homePageContentApi.update(data.homePageContentId, form)
    },
    onSuccess: (updated) => {
      qc.setQueryData(['admin-homepage-content'], updated)
      qc.invalidateQueries({ queryKey: ['public-homepage-content'] })
      showToast('Home page content saved')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
    onError: () => showToast('Failed to save — please try again'),
  })

  const set = <K extends keyof UpdateHomePageContentDto>(k: K, v: UpdateHomePageContentDto[K]) =>
    setForm(f => f ? { ...f, [k]: v } : f)

  const setNum = (k: keyof UpdateHomePageContentDto, v: string) =>
    set(k, Number(v) as UpdateHomePageContentDto[typeof k])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-muted">
        <Loader2 className="h-5 w-5 animate-spin text-[#E8B84B]" />
        <span className="text-sm">Loading home page content…</span>
      </div>
    )
  }

  if (isError || !form) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-2xl">⚠️</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Could not load home page content.
        </p>
        <p className="text-xs text-gray-400">Check that the API is reachable, then refresh.</p>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/admin/site-content')}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                🏠 Home Page Content
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Hero images & text · Stats · Foundation · Final CTA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Page
            </Link>
            <button
              onClick={() => mut.mutate()}
              disabled={mut.isPending}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition disabled:opacity-60',
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-[#E8B84B] text-[#0d1b0d] hover:bg-[#d4a43a]',
              )}
            >
              {mut.isPending ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
              ) : saved ? (
                <><CheckCircle className="h-3.5 w-3.5" /> Saved</>
              ) : (
                <><Save className="h-3.5 w-3.5" /> Save Changes</>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-3 max-w-5xl flex gap-1">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  tab === t.id
                    ? 'bg-[#E8B84B]/15 text-[#c49830] dark:text-[#E8B84B]'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">

        {/* ── HERO TAB ── */}
        {tab === 'hero' && (
          <>
            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Hero Images (Slideshow)</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {([
                  { key: 'heroImage1Url', label: 'Slide 1 Image URL' },
                  { key: 'heroImage2Url', label: 'Slide 2 Image URL' },
                  { key: 'heroImage3Url', label: 'Slide 3 Image URL' },
                  { key: 'heroImage4Url', label: 'Slide 4 Image URL' },
                ] as const).map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <input
                      type="url"
                      className={FIELD}
                      value={form[key]}
                      onChange={e => set(key, e.target.value)}
                      placeholder="https://…"
                    />
                    <ImagePreview url={form[key]} />
                  </Field>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Hero Text</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Tagline (white text)">
                  <input className={FIELD} value={form.heroTagline} onChange={e => set('heroTagline', e.target.value)} placeholder="Where Excellence" />
                </Field>
                <Field label="Tagline Gold (gold text)">
                  <input className={FIELD} value={form.heroTaglineGold} onChange={e => set('heroTaglineGold', e.target.value)} placeholder="Meets Tomorrow" />
                </Field>
                <Field label="Location Badge">
                  <input className={FIELD} value={form.heroLocationBadge} onChange={e => set('heroLocationBadge', e.target.value)} placeholder="Kutus · Kirinyaga County · Est. Since 2005" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Hero Subtitle">
                  <textarea
                    rows={3}
                    className={`${FIELD} resize-none`}
                    value={form.heroSubtitle}
                    onChange={e => set('heroSubtitle', e.target.value)}
                    placeholder="Kenya's premier learning institution…"
                  />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Hero Call-to-Action Buttons</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Primary Button Label">
                  <input className={FIELD} value={form.heroPrimaryCtaLabel} onChange={e => set('heroPrimaryCtaLabel', e.target.value)} placeholder="Apply Now" />
                </Field>
                <Field label="Primary Button URL">
                  <input className={FIELD} value={form.heroPrimaryCtaUrl} onChange={e => set('heroPrimaryCtaUrl', e.target.value)} placeholder="/admissions" />
                </Field>
                <Field label="Secondary Button Label">
                  <input className={FIELD} value={form.heroSecondaryCtaLabel} onChange={e => set('heroSecondaryCtaLabel', e.target.value)} placeholder="Explore Programs" />
                </Field>
                <Field label="Secondary Button URL">
                  <input className={FIELD} value={form.heroSecondaryCtaUrl} onChange={e => set('heroSecondaryCtaUrl', e.target.value)} placeholder="/academics" />
                </Field>
              </div>
            </GlassCard>
          </>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <GlassCard className="p-6" hover={false}>
            <p className={SECTION}>Stats Bar Figures</p>
            <p className="mt-1 mb-4 text-xs text-gray-500 dark:text-gray-400">
              These numbers animate as counters on the home page hero.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Students Enrolled">
                <input
                  type="number"
                  min={0}
                  className={FIELD}
                  value={form.statStudentsEnrolled}
                  onChange={e => setNum('statStudentsEnrolled', e.target.value)}
                />
                <p className="mt-1 text-[11px] text-gray-400">Displayed as "{form.statStudentsEnrolled}+"</p>
              </Field>
              <Field label="Expert Educators">
                <input
                  type="number"
                  min={0}
                  className={FIELD}
                  value={form.statEducators}
                  onChange={e => setNum('statEducators', e.target.value)}
                />
                <p className="mt-1 text-[11px] text-gray-400">Displayed as "{form.statEducators}+"</p>
              </Field>
              <Field label="Year Established">
                <input
                  type="number"
                  min={1900}
                  max={2100}
                  className={FIELD}
                  value={form.statEstYear}
                  onChange={e => setNum('statEstYear', e.target.value)}
                />
                <p className="mt-1 text-[11px] text-gray-400">Displayed as "Est. {form.statEstYear}"</p>
              </Field>
              <Field label="Co-Curricular Activities">
                <input
                  type="number"
                  min={0}
                  className={FIELD}
                  value={form.statActivities}
                  onChange={e => setNum('statActivities', e.target.value)}
                />
                <p className="mt-1 text-[11px] text-gray-400">Displayed as "{form.statActivities}+"</p>
              </Field>
            </div>
          </GlassCard>
        )}

        {/* ── FOUNDATION TAB ── */}
        {tab === 'foundation' && (
          <>
            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Section Header</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Section Label (pill)">
                  <input className={FIELD} value={form.foundationSectionLabel} onChange={e => set('foundationSectionLabel', e.target.value)} placeholder="Our Foundation" />
                </Field>
                <Field label="Section Heading">
                  <input className={FIELD} value={form.foundationHeading} onChange={e => set('foundationHeading', e.target.value)} placeholder="What We Stand For" />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Mission</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Label (pill text)">
                  <input className={FIELD} value={form.missionLabel} onChange={e => set('missionLabel', e.target.value)} placeholder="Our Mission" />
                </Field>
                <Field label="Title">
                  <input className={FIELD} value={form.missionTitle} onChange={e => set('missionTitle', e.target.value)} placeholder="To Nurture Genius" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Body Text">
                  <textarea rows={3} className={`${FIELD} resize-none`} value={form.missionBody} onChange={e => set('missionBody', e.target.value)} />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Motto</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Label (pill text)">
                  <input className={FIELD} value={form.mottoLabel} onChange={e => set('mottoLabel', e.target.value)} placeholder="Our Motto" />
                </Field>
                <Field label="Title">
                  <input className={FIELD} value={form.mottoTitle} onChange={e => set('mottoTitle', e.target.value)} placeholder="Excellence in All" />
                </Field>
                <Field label="Tagline (italic quote)">
                  <input className={FIELD} value={form.mottoTagline} onChange={e => set('mottoTagline', e.target.value)} placeholder="Unlocking Every Child's Genius" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Body Text">
                  <textarea rows={3} className={`${FIELD} resize-none`} value={form.mottoBody} onChange={e => set('mottoBody', e.target.value)} />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Vision</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Label (pill text)">
                  <input className={FIELD} value={form.visionLabel} onChange={e => set('visionLabel', e.target.value)} placeholder="Our Vision" />
                </Field>
                <Field label="Title">
                  <input className={FIELD} value={form.visionTitle} onChange={e => set('visionTitle', e.target.value)} placeholder="Leaders for Tomorrow" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Body Text">
                  <textarea rows={3} className={`${FIELD} resize-none`} value={form.visionBody} onChange={e => set('visionBody', e.target.value)} />
                </Field>
              </div>
            </GlassCard>
          </>
        )}

        {/* ── FINAL CTA TAB ── */}
        {tab === 'cta' && (
          <GlassCard className="p-6" hover={false}>
            <p className={SECTION}>Final Call-to-Action Section</p>
            <div className="mt-3 space-y-4">
              <Field label="Badge Text (pill above heading)">
                <input className={FIELD} value={form.ctaBadgeText} onChange={e => set('ctaBadgeText', e.target.value)} placeholder="Applications Open · 2026–2027" />
              </Field>
              <Field label="Heading">
                <input className={FIELD} value={form.ctaHeading} onChange={e => set('ctaHeading', e.target.value)} placeholder="Ready to Join Alber School?" />
              </Field>
              <Field label="Subtext">
                <textarea rows={3} className={`${FIELD} resize-none`} value={form.ctaSubtext} onChange={e => set('ctaSubtext', e.target.value)} placeholder="Applications are open for the 2026/2027 academic year…" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8B84B]">Primary Button</p>
                  <Field label="Label">
                    <input className={FIELD} value={form.ctaPrimaryLabel} onChange={e => set('ctaPrimaryLabel', e.target.value)} placeholder="Apply Now" />
                  </Field>
                  <Field label="URL">
                    <input className={FIELD} value={form.ctaPrimaryUrl} onChange={e => set('ctaPrimaryUrl', e.target.value)} placeholder="/admissions" />
                  </Field>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secondary Button</p>
                  <Field label="Label">
                    <input className={FIELD} value={form.ctaSecondaryLabel} onChange={e => set('ctaSecondaryLabel', e.target.value)} placeholder="Contact Us" />
                  </Field>
                  <Field label="URL">
                    <input className={FIELD} value={form.ctaSecondaryUrl} onChange={e => set('ctaSecondaryUrl', e.target.value)} placeholder="/contact" />
                  </Field>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Save reminder */}
        <div className="flex justify-end pb-8">
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className={cn(
              'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition disabled:opacity-60',
              saved
                ? 'bg-green-500 text-white'
                : 'bg-[#E8B84B] text-[#0d1b0d] hover:bg-[#d4a43a]',
            )}
          >
            {mut.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle className="h-4 w-4" /> Saved</>
            ) : (
              <><Save className="h-4 w-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
