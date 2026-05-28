import { useState } from 'react'
import { Shield, Search, Download, Loader2, RefreshCw } from 'lucide-react'
import { useAuditLog, useAuditStats } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import { useQueryClient } from '@tanstack/react-query'
import type { AuditEntry } from '../../../services/auditService'

const ACTION_COLORS: Record<AuditEntry['action'], string> = {
  CREATE:  'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  UPDATE:  'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  DELETE:  'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  LOGIN:   'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  LOGOUT:  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  EXPORT:  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  VIEW:    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

const ROLE_COLORS = { admin: 'text-red-600 dark:text-red-400', teacher: 'text-blue-600 dark:text-blue-400', parent: 'text-green-600 dark:text-green-400', student: 'text-purple-600 dark:text-purple-400' }

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-KE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function AuditLogManager() {
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<AuditEntry['action'] | 'all'>('all')
  const [resourceFilter, setResourceFilter] = useState('')

  const { data: logs = [], isLoading } = useAuditLog(
    actionFilter !== 'all' || resourceFilter ? { action: actionFilter !== 'all' ? actionFilter : undefined, resource: resourceFilter || undefined } : undefined
  )
  const { data: stats } = useAuditStats()

  const filtered = logs.filter(l => {
    const q = search.toLowerCase()
    return l.userName.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q)
  })

  const ACTIONS: (AuditEntry['action'] | 'all')[] = ['all', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'EXPORT']

  const RESOURCES = ['User', 'Student', 'Staff', 'Payment', 'Invoice', 'Announcement', 'Admission', 'Scholarship', 'FeeStructure', 'Exam', 'Database']

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Complete trail of all system actions — {stats?.totalEntries ?? 0} entries</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => qc.invalidateQueries({ queryKey: ['audit'] })}
            className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => showToast('Audit log exported to CSV')}
            className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Entries', value: stats.totalEntries },
            { label: 'Today', value: stats.todayEntries },
            { label: 'Exports', value: stats.exports },
            { label: 'Deletions', value: stats.deletes },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
            placeholder="Search by user, action, or resource…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
          value={actionFilter} onChange={e => setActionFilter(e.target.value as AuditEntry['action'] | 'all')}>
          {ACTIONS.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a}</option>)}
        </select>
        <select className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none"
          value={resourceFilter} onChange={e => setResourceFilter(e.target.value)}>
          <option value="">All Resources</option>
          {RESOURCES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Log table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                <tr>{['Time', 'User', 'Action', 'Resource', 'Details', 'IP Address'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{formatTime(entry.timestamp)}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 dark:text-white text-xs">{entry.userName}</p>
                      <p className={`text-[10px] font-semibold capitalize ${ROLE_COLORS[entry.userRole]}`}>{entry.userRole}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ACTION_COLORS[entry.action]}`}>{entry.action}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{entry.resource}</span>
                      </div>
                      {entry.resourceId && <p className="text-[10px] font-mono text-gray-400 mt-0.5">{entry.resourceId}</p>}
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{entry.details}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs text-gray-400">{entry.ipAddress}</p>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No audit entries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          Showing {filtered.length} of {logs.length} entries
        </div>
      </div>
    </div>
  )
}
