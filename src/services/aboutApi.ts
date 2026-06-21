import axios, { type AxiosError } from 'axios'

const BASE = 'https://yoko-unresourceful-coretta.ngrok-free.dev/api'

const client = axios.create({
  baseURL: BASE,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

// ── Debug interceptors ───────────────────────────────────────────────────────
client.interceptors.request.use((config) => {
  console.log(`[aboutApi] ▶ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data ?? '')
  return config
})
client.interceptors.response.use(
  (res) => {
    console.log(`[aboutApi] ✅ ${res.config.method?.toUpperCase()} ${res.config.url} → ${res.status}`, res.data)
    return res
  },
  (err: AxiosError) => {
    console.error(`[aboutApi] ❌ ${err.config?.method?.toUpperCase()} ${err.config?.url} → ${err.response?.status}`, err.response?.data ?? err.message)
    return Promise.reject(err)
  },
)

// ── Interfaces ───────────────────────────────────────────────────────────────
export interface AboutPageContent {
  id: number
  headline: string
  subheadline: string
  mission: string
  vision: string
  historyIntro: string
}

export interface CoreValue {
  id: number
  icon: string
  title: string
  description: string
  sortOrder: number
}

export interface HistoryMilestone {
  id: number
  year: string
  title: string
  description: string
  sortOrder: number
}

// ── DTOs ─────────────────────────────────────────────────────────────────────
export type AboutPageContentCreateDto = Omit<AboutPageContent, 'id'>
export type AboutPageContentUpdateDto = Partial<AboutPageContentCreateDto>
export type CoreValueCreateDto = Omit<CoreValue, 'id'>
export type CoreValueUpdateDto = Partial<CoreValueCreateDto>
export type HistoryMilestoneCreateDto = Omit<HistoryMilestone, 'id'>
export type HistoryMilestoneUpdateDto = Partial<HistoryMilestoneCreateDto>

// ── Response helpers ─────────────────────────────────────────────────────────
function unwrapData(raw: unknown): unknown {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['data', 'items', 'value', 'results']) {
      if (obj[key] !== undefined) return obj[key]
    }
  }
  return raw
}

/** Normalise a raw item: alias a vendor-specific ID field (e.g. coreValueId) to `id`. */
function normalizeId<T>(item: unknown, idField: string): T {
  if (!item || typeof item !== 'object') return item as T
  const obj = item as Record<string, unknown>
  if (idField in obj && !('id' in obj)) {
    return { ...obj, id: obj[idField] } as T
  }
  return obj as T
}

function toList<T>(raw: unknown, idField: string): T[] {
  const payload = unwrapData(raw)
  const arr = Array.isArray(payload) ? payload : []
  return arr.map((item) => normalizeId<T>(item, idField))
}

function toOne<T>(raw: unknown, idField: string): T {
  const payload = unwrapData(raw)
  return normalizeId<T>(payload, idField)
}

/** Extracts a human-readable message from an axios error */
export function apiErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ message?: string; title?: string; errors?: Record<string, string[]> }>
  if (e.response?.data) {
    const d = e.response.data
    if (d.errors) return Object.values(d.errors).flat().join('; ')
    if (d.message) return d.message
    if (d.title) return d.title
    if (typeof d === 'string') return d
  }
  return e.message ?? 'Unknown error'
}

// ── API ───────────────────────────────────────────────────────────────────────
export const aboutApi = {
  // About Page Content
  getPageContent: (): Promise<AboutPageContent[]> =>
    client.get('/about-page-content').then((r) => toList<AboutPageContent>(r.data, 'aboutPageContentId')),

  createPageContent: (dto: AboutPageContentCreateDto): Promise<AboutPageContent> =>
    client.post('/about-page-content', dto).then((r) => toOne<AboutPageContent>(r.data, 'aboutPageContentId')),

  updatePageContent: (id: number, dto: AboutPageContentUpdateDto): Promise<AboutPageContent> =>
    client.put(`/about-page-content/${id}`, dto).then((r) => toOne<AboutPageContent>(r.data, 'aboutPageContentId')),

  deletePageContent: (id: number): Promise<void> =>
    client.delete(`/about-page-content/${id}`).then(() => undefined),

  // Core Values
  getCoreValues: (): Promise<CoreValue[]> =>
    client.get('/core-values').then((r) => toList<CoreValue>(r.data, 'coreValueId')),

  createCoreValue: (dto: CoreValueCreateDto): Promise<CoreValue> =>
    client.post('/core-values', dto).then((r) => toOne<CoreValue>(r.data, 'coreValueId')),

  updateCoreValue: (id: number, dto: CoreValueUpdateDto): Promise<CoreValue> =>
    client.put(`/core-values/${id}`, dto).then((r) => toOne<CoreValue>(r.data, 'coreValueId')),

  deleteCoreValue: (id: number): Promise<void> =>
    client.delete(`/core-values/${id}`).then(() => undefined),

  // History Milestones
  getHistoryMilestones: (): Promise<HistoryMilestone[]> =>
    client.get('/history-milestones').then((r) => toList<HistoryMilestone>(r.data, 'historyMilestoneId')),

  createHistoryMilestone: (dto: HistoryMilestoneCreateDto): Promise<HistoryMilestone> =>
    client.post('/history-milestones', dto).then((r) => toOne<HistoryMilestone>(r.data, 'historyMilestoneId')),

  updateHistoryMilestone: (id: number, dto: HistoryMilestoneUpdateDto): Promise<HistoryMilestone> =>
    client.put(`/history-milestones/${id}`, dto).then((r) => toOne<HistoryMilestone>(r.data, 'historyMilestoneId')),

  deleteHistoryMilestone: (id: number): Promise<void> =>
    client.delete(`/history-milestones/${id}`).then(() => undefined),
}
