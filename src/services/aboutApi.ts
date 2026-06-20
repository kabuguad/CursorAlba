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

export const aboutApi = {
  getPageContent: (): Promise<AboutPageContent[]> =>
    client.get('/about-page-content').then((r) => toArray<AboutPageContent>(r.data)),

  getCoreValues: (): Promise<CoreValue[]> =>
    client.get('/core-values').then((r) => toArray<CoreValue>(r.data)),

  getHistoryMilestones: (): Promise<HistoryMilestone[]> =>
    client.get('/history-milestones').then((r) => toArray<HistoryMilestone>(r.data)),
}
