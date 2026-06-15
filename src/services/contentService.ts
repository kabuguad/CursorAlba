import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { MediaAsset, PublicBlogPost, PublicEvent, PublicGalleryImage, PublicProgramLevel, PublicFeeRow, PublicTeacher, SportFixture, CmsPage, CmsBlock, CmsBlockType, AboutCoreValue, AboutHistoryItem } from './db'
import { addAudit } from './auditService'

export type { MediaAsset, PublicBlogPost, PublicEvent, PublicGalleryImage, PublicProgramLevel, PublicFeeRow, PublicTeacher, SportFixture, CmsPage, CmsBlock, CmsBlockType, AboutCoreValue, AboutHistoryItem }

export const contentService = {
  // Media Library
  listMedia: () => mockGet(() => getDB().mediaAssets.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))),

  uploadMedia: (data: { name: string; url: string; type: MediaAsset['type']; size: string; category: string; uploadedBy: string }) => mockPost(() => {
    const asset: MediaAsset = {
      id: newId('MDA'),
      ...data,
      uploadedAt: new Date().toISOString(),
      usedIn: [],
    }
    mutateDB(db => { db.mediaAssets.push(asset) })
    addAudit({ action: 'CREATE', resource: 'MediaAsset', resourceId: asset.id, details: `Uploaded: ${asset.name}` })
    return asset
  }),

  deleteMedia: (id: string) => mockDelete(() => {
    mutateDB(db => { db.mediaAssets = db.mediaAssets.filter(a => a.id !== id) })
    addAudit({ action: 'DELETE', resource: 'MediaAsset', resourceId: id, details: 'Media deleted' })
  }),

  // Settings (content-related subset)
  getSettings: () => mockGet(() => getDB().settings),

  updateSettings: (data: Partial<typeof getDB extends () => infer R ? R extends { settings: infer S } ? S : never : never>) => mockPut(() => {
    mutateDB(db => { Object.assign(db.settings, data) })
    addAudit({ action: 'UPDATE', resource: 'Settings', resourceId: null, details: 'School settings updated' })
    return getDB().settings
  }),

  // ── Public Blog Posts ────────────────────────────────────────────────────
  listBlogPosts: () => mockGet(() => [...getDB().publicBlogPosts].sort((a, b) => b.publishedAt?.localeCompare(a.publishedAt ?? '') || b.createdAt.localeCompare(a.createdAt))),

  getBlogPost: (id: string) => mockGet(() => getDB().publicBlogPosts.find(p => p.id === id) ?? null),

  createBlogPost: (dto: Omit<PublicBlogPost, 'id' | 'createdAt' | 'viewCount'>) => mockPost(() => {
    const slug = dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const post: PublicBlogPost = {
      id: newId('PB'),
      ...dto,
      slug,
      viewCount: 0,
      createdAt: new Date().toISOString(),
    }
    mutateDB(db => { db.publicBlogPosts.push(post) })
    addAudit({ action: 'CREATE', resource: 'BlogPost', resourceId: post.id, details: `Created: ${post.title}` })
    return post
  }),

  updateBlogPost: (id: string, dto: Partial<Omit<PublicBlogPost, 'id' | 'createdAt'>>) => mockPut(() => {
    let updated: PublicBlogPost | undefined
    mutateDB(db => {
      const idx = db.publicBlogPosts.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Post not found')
      updated = { ...db.publicBlogPosts[idx], ...dto, id }
      db.publicBlogPosts[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'BlogPost', resourceId: id, details: `Updated: ${updated?.title}` })
    return updated!
  }),

  deleteBlogPost: (id: string) => mockDelete(() => {
    mutateDB(db => { db.publicBlogPosts = db.publicBlogPosts.filter(p => p.id !== id) })
    addAudit({ action: 'DELETE', resource: 'BlogPost', resourceId: id, details: 'Deleted blog post' })
  }),

  toggleBlogPostPublish: (id: string) => mockPut(() => {
    let post: PublicBlogPost | undefined
    mutateDB(db => {
      const p = db.publicBlogPosts.find(x => x.id === id)
      if (!p) throw new Error('Post not found')
      p.isPublished = !p.isPublished
      p.publishedAt = p.isPublished ? new Date().toISOString() : null
      post = p
    })
    addAudit({ action: 'UPDATE', resource: 'BlogPost', resourceId: id, details: `Toggled publish: ${post?.isPublished ? 'published' : 'unpublished'}` })
    return post!
  }),

  // ── Public Events ────────────────────────────────────────────────────────
  listEvents: () => mockGet(() => [...getDB().publicEvents].sort((a, b) => a.startDate.localeCompare(b.startDate))),

  createEvent: (dto: Omit<PublicEvent, 'id' | 'createdAt'>) => mockPost(() => {
    const evt: PublicEvent = { id: newId('EVT'), ...dto, createdAt: new Date().toISOString() }
    mutateDB(db => { db.publicEvents.push(evt) })
    addAudit({ action: 'CREATE', resource: 'Event', resourceId: evt.id, details: `Created: ${evt.title}` })
    return evt
  }),

  updateEvent: (id: string, dto: Partial<Omit<PublicEvent, 'id' | 'createdAt'>>) => mockPut(() => {
    let updated: PublicEvent | undefined
    mutateDB(db => {
      const idx = db.publicEvents.findIndex(e => e.id === id)
      if (idx === -1) throw new Error('Event not found')
      updated = { ...db.publicEvents[idx], ...dto, id }
      db.publicEvents[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'Event', resourceId: id, details: `Updated: ${updated?.title}` })
    return updated!
  }),

  deleteEvent: (id: string) => mockDelete(() => {
    mutateDB(db => { db.publicEvents = db.publicEvents.filter(e => e.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Event', resourceId: id, details: 'Deleted event' })
  }),

  // ── Public Gallery ───────────────────────────────────────────────────────
  listGalleryImages: () => mockGet(() => [...getDB().publicGalleryImages].sort((a, b) => a.sortOrder - b.sortOrder)),

  addGalleryImage: (dto: { url: string; caption?: string; category?: string; isPublic?: boolean }) => mockPost(() => {
    const img: PublicGalleryImage = {
      id: newId('GAL'),
      ...dto,
      sortOrder: getDB().publicGalleryImages.length + 1,
      createdAt: new Date().toISOString(),
    }
    mutateDB(db => { db.publicGalleryImages.push(img) })
    addAudit({ action: 'CREATE', resource: 'GalleryImage', resourceId: img.id, details: `Added image to ${img.category ?? 'gallery'}` })
    return img
  }),

  updateGalleryImage: (id: string, dto: Partial<Omit<PublicGalleryImage, 'id' | 'createdAt'>>) => mockPut(() => {
    let updated: PublicGalleryImage | undefined
    mutateDB(db => {
      const idx = db.publicGalleryImages.findIndex(g => g.id === id)
      if (idx === -1) throw new Error('Image not found')
      updated = { ...db.publicGalleryImages[idx], ...dto, id }
      db.publicGalleryImages[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'GalleryImage', resourceId: id, details: 'Updated gallery image' })
    return updated!
  }),

  deleteGalleryImage: (id: string) => mockDelete(() => {
    mutateDB(db => { db.publicGalleryImages = db.publicGalleryImages.filter(g => g.id !== id) })
    addAudit({ action: 'DELETE', resource: 'GalleryImage', resourceId: id, details: 'Deleted gallery image' })
  }),

  // ── Program Levels ───────────────────────────────────────────────────────
  listProgramLevels: () => mockGet(() => [...getDB().publicProgramLevels].sort((a, b) => a.sortOrder - b.sortOrder)),

  createProgramLevel: (dto: Omit<PublicProgramLevel, 'id' | 'createdAt'>) => mockPost(() => {
    const prog: PublicProgramLevel = { id: newId('PRG'), ...dto, createdAt: new Date().toISOString() }
    mutateDB(db => { db.publicProgramLevels.push(prog) })
    addAudit({ action: 'CREATE', resource: 'ProgramLevel', resourceId: prog.id, details: `Created: ${prog.name}` })
    return prog
  }),

  updateProgramLevel: (id: string, dto: Partial<Omit<PublicProgramLevel, 'id' | 'createdAt'>>) => mockPut(() => {
    let updated: PublicProgramLevel | undefined
    mutateDB(db => {
      const idx = db.publicProgramLevels.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Program not found')
      updated = { ...db.publicProgramLevels[idx], ...dto, id }
      db.publicProgramLevels[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'ProgramLevel', resourceId: id, details: `Updated: ${updated?.name}` })
    return updated!
  }),

  deleteProgramLevel: (id: string) => mockDelete(() => {
    mutateDB(db => { db.publicProgramLevels = db.publicProgramLevels.filter(p => p.id !== id) })
    addAudit({ action: 'DELETE', resource: 'ProgramLevel', resourceId: id, details: 'Deleted program level' })
  }),

  // ── Public Fee Rows ──────────────────────────────────────────────────────
  listPublicFeeRows: () => mockGet(() => [...getDB().publicFeeRows].sort((a, b) => a.sortOrder - b.sortOrder)),

  createPublicFeeRow: (dto: Omit<PublicFeeRow, 'id' | 'total'>) => mockPost(() => {
    const fee: PublicFeeRow = {
      id: newId('FEE'),
      ...dto,
      total: dto.tuition + (dto.transport || 0) + (dto.activities || 0),
    }
    mutateDB(db => { db.publicFeeRows.push(fee) })
    addAudit({ action: 'CREATE', resource: 'PublicFeeRow', resourceId: fee.id, details: `Created fee: ${fee.level}` })
    return fee
  }),

  updatePublicFeeRow: (id: string, dto: Partial<Omit<PublicFeeRow, 'id' | 'total'>>) => mockPut(() => {
    let updated: PublicFeeRow | undefined
    mutateDB(db => {
      const idx = db.publicFeeRows.findIndex(f => f.id === id)
      if (idx === -1) throw new Error('Fee row not found')
      const prev = db.publicFeeRows[idx]
      updated = {
        ...prev,
        ...dto,
        id,
        total: (dto.tuition ?? prev.tuition) + (dto.transport ?? prev.transport) + (dto.activities ?? prev.activities),
      }
      db.publicFeeRows[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'PublicFeeRow', resourceId: id, details: `Updated fee: ${updated?.level}` })
    return updated!
  }),

  deletePublicFeeRow: (id: string) => mockDelete(() => {
    mutateDB(db => { db.publicFeeRows = db.publicFeeRows.filter(f => f.id !== id) })
    addAudit({ action: 'DELETE', resource: 'PublicFeeRow', resourceId: id, details: 'Deleted fee row' })
  }),

  // ── Staff (public-facing) ────────────────────────────────────────────────
  listPublicTeachers: () => mockGet(() => [...getDB().publicTeachers].sort((a, b) => a.name.localeCompare(b.name))),

  addPublicTeacher: (dto: Omit<PublicTeacher, 'id'>) => mockPost(() => {
    const t: PublicTeacher = { id: newId('TCH'), ...dto }
    mutateDB(db => { db.publicTeachers.push(t) })
    addAudit({ action: 'CREATE', resource: 'Teacher', resourceId: t.id, details: `Added teacher: ${t.name}` })
    return t
  }),

  updatePublicTeacher: (id: string, dto: Partial<Omit<PublicTeacher, 'id'>>) => mockPut(() => {
    let updated: PublicTeacher | undefined
    mutateDB(db => {
      const idx = db.publicTeachers.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Teacher not found')
      updated = { ...db.publicTeachers[idx], ...dto, id }
      db.publicTeachers[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'Teacher', resourceId: id, details: `Updated teacher: ${updated?.name}` })
    return updated!
  }),

  deletePublicTeacher: (id: string) => mockDelete(() => {
    mutateDB(db => { db.publicTeachers = db.publicTeachers.filter(t => t.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Teacher', resourceId: id, details: 'Deleted teacher' })
  }),

  // ── Sports Fixtures ──────────────────────────────────────────────────────
  listSportFixtures: () => mockGet(() => [...getDB().publicSportFixtures].sort((a, b) => a.date.localeCompare(b.date))),

  addSportFixture: (dto: Omit<SportFixture, 'id'>) => mockPost(() => {
    const f: SportFixture = { id: newId('FIX'), ...dto }
    mutateDB(db => { db.publicSportFixtures.push(f) })
    addAudit({ action: 'CREATE', resource: 'SportFixture', resourceId: f.id, details: `Added fixture: ${f.sport} vs ${f.opponent}` })
    return f
  }),

  updateSportFixture: (id: string, dto: Partial<Omit<SportFixture, 'id'>>) => mockPut(() => {
    let updated: SportFixture | undefined
    mutateDB(db => {
      const idx = db.publicSportFixtures.findIndex(f => f.id === id)
      if (idx === -1) throw new Error('Fixture not found')
      updated = { ...db.publicSportFixtures[idx], ...dto, id }
      db.publicSportFixtures[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'SportFixture', resourceId: id, details: `Updated fixture: ${updated?.sport}` })
    return updated!
  }),

  deleteSportFixture: (id: string) => mockDelete(() => {
    mutateDB(db => { db.publicSportFixtures = db.publicSportFixtures.filter(f => f.id !== id) })
    addAudit({ action: 'DELETE', resource: 'SportFixture', resourceId: id, details: 'Deleted fixture' })
  }),

  // ── CMS Pages ────────────────────────────────────────────────────────────
  listCmsPages: () => mockGet(() => [...getDB().cmsPages].sort((a, b) => {
    if (a.parentId === null && b.parentId !== null) return -1
    if (a.parentId !== null && b.parentId === null) return 1
    return a.sortOrder - b.sortOrder
  })),

  updateCmsPage: (id: string, dto: Partial<Omit<CmsPage, 'id'>>) => mockPut(() => {
    let updated: CmsPage | undefined
    mutateDB(db => {
      const idx = db.cmsPages.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Page not found')
      updated = { ...db.cmsPages[idx], ...dto }
      db.cmsPages[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'CmsPage', resourceId: id, details: `Updated page: ${updated?.title}` })
    return updated!
  }),

  // ── CMS Blocks ───────────────────────────────────────────────────────────
  getCmsBlocks: (pageId: string) => mockGet(() =>
    [...getDB().cmsBlocks.filter(b => b.pageId === pageId)].sort((a, b) => a.sortOrder - b.sortOrder)
  ),

  updateCmsBlock: (id: string, value: string) => mockPut(() => {
    let updated: CmsBlock | undefined
    mutateDB(db => {
      const idx = db.cmsBlocks.findIndex(b => b.id === id)
      if (idx === -1) throw new Error('Block not found')
      updated = { ...db.cmsBlocks[idx], value }
      db.cmsBlocks[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'CmsBlock', resourceId: id, details: `Updated block: ${updated?.key}` })
    return updated!
  }),

  createCmsBlock: (dto: Omit<CmsBlock, 'id'>) => mockPost(() => {
    const block: CmsBlock = { id: newId('CB'), ...dto }
    mutateDB(db => { db.cmsBlocks.push(block) })
    addAudit({ action: 'CREATE', resource: 'CmsBlock', resourceId: block.id, details: `Created block: ${block.key}` })
    return block
  }),

  deleteCmsBlock: (id: string) => mockDelete(() => {
    mutateDB(db => { db.cmsBlocks = db.cmsBlocks.filter(b => b.id !== id) })
    addAudit({ action: 'DELETE', resource: 'CmsBlock', resourceId: id, details: 'Deleted CMS block' })
  }),

  // ── About — Core Values ──────────────────────────────────────────────────
  listCoreValues: () => mockGet(() =>
    [...getDB().aboutCoreValues].sort((a, b) => a.sortOrder - b.sortOrder)
  ),

  createCoreValue: (dto: Omit<AboutCoreValue, 'id'>) => mockPost(() => {
    const item: AboutCoreValue = { id: newId('CV'), ...dto }
    mutateDB(db => { db.aboutCoreValues.push(item) })
    addAudit({ action: 'CREATE', resource: 'AboutCoreValue', resourceId: item.id, details: `Added core value: ${item.title}` })
    return item
  }),

  updateCoreValue: (id: string, dto: Partial<Omit<AboutCoreValue, 'id'>>) => mockPut(() => {
    let updated: AboutCoreValue | undefined
    mutateDB(db => {
      const idx = db.aboutCoreValues.findIndex(v => v.id === id)
      if (idx === -1) throw new Error('Core value not found')
      updated = { ...db.aboutCoreValues[idx], ...dto }
      db.aboutCoreValues[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'AboutCoreValue', resourceId: id, details: `Updated core value: ${updated?.title}` })
    return updated!
  }),

  deleteCoreValue: (id: string) => mockDelete(() => {
    mutateDB(db => { db.aboutCoreValues = db.aboutCoreValues.filter(v => v.id !== id) })
    addAudit({ action: 'DELETE', resource: 'AboutCoreValue', resourceId: id, details: 'Deleted core value' })
  }),

  // ── About — History Items ────────────────────────────────────────────────
  listHistoryItems: () => mockGet(() =>
    [...getDB().aboutHistoryItems].sort((a, b) => a.sortOrder - b.sortOrder)
  ),

  createHistoryItem: (dto: Omit<AboutHistoryItem, 'id'>) => mockPost(() => {
    const item: AboutHistoryItem = { id: newId('HI'), ...dto }
    mutateDB(db => { db.aboutHistoryItems.push(item) })
    addAudit({ action: 'CREATE', resource: 'AboutHistoryItem', resourceId: item.id, details: `Added history item: ${item.year} ${item.title}` })
    return item
  }),

  updateHistoryItem: (id: string, dto: Partial<Omit<AboutHistoryItem, 'id'>>) => mockPut(() => {
    let updated: AboutHistoryItem | undefined
    mutateDB(db => {
      const idx = db.aboutHistoryItems.findIndex(h => h.id === id)
      if (idx === -1) throw new Error('History item not found')
      updated = { ...db.aboutHistoryItems[idx], ...dto }
      db.aboutHistoryItems[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'AboutHistoryItem', resourceId: id, details: `Updated history item: ${updated?.year}` })
    return updated!
  }),

  deleteHistoryItem: (id: string) => mockDelete(() => {
    mutateDB(db => { db.aboutHistoryItems = db.aboutHistoryItems.filter(h => h.id !== id) })
    addAudit({ action: 'DELETE', resource: 'AboutHistoryItem', resourceId: id, details: 'Deleted history item' })
  }),
}
