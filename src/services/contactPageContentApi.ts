import { apiClient } from './apiClient'

// ── Raw shape from the API (entity-prefixed PK, plus createdAt) ───────────────
interface RawContactPageContent {
  contactPageContentId: number
  heroHeadline: string
  heroSubheadline: string
  heroImageUrl: string
  phonePrimary: string
  phoneSecondary: string
  emailPrimary: string
  emailSecondary: string
  whatsAppNumber: string
  addressLine1: string
  addressLine2: string
  mapEmbedUrl: string
  officeHours: string
  officeHoursNote: string
  createdAt: string
  updatedAt: string
}

// ── Normalised shape used throughout the app ──────────────────────────────────
export interface ContactPageContentDto {
  id: number
  heroHeadline: string
  heroSubheadline: string
  heroImageUrl: string
  phonePrimary: string
  phoneSecondary: string
  emailPrimary: string
  emailSecondary: string
  whatsAppNumber: string
  addressLine1: string
  addressLine2: string
  mapEmbedUrl: string
  officeHours: string
  officeHoursNote: string
  updatedAt: string
}

export type UpdateContactPageContentDto = Omit<ContactPageContentDto, 'id' | 'updatedAt'>

function normalize(raw: RawContactPageContent): ContactPageContentDto {
  const { contactPageContentId, createdAt: _c, ...rest } = raw
  return { id: contactPageContentId, ...rest }
}

function unwrapSingle<T>(r: { data: { success?: boolean; data: T | T[]; error?: unknown } }): T {
  const payload = r.data
  if (payload.success === false) {
    const err = payload as unknown as { message?: string }
    throw new Error(err.message ?? 'API request failed')
  }
  const d = payload.data
  return Array.isArray(d) ? d[0] : d
}

function extractErrorMessage(err: unknown): string {
  const axiosErr = err as {
    response?: {
      status?: number
      data?: { message?: string; title?: string; errors?: Record<string, string[]> }
    }
    message?: string
  }
  const status = axiosErr?.response?.status
  const data = axiosErr?.response?.data
  if (data?.message) return data.message
  if (data?.title) return data.title
  if (data?.errors) {
    const msgs = Object.values(data.errors).flat()
    if (msgs.length) return msgs.join('; ')
  }
  if (status === 401) return 'Not authorised — please sign in with admin credentials'
  if (status === 403) return 'Forbidden — your account does not have admin access'
  if (status === 415) return 'Server rejected the request format (415) — check that the API is up to date'
  if (status === 404) return 'Contact page content record not found on the server'
  return axiosErr?.message ?? 'Unknown error'
}

export const contactPageContentApi = {
  get: (): Promise<ContactPageContentDto> =>
    apiClient
      .get<{ success: boolean; data: RawContactPageContent[] | RawContactPageContent; error: unknown }>(
        '/contact-page-content',
      )
      .then(r => normalize(unwrapSingle<RawContactPageContent>(r))),

  getById: (id: number): Promise<ContactPageContentDto> =>
    apiClient
      .get<{ success: boolean; data: RawContactPageContent; error: unknown }>(
        `/contact-page-content/${id}`,
      )
      .then(r => normalize(unwrapSingle<RawContactPageContent>(r))),

  update: async (id: number, dto: UpdateContactPageContentDto): Promise<ContactPageContentDto> => {
    try {
      const r = await apiClient.put<{
        success: boolean
        data: RawContactPageContent | RawContactPageContent[]
        error: unknown
      }>(`/contact-page-content/${id}`, dto)
      return normalize(unwrapSingle<RawContactPageContent>(r))
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  },
}
