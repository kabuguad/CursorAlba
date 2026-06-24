import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Save, ExternalLink, ArrowLeft, Phone, MapPin, Image,
  Loader2, CheckCircle, AlertTriangle, WifiOff, Info,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  contactPageContentApi,
  type ContactPageContentDto,
  type UpdateContactPageContentDto,
} from '../../../services/contactPageContentApi'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'

const FIELD = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
const SECTION = 'text-[10px] font-bold uppercase tracking-widest text-[#E8B84B] pt-2 pb-1'

type Tab = 'hero' | 'contact' | 'hours'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'hero',    label: 'Hero',         icon: Image    },
  { id: 'contact', label: 'Contact Info', icon: Phone    },
  { id: 'hours',   label: 'Hours & Map',  icon: MapPin   },
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

function hasJwt(): boolean {
  return Boolean(sessionStorage.getItem('alber-token'))
}

const BLANK: UpdateContactPageContentDto = {
  heroHeadline:    'Contact Us',
  heroSubheadline: "Adjacent to the Governor's Offices, Kutus — Kirinyaga County. We're here to help.",
  heroImageUrl:    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
  phonePrimary:    '+254 712 345 678',
  phoneSecondary:  '+254 734 567 890',
  emailPrimary:    'info@alberschool.ke',
  emailSecondary:  'admissions@alberschool.ke',
  whatsAppNumber:  '254712345678',
  addressLine1:    "Adjacent to Governor's Offices",
  addressLine2:    'Kutus Town, Kirinyaga County',
  mapEmbedUrl:     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d37.285!3d-0.518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1828bf2f9c72a4a1%3A0x4a6d4f5e1b3c2d8e!2sKutus%2C%20Kirinyaga!5e0!3m2!1sen!2ske!4v1',
  officeHours:     'Monday \u2013 Friday 7:30 AM \u2013 5:00 PM \u00B7 Saturday 8:00 AM \u2013 1:00 PM',
  officeHoursNote: 'For urgent matters outside office hours, please use WhatsApp.',
}

export function ContactPageContentManager() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>('hero')
  const [form, setForm] = useState<UpdateContactPageContentDto | null>(null)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isDemo] = useState(() => !hasJwt())

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin-contact-page-content'],
    queryFn: () => contactPageContentApi.get(),
    staleTime: 30_000,
    retry: 2,
  })

  useEffect(() => {
    if (data && !form) {
      const { id: _, updatedAt: __, ...rest } = data
      setForm(rest)
    }
  }, [data])

  const mut = useMutation({
    mutationFn: () => {
      if (!data || !form) throw new Error('No data loaded')
      return contactPageContentApi.update(data.id, form)
    },
    onSuccess: (updated: ContactPageContentDto) => {
      qc.setQueryData(['admin-contact-page-content'], updated)
      qc.invalidateQueries({ queryKey: ['public-contact-page-content'] })
      showToast('Contact page content saved successfully')
      setSaved(true)
      setSaveError(null)
      setTimeout(() => setSaved(false), 2500)
    },
    onError: (err: Error) => {
      const msg = err.message || 'Failed to save — please try again'
      setSaveError(msg)
      showToast(msg)
    },
  })

  const set = <K extends keyof UpdateContactPageContentDto>(k: K, v: UpdateContactPageContentDto[K]) =>
    setForm(f => f ? { ...f, [k]: v } : f)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-muted">
        <Loader2 className="h-5 w-5 animate-spin text-[#E8B84B]" />
        <span className="text-sm">Loading contact page content…</span>
      </div>
    )
  }

  if (isError || !form) {
    const errMsg = (error as Error)?.message ?? 'Could not load contact page content.'
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center px-6">
        <WifiOff className="h-8 w-8 text-gray-400" />
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Failed to load contact page content
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">{errMsg}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-1.5 text-xs font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition"
        >
          <Loader2 className="h-3.5 w-3.5" /> Retry
        </button>
        <p className="text-[11px] text-gray-400">
          Ensure the API is reachable at <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">/api/contact-page-content</code>
        </p>
      </div>
    )
  }

  const saveBtn = (
    <button
      onClick={() => { setSaveError(null); mut.mutate() }}
      disabled={mut.isPending || isDemo}
      title={isDemo ? 'Sign in with real credentials to enable saving' : undefined}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition disabled:opacity-60',
        saved
          ? 'bg-green-500 text-white'
          : isDemo
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
  )

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">

      {/* ── Demo-mode notice ── */}
      {isDemo && (
        <div className="mx-auto max-w-4xl px-6 pt-4">
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/15 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Demo mode — </span>
              Content is loaded from the live API but{' '}
              <span className="font-semibold">saving is disabled</span>. Sign in with real admin
              credentials (email + password) to enable saves.
            </p>
          </div>
        </div>
      )}

      {/* ── Save error banner ── */}
      {saveError && (
        <div className="mx-auto max-w-4xl px-6 pt-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-900/15 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-xs text-red-700 dark:text-red-400">
              <span className="font-semibold">Save failed: </span>{saveError}
            </p>
            <button
              onClick={() => setSaveError(null)}
              className="ml-auto text-red-400 hover:text-red-600 transition text-sm leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/admin/site-content')}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                📞 Contact Page Content
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Hero · Contact info · Office hours &amp; map
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Page
            </Link>
            {saveBtn}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto mt-3 max-w-4xl flex gap-1">
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
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">

        {/* ── HERO TAB ── */}
        {tab === 'hero' && (
          <>
            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Hero Image</p>
              <div className="mt-3">
                <Field label="Background Image URL">
                  <input
                    type="url"
                    className={FIELD}
                    value={form.heroImageUrl}
                    onChange={e => set('heroImageUrl', e.target.value)}
                    placeholder="https://…"
                    readOnly={isDemo}
                  />
                  <ImagePreview url={form.heroImageUrl} />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Hero Text</p>
              <div className="mt-3 space-y-4">
                <Field label="Headline">
                  <input
                    className={FIELD}
                    value={form.heroHeadline}
                    onChange={e => set('heroHeadline', e.target.value)}
                    placeholder="Contact Us"
                    readOnly={isDemo}
                  />
                </Field>
                <Field label="Subheadline">
                  <textarea
                    rows={3}
                    className={`${FIELD} resize-none`}
                    value={form.heroSubheadline}
                    onChange={e => set('heroSubheadline', e.target.value)}
                    placeholder="Adjacent to the Governor's Offices…"
                    readOnly={isDemo}
                  />
                </Field>
              </div>
            </GlassCard>
          </>
        )}

        {/* ── CONTACT INFO TAB ── */}
        {tab === 'contact' && (
          <>
            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Phone Numbers</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Primary Phone">
                  <input
                    className={FIELD}
                    value={form.phonePrimary}
                    onChange={e => set('phonePrimary', e.target.value)}
                    placeholder="+254 712 345 678"
                    readOnly={isDemo}
                  />
                </Field>
                <Field label="Secondary Phone">
                  <input
                    className={FIELD}
                    value={form.phoneSecondary}
                    onChange={e => set('phoneSecondary', e.target.value)}
                    placeholder="+254 734 567 890"
                    readOnly={isDemo}
                  />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Email Addresses</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Primary Email">
                  <input
                    type="email"
                    className={FIELD}
                    value={form.emailPrimary}
                    onChange={e => set('emailPrimary', e.target.value)}
                    placeholder="info@alberschool.ke"
                    readOnly={isDemo}
                  />
                </Field>
                <Field label="Secondary Email">
                  <input
                    type="email"
                    className={FIELD}
                    value={form.emailSecondary}
                    onChange={e => set('emailSecondary', e.target.value)}
                    placeholder="admissions@alberschool.ke"
                    readOnly={isDemo}
                  />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>WhatsApp</p>
              <div className="mt-3">
                <Field label="WhatsApp Number (digits only — used in wa.me link)">
                  <input
                    className={FIELD}
                    value={form.whatsAppNumber}
                    onChange={e => set('whatsAppNumber', e.target.value)}
                    placeholder="254712345678"
                    readOnly={isDemo}
                  />
                </Field>
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Enter country code + number without +, spaces, or dashes. e.g. <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">254712345678</code>
                </p>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Physical Address</p>
              <div className="mt-3 space-y-4">
                <Field label="Address Line 1">
                  <input
                    className={FIELD}
                    value={form.addressLine1}
                    onChange={e => set('addressLine1', e.target.value)}
                    placeholder="Adjacent to Governor's Offices"
                    readOnly={isDemo}
                  />
                </Field>
                <Field label="Address Line 2">
                  <input
                    className={FIELD}
                    value={form.addressLine2}
                    onChange={e => set('addressLine2', e.target.value)}
                    placeholder="Kutus Town, Kirinyaga County"
                    readOnly={isDemo}
                  />
                </Field>
              </div>
            </GlassCard>
          </>
        )}

        {/* ── HOURS & MAP TAB ── */}
        {tab === 'hours' && (
          <>
            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Office Hours</p>
              <div className="mt-3 space-y-4">
                <Field label="Hours Text">
                  <input
                    className={FIELD}
                    value={form.officeHours}
                    onChange={e => set('officeHours', e.target.value)}
                    placeholder="Monday – Friday 7:30 AM – 5:00 PM · Saturday 8:00 AM – 1:00 PM"
                    readOnly={isDemo}
                  />
                </Field>
                <Field label="Out-of-Hours Note">
                  <input
                    className={FIELD}
                    value={form.officeHoursNote}
                    onChange={e => set('officeHoursNote', e.target.value)}
                    placeholder="For urgent matters outside office hours, please use WhatsApp."
                    readOnly={isDemo}
                  />
                </Field>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className={SECTION}>Google Maps Embed</p>
              <div className="mt-3 space-y-3">
                <Field label="Map Embed URL (src from Google Maps → Share → Embed)">
                  <textarea
                    rows={3}
                    className={`${FIELD} resize-none font-mono text-xs`}
                    value={form.mapEmbedUrl}
                    onChange={e => set('mapEmbedUrl', e.target.value)}
                    readOnly={isDemo}
                  />
                </Field>
                {form.mapEmbedUrl && (
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 h-48">
                    <iframe
                      src={form.mapEmbedUrl}
                      title="Map preview"
                      className="h-full w-full border-0 grayscale"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="text-[11px] text-gray-400">
                  Go to Google Maps → share your location → Embed a map → copy the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">src</code> value from the iframe snippet.
                </p>
              </div>
            </GlassCard>
          </>
        )}

        {/* Bottom save button */}
        <div className="flex justify-end pb-8">
          <button
            onClick={() => { setSaveError(null); mut.mutate() }}
            disabled={mut.isPending || isDemo}
            title={isDemo ? 'Sign in with real credentials to enable saving' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition disabled:opacity-60',
              saved
                ? 'bg-green-500 text-white'
                : isDemo
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
