import { unwrap } from './mockApi'
import { contentService } from './contentService'

export interface ApiBlogPost {
  id: number
  title: string
  slug: string
  content: string
  summary: string | null
  coverImageUrl: string | null
  authorId: string | null
  isPublished: boolean
  publishedAt: string | null
  viewCount: number
  createdAt: string
}

export interface ApiEvent {
  id: number
  title: string
  description: string | null
  startDate: string
  endDate: string
  location: string | null
  imageUrl: string | null
  isPublished: boolean
  eventType: string | null
  isPast: boolean
}

export interface ApiGalleryImage {
  id: number
  url: string
  caption: string | null
  category: string | null
  sortOrder: number
  isPublic: boolean
  createdAt: string
}

export interface ApiApplication {
  id: string
  childFirstName: string
  childLastName: string
  dob: string
  gender: string
  applyingForGrade: string
  applyingForClassId: number | null
  previousSchool: string | null
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentRelationship: string
  address: string
  documents: string[]
  status: string
  notes: string
  submittedDate: string
  assignedTo: string | null
  reviewedAt: string | null
}

export interface ApiStaffMember {
  id: string
  userId: number
  firstName: string
  lastName: string
  email: string
  qualification: string | null
  specialization: string | null
  hireDate: string | null
  role: string
  status: string
}

export interface ApiStudent {
  id: string
  userId: number
  firstName: string
  lastName: string
  email: string
  classId: number
  className: string
  classSection: string
  parentId: number | null
  parentName: string
  dateOfBirth: string | null
  gender: string | null
  address: string | null
}

export interface ApiClass {
  id: number
  name: string
  section: string | null
  fullName: string
  description: string | null
  studentCount: number
}

export interface ApiSubject {
  id: number
  name: string
  code: string | null
  classId: number
  className: string
  classSection: string
}

export interface ApiFeeStructure {
  id: number
  name: string
  amount: number
  term: string | null
  academicYear: string | null
  classId: number
  className: string
  feeType: string | null
  dueDate: string
  status: string
}

import type { PublicBlogPost, PublicEvent, PublicGalleryImage } from './db'

function toApiBlogPost(p: PublicBlogPost): ApiBlogPost {
  return {
    id: Number(String(p.id).replace(/\D/g, '').slice(-6) || '0'),
    title: p.title,
    slug: p.slug,
    content: p.content,
    summary: p.excerpt as string | null,
    coverImageUrl: p.coverImageUrl,
    authorId: null,
    isPublished: p.isPublished,
    publishedAt: p.publishedAt,
    viewCount: p.viewCount,
    createdAt: p.createdAt,
  }
}

function toApiEvent(e: PublicEvent): ApiEvent {
  return {
    id: Number(String(e.id).replace(/\D/g, '').slice(-6) || '0'),
    title: e.title,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    location: e.location,
    imageUrl: e.imageUrl,
    isPublished: e.isPublished,
    eventType: e.eventType,
    isPast: e.isPast,
  }
}

function toApiGalleryImage(g: PublicGalleryImage): ApiGalleryImage {
  return {
    id: Number(String(g.id).replace(/\D/g, '').slice(-6) || '0'),
    url: g.url,
    caption: g.caption,
    category: g.category,
    sortOrder: g.sortOrder,
    isPublic: g.isPublic,
    createdAt: g.createdAt,
  }
}

const blog = {
  getAll: () => contentService.listBlogPosts().then(r => unwrap(r).map(toApiBlogPost)),
  getById: (id: number) => contentService.getBlogPost(String(id)).then(r => unwrap(r)).then(p => p ? toApiBlogPost(p) : null),
  create: (dto: { title: string; content: string; summary?: string; coverImageUrl?: string; author?: string; isPublished: boolean; category?: string }) =>
    contentService.createBlogPost({
      title: dto.title,
      slug: dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content: dto.content,
      excerpt: dto.summary ?? '',
      coverImageUrl: dto.coverImageUrl ?? null,
      author: dto.author ?? '',
      category: dto.category ?? '',
      isPublished: dto.isPublished,
      publishedAt: dto.isPublished ? new Date().toISOString() : null,
    }).then(r => unwrap(r)).then(toApiBlogPost),
  update: (id: number, dto: { title: string; content: string; summary?: string; coverImageUrl?: string; author?: string; isPublished: boolean; category?: string }) =>
    contentService.updateBlogPost(String(id), {
      title: dto.title,
      content: dto.content,
      excerpt: dto.summary ?? '',
      coverImageUrl: dto.coverImageUrl ?? null,
      author: dto.author ?? '',
      category: dto.category ?? '',
      isPublished: dto.isPublished,
    }).then(r => unwrap(r)).then(toApiBlogPost),
  delete: (id: number) => contentService.deleteBlogPost(String(id)).then(r => unwrap(r)),
  togglePublish: (id: number) => contentService.toggleBlogPostPublish(String(id)).then(r => unwrap(r)).then(toApiBlogPost),
}

const events = {
  getAll: () => contentService.listEvents().then(r => unwrap(r).map(toApiEvent)),
  create: (dto: { title: string; description?: string; startDate: string; endDate?: string; location?: string; imageUrl?: string; isPublished: boolean; eventType?: string }) =>
    contentService.createEvent({
      title: dto.title,
      description: dto.description ?? null,
      startDate: dto.startDate,
      endDate: dto.endDate ?? dto.startDate,
      location: dto.location ?? null,
      imageUrl: dto.imageUrl ?? null,
      isPublished: dto.isPublished,
      isPast: new Date(dto.startDate) < new Date(),
      eventType: dto.eventType ?? null,
    }).then(r => unwrap(r)).then(toApiEvent),
  update: (id: number, dto: { title: string; description?: string; startDate: string; endDate?: string; location?: string; imageUrl?: string; isPublished: boolean; eventType?: string }) =>
    contentService.updateEvent(String(id), {
      title: dto.title,
      description: dto.description ?? null,
      startDate: dto.startDate,
      endDate: dto.endDate ?? dto.startDate,
      location: dto.location ?? null,
      imageUrl: dto.imageUrl ?? null,
      isPublished: dto.isPublished,
      isPast: new Date(dto.startDate) < new Date(),
      eventType: dto.eventType ?? null,
    }).then(r => unwrap(r)).then(toApiEvent),
  delete: (id: number) => contentService.deleteEvent(String(id)).then(r => unwrap(r)),
}

const gallery = {
  getAll: () => contentService.listGalleryImages().then(r => unwrap(r).map(toApiGalleryImage)),
  add: (dto: { url: string; caption?: string; category?: string; sortOrder?: number; isPublic?: boolean }) =>
    contentService.addGalleryImage({
      url: dto.url,
      caption: dto.caption,
      category: dto.category ?? 'Campus',
      isPublic: dto.isPublic ?? true,
    }).then(r => unwrap(r)).then(toApiGalleryImage),
  update: (id: number, dto: { url: string; caption?: string; category?: string; sortOrder?: number; isPublic?: boolean }) =>
    contentService.updateGalleryImage(String(id), dto).then(r => unwrap(r)).then(toApiGalleryImage),
  delete: (id: number) => contentService.deleteGalleryImage(String(id)).then(r => unwrap(r)),
}

const upload = {
  uploadFile: async (_file: File, _folder?: string): Promise<string> => {
    throw new Error('File upload requires a real backend. Use image URL in the CMS.')
  },
  deleteFile: (_fileUrl: string) => Promise.resolve({} as any),
}

const admissions = {
  getAll: () => Promise.resolve([]),
  getStats: () => Promise.resolve({ total: 0, pending: 0, reviewing: 0, approved: 0, rejected: 0 }),
  updateStatus: (_id: string, _status: string, _notes?: string) => Promise.resolve({} as any),
  delete: (_id: string) => Promise.resolve({} as any),
}

const staff = {
  getAll: () => Promise.resolve([]),
  create: (_dto: any) => Promise.resolve({} as any),
  update: (_id: string, _dto: any) => Promise.resolve({} as any),
  delete: (_id: string) => Promise.resolve({} as any),
}

const students = {
  getAll: () => Promise.resolve([]),
  create: (_dto: any) => Promise.resolve({} as any),
  update: (_id: string, _dto: any) => Promise.resolve({} as any),
  delete: (_id: string) => Promise.resolve({} as any),
}

const classes = {
  getAll: () => Promise.resolve([]),
  create: (_dto: any) => Promise.resolve({} as any),
  update: (_id: number, _dto: any) => Promise.resolve({} as any),
  delete: (_id: number) => Promise.resolve({} as any),
}

const subjects = {
  getAll: (_classId?: number) => Promise.resolve([]),
  create: (_dto: any) => Promise.resolve({} as any),
  update: (_id: number, _dto: any) => Promise.resolve({} as any),
  delete: (_id: number) => Promise.resolve({} as any),
}

const fees = {
  getAll: () => Promise.resolve([]),
  create: (_dto: any) => Promise.resolve({} as any),
  update: (_id: number, _dto: any) => Promise.resolve({} as any),
  delete: (_id: number) => Promise.resolve({} as any),
}

// ── Site Content ──────────────────────────────────────────────────────────

export interface ApiSiteSetting { key: string; value: string }

export interface ApiProgramLevel {
  id: number
  slug: string
  name: string
  ages: string
  description: string
  imageUrl: string | null
  sortOrder: number
  createdAt: string
}

export interface ApiPublicFeeRow {
  id: number
  level: string
  tuition: number
  transport: number
  activities: number
  total: number
  sortOrder: number
}

const content = {
  getSettings: () =>
    contentService.getSettings().then(_r => [
      { key: 'home.hero.tagline', value: 'Kutus · Kirinyaga County · Est. 2005' },
      { key: 'home.hero.taglineGold', value: 'Where Excellence Meets Tomorrow' },
      { key: 'home.hero.subtitle', value: 'Premium private education in the heart of Kirinyaga.' },
      { key: 'home.hero.directorName', value: 'Mr. Albert Njeru' },
      { key: 'home.hero.directorTitle', value: 'Founder & Director' },
      { key: 'home.hero.directorQuote', value: 'Every child in Kirinyaga deserves an education that changes the trajectory of a family.' },
      { key: 'home.hero.directorCredential', value: 'M.Ed., UoN' },
      { key: 'home.stats.0.label', value: 'Students Enrolled' },
      { key: 'home.stats.0.value', value: '2,000+' },
      { key: 'home.stats.1.label', value: 'Expert Educators' },
      { key: 'home.stats.1.value', value: '120+' },
      { key: 'home.stats.2.label', value: 'School Buses' },
      { key: 'home.stats.2.value', value: '8' },
      { key: 'home.stats.3.label', value: 'Sports Disciplines' },
      { key: 'home.stats.3.value', value: '6' },
      { key: 'about.mission', value: 'To cultivate visionary leaders through innovative, competency-based education...' },
      { key: 'about.vision', value: 'To be East Africa\'s most sought-after private institution...' },
      { key: 'about.history', value: 'Two decades of excellence — from a single campus in Kutus...' },
      { key: 'about.values', value: 'Academic Excellence · Integrity · Global Citizenship · Innovation · Holistic Growth · Sustainability' },
      { key: 'programs.cbcFramework', value: 'Competency-based assessment\nLearner-centered projects\nNational values integration\nCareer pathways from Grade 7\nContinuous assessment portfolios' },
      { key: 'programs.igcseFramework', value: 'Cambridge international standards\nIGCSE & A-Level examinations\nGlobal university recognition\nRigorous external assessment\nCross-cultural curriculum breadth' },
    ]),

  saveSettings: (_settings: ApiSiteSetting[]) =>
    contentService.updateSettings({}).then(r => r),

  getProgramLevels: () =>
    contentService.listProgramLevels().then(r => unwrap(r).map(p => ({
      id: Number(String(p.id).replace(/\D/g, '').slice(-6) || '0'),
      slug: p.slug,
      name: p.name,
      ages: p.ages,
      description: p.description,
      imageUrl: p.imageUrl,
      sortOrder: p.sortOrder,
      createdAt: p.createdAt,
    } as ApiProgramLevel))),

  createProgramLevel: (dto: { slug: string; name: string; ages: string; description: string; imageUrl?: string; sortOrder: number }) =>
    contentService.createProgramLevel({
      slug: dto.slug,
      name: dto.name,
      ages: dto.ages,
      description: dto.description,
      imageUrl: dto.imageUrl ?? null,
      sortOrder: dto.sortOrder,
    }).then(r => unwrap(r)).then(p => ({
      id: Number(String(p.id).replace(/\D/g, '').slice(-6) || '0'),
      slug: p.slug,
      name: p.name,
      ages: p.ages,
      description: p.description,
      imageUrl: p.imageUrl,
      sortOrder: p.sortOrder,
      createdAt: p.createdAt,
    } as ApiProgramLevel)),

  updateProgramLevel: (id: number, dto: { slug: string; name: string; ages: string; description: string; imageUrl?: string; sortOrder: number }) =>
    contentService.updateProgramLevel(String(id), {
      slug: dto.slug,
      name: dto.name,
      ages: dto.ages,
      description: dto.description,
      imageUrl: dto.imageUrl ?? null,
      sortOrder: dto.sortOrder,
    }).then(r => unwrap(r)).then(p => ({
      id: Number(String(p.id).replace(/\D/g, '').slice(-6) || '0'),
      slug: p.slug,
      name: p.name,
      ages: p.ages,
      description: p.description,
      imageUrl: p.imageUrl,
      sortOrder: p.sortOrder,
      createdAt: p.createdAt,
    } as ApiProgramLevel)),

  deleteProgramLevel: (id: number) =>
    contentService.deleteProgramLevel(String(id)),
 

  getPublicFees: () =>
    contentService.listPublicFeeRows().then(r => unwrap(r).map(f => ({
      id: Number(String(f.id).replace(/\D/g, '').slice(-6) || '0'),
      level: f.level,
      tuition: f.tuition,
      transport: f.transport,
      activities: f.activities,
      total: f.total,
      sortOrder: f.sortOrder,
    } as ApiPublicFeeRow))),

  createPublicFeeRow: (dto: { level: string; tuition: number; transport: number; activities: number; sortOrder: number }) =>
    contentService.createPublicFeeRow(dto).then(r => unwrap(r)).then(f => ({
      id: Number(String(f.id).replace(/\D/g, '').slice(-6) || '0'),
      level: f.level,
      tuition: f.tuition,
      transport: f.transport,
      activities: f.activities,
      total: f.total,
      sortOrder: f.sortOrder,
    } as ApiPublicFeeRow)),

  updatePublicFeeRow: (id: number, dto: { level: string; tuition: number; transport: number; activities: number; sortOrder: number }) =>
    contentService.updatePublicFeeRow(String(id), dto).then(r => unwrap(r)).then(f => ({
      id: Number(String(f.id).replace(/\D/g, '').slice(-6) || '0'),
      level: f.level,
      tuition: f.tuition,
      transport: f.transport,
      activities: f.activities,
      total: f.total,
      sortOrder: f.sortOrder,
    } as ApiPublicFeeRow)),

  deletePublicFeeRow: (id: number) =>
    contentService.deletePublicFeeRow(String(id)),
}


export const adminApi = { blog, events, gallery, upload, admissions, staff, students, classes, subjects, fees, content }
