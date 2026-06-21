import axios from 'axios'

const BASE = 'https://yoko-unresourceful-coretta.ngrok-free.dev/api'

const client = axios.create({
  baseURL: BASE,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

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

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    for (const key of ['data', 'items', 'value', 'results']) {
      if (Array.isArray(obj[key])) return obj[key] as T[]
    }
  }
  return []
}

function toItem<T>(raw: unknown): T {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if ('data' in obj && obj.data && typeof obj.data === 'object') return obj.data as T
  }
  return raw as T
}

// ── About Page Content ──────────────────────────────────────────────────────
export type AboutPageContentCreateDto = Omit<AboutPageContent, 'id'>
export type AboutPageContentUpdateDto = Partial<AboutPageContentCreateDto>

// ── Core Values ─────────────────────────────────────────────────────────────
export type CoreValueCreateDto = Omit<CoreValue, 'id'>
export type CoreValueUpdateDto = Partial<CoreValueCreateDto>

// ── History Milestones ───────────────────────────────────────────────────────
export type HistoryMilestoneCreateDto = Omit<HistoryMilestone, 'id'>
export type HistoryMilestoneUpdateDto = Partial<HistoryMilestoneCreateDto>

export const aboutApi = {
  // ── About Page Content ────────────────────────────────────────────────────
  getPageContent: (): Promise<AboutPageContent[]> =>
    client.get('/about-page-content').then((r) => toArray<AboutPageContent>(r.data)),

  createPageContent: (dto: AboutPageContentCreateDto): Promise<AboutPageContent> =>
    client.post('/about-page-content', dto).then((r) => toItem<AboutPageContent>(r.data)),

  updatePageContent: (id: number, dto: AboutPageContentUpdateDto): Promise<AboutPageContent> =>
    client.put(`/about-page-content/${id}`, dto).then((r) => toItem<AboutPageContent>(r.data)),

  deletePageContent: (id: number): Promise<void> =>
    client.delete(`/about-page-content/${id}`).then(() => undefined),

  // ── Core Values ───────────────────────────────────────────────────────────
  getCoreValues: (): Promise<CoreValue[]> =>
    client.get('/core-values').then((r) => toArray<CoreValue>(r.data)),

  createCoreValue: (dto: CoreValueCreateDto): Promise<CoreValue> =>
    client.post('/core-values', dto).then((r) => toItem<CoreValue>(r.data)),

  updateCoreValue: (id: number, dto: CoreValueUpdateDto): Promise<CoreValue> =>
    client.put(`/core-values/${id}`, dto).then((r) => toItem<CoreValue>(r.data)),

  deleteCoreValue: (id: number): Promise<void> =>
    client.delete(`/core-values/${id}`).then(() => undefined),

  // ── History Milestones ────────────────────────────────────────────────────
  getHistoryMilestones: (): Promise<HistoryMilestone[]> =>
    client.get('/history-milestones').then((r) => toArray<HistoryMilestone>(r.data)),

  createHistoryMilestone: (dto: HistoryMilestoneCreateDto): Promise<HistoryMilestone> =>
    client.post('/history-milestones', dto).then((r) => toItem<HistoryMilestone>(r.data)),

  updateHistoryMilestone: (id: number, dto: HistoryMilestoneUpdateDto): Promise<HistoryMilestone> =>
    client.put(`/history-milestones/${id}`, dto).then((r) => toItem<HistoryMilestone>(r.data)),

  deleteHistoryMilestone: (id: number): Promise<void> =>
    client.delete(`/history-milestones/${id}`).then(() => undefined),
}
