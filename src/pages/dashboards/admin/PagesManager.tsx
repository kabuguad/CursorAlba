import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, ChevronRight, Save, Globe, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contentService } from '../../../services/contentService'
import type { CmsPage, CmsBlock } from '../../../services/contentService'
import { unwrap } from '../../../services/mockApi'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { cn } from '../../../lib/utils'

function BlockField({
  block,
  value,
  onChange,
}: {
  block: CmsBlock
  value: string
  onChange: (v: string) => void
}) {
  if (block.type === 'textarea') {
    return (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field resize-none"
        placeholder={block.label}
      />
    )
  }
  if (block.type === 'image') {
    return (
      <div className="space-y-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field"
          placeholder="https://example.com/image.jpg"
        />
        {value && (
          <img
            src={value}
            alt="Preview"
            className="h-28 w-full rounded-xl object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>
    )
  }
  if (block.type === 'list') {
    return (
      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field resize-none font-mono text-xs"
        placeholder="One item per line"
      />
    )
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="field"
      placeholder={block.label}
    />
  )
}

export function PagesManager() {
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['pg-cocurr']))
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const { data: pages = [] } = useQuery({
    queryKey: ['cms-pages'],
    queryFn: () => contentService.listCmsPages().then(unwrap),
    staleTime: 60_000,
  })

  const { data: blocks = [], isFetching: blocksLoading } = useQuery({
    queryKey: ['cms-blocks', selectedPageId],
    queryFn: () => contentService.getCmsBlocks(selectedPageId!).then(unwrap),
    enabled: !!selectedPageId,
    staleTime: 30_000,
  })

  const togglePublish = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      contentService.updateCmsPage(id, { isPublished }).then(unwrap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] })
      showToast('Page visibility updated')
    },
  })

  const saveBlock = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      contentService.updateCmsBlock(id, value).then(unwrap),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['cms-blocks', updated.pageId] })
      setSavedIds((prev) => new Set([...prev, updated.id]))
      setTimeout(() => setSavedIds((prev) => { const n = new Set(prev); n.delete(updated.id); return n }), 2000)
    },
  })

  useEffect(() => {
    setDrafts({})
    setSavedIds(new Set())
  }, [selectedPageId])

  const topLevel = pages.filter((p) => p.parentId === null).sort((a, b) => a.sortOrder - b.sortOrder)
  const children = (parentId: string) =>
    pages.filter((p) => p.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder)
  const hasChildren = (id: string) => pages.some((p) => p.parentId === id)

  const selectedPage = pages.find((p) => p.id === selectedPageId) ?? null

  const getDraft = (block: CmsBlock) => (block.id in drafts ? drafts[block.id] : block.value)

  const isDirty = blocks.some((b) => b.id in drafts && drafts[b.id] !== b.value)

  const saveAll = async () => {
    const changed = blocks.filter((b) => b.id in drafts && drafts[b.id] !== b.value)
    if (changed.length === 0) {
      showToast('No changes to save')
      return
    }
    await Promise.all(changed.map((b) => saveBlock.mutateAsync({ id: b.id, value: drafts[b.id] })))
    showToast(`Saved ${changed.length} field${changed.length > 1 ? 's' : ''} on ${selectedPage?.title}`)
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function PageTreeItem({ page, depth = 0 }: { page: CmsPage; depth?: number }) {
    const isSelected = selectedPageId === page.id
    const expanded = expandedIds.has(page.id)
    const kids = children(page.id)
    const hasSubs = hasChildren(page.id)
    const pub = page.isPublished

    return (
      <div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 transition cursor-pointer select-none',
            isSelected
              ? 'bg-primary/15 dark:bg-gold/15 text-primary dark:text-gold font-semibold'
              : 'hover:bg-tint/60 dark:hover:bg-dark-card/80',
            depth > 0 && 'ml-5 border-l border-theme/40 pl-3',
          )}
          onClick={() => {
            setSelectedPageId(page.id)
            if (hasSubs) toggleExpand(page.id)
          }}
        >
          <span className="text-base">{page.icon}</span>
          <span className="flex-1 text-sm">{page.title}</span>
          {!pub && <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">DRAFT</span>}
          {hasSubs && (
            <ChevronRight className={cn('h-3.5 w-3.5 transition-transform text-muted', expanded && 'rotate-90')} />
          )}
        </div>
        {hasSubs && expanded && (
          <div className="mt-0.5 space-y-0.5">
            {kids.map((child) => (
              <PageTreeItem key={child.id} page={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* ── Sidebar: Page Tree ── */}
      <aside className="hidden w-64 flex-shrink-0 flex-col overflow-y-auto border-r border-theme bg-surface md:flex">
        <div className="border-b border-theme px-4 py-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gold" />
            <span className="font-bold text-sm">Site Pages</span>
          </div>
          <p className="mt-1 text-xs text-muted">Select a page to edit its content</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {topLevel.map((page) => (
            <PageTreeItem key={page.id} page={page} />
          ))}
        </nav>
      </aside>

      {/* ── Main: Block Editor ── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {!selectedPage ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <Globe className="h-12 w-12 text-muted opacity-40" />
            <div>
              <p className="text-lg font-semibold">Select a page</p>
              <p className="text-sm text-muted">Choose a page from the left panel to edit its content blocks.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-theme px-6 py-4 bg-surface">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedPage.icon}</span>
                <div>
                  <h1 className="text-base font-bold">{selectedPage.title}</h1>
                  <p className="text-xs text-muted font-mono">{selectedPage.path}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish.mutate({ id: selectedPage.id, isPublished: !selectedPage.isPublished })}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition',
                    selectedPage.isPublished
                      ? 'bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25',
                  )}
                >
                  {selectedPage.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {selectedPage.isPublished ? 'Published' : 'Draft'}
                </button>
                <Link
                  to={selectedPage.path}
                  target="_blank"
                  className="flex items-center gap-1.5 rounded-xl border border-theme px-3 py-1.5 text-xs font-semibold transition hover:border-gold/50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Preview
                </Link>
                <Button
                  variant={isDirty ? 'primary' : 'outline'}
                  onClick={saveAll}
                  disabled={saveBlock.isPending}
                  className="flex items-center gap-1.5 text-xs px-4 py-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saveBlock.isPending ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </div>

            {/* Block list */}
            <div className="flex-1 overflow-y-auto p-6">
              {blocksLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl bg-tint/60 dark:bg-dark-card" />
                  ))}
                </div>
              ) : blocks.length === 0 ? (
                <GlassCard className="p-10 text-center">
                  <p className="text-muted">No content blocks configured for this page.</p>
                  <p className="mt-1 text-xs text-muted">Blog posts are managed via the Blog Posts menu.</p>
                </GlassCard>
              ) : (
                <div className="space-y-4 max-w-3xl">
                  {blocks.map((block) => {
                    const val = getDraft(block)
                    const changed = block.id in drafts && drafts[block.id] !== block.value
                    const saved = savedIds.has(block.id)
                    return (
                      <GlassCard key={block.id} className={cn('p-5 transition-all', changed && 'border-gold/40')}>
                        <div className="mb-2 flex items-center gap-2">
                          <label className="text-sm font-semibold">{block.label}</label>
                          {changed && !saved && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              Unsaved
                            </span>
                          )}
                          {saved && (
                            <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-600 dark:text-green-400">
                              <CheckCircle className="h-3 w-3" /> Saved
                            </span>
                          )}
                          <span className="ml-auto rounded bg-tint/60 dark:bg-dark-card px-2 py-0.5 font-mono text-[10px] text-muted">
                            {block.type}
                          </span>
                        </div>
                        {block.helpText && (
                          <p className="mb-2 text-xs text-muted">{block.helpText}</p>
                        )}
                        <BlockField
                          block={block}
                          value={val}
                          onChange={(v) => setDrafts((prev) => ({ ...prev, [block.id]: v }))}
                        />
                        {changed && (
                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              className="text-xs text-muted hover:text-foreground transition"
                              onClick={() => setDrafts((prev) => { const n = { ...prev }; delete n[block.id]; return n })}
                            >
                              Reset
                            </button>
                            <button
                              className="text-xs font-semibold text-primary dark:text-gold hover:underline transition"
                              onClick={() => saveBlock.mutate({ id: block.id, value: val })}
                            >
                              Save this field
                            </button>
                          </div>
                        )}
                      </GlassCard>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
