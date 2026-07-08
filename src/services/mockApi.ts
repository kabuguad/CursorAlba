/**
 * Mock API Engine
 * Simulates an ASP.NET Core Web API with realistic latency, response envelopes,
 * and optional error injection. Designed to be a drop-in stand-in until the real
 * backend at https://api.alberschool.ke is wired up.
 *
 * ASP.NET Core response envelope shape:
 *   { success, data, error, statusCode, timestamp, traceId }
 */

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T | null
  error: string | null
  statusCode: number
  timestamp: string
  traceId: string
}

export interface PagedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// ── Latency profiles (ms) ──────────────────────────────────────────────────
const LATENCY = {
  read:   { min: 120, max: 380 },
  write:  { min: 200, max: 550 },
  heavy:  { min: 350, max: 800 },
  report: { min: 500, max: 1200 },
}

type LatencyProfile = keyof typeof LATENCY

// Global error injection rate (0 = never, 0.05 = 5% of calls)
let errorRate = 0

export function setErrorRate(rate: number) {
  errorRate = Math.max(0, Math.min(1, rate))
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function randomLatency(profile: LatencyProfile): number {
  const { min, max } = LATENCY[profile]
  return Math.floor(Math.random() * (max - min) + min)
}

function generateTraceId(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function ok<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    statusCode: 200,
    timestamp: new Date().toISOString(),
    traceId: generateTraceId(),
  }
}

function created<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    statusCode: 201,
    timestamp: new Date().toISOString(),
    traceId: generateTraceId(),
  }
}

function fail(message: string, statusCode = 500): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
    traceId: generateTraceId(),
  }
}

// ── Core mock fetch ────────────────────────────────────────────────────────
export async function mockGet<T>(
  handler: () => T,
  profile: LatencyProfile = 'read',
): Promise<ApiResponse<T>> {
  await sleep(randomLatency(profile))
  if (Math.random() < errorRate) {
    return fail('Simulated network error — please retry', 503) as ApiResponse<T>
  }
  try {
    return ok(handler())
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Internal server error', 500) as ApiResponse<T>
  }
}

export async function mockPost<T>(
  handler: () => T,
  profile: LatencyProfile = 'write',
): Promise<ApiResponse<T>> {
  await sleep(randomLatency(profile))
  if (Math.random() < errorRate) {
    return fail('Simulated network error — please retry', 503) as ApiResponse<T>
  }
  try {
    return created(handler())
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Internal server error', 500) as ApiResponse<T>
  }
}

export async function mockPut<T>(
  handler: () => T,
  profile: LatencyProfile = 'write',
): Promise<ApiResponse<T>> {
  await sleep(randomLatency(profile))
  if (Math.random() < errorRate) {
    return fail('Simulated network error — please retry', 503) as ApiResponse<T>
  }
  try {
    return ok(handler())
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Internal server error', 500) as ApiResponse<T>
  }
}

export async function mockDelete(
  handler: () => void,
  profile: LatencyProfile = 'write',
): Promise<ApiResponse<{ deleted: boolean }>> {
  await sleep(randomLatency(profile))
  if (Math.random() < errorRate) {
    return fail('Simulated network error — please retry', 503) as unknown as ApiResponse<{ deleted: boolean }>
  }
  try {
    handler()
    return ok({ deleted: true })
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Internal server error', 500) as unknown as ApiResponse<{ deleted: boolean }>
  }
}

// ── Unwrap helper (throws on failure, returns data on success) ─────────────
export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    throw new Error(response.error ?? 'Unknown API error')
  }
  return response.data
}

// ── ID generator ──────────────────────────────────────────────────────────
export function newId(prefix = ''): string {
  const ts  = Date.now().toString(36).toUpperCase()
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase()
  return prefix ? `${prefix}-${ts}${rnd}` : `${ts}${rnd}`
}
