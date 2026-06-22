import axios, { type AxiosError } from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Response helpers ──────────────────────────────────────────────────────────

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

export function coCurrApiError(err: unknown): string {
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

export interface CoCurrPageContent {
  id: number
  headline: string
  subheadline: string
  ctaHeadline: string
  ctaSubtext: string
}

export interface CoCurrCategory {
  id: number
  icon: string
  title: string
  heading: string
  intro: string
  sortOrder: number
  cocurrPageContentId: number
}

export interface CoCurrActivity {
  id: number
  icon: string
  name: string
  description: string
  sortOrder: number
  cocurrCategoryId: number
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export type CoCurrPageContentDto = Omit<CoCurrPageContent, 'id'>
export type CoCurrCategoryDto    = Omit<CoCurrCategory, 'id'>
export type CoCurrActivityDto    = Omit<CoCurrActivity, 'id'>

// ── API ───────────────────────────────────────────────────────────────────────

export const coCurrApi = {

  // ── Page Content ────────────────────────────────────────────────────────────

  getPageContent: (): Promise<CoCurrPageContent[]> =>
    client.get('/co-curricular-page-content').then((r) =>
      toList<CoCurrPageContent>(r.data, 'cocurrPageContentId')),

  updatePageContent: (id: number, dto: Partial<CoCurrPageContentDto>): Promise<CoCurrPageContent> =>
    client.put(`/co-curricular-page-content/${id}`, dto).then((r) =>
      toOne<CoCurrPageContent>(r.data, 'cocurrPageContentId')),

  // ── Categories ──────────────────────────────────────────────────────────────

  getCategories: (): Promise<CoCurrCategory[]> =>
    client.get('/co-curricular-categories').then((r) =>
      toList<CoCurrCategory>(r.data, 'cocurrCategoryId')),

  createCategory: (dto: CoCurrCategoryDto): Promise<CoCurrCategory> =>
    client.post('/co-curricular-categories', dto).then((r) =>
      toOne<CoCurrCategory>(r.data, 'cocurrCategoryId')),

  updateCategory: (id: number, dto: Partial<CoCurrCategoryDto>): Promise<CoCurrCategory> =>
    client.put(`/co-curricular-categories/${id}`, dto).then((r) =>
      toOne<CoCurrCategory>(r.data, 'cocurrCategoryId')),

  deleteCategory: (id: number): Promise<void> =>
    client.delete(`/co-curricular-categories/${id}`).then(() => undefined),

  // ── Activities ──────────────────────────────────────────────────────────────

  getActivities: (): Promise<CoCurrActivity[]> =>
    client.get('/co-curricular-activities').then((r) =>
      toList<CoCurrActivity>(r.data, 'cocurrActivityId')),

  createActivity: (dto: CoCurrActivityDto): Promise<CoCurrActivity> =>
    client.post('/co-curricular-activities', dto).then((r) =>
      toOne<CoCurrActivity>(r.data, 'cocurrActivityId')),

  updateActivity: (id: number, dto: Partial<CoCurrActivityDto>): Promise<CoCurrActivity> =>
    client.put(`/co-curricular-activities/${id}`, dto).then((r) =>
      toOne<CoCurrActivity>(r.data, 'cocurrActivityId')),

  deleteActivity: (id: number): Promise<void> =>
    client.delete(`/co-curricular-activities/${id}`).then(() => undefined),
}
