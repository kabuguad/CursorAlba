import { useState, useEffect } from 'react'
import { Save, TrendingUp, Loader2, Banknote, AlertCircle, RefreshCw } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import {
  useFeeStructures, useUpdateFeeStructure,
  useFeeCollectionByLevel, useFinanceSummary,
} from '../../../hooks/useAdminData'
import { unwrap } from '../../../services/mockApi'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'

type FeeRow = { id: string; level: string; tuition: number; transport: number; activities: number }

export function FeesManager() {
  const { showToast } = useToast()

  const { data: feeStructures, isLoading: loadingFees }   = useFeeStructures()
  const { data: collection,    isLoading: loadingColl }   = useFeeCollectionByLevel()
  const { data: summary }                                  = useFinanceSummary()
  const updateFee                                          = useUpdateFeeStructure()

  const [rows, setRows] = useState<FeeRow[]>([])
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (feeStructures) {
      setRows(feeStructures.map(f => ({ id: f.id, level: f.level, tuition: f.tuition, transport: f.transport, activities: f.activities })))
      setDirty(false)
    }
  }, [feeStructures])

  const totalRevenue = rows.reduce((s, r) => s + r.tuition + r.transport + r.activities, 0)

  const save = async () => {
    try {
      await Promise.all(
        rows.map(r => updateFee.mutateAsync({ id: r.id, data: { tuition: r.tuition, transport: r.transport, activities: r.activities } }).then(unwrap))
      )
      showToast('Fee structure saved ✓')
      setDirty(false)
    } catch {
      showToast('Failed to save — please retry', 'error')
    }
  }

  const setRow = (i: number, field: keyof FeeRow, val: number) => {
    setRows(prev => { const n = [...prev]; n[i] = { ...n[i], [field]: val }; return n })
    setDirty(true)
  }

  if (loadingFees) {
    return (
      <div className="p-8 flex items-center justify-center gap-3 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading fee structures…
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Structure</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage termly fees for each school level · Live db data</p>
        </div>
        <button
          onClick={save}
          disabled={!dirty || updateFee.isPending}
          className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateFee.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {dirty ? 'Save Changes' : 'Saved'}
        </button>
      </div>

      {/* Finance summary strip */}
      {summary && (
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Collected', value: `KES ${(summary.totalCollected / 1000).toFixed(0)}K`, color: 'text-green-600 dark:text-green-400' },
            { label: 'Outstanding',     value: `KES ${(summary.outstanding / 1000).toFixed(0)}K`,    color: 'text-red-500' },
            { label: 'Collection Rate', value: `${summary.collectionRate}%`,                         color: summary.collectionRate >= 90 ? 'text-green-600 dark:text-green-400' : 'text-amber-500' },
            { label: 'Overdue Invoices', value: String(summary.overdueCount),                       color: summary.overdueCount > 0 ? 'text-red-500' : 'text-gray-900 dark:text-white' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className={`mt-1 text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(f => (
          <div key={f.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{f.level}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {(f.tuition + f.transport + f.activities).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1">KES per term</p>
          </div>
        ))}
      </div>

      {/* Editable fee table */}
      <div className="mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Banknote className="h-4 w-4 text-[#E8B84B]" /> Edit Fees (KES per term)
          </h2>
          <span className="text-xs text-gray-400">Annual revenue est: {(totalRevenue * 3).toLocaleString()} KES × enrolment</span>
        </div>
        {dirty && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> You have unsaved changes
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Level', 'Tuition', 'Transport', 'Activities', 'Term Total', 'Annual Est.'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {rows.map((f, i) => {
                const termTotal = f.tuition + f.transport + f.activities
                const orig = feeStructures?.[i]
                const changed = orig && (f.tuition !== orig.tuition || f.transport !== orig.transport || f.activities !== orig.activities)
                return (
                  <tr key={f.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${changed ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{f.level}</td>
                    <td className="px-5 py-4">
                      <input type="number" className={`${INP} w-28`} value={f.tuition}
                        onChange={e => setRow(i, 'tuition', +e.target.value)} />
                    </td>
                    <td className="px-5 py-4">
                      <input type="number" className={`${INP} w-24`} value={f.transport}
                        onChange={e => setRow(i, 'transport', +e.target.value)} />
                    </td>
                    <td className="px-5 py-4">
                      <input type="number" className={`${INP} w-24`} value={f.activities}
                        onChange={e => setRow(i, 'activities', +e.target.value)} />
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{termTotal.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{(termTotal * 3).toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collection tracker — live from db */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" /> Fee Collection Rate by Level
          </h2>
          {loadingColl && <RefreshCw className="h-3.5 w-3.5 animate-spin text-gray-400" />}
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {(collection ?? []).map(c => (
            <div key={c.level} className="flex items-center gap-4 px-6 py-4">
              <p className="w-36 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">{c.level}</p>
              <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${c.rate >= 90 ? 'bg-green-500' : c.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, c.rate)}%` }}
                />
              </div>
              <div className="flex items-center gap-3 w-32 justify-end text-right">
                <span className="text-xs text-gray-400">KES {(c.collected / 1000).toFixed(0)}K / {(c.target / 1000).toFixed(0)}K</span>
                <span className={`text-sm font-bold ${c.rate >= 90 ? 'text-green-600 dark:text-green-400' : c.rate >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500'}`}>
                  {c.rate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
