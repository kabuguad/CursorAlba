import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { MediaAsset, PublicBlogPost, PublicEvent, PublicGalleryImage, PublicProgramLevel, PublicFeeRow, PublicTeacher, SportFixture, CmsPage, CmsBlock, CmsBlockType, AboutCoreValue, AboutHistoryItem, AcademicsSchoolLevel, AcademicsCompetency, Facility, CocurrActivity, CocurrCategoryId, SportOffered, SportTrophy, MusicInstrument, MusicTeacher, MusicScheduleSlot, DanceStyle, DramaPlay, DramaFaculty, DramaScheduleSlot } from './db'
import { addAudit } from './auditService'

export type { MediaAsset, PublicBlogPost, PublicEvent, PublicGalleryImage, PublicProgramLevel, PublicFeeRow, PublicTeacher, SportFixture, CmsPage, CmsBlock, CmsBlockType, AboutCoreValue, AboutHistoryItem, AcademicsSchoolLevel, AcademicsCompetency, Facility, CocurrActivity, CocurrCategoryId, SportOffered, SportTrophy, MusicInstrument, MusicTeacher, MusicScheduleSlot, DanceStyle, DramaPlay, DramaFaculty, DramaScheduleSlot }

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

  // ── Academics — School Levels ────────────────────────────────────────────
  listSchoolLevels: () => mockGet(() =>
    [...getDB().academicsSchoolLevels].sort((a, b) => a.sortOrder - b.sortOrder)
  ),

  createSchoolLevel: (dto: Omit<AcademicsSchoolLevel, 'id'>) => mockPost(() => {
    const item: AcademicsSchoolLevel = { id: newId('SL'), ...dto }
    mutateDB(db => { db.academicsSchoolLevels.push(item) })
    addAudit({ action: 'CREATE', resource: 'AcademicsSchoolLevel', resourceId: item.id, details: `Added school level: ${item.name}` })
    return item
  }),

  updateSchoolLevel: (id: string, dto: Partial<Omit<AcademicsSchoolLevel, 'id'>>) => mockPut(() => {
    let updated: AcademicsSchoolLevel | undefined
    mutateDB(db => {
      const idx = db.academicsSchoolLevels.findIndex(s => s.id === id)
      if (idx === -1) throw new Error('School level not found')
      updated = { ...db.academicsSchoolLevels[idx], ...dto }
      db.academicsSchoolLevels[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'AcademicsSchoolLevel', resourceId: id, details: `Updated school level: ${updated?.name}` })
    return updated!
  }),

  deleteSchoolLevel: (id: string) => mockDelete(() => {
    mutateDB(db => { db.academicsSchoolLevels = db.academicsSchoolLevels.filter(s => s.id !== id) })
    addAudit({ action: 'DELETE', resource: 'AcademicsSchoolLevel', resourceId: id, details: 'Deleted school level' })
  }),

  // ── Academics — CBC Competencies ─────────────────────────────────────────
  listCompetencies: () => mockGet(() =>
    [...getDB().academicsCompetencies].sort((a, b) => a.sortOrder - b.sortOrder)
  ),

  createCompetency: (dto: Omit<AcademicsCompetency, 'id'>) => mockPost(() => {
    const item: AcademicsCompetency = { id: newId('AC'), ...dto }
    mutateDB(db => { db.academicsCompetencies.push(item) })
    addAudit({ action: 'CREATE', resource: 'AcademicsCompetency', resourceId: item.id, details: `Added competency: ${item.title}` })
    return item
  }),

  updateCompetency: (id: string, dto: Partial<Omit<AcademicsCompetency, 'id'>>) => mockPut(() => {
    let updated: AcademicsCompetency | undefined
    mutateDB(db => {
      const idx = db.academicsCompetencies.findIndex(c => c.id === id)
      if (idx === -1) throw new Error('Competency not found')
      updated = { ...db.academicsCompetencies[idx], ...dto }
      db.academicsCompetencies[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'AcademicsCompetency', resourceId: id, details: `Updated competency: ${updated?.title}` })
    return updated!
  }),

  deleteCompetency: (id: string) => mockDelete(() => {
    mutateDB(db => { db.academicsCompetencies = db.academicsCompetencies.filter(c => c.id !== id) })
    addAudit({ action: 'DELETE', resource: 'AcademicsCompetency', resourceId: id, details: 'Deleted competency' })
  }),

  // ── Facilities ────────────────────────────────────────────────────────────
  listFacilities: () => mockGet(() =>
    [...getDB().facilities].sort((a, b) => a.sortOrder - b.sortOrder)
  ),

  createFacility: (dto: Omit<Facility, 'id'>) => mockPost(() => {
    const item: Facility = { id: newId('FAC'), ...dto }
    mutateDB(db => { db.facilities.push(item) })
    addAudit({ action: 'CREATE', resource: 'Facility', resourceId: item.id, details: `Added facility: ${item.name}` })
    return item
  }),

  updateFacility: (id: string, dto: Partial<Omit<Facility, 'id'>>) => mockPut(() => {
    let updated: Facility | undefined
    mutateDB(db => {
      const idx = db.facilities.findIndex(f => f.id === id)
      if (idx === -1) throw new Error('Facility not found')
      updated = { ...db.facilities[idx], ...dto }
      db.facilities[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'Facility', resourceId: id, details: `Updated facility: ${updated?.name}` })
    return updated!
  }),

  deleteFacility: (id: string) => mockDelete(() => {
    mutateDB(db => { db.facilities = db.facilities.filter(f => f.id !== id) })
    addAudit({ action: 'DELETE', resource: 'Facility', resourceId: id, details: 'Deleted facility' })
  }),

  // ── Co-Curricular Activities ──────────────────────────────────────────────
  listCocurrActivities: (categoryId?: CocurrCategoryId) => mockGet(() => {
    const all = [...getDB().cocurrActivities].sort((a, b) => a.sortOrder - b.sortOrder)
    return categoryId ? all.filter(a => a.categoryId === categoryId) : all
  }),
  createCocurrActivity: (dto: Omit<CocurrActivity, 'id'>) => mockPost(() => {
    const item: CocurrActivity = { id: newId('CAC'), ...dto }
    mutateDB(db => { db.cocurrActivities.push(item) })
    addAudit({ action: 'CREATE', resource: 'CocurrActivity', resourceId: item.id, details: `Added activity: ${item.name}` })
    return item
  }),
  updateCocurrActivity: (id: string, dto: Partial<Omit<CocurrActivity, 'id'>>) => mockPut(() => {
    let updated: CocurrActivity | undefined
    mutateDB(db => {
      const idx = db.cocurrActivities.findIndex(a => a.id === id)
      if (idx === -1) throw new Error('Activity not found')
      updated = { ...db.cocurrActivities[idx], ...dto }
      db.cocurrActivities[idx] = updated
    })
    addAudit({ action: 'UPDATE', resource: 'CocurrActivity', resourceId: id, details: `Updated activity: ${updated?.name}` })
    return updated!
  }),
  deleteCocurrActivity: (id: string) => mockDelete(() => {
    mutateDB(db => { db.cocurrActivities = db.cocurrActivities.filter(a => a.id !== id) })
    addAudit({ action: 'DELETE', resource: 'CocurrActivity', resourceId: id, details: 'Deleted co-curr activity' })
  }),

  // ── Sports Offered ────────────────────────────────────────────────────────
  listSportsOffered: () => mockGet(() => [...getDB().sportsOffered].sort((a, b) => a.sortOrder - b.sortOrder)),
  createSportOffered: (dto: Omit<SportOffered, 'id'>) => mockPost(() => {
    const item: SportOffered = { id: newId('SO'), ...dto }
    mutateDB(db => { db.sportsOffered.push(item) })
    addAudit({ action: 'CREATE', resource: 'SportOffered', resourceId: item.id, details: `Added sport: ${item.name}` })
    return item
  }),
  updateSportOffered: (id: string, dto: Partial<Omit<SportOffered, 'id'>>) => mockPut(() => {
    let updated: SportOffered | undefined
    mutateDB(db => {
      const idx = db.sportsOffered.findIndex(s => s.id === id)
      if (idx === -1) throw new Error('Sport not found')
      updated = { ...db.sportsOffered[idx], ...dto }
      db.sportsOffered[idx] = updated
    })
    return updated!
  }),
  deleteSportOffered: (id: string) => mockDelete(() => {
    mutateDB(db => { db.sportsOffered = db.sportsOffered.filter(s => s.id !== id) })
    addAudit({ action: 'DELETE', resource: 'SportOffered', resourceId: id, details: 'Deleted sport offered' })
  }),

  // ── Sport Trophies ────────────────────────────────────────────────────────
  listSportTrophies: () => mockGet(() => [...getDB().sportTrophies].sort((a, b) => a.sortOrder - b.sortOrder)),
  createSportTrophy: (dto: Omit<SportTrophy, 'id'>) => mockPost(() => {
    const item: SportTrophy = { id: newId('TR'), ...dto }
    mutateDB(db => { db.sportTrophies.push(item) })
    addAudit({ action: 'CREATE', resource: 'SportTrophy', resourceId: item.id, details: `Added trophy: ${item.title}` })
    return item
  }),
  updateSportTrophy: (id: string, dto: Partial<Omit<SportTrophy, 'id'>>) => mockPut(() => {
    let updated: SportTrophy | undefined
    mutateDB(db => {
      const idx = db.sportTrophies.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Trophy not found')
      updated = { ...db.sportTrophies[idx], ...dto }
      db.sportTrophies[idx] = updated
    })
    return updated!
  }),
  deleteSportTrophy: (id: string) => mockDelete(() => {
    mutateDB(db => { db.sportTrophies = db.sportTrophies.filter(t => t.id !== id) })
    addAudit({ action: 'DELETE', resource: 'SportTrophy', resourceId: id, details: 'Deleted trophy' })
  }),

  // ── Music Instruments ─────────────────────────────────────────────────────
  listMusicInstruments: () => mockGet(() => [...getDB().musicInstruments].sort((a, b) => a.sortOrder - b.sortOrder)),
  createMusicInstrument: (dto: Omit<MusicInstrument, 'id'>) => mockPost(() => {
    const item: MusicInstrument = { id: newId('MI'), ...dto }
    mutateDB(db => { db.musicInstruments.push(item) })
    addAudit({ action: 'CREATE', resource: 'MusicInstrument', resourceId: item.id, details: `Added instrument: ${item.name}` })
    return item
  }),
  updateMusicInstrument: (id: string, dto: Partial<Omit<MusicInstrument, 'id'>>) => mockPut(() => {
    let updated: MusicInstrument | undefined
    mutateDB(db => {
      const idx = db.musicInstruments.findIndex(m => m.id === id)
      if (idx === -1) throw new Error('Instrument not found')
      updated = { ...db.musicInstruments[idx], ...dto }
      db.musicInstruments[idx] = updated
    })
    return updated!
  }),
  deleteMusicInstrument: (id: string) => mockDelete(() => {
    mutateDB(db => { db.musicInstruments = db.musicInstruments.filter(m => m.id !== id) })
    addAudit({ action: 'DELETE', resource: 'MusicInstrument', resourceId: id, details: 'Deleted instrument' })
  }),

  // ── Music Teachers ────────────────────────────────────────────────────────
  listMusicTeachers: () => mockGet(() => [...getDB().musicTeachers].sort((a, b) => a.sortOrder - b.sortOrder)),
  createMusicTeacher: (dto: Omit<MusicTeacher, 'id'>) => mockPost(() => {
    const item: MusicTeacher = { id: newId('MT'), ...dto }
    mutateDB(db => { db.musicTeachers.push(item) })
    addAudit({ action: 'CREATE', resource: 'MusicTeacher', resourceId: item.id, details: `Added teacher: ${item.name}` })
    return item
  }),
  updateMusicTeacher: (id: string, dto: Partial<Omit<MusicTeacher, 'id'>>) => mockPut(() => {
    let updated: MusicTeacher | undefined
    mutateDB(db => {
      const idx = db.musicTeachers.findIndex(t => t.id === id)
      if (idx === -1) throw new Error('Teacher not found')
      updated = { ...db.musicTeachers[idx], ...dto }
      db.musicTeachers[idx] = updated
    })
    return updated!
  }),
  deleteMusicTeacher: (id: string) => mockDelete(() => {
    mutateDB(db => { db.musicTeachers = db.musicTeachers.filter(t => t.id !== id) })
    addAudit({ action: 'DELETE', resource: 'MusicTeacher', resourceId: id, details: 'Deleted music teacher' })
  }),

  // ── Music Schedule ────────────────────────────────────────────────────────
  listMusicScheduleSlots: () => mockGet(() => [...getDB().musicScheduleSlots].sort((a, b) => a.sortOrder - b.sortOrder)),
  createMusicScheduleSlot: (dto: Omit<MusicScheduleSlot, 'id'>) => mockPost(() => {
    const item: MusicScheduleSlot = { id: newId('MS'), ...dto }
    mutateDB(db => { db.musicScheduleSlots.push(item) })
    return item
  }),
  updateMusicScheduleSlot: (id: string, dto: Partial<Omit<MusicScheduleSlot, 'id'>>) => mockPut(() => {
    let updated: MusicScheduleSlot | undefined
    mutateDB(db => {
      const idx = db.musicScheduleSlots.findIndex(s => s.id === id)
      if (idx === -1) throw new Error('Slot not found')
      updated = { ...db.musicScheduleSlots[idx], ...dto }
      db.musicScheduleSlots[idx] = updated
    })
    return updated!
  }),
  deleteMusicScheduleSlot: (id: string) => mockDelete(() => {
    mutateDB(db => { db.musicScheduleSlots = db.musicScheduleSlots.filter(s => s.id !== id) })
  }),

  // ── Dance Styles ──────────────────────────────────────────────────────────
  listDanceStyles: () => mockGet(() => [...getDB().danceStyles].sort((a, b) => a.sortOrder - b.sortOrder)),
  createDanceStyle: (dto: Omit<DanceStyle, 'id'>) => mockPost(() => {
    const item: DanceStyle = { id: newId('DS'), ...dto }
    mutateDB(db => { db.danceStyles.push(item) })
    addAudit({ action: 'CREATE', resource: 'DanceStyle', resourceId: item.id, details: `Added dance style: ${item.style}` })
    return item
  }),
  updateDanceStyle: (id: string, dto: Partial<Omit<DanceStyle, 'id'>>) => mockPut(() => {
    let updated: DanceStyle | undefined
    mutateDB(db => {
      const idx = db.danceStyles.findIndex(d => d.id === id)
      if (idx === -1) throw new Error('Dance style not found')
      updated = { ...db.danceStyles[idx], ...dto }
      db.danceStyles[idx] = updated
    })
    return updated!
  }),
  deleteDanceStyle: (id: string) => mockDelete(() => {
    mutateDB(db => { db.danceStyles = db.danceStyles.filter(d => d.id !== id) })
    addAudit({ action: 'DELETE', resource: 'DanceStyle', resourceId: id, details: 'Deleted dance style' })
  }),

  // ── Drama Plays ───────────────────────────────────────────────────────────
  listDramaPlays: () => mockGet(() => [...getDB().dramaPlays].sort((a, b) => a.sortOrder - b.sortOrder)),
  createDramaPlay: (dto: Omit<DramaPlay, 'id'>) => mockPost(() => {
    const item: DramaPlay = { id: newId('DP'), ...dto }
    mutateDB(db => { db.dramaPlays.push(item) })
    addAudit({ action: 'CREATE', resource: 'DramaPlay', resourceId: item.id, details: `Added play: ${item.title}` })
    return item
  }),
  updateDramaPlay: (id: string, dto: Partial<Omit<DramaPlay, 'id'>>) => mockPut(() => {
    let updated: DramaPlay | undefined
    mutateDB(db => {
      const idx = db.dramaPlays.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Play not found')
      updated = { ...db.dramaPlays[idx], ...dto }
      db.dramaPlays[idx] = updated
    })
    return updated!
  }),
  deleteDramaPlay: (id: string) => mockDelete(() => {
    mutateDB(db => { db.dramaPlays = db.dramaPlays.filter(p => p.id !== id) })
    addAudit({ action: 'DELETE', resource: 'DramaPlay', resourceId: id, details: 'Deleted drama play' })
  }),

  // ── Drama Faculty ─────────────────────────────────────────────────────────
  listDramaFaculty: () => mockGet(() => [...getDB().dramaFaculty].sort((a, b) => a.sortOrder - b.sortOrder)),
  createDramaFaculty: (dto: Omit<DramaFaculty, 'id'>) => mockPost(() => {
    const item: DramaFaculty = { id: newId('DF'), ...dto }
    mutateDB(db => { db.dramaFaculty.push(item) })
    addAudit({ action: 'CREATE', resource: 'DramaFaculty', resourceId: item.id, details: `Added faculty: ${item.name}` })
    return item
  }),
  updateDramaFaculty: (id: string, dto: Partial<Omit<DramaFaculty, 'id'>>) => mockPut(() => {
    let updated: DramaFaculty | undefined
    mutateDB(db => {
      const idx = db.dramaFaculty.findIndex(f => f.id === id)
      if (idx === -1) throw new Error('Faculty not found')
      updated = { ...db.dramaFaculty[idx], ...dto }
      db.dramaFaculty[idx] = updated
    })
    return updated!
  }),
  deleteDramaFaculty: (id: string) => mockDelete(() => {
    mutateDB(db => { db.dramaFaculty = db.dramaFaculty.filter(f => f.id !== id) })
    addAudit({ action: 'DELETE', resource: 'DramaFaculty', resourceId: id, details: 'Deleted drama faculty' })
  }),

  // ── Drama Schedule ────────────────────────────────────────────────────────
  listDramaScheduleSlots: () => mockGet(() => [...getDB().dramaScheduleSlots].sort((a, b) => a.sortOrder - b.sortOrder)),
  createDramaScheduleSlot: (dto: Omit<DramaScheduleSlot, 'id'>) => mockPost(() => {
    const item: DramaScheduleSlot = { id: newId('DSS'), ...dto }
    mutateDB(db => { db.dramaScheduleSlots.push(item) })
    return item
  }),
  updateDramaScheduleSlot: (id: string, dto: Partial<Omit<DramaScheduleSlot, 'id'>>) => mockPut(() => {
    let updated: DramaScheduleSlot | undefined
    mutateDB(db => {
      const idx = db.dramaScheduleSlots.findIndex(s => s.id === id)
      if (idx === -1) throw new Error('Slot not found')
      updated = { ...db.dramaScheduleSlots[idx], ...dto }
      db.dramaScheduleSlots[idx] = updated
    })
    return updated!
  }),
  deleteDramaScheduleSlot: (id: string) => mockDelete(() => {
    mutateDB(db => { db.dramaScheduleSlots = db.dramaScheduleSlots.filter(s => s.id !== id) })
  }),
}
