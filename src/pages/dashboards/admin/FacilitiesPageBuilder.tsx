import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Edit2, Trash2, Plus, X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'
import { facilitiesApi, type FacilityDto, type FacilityPageContent } from '../../../services/facilitiesApi'

const EMPTY_FACILITY: Omit<FacilityDto, 'facilityId' | 'facilitiesPageContentId'> = {
  icon: '🏫',
  name: '',
  desc: '',
  img: '',
  highlights: '',
  sortOrder: 99,
  isPublished: true,
}

function PageContentModal({
  initial,
  onClose,
}: {
  initial: FacilityPageContent
  onClose: () => void
}) {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [form, setForm] = useState({
    headline: initial.headline,
    subheadline: initial.subheadline,
    ctaHeadline: initial.ctaHeadline,
    ctaSubtext: initial.ctaSubtext,
  })

  const mut = useMutation({
    mutationFn: () => facilitiesApi.updatePageContent(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['facilities-page-content'] })
      showToast('Page content updated')
      onClose()
    },
    onError: () => showToast('Failed to update page content'),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
      <GlassCard className="w-full max-w-lg p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Edit Page Content</h2>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-tint/60 dark:hover:bg-dark-card transition">
            <X className="h-4 w-4 text-muted" />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mut.mutate() }} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Hero Headline</label>
            <input className="field" value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Hero Subheadline</label>
            <textarea rows={2} className="field resize-none" value={form.subheadline} onChange={e => setForm(f => ({ ...f, subheadline: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">CTA Headline</label>
            <input className="field" value={form.ctaHeadline} onChange={e => setForm(f => ({ ...f, ctaHeadline: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">CTA Subtext</label>
            <textarea rows={2} className="field resize-none" value={form.ctaSubtext} onChange={e => setForm(f => ({ ...f, ctaSubtext: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={mut.isPending}>
              {mut.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </GlassCard>
      </div>
    </div>
  )
}

function FacilityModal({
  initial,
  onClose,
}: {
  initial: Omit<FacilityDto, 'facilityId' | 'facilitiesPageContentId'> & { facilityId?: number }
  onClose: () => void
}) {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const isEdit = initial.facilityId !== undefined

  const [form, setForm] = useState<Omit<FacilityDto, 'facilityId' | 'facilitiesPageContentId'>>({
    icon: initial.icon,
    name: initial.name,
    desc: initial.desc,
    img: initial.img,
    highlights: initial.highlights,
    sortOrder: initial.sortOrder,
    isPublished: initial.isPublished,
  })

  const mut = useMutation({
    mutationFn: () =>
      isEdit
        ? facilitiesApi.update(initial.facilityId!, form)
        : facilitiesApi.create({ ...form, facilitiesPageContentId: 1 }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['facilities'] })
      showToast(isEdit ? `"${form.name}" updated` : `"${form.name}" added`)
      onClose()
    },
    onError: () => showToast('Failed to save facility'),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
      <GlassCard className="w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isEdit ? 'Edit Facility' : 'Add Facility'}</h2>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-tint/60 dark:hover:bg-dark-card transition">
            <X className="h-4 w-4 text-muted" />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mut.mutate() }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Icon (emoji)</label>
              <input className="field text-xl" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🏫" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Sort Order</label>
              <input type="number" className="field" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Name <span className="text-gold">*</span></label>
            <input required className="field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Science Labs" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Description <span className="text-gold">*</span></label>
            <textarea required rows={3} className="field resize-none" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Full description shown in the detail modal…" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Image URL</label>
            <input type="url" className="field" value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="https://…" />
            {form.img && (
              <img src={form.img} alt="preview" className="mt-2 h-28 w-full rounded-xl object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted uppercase tracking-widest">Highlights <span className="text-muted font-normal">(one per line)</span></label>
            <textarea rows={4} className="field resize-none font-mono text-xs" value={form.highlights}
              onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
              placeholder={"Interactive whiteboards\nHigh-speed Wi-Fi\nAir-conditioned"} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
              className="h-4 w-4 rounded" />
            <span className="text-sm font-medium">Published (visible on public site)</span>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={mut.isPending}>
              {mut.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Facility'}
            </Button>
          </div>
        </form>
      </GlassCard>
      </div>
    </div>
  )
}

export function FacilitiesPageBuilder() {
  const { showToast } = useToast()
  const qc = useQueryClient()

  const [editingContent, setEditingContent] = useState(false)
  const [editingFacility, setEditingFacility] = useState<FacilityDto | null>(null)
  const [addingFacility, setAddingFacility] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const { data: pageContent, isLoading: contentLoading } = useQuery({
    queryKey: ['facilities-page-content'],
    queryFn: () => facilitiesApi.getPageContent(),
    staleTime: 60_000,
  })

  const { data: facilities = [], isLoading: facilitiesLoading } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => facilitiesApi.getAll(),
    staleTime: 30_000,
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => facilitiesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['facilities'] })
      showToast('Facility deleted')
      setConfirmDeleteId(null)
    },
    onError: () => showToast('Failed to delete facility'),
  })

  const publishMut = useMutation({
    mutationFn: ({ f, published }: { f: FacilityDto; published: boolean }) =>
      facilitiesApi.update(f.facilityId, {
        icon: f.icon, name: f.name, desc: f.desc,
        img: f.img, highlights: f.highlights,
        sortOrder: f.sortOrder, isPublished: published,
      }),
    onSuccess: (_data, { published }) => {
      qc.invalidateQueries({ queryKey: ['facilities'] })
      showToast(published ? 'Facility published' : 'Facility unpublished')
    },
    onError: () => showToast('Failed to update publish status'),
  })

  const sorted = [...facilities].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-950">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
        <div className="mx-auto max-w-4xl w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/dashboard/admin/site-content"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Site Content
          </Link>
          <span className="text-muted text-xs">/</span>
          <span className="text-xs font-semibold truncate">🏛 Facilities</span>
        </div>
        <a
          href="/facilities"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition shrink-0"
        >
          <ExternalLink className="h-3 w-3" /> Preview page
        </a>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6 max-w-4xl mx-auto w-full">

        {/* Section 1 — Page Content */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              1 · Page Content
            </h2>
          </div>
          <GlassCard className="p-5">
            {contentLoading ? (
              <div className="flex items-center gap-2 text-muted py-4">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : pageContent ? (
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <p className="text-base font-bold truncate">{pageContent.headline}</p>
                  <p className="text-xs text-muted line-clamp-2">{pageContent.subheadline}</p>
                  <div className="mt-3 pt-3 border-t border-theme space-y-1">
                    <p className="text-xs font-semibold text-primary dark:text-gold truncate">{pageContent.ctaHeadline}</p>
                    <p className="text-xs text-muted line-clamp-1">{pageContent.ctaSubtext}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingContent(true)}
                  className="shrink-0 rounded-lg p-2 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition"
                  title="Edit page content"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted py-2">Could not load page content.</p>
            )}
          </GlassCard>
        </section>

        {/* Section 2 — Facilities */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              2 · Facilities <span className="ml-2 text-xs font-normal text-muted normal-case tracking-normal">({sorted.length} total · {sorted.filter(f => f.isPublished).length} published)</span>
            </h2>
            <Button variant="gold" onClick={() => setAddingFacility(true)} className="flex items-center gap-1.5 text-xs py-1.5 px-3">
              <Plus className="h-3.5 w-3.5" /> Add Facility
            </Button>
          </div>

          {facilitiesLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading facilities…
            </div>
          ) : sorted.length === 0 ? (
            <button
              onClick={() => setAddingFacility(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-theme py-12 text-sm text-muted transition hover:border-gold/50 hover:text-gold"
            >
              <Plus className="h-4 w-4" /> Add your first facility
            </button>
          ) : (
            <div className="space-y-3">
              {sorted.map((f) => (
                <GlassCard key={f.facilityId} className="p-0 overflow-hidden">
                  <div className="flex items-center gap-4 px-4 py-3">
                    {/* Image thumbnail */}
                    {f.img ? (
                      <img src={f.img} alt={f.name} className="h-14 w-20 rounded-lg object-cover shrink-0"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <div className="h-14 w-20 rounded-lg bg-tint dark:bg-dark-card flex items-center justify-center text-2xl shrink-0">
                        {f.icon}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{f.icon}</span>
                        <p className="font-semibold truncate">{f.name}</p>
                        <span className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          f.isPublished
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                        )}>
                          {f.isPublished ? 'Published' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">{f.desc}</p>
                      {f.highlights && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {f.highlights.split('\n').filter(Boolean).slice(0, 3).map(h => (
                            <span key={h} className="rounded-full bg-tint dark:bg-dark-card px-2 py-0.5 text-[10px] text-muted">{h}</span>
                          ))}
                          {f.highlights.split('\n').filter(Boolean).length > 3 && (
                            <span className="text-[10px] text-muted">+{f.highlights.split('\n').filter(Boolean).length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => publishMut.mutate({ f, published: !f.isPublished })}
                        className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition"
                        title={f.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {f.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => setEditingFacility(f)}
                        className="rounded-lg p-1.5 text-muted hover:bg-tint/60 dark:hover:bg-dark-card transition"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {confirmDeleteId === f.facilityId ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteMut.mutate(f.facilityId)}
                            disabled={deleteMut.isPending}
                            className="rounded-lg px-2 py-1 text-[10px] font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                          >
                            {deleteMut.isPending ? '…' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg px-2 py-1 text-[10px] font-semibold border border-theme text-muted hover:text-foreground transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(f.facilityId)}
                          className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {editingContent && pageContent && (
        <PageContentModal initial={pageContent} onClose={() => setEditingContent(false)} />
      )}
      {(editingFacility || addingFacility) && (
        <FacilityModal
          initial={editingFacility ?? EMPTY_FACILITY}
          onClose={() => { setEditingFacility(null); setAddingFacility(false) }}
        />
      )}
    </div>
  )
}
