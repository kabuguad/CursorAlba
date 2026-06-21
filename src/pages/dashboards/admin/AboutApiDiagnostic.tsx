import { useState } from 'react'
import axios from 'axios'
import { CheckCircle2, XCircle, Loader2, Play, ChevronDown, ChevronRight } from 'lucide-react'

const BASE = 'https://yoko-unresourceful-coretta.ngrok-free.dev/api'

const HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
}

interface Result {
  status: number | null
  ok: boolean
  body: unknown
  durationMs: number
  error?: string
}

interface EndpointTest {
  name: string
  path: string
  minimalPost: Record<string, unknown>
}

const ENDPOINTS: EndpointTest[] = [
  {
    name: 'About Page Content',
    path: '/about-page-content',
    minimalPost: {
      headline: '_test_',
      subheadline: '_test_',
      mission: '_test_',
      vision: '_test_',
      historyIntro: '_test_',
    },
  },
  {
    name: 'Core Values',
    path: '/core-values',
    minimalPost: {
      icon: '⭐',
      title: '_test_',
      description: '_test_',
      sortOrder: 99,
    },
  },
  {
    name: 'History Milestones',
    path: '/history-milestones',
    minimalPost: {
      year: '1900',
      title: '_test_',
      description: '_test_',
      sortOrder: 99,
    },
  },
]

async function probe(method: 'GET' | 'POST' | 'DELETE', path: string, data?: unknown): Promise<Result> {
  const start = Date.now()
  try {
    const res = await axios({ method, url: `${BASE}${path}`, headers: HEADERS, data, validateStatus: () => true })
    return { status: res.status, ok: res.status >= 200 && res.status < 300, body: res.data, durationMs: Date.now() - start }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { status: null, ok: false, body: null, durationMs: Date.now() - start, error: msg }
  }
}

function StatusBadge({ result }: { result: Result | null; }) {
  if (!result) return <span className="text-xs text-gray-400">—</span>
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
      result.ok
        ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
        : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
    }`}>
      {result.ok
        ? <CheckCircle2 className="h-3 w-3" />
        : <XCircle className="h-3 w-3" />}
      {result.status ?? 'ERR'} · {result.durationMs}ms
    </span>
  )
}

function RawBody({ body, error }: { body: unknown; error?: string }) {
  const [open, setOpen] = useState(false)
  const text = error ?? JSON.stringify(body, null, 2)
  if (!text || text === 'null') return <span className="text-xs text-gray-400">(empty)</span>
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {open ? 'Hide' : 'Show'} response
      </button>
      {open && (
        <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-gray-50 dark:bg-gray-900 p-3 text-[11px] text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all border border-gray-200 dark:border-gray-700">
          {text}
        </pre>
      )}
    </div>
  )
}

interface EndpointState {
  getResult: Result | null
  postResult: Result | null
  deleteId: number | null
  deleteResult: Result | null
  loading: string | null
}

export function AboutApiDiagnostic() {
  const [states, setStates] = useState<Record<string, EndpointState>>(
    Object.fromEntries(ENDPOINTS.map(e => [e.path, { getResult: null, postResult: null, deleteId: null, deleteResult: null, loading: null }]))
  )

  const setLoading = (path: string, op: string | null) =>
    setStates(s => ({ ...s, [path]: { ...s[path], loading: op } }))

  const runGet = async (ep: EndpointTest) => {
    setLoading(ep.path, 'GET')
    const result = await probe('GET', ep.path)
    setStates(s => ({ ...s, [ep.path]: { ...s[ep.path], getResult: result, loading: null } }))
  }

  const runPost = async (ep: EndpointTest) => {
    setLoading(ep.path, 'POST')
    const result = await probe('POST', ep.path, ep.minimalPost)
    let createdId: number | null = null
    if (result.ok && result.body && typeof result.body === 'object') {
      const b = result.body as Record<string, unknown>
      createdId = (b.id ?? b.Id ?? (b.data && typeof b.data === 'object' ? (b.data as Record<string,unknown>).id : null)) as number | null
    }
    setStates(s => ({ ...s, [ep.path]: { ...s[ep.path], postResult: result, deleteId: createdId, loading: null } }))
  }

  const runDelete = async (ep: EndpointTest, id: number) => {
    setLoading(ep.path, 'DELETE')
    const result = await probe('DELETE', `${ep.path}/${id}`)
    setStates(s => ({ ...s, [ep.path]: { ...s[ep.path], deleteResult: result, deleteId: result.ok ? null : id, loading: null } }))
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Diagnostics</h2>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Test each About page endpoint — GET to read, POST to create a test record, then DELETE to clean it up.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 mb-6 text-sm text-amber-700 dark:text-amber-300">
        <strong>How to use:</strong> Click <strong>GET</strong> first to confirm read access, then <strong>POST test</strong> to verify writes.
        If POST succeeds a <strong>DELETE</strong> button appears to clean up the test record. The raw API response is shown for each call.
      </div>

      <div className="space-y-4">
        {ENDPOINTS.map(ep => {
          const s = states[ep.path]
          return (
            <div key={ep.path} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{ep.name}</p>
                  <code className="text-xs text-gray-400 font-mono">{BASE}{ep.path}</code>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => runGet(ep)}
                  disabled={s.loading === 'GET'}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-white transition"
                >
                  {s.loading === 'GET' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  GET
                </button>

                <button
                  onClick={() => runPost(ep)}
                  disabled={s.loading === 'POST'}
                  className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] hover:bg-[#d4a43a] disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-[#0d1b0d] transition"
                >
                  {s.loading === 'POST' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  POST test
                </button>

                {s.deleteId && (
                  <button
                    onClick={() => runDelete(ep, s.deleteId!)}
                    disabled={s.loading === 'DELETE'}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-white transition"
                  >
                    {s.loading === 'DELETE' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                    DELETE id={s.deleteId}
                  </button>
                )}
              </div>

              {/* Results table */}
              <div className="space-y-3">
                {/* GET */}
                <div className="grid grid-cols-[60px_1fr] gap-3 items-start">
                  <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mt-0.5">GET</span>
                  <div className="space-y-1">
                    <StatusBadge result={s.getResult} />
                    {s.getResult && <RawBody body={s.getResult.body} error={s.getResult.error} />}
                  </div>
                </div>

                {/* POST */}
                {s.postResult && (
                  <div className="grid grid-cols-[60px_1fr] gap-3 items-start">
                    <span className="text-[11px] font-bold text-[#b8892b] uppercase tracking-wider mt-0.5">POST</span>
                    <div className="space-y-1">
                      <StatusBadge result={s.postResult} />
                      {!s.postResult.ok && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          ↳ Write is failing — the body below shows the exact reason from your API.
                        </p>
                      )}
                      {s.postResult.ok && !s.deleteId && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ↳ POST succeeded but no <code className="font-mono">id</code> found in response — delete manually if needed.
                        </p>
                      )}
                      <RawBody body={s.postResult.body} error={s.postResult.error} />
                    </div>
                  </div>
                )}

                {/* DELETE */}
                {s.deleteResult && (
                  <div className="grid grid-cols-[60px_1fr] gap-3 items-start">
                    <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider mt-0.5">DELETE</span>
                    <div className="space-y-1">
                      <StatusBadge result={s.deleteResult} />
                      <RawBody body={s.deleteResult.body} error={s.deleteResult.error} />
                    </div>
                  </div>
                )}
              </div>

              {/* Payload preview */}
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                  View test POST payload
                </summary>
                <pre className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-3 text-[11px] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  {JSON.stringify(ep.minimalPost, null, 2)}
                </pre>
              </details>
            </div>
          )
        })}
      </div>
    </div>
  )
}
