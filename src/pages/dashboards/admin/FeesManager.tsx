import { useState } from 'react'
import { Save, TrendingUp } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { feeStructure } from '../../../data/programs'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'

const COLLECTION = [
  { level: 'Daycare',          collected: 92, total: 100 },
  { level: 'Primary',          collected: 95, total: 100 },
  { level: 'Junior Secondary', collected: 91, total: 100 },
  { level: 'Senior / IGCSE',   collected: 96, total: 100 },
]

export function FeesManager() {
  const { showToast } = useToast()
  const [fees, setFees] = useState(feeStructure.map(f => ({ ...f })))

  const totalRevenue = fees.reduce((sum, f) => sum + f.tuition + f.transport + f.activities, 0)

  const save = () => showToast('Fee structure saved ✓')

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Structure</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage termly fees for each school level</p>
        </div>
        <button onClick={save} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fees.map(f => (
          <div key={f.level} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
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
          <h2 className="font-semibold text-gray-900 dark:text-white">Edit Fees (KES per term)</h2>
          <span className="text-xs text-gray-400">Max annual revenue est: {(totalRevenue * 3).toLocaleString()} KES × enrolment</span>
        </div>
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
              {fees.map((f, i) => {
                const termTotal = f.tuition + f.transport + f.activities
                return (
                  <tr key={f.level} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{f.level}</td>
                    <td className="px-5 py-4">
                      <input type="number" className={`${INP} w-28`} value={f.tuition}
                        onChange={e => { const nf = [...fees]; nf[i] = { ...f, tuition: +e.target.value }; setFees(nf) }} />
                    </td>
                    <td className="px-5 py-4">
                      <input type="number" className={`${INP} w-24`} value={f.transport}
                        onChange={e => { const nf = [...fees]; nf[i] = { ...f, transport: +e.target.value }; setFees(nf) }} />
                    </td>
                    <td className="px-5 py-4">
                      <input type="number" className={`${INP} w-24`} value={f.activities}
                        onChange={e => { const nf = [...fees]; nf[i] = { ...f, activities: +e.target.value }; setFees(nf) }} />
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

      {/* Collection tracker */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" /> Fee Collection Rate — Term 1 2026
          </h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {COLLECTION.map(c => (
            <div key={c.level} className="flex items-center gap-4 px-6 py-4">
              <p className="w-40 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">{c.level}</p>
              <div className="flex-1 rounded-full bg-gray-100 dark:bg-gray-700 h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${c.collected >= 90 ? 'bg-green-500' : c.collected >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${c.collected}%` }}
                />
              </div>
              <span className={`w-12 text-right text-sm font-bold ${c.collected >= 90 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {c.collected}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
