import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft, Plus, Edit2, Trash2, X, Check,
  ChevronDown, ChevronRight, ExternalLink,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'
import {
  coCurrApi,
  coCurrApiError,
  type CoCurrPageContent,
  type CoCurrCategory,
  type CoCurrActivity,
  type CoCurrPageContentDto,
  type CoCurrCategoryDto,
  type CoCurrActivityDto,
} from '../../../services/coCurrApi'

const INP   = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
const BTN_GOLD  = 'flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-3 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-60'
const BTN_GHOST = 'flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition'

const PALETTE = [
  { color: 'from-green-500/20 to-emerald-500/10',  border: 'border-green-500/30'  },
  { color: 'from-purple-500/20 to-pink-500/10',    border: 'border-purple-500/30' },
  { color: 'from-blue-500/20 to-cyan-500/10',      border: 'border-blue-500/30'   },
  { color: 'from-amber-500/20 to-orange-500/10',   border: 'border-amber-500/30'  },
]
const palette = (i: number) => PALETTE[i % PALETTE.length]

const BLANK_CAT: CoCurrCategoryDto = {
  icon: '🏫', title: '', heading: '', intro: '', sortOrder: 1, cocurrPageContentId: 1,
}

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
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

export function CoCurrPageBuilder() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { showToast } = useToast()

  // ── Queries ─────────────────────────────────────────────────────────────────
  const { data: pageContents = [], isLoading: pcLoading } = useQuery({
    queryKey: ['cocurr-page-content'],
    queryFn: () => coCurrApi.getPageContent(),
    staleTime: 30_000,
  })
  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['cocurr-categories'],
    queryFn: () => coCurrApi.getCategories(),
    staleTime: 30_000,
  })
  const { data: allActivities = [], isLoading: actsLoading } = useQuery({
    queryKey: ['cocurr-activities'],
    queryFn: () => coCurrApi.getActivities(),
    staleTime: 30_000,
  })

  void (pcLoading || catsLoading || actsLoading)
  const sortedCats = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  // ── Expanded categories ──────────────────────────────────────────────────────
  const [expandedCats, setExpandedCats] = useState<Set<number>>(new Set())
  const toggleCat = (id: number) =>
    setExpandedCats(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  // ── Page Content editing ─────────────────────────────────────────────────────
  const [editingPc, setEditingPc] = useState<CoCurrPageContent | null>(null)
  const [pcDraft, setPcDraft] = useState<Partial<CoCurrPageContentDto>>({})

  const updatePcMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CoCurrPageContentDto> }) => coCurrApi.updatePageContent(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-page-content'] }); showToast('Page content saved ✓'); setEditingPc(null) },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })

  const openEditPc = (item: CoCurrPageContent) => {
    setPcDraft({ headline: item.headline ?? '', subheadline: item.subheadline ?? '', ctaHeadline: item.ctaHeadline ?? '', ctaSubtext: item.ctaSubtext ?? '' })
    setEditingPc(item)
  }

  // ── Category CRUD ────────────────────────────────────────────────────────────
  const [catModal, setCatModal] = useState(false)
  const [editingCat, setEditingCat] = useState<CoCurrCategory | null>(null)
  const [catDraft, setCatDraft] = useState<CoCurrCategoryDto>(BLANK_CAT)
  const [delCat, setDelCat] = useState<number | null>(null)

  const createCatMut = useMutation({
    mutationFn: (dto: CoCurrCategoryDto) => coCurrApi.createCategory(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-categories'] }); showToast('Category added ✓'); closeCatModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const updateCatMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CoCurrCategoryDto> }) => coCurrApi.updateCategory(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-categories'] }); showToast('Category updated ✓'); closeCatModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const deleteCatMut = useMutation({
    mutationFn: (id: number) => coCurrApi.deleteCategory(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-categories'] }); qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Category deleted'); setDelCat(null) },
    onError: (err) => showToast(`Delete failed: ${coCurrApiError(err)}`),
  })

  const openNewCat = () => { setCatDraft({ ...BLANK_CAT, sortOrder: categories.length + 1 }); setEditingCat(null); setCatModal(true) }
  const openEditCat = (c: CoCurrCategory) => {
    setCatDraft({ icon: c.icon, title: c.title, heading: c.heading, intro: c.intro ?? '', sortOrder: c.sortOrder, cocurrPageContentId: c.cocurrPageContentId })
    setEditingCat(c); setCatModal(true)
  }
  const closeCatModal = () => { setCatModal(false); setEditingCat(null) }
  const handleSaveCat = () => {
    if (!catDraft.title.trim()) return showToast('Title is required')
    if (!catDraft.heading.trim()) return showToast('Heading is required')
    editingCat ? updateCatMut.mutate({ id: editingCat.id, dto: catDraft }) : createCatMut.mutate(catDraft)
  }
  const setCat = <K extends keyof CoCurrCategoryDto>(k: K, v: CoCurrCategoryDto[K]) =>
    setCatDraft(d => ({ ...d, [k]: v }))

  // ── Activity CRUD ────────────────────────────────────────────────────────────
  const [actModal, setActModal] = useState(false)
  const [_actCatId, setActCatId] = useState<number>(0)
  const [editingAct, setEditingAct] = useState<CoCurrActivity | null>(null)
  const [actDraft, setActDraft] = useState<CoCurrActivityDto>({ icon: '⭐', name: '', description: '', sortOrder: 1, cocurrCategoryId: 0 })
  const [delAct, setDelAct] = useState<number | null>(null)

  const createActMut = useMutation({
    mutationFn: (dto: CoCurrActivityDto) => coCurrApi.createActivity(dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Activity added ✓'); closeActModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const updateActMut = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: Partial<CoCurrActivityDto> }) => coCurrApi.updateActivity(id, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Activity updated ✓'); closeActModal() },
    onError: (err) => showToast(`Failed: ${coCurrApiError(err)}`),
  })
  const deleteActMut = useMutation({
    mutationFn: (id: number) => coCurrApi.deleteActivity(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cocurr-activities'] }); showToast('Activity deleted'); setDelAct(null) },
    onError: (err) => showToast(`Delete failed: ${coCurrApiError(err)}`),
  })

  const openNewAct = (catId: number) => {
    const count = allActivities.filter(a => a.cocurrCategoryId === catId).length
    setActDraft({ icon: '⭐', name: '', description: '', sortOrder: count + 1, cocurrCategoryId: catId })
    setActCatId(catId); setEditingAct(null); setActModal(true)
  }
  const openEditAct = (a: CoCurrActivity) => {
    setActDraft({ icon: a.icon, name: a.name, description: a.description ?? '', sortOrder: a.sortOrder, cocurrCategoryId: a.cocurrCategoryId })
    setActCatId(a.cocurrCategoryId); setEditingAct(a); setActModal(true)
  }
  const closeActModal = () => { setActModal(false); setEditingAct(null) }
  const handleSaveAct = () => {
    if (!actDraft.name.trim()) return showToast('Activity name is required')
    editingAct ? updateActMut.mutate({ id: editingAct.id, dto: actDraft }) : createActMut.mutate(actDraft)
  }
  const setAct = <K extends keyof CoCurrActivityDto>(k: K, v: CoCurrActivityDto[K]) =>
    setActDraft(d => ({ ...d, [k]: v }))

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3">
        <div className="mx-auto max-w-5xl w-full flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/admin/site-content')}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Site Content
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">🤸 Co-Curricular</span>
          <div className="ml-auto">
            <Link
              to="/co-curricular"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview page
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto p-6 lg:p-8 space-y-8 max-w-5xl w-full">

        {/* ── Section 1: Page Content ───────────────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Page Content</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Hero headline, subheadline and CTA text shown on the public page.</p>
            </div>
          </div>

          {pcLoading && <div className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />}

          {!pcLoading && pageContents.map(pc => (
            <div
              key={pc.id}
              className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{pc.headline || <span className="italic text-gray-400">No headline set</span>}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{pc.subheadline}</p>
                {(pc.ctaHeadline || pc.ctaSubtext) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {pc.ctaHeadline && <span className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">CTA: {pc.ctaHeadline}</span>}
                  </div>
                )}
              </div>
              <button
                onClick={() => openEditPc(pc)}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {!pcLoading && pageContents.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center text-sm text-gray-400">
              No page content found. Seed the database to generate the default record.
            </div>
          )}
        </section>

        {/* ── Section 2: Categories & Activities ───────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Categories &amp; Activities</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Each category is a tab on the public page. Expand a category to view and manage its activities.
              </p>
            </div>
            <button onClick={openNewCat} className={BTN_GOLD}>
              <Plus className="h-4 w-4" /> Add Category
            </button>
          </div>

          {catsLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
            </div>
          )}

          {!catsLoading && sortedCats.length === 0 && (
            <button
              onClick={openNewCat}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-14 text-sm text-gray-400 hover:border-[#E8B84B]/50 hover:text-[#E8B84B] transition"
            >
              <Plus className="h-5 w-5" /> Add your first category
            </button>
          )}

          <div className="space-y-3">
            {sortedCats.map((cat, idx) => {
              const pal = palette(idx)
              const catActivities = allActivities
                .filter(a => a.cocurrCategoryId === cat.id)
                .sort((a, b) => a.sortOrder - b.sortOrder)
              const isExpanded = expandedCats.has(cat.id)

              return (
                <div
                  key={cat.id}
                  className={cn('rounded-2xl border bg-gradient-to-br overflow-hidden transition-all', pal.color, pal.border)}
                >
                  {/* Category header row */}
                  <div className="flex items-center gap-3 p-4">
                    <button
                      onClick={() => toggleCat(cat.id)}
                      className="flex flex-1 items-center gap-3 min-w-0 text-left"
                    >
                      <span className="text-2xl w-9 text-center flex-shrink-0">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white leading-tight">{cat.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate italic">{cat.heading}</p>
                      </div>
                      <span className={cn(
                        'ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold flex-shrink-0',
                        isExpanded
                          ? 'bg-white/60 dark:bg-black/20 text-gray-700 dark:text-gray-300'
                          : 'bg-white/40 dark:bg-black/10 text-gray-500 dark:text-gray-400',
                      )}>
                        {catActivities.length} {catActivities.length === 1 ? 'activity' : 'activities'}
                      </span>
                      {isExpanded
                        ? <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                        : <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                      }
                    </button>

                    {/* Category action buttons */}
                    <div className="flex shrink-0 items-center gap-1 ml-2">
                      <button
                        onClick={() => openEditCat(cat)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-white/50 dark:hover:bg-black/20 transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {delCat === cat.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteCatMut.mutate(cat.id)}
                            disabled={deleteCatMut.isPending}
                            className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600 transition disabled:opacity-60"
                          >
                            Delete
                          </button>
                          <button onClick={() => setDelCat(null)} className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-white/50 transition">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDelCat(cat.id)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded: intro + activities */}
                  {isExpanded && (
                    <div className="border-t border-white/30 dark:border-black/20 bg-white/70 dark:bg-gray-900/60">
                      {/* Intro text */}
                      {cat.intro && (
                        <p className="px-5 pt-4 pb-1 text-xs text-gray-500 dark:text-gray-400 italic max-w-2xl">{cat.intro}</p>
                      )}

                      {/* Activities table */}
                      <div className="px-4 pt-3 pb-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activities</p>
                          <button onClick={() => openNewAct(cat.id)} className={BTN_GOLD + ' !py-1 !text-xs'}>
                            <Plus className="h-3.5 w-3.5" /> Add Activity
                          </button>
                        </div>

                        {actsLoading ? (
                          <div className="space-y-2">
                            {[1, 2].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />)}
                          </div>
                        ) : catActivities.length === 0 ? (
                          <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-6 text-center text-xs text-gray-400">
                            No activities yet.{' '}
                            <button onClick={() => openNewAct(cat.id)} className="font-semibold text-[#E8B84B] hover:underline">
                              Add the first one →
                            </button>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <table className="w-full min-w-[480px] text-left text-sm">
                              <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Icon</th>
                                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Name</th>
                                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Description</th>
                                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 text-center">Order</th>
                                  <th className="px-4 py-2.5" />
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {catActivities.map(act => (
                                  <tr key={act.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                    <td className="px-4 py-2.5 text-xl">{act.icon}</td>
                                    <td className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{act.name}</td>
                                    <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                                      <p className="line-clamp-2">{act.description}</p>
                                    </td>
                                    <td className="px-4 py-2.5 text-center text-xs text-gray-400">{act.sortOrder}</td>
                                    <td className="px-4 py-2.5">
                                      <div className="flex items-center justify-end gap-1">
                                        <button
                                          onClick={() => openEditAct(act)}
                                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition"
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        {delAct === act.id ? (
                                          <div className="flex items-center gap-1 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-2 py-1">
                                            <span className="text-xs text-red-600 dark:text-red-400">Delete?</span>
                                            <button onClick={() => deleteActMut.mutate(act.id)} className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline">Yes</button>
                                            <button onClick={() => setDelAct(null)} className="text-xs text-gray-400">No</button>
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => setDelAct(act.id)}
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
                                          >
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
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* ── Page Content Modal ────────────────────────────────────────────────── */}
      <Modal open={!!editingPc} onClose={() => setEditingPc(null)} title="Edit Page Content">
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Headline <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={pcDraft.headline ?? ''} onChange={e => setPcDraft(d => ({ ...d, headline: e.target.value }))} autoFocus />
          </div>
          <div>
            <label className={LABEL}>Subheadline</label>
            <textarea rows={3} className={cn(INP, 'resize-none')} value={pcDraft.subheadline ?? ''} onChange={e => setPcDraft(d => ({ ...d, subheadline: e.target.value }))} />
          </div>
          <div>
            <label className={LABEL}>CTA Headline</label>
            <input className={INP} value={pcDraft.ctaHeadline ?? ''} onChange={e => setPcDraft(d => ({ ...d, ctaHeadline: e.target.value }))} />
          </div>
          <div>
            <label className={LABEL}>CTA Subtext</label>
            <textarea rows={3} className={cn(INP, 'resize-none')} value={pcDraft.ctaSubtext ?? ''} onChange={e => setPcDraft(d => ({ ...d, ctaSubtext: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => { if (!editingPc || !pcDraft.headline?.trim()) return; updatePcMut.mutate({ id: editingPc.id, dto: pcDraft }) }} disabled={updatePcMut.isPending || !pcDraft.headline?.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{updatePcMut.isPending ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={() => setEditingPc(null)} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>

      {/* ── Category Modal ───────────────────────────────────────────────────── */}
      <Modal open={catModal} onClose={closeCatModal} title={editingCat ? `Edit: ${editingCat.title}` : 'New Category'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={cn(INP, 'text-center')} value={catDraft.icon} onChange={e => setCat('icon', e.target.value)} style={{ fontSize: 20 }} />
            </div>
            <div>
              <label className={LABEL}>Tab Title <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={catDraft.title} onChange={e => setCat('title', e.target.value)} placeholder="Sports & Physical" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Section Heading <span className="text-[#E8B84B]">*</span></label>
            <input className={INP} value={catDraft.heading} onChange={e => setCat('heading', e.target.value)} placeholder="Sports & Physical Activities" />
          </div>
          <div>
            <label className={LABEL}>Intro Text</label>
            <textarea rows={4} className={cn(INP, 'resize-none')} value={catDraft.intro} onChange={e => setCat('intro', e.target.value)} placeholder="Describe this category…" />
          </div>
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={INP} value={catDraft.sortOrder} onChange={e => setCat('sortOrder', Number(e.target.value))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSaveCat} disabled={createCatMut.isPending || updateCatMut.isPending || !catDraft.title.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{createCatMut.isPending || updateCatMut.isPending ? 'Saving…' : editingCat ? 'Save Changes' : 'Create Category'}
            </button>
            <button onClick={closeCatModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>

      {/* ── Activity Modal ───────────────────────────────────────────────────── */}
      <Modal open={actModal} onClose={closeActModal} title={editingAct ? `Edit Activity` : 'New Activity'}>
        <div className="space-y-4">
          {/* Category context badge */}
          {(() => {
            const cat = categories.find(c => c.id === actDraft.cocurrCategoryId)
            return cat ? (
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2">
                <span className="text-lg">{cat.icon}</span>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">{cat.title}</p>
              </div>
            ) : null
          })()}
          <div className="grid grid-cols-[72px_1fr] gap-3">
            <div>
              <label className={LABEL}>Icon</label>
              <input className={cn(INP, 'text-center')} value={actDraft.icon} onChange={e => setAct('icon', e.target.value)} style={{ fontSize: 20 }} />
            </div>
            <div>
              <label className={LABEL}>Name <span className="text-[#E8B84B]">*</span></label>
              <input className={INP} value={actDraft.name} onChange={e => setAct('name', e.target.value)} placeholder="e.g. Table Tennis" autoFocus />
            </div>
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea rows={3} className={cn(INP, 'resize-none')} value={actDraft.description} onChange={e => setAct('description', e.target.value)} placeholder="Brief description shown on the activity card…" />
          </div>
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" min={1} className={cn(INP, 'w-24')} value={actDraft.sortOrder} onChange={e => setAct('sortOrder', Number(e.target.value))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleSaveAct} disabled={createActMut.isPending || updateActMut.isPending || !actDraft.name.trim()} className={BTN_GOLD}>
              <Check className="h-3.5 w-3.5" />{createActMut.isPending || updateActMut.isPending ? 'Saving…' : editingAct ? 'Save Changes' : 'Add Activity'}
            </button>
            <button onClick={closeActModal} className={BTN_GHOST}><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
