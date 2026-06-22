import axios, { type AxiosError } from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Response helpers (same pattern as aboutApi) ───────────────────────────────

function unwrapData(raw: unknown): unknown {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['data', 'items', 'value', 'results']) {
      if (obj[key] !== undefined) return obj[key]
    }
  }
  return raw
}

function normalizeId<T>(item: unknown, idField: string): T {
  if (!item || typeof item !== 'object') return item as T
  const obj = item as Record<string, unknown>
  if (idField in obj && !('id' in obj)) return { ...obj, id: obj[idField] } as T
  return obj as T
}

function toList<T>(raw: unknown, idField: string): T[] {
  const payload = unwrapData(raw)
  const arr = Array.isArray(payload) ? payload : []
  return arr.map((item) => normalizeId<T>(item, idField))
}

function toOne<T>(raw: unknown, idField: string): T {
  return normalizeId<T>(unwrapData(raw), idField)
}

export function apiErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ message?: string; title?: string; errors?: Record<string, string[]> }>
  if (e.response?.data) {
    const d = e.response.data
    if (d.errors) return Object.values(d.errors).flat().join('; ')
    if (d.message) return d.message
    if (d.title) return d.title
    if (typeof d === 'string') return d
  }
  return (e as Error).message ?? 'Unknown error'
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AcademicsPageContent {
  id: number
  headline: string
  subheadline: string
  ctaHeadline: string
  ctaSubtext: string
}

export interface CbcCompetency {
  id: number
  icon: string
  title: string
  description: string
  isFeatured: boolean
  sortOrder: number
}

export interface TeachingPillar {
  id: number
  icon: string
  title: string
  description: string
  gradient: string
  sortOrder: number
}

export interface SchoolLevel {
  id: number
  slug: string
  name: string
  ages: string
  icon: string
  colorKey: string
  desc: string
  highlights: string
  sortOrder: number
}

// ── DTOs ─────────────────────────────────────────────────────────────────────

export type AcademicsPageContentCreateDto = Omit<AcademicsPageContent, 'id'>
export type AcademicsPageContentUpdateDto = Partial<AcademicsPageContentCreateDto>

export type CbcCompetencyCreateDto = Omit<CbcCompetency, 'id'>
export type CbcCompetencyUpdateDto = Partial<CbcCompetencyCreateDto>

export type TeachingPillarCreateDto = Omit<TeachingPillar, 'id'>
export type TeachingPillarUpdateDto = Partial<TeachingPillarCreateDto>

export type SchoolLevelCreateDto = Omit<SchoolLevel, 'id'>
export type SchoolLevelUpdateDto = Partial<SchoolLevelCreateDto>

// ── API ───────────────────────────────────────────────────────────────────────

export const academicsApi = {

  // ── Academics Page Content ─────────────────────────────────────────────────

  getPageContent: (): Promise<AcademicsPageContent[]> =>
    client.get('/academics-page-content').then((r) =>
      toList<AcademicsPageContent>(r.data, 'academicsPageContentId')),

  createPageContent: (dto: AcademicsPageContentCreateDto): Promise<AcademicsPageContent> =>
    client.post('/academics-page-content', dto).then((r) =>
      toOne<AcademicsPageContent>(r.data, 'academicsPageContentId')),

  updatePageContent: (id: number, dto: AcademicsPageContentUpdateDto): Promise<AcademicsPageContent> =>
    client.put(`/academics-page-content/${id}`, dto).then((r) =>
      toOne<AcademicsPageContent>(r.data, 'academicsPageContentId')),

  deletePageContent: (id: number): Promise<void> =>
    client.delete(`/academics-page-content/${id}`).then(() => undefined),

  // ── CBC Competencies — "Our Approach" section ──────────────────────────────

  getCompetencies: (): Promise<CbcCompetency[]> =>
    client.get('/cbc-competencies').then((r) =>
      toList<CbcCompetency>(r.data, 'cbcCompetencyId')),

  createCompetency: (dto: CbcCompetencyCreateDto): Promise<CbcCompetency> =>
    client.post('/cbc-competencies', dto).then((r) =>
      toOne<CbcCompetency>(r.data, 'cbcCompetencyId')),

  updateCompetency: (id: number, dto: CbcCompetencyUpdateDto): Promise<CbcCompetency> =>
    client.put(`/cbc-competencies/${id}`, dto).then((r) =>
      toOne<CbcCompetency>(r.data, 'cbcCompetencyId')),

  deleteCompetency: (id: number): Promise<void> =>
    client.delete(`/cbc-competencies/${id}`).then(() => undefined),

  // ── Teaching Pillars — "How We Teach" section ─────────────────────────────

  getPillars: (): Promise<TeachingPillar[]> =>
    client.get('/teaching-pillars').then((r) =>
      toList<TeachingPillar>(r.data, 'teachingPillarId')),

  createPillar: (dto: TeachingPillarCreateDto): Promise<TeachingPillar> =>
    client.post('/teaching-pillars', dto).then((r) =>
      toOne<TeachingPillar>(r.data, 'teachingPillarId')),

  updatePillar: (id: number, dto: TeachingPillarUpdateDto): Promise<TeachingPillar> =>
    client.put(`/teaching-pillars/${id}`, dto).then((r) =>
      toOne<TeachingPillar>(r.data, 'teachingPillarId')),

  deletePillar: (id: number): Promise<void> =>
    client.delete(`/teaching-pillars/${id}`).then(() => undefined),

  // ── School Levels — "School Structure" section ─────────────────────────────

  getSchoolLevels: (): Promise<SchoolLevel[]> =>
    client.get('/academics-page-content/school-levels').then((r) =>
      toList<SchoolLevel>(r.data, 'schoolLevelId')),

  createSchoolLevel: (dto: SchoolLevelCreateDto): Promise<SchoolLevel> =>
    client.post('/academics-page-content/school-levels', dto).then((r) =>
      toOne<SchoolLevel>(r.data, 'schoolLevelId')),

  updateSchoolLevel: (id: number, dto: SchoolLevelUpdateDto): Promise<SchoolLevel> =>
    client.put(`/academics-page-content/school-levels/${id}`, dto).then((r) =>
      toOne<SchoolLevel>(r.data, 'schoolLevelId')),

  deleteSchoolLevel: (id: number): Promise<void> =>
    client.delete(`/academics-page-content/school-levels/${id}`).then(() => undefined),
}
