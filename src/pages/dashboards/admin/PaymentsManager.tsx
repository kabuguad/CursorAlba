import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Search, CheckCircle, Clock, XCircle, Download, Banknote } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'

type PayStatus = 'completed' | 'pending' | 'failed'

interface Payment {
  id: string
  date: string
  time: string
  studentName: string
  studentId: string
  parentName: string
  phone: string
  amount: number
  description: string
  method: 'M-Pesa' | 'Bank Transfer' | 'Cash'
  mpesaRef: string
  status: PayStatus
}

const SEED: Payment[] = [
  { id: 'PAY-001', date: '2026-05-27', time: '08:14', studentName: 'Amani Kariuki',   studentId: 'ADM-0041', parentName: 'Grace Njeri',    phone: '0712-111-001', amount: 40000, description: 'Term 2 Tuition Balance',  method: 'M-Pesa',       mpesaRef: 'QHJ8K2M1X3', status: 'completed' },
  { id: 'PAY-002', date: '2026-05-27', time: '09:30', studentName: 'Baraka Muthoni',  studentId: 'ADM-0022', parentName: 'Peter Muthoni',  phone: '0722-111-002', amount: 15000, description: 'Transport Levy T2',      method: 'M-Pesa',       mpesaRef: 'QHJ8L5N2P4', status: 'completed' },
  { id: 'PAY-003', date: '2026-05-26', time: '14:45', studentName: 'Cherono Oduor',   studentId: 'ADM-0033', parentName: 'Ruth Oduor',     phone: '0733-111-003', amount: 120000,description: 'Term 2 Full Tuition',    method: 'Bank Transfer', mpesaRef: 'BANK-2026-003', status: 'completed' },
  { id: 'PAY-004', date: '2026-05-26', time: '11:00', studentName: 'Daudi Wairimu',   studentId: 'ADM-0055', parentName: 'Samuel Wairimu', phone: '0744-111-004', amount: 8500,  description: 'Activity Fee',          method: 'M-Pesa',       mpesaRef: 'QHJ8M7P3R5', status: 'pending'   },
  { id: 'PAY-005', date: '2026-05-25', time: '16:20', studentName: 'Eunice Kipchoge', studentId: 'ADM-0067', parentName: 'Susan Kipchoge', phone: '0755-111-005', amount: 120000,description: 'Term 2 Full Tuition',    method: 'M-Pesa',       mpesaRef: 'QHJ9A2B4D6', status: 'completed' },
  { id: 'PAY-006', date: '2026-05-25', time: '10:05', studentName: 'Farida Nyambura', studentId: 'ADM-0078', parentName: 'Ali Nyambura',   phone: '0766-111-006', amount: 40000, description: 'Term 2 Tuition Balance',method: 'M-Pesa',       mpesaRef: 'QHJ9C3D5E7', status: 'failed'    },
  { id: 'PAY-007', date: '2026-05-24', time: '08:55', studentName: 'Gitonga Odhiambo',studentId: 'ADM-0089', parentName: 'John Odhiambo',  phone: '0777-111-007', amount: 25000, description: 'Partial Term 2 Tuition',method: 'Cash',         mpesaRef: 'CASH-0007',  status: 'completed' },
  { id: 'PAY-008', date: '2026-05-24', time: '13:30', studentName: 'Hannah Wanjala',  studentId: 'ADM-0012', parentName: 'David Wanjala',  phone: '0788-111-008', amount: 135000,description: 'Term 2 Full + Transport',method: 'M-Pesa',       mpesaRef: 'QHJ9F4G6H8', status: 'completed' },
  { id: 'PAY-009', date: '2026-05-23', time: '15:10', studentName: 'Ibrahim Mwenda',  studentId: 'ADM-0101', parentName: 'Mary Mwenda',    phone: '0799-111-009', amount: 15000, description: 'Transport Levy T2',     method: 'M-Pesa',       mpesaRef: 'QHJ9H5I7J9', status: 'completed' },
  { id: 'PAY-010', date: '2026-05-22', time: '09:00', studentName: 'Joyce Kamau',     studentId: 'ADM-0115', parentName: 'George Kamau',   phone: '0700-111-010', amount: 120000,description: 'Term 2 Full Tuition',   method: 'Bank Transfer',mpesaRef: 'BANK-2026-010',status: 'pending' },
]

const DAILY_TREND = [
  { day: '20 May', amount: 285000 },
  { day: '21 May', amount: 420000 },
  { day: '22 May', amount: 180000 },
  { day: '23 May', amount: 350000 },
  { day: '24 May', amount: 520000 },
  { day: '25 May', amount: 395000 },
  { day: '26 May', amount: 610000 },
  { day: '27 May', amount: 227500 },
]

const STATUS_CONFIG: Record<PayStatus, { label: string; icon: typeof CheckCircle; cls: string }> = {
  completed: { label: 'Completed', icon: CheckCircle, cls: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  pending:   { label: 'Pending',   icon: Clock,       cls: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  failed:    { label: 'Failed',    icon: XCircle,     cls: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

function formatKES(n: number) {
  return `KES ${n.toLocaleString()}`
}

export function PaymentsManager() {
  const { showToast } = useToast()
  const [payments] = useState<Payment[]>(SEED)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PayStatus | 'all'>('all')
  const [methodFilter, setMethodFilter] = useState('All')

  const filtered = payments.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = p.studentName.toLowerCase().includes(q) || p.parentName.toLowerCase().includes(q) || p.mpesaRef.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    const matchMethod = methodFilter === 'All' || p.method === methodFilter
    return matchSearch && matchStatus && matchMethod
  })

  const totalCollected = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
  const totalPending   = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const totalFailed    = payments.filter(p => p.status === 'failed').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">M-Pesa, bank, and cash payment records</p>
        </div>
        <button
          onClick={() => showToast('Statement exported — CSV ready')}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Collected (Term 2)</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{formatKES(totalCollected)}</p>
          <p className="mt-1 text-xs text-gray-400">{payments.filter(p => p.status === 'completed').length} transactions</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Clearance</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{formatKES(totalPending)}</p>
          <p className="mt-1 text-xs text-gray-400">{payments.filter(p => p.status === 'pending').length} transactions</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Failed Payments</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{formatKES(totalFailed)}</p>
          <p className="mt-1 text-xs text-gray-400">{payments.filter(p => p.status === 'failed').length} transactions</p>
        </div>
      </div>

      {/* Daily trend chart */}
      <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-2">
          <Banknote className="h-4 w-4 text-green-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Daily Collections — Last 8 Days</h2>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={DAILY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Collected']} />
              <Line type="monotone" dataKey="amount" stroke="#15803d" strokeWidth={2.5} dot={{ r: 4, fill: '#15803d' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input className={`${INP} pl-9`} placeholder="Search by student, parent, or reference…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={`${INP} w-auto`} value={statusFilter} onChange={e => setStatusFilter(e.target.value as PayStatus | 'all')}>
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select className={`${INP} w-auto`} value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
          <option value="All">All Methods</option>
          <option value="M-Pesa">M-Pesa</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
              <tr>
                {['Reference', 'Date/Time', 'Student', 'Parent', 'Amount', 'Description', 'Method', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {filtered.map(p => {
                const cfg = STATUS_CONFIG[p.status]
                return (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs text-gray-400">{p.id}</p>
                      <p className="text-xs text-gray-400">{p.mpesaRef}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      <p>{p.date}</p>
                      <p className="text-xs text-gray-400">{p.time}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900 dark:text-white">{p.studentName}</p>
                      <p className="text-[10px] text-gray-400">{p.studentId}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-gray-700 dark:text-gray-300">{p.parentName}</p>
                      <p className="text-[10px] text-gray-400">{p.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">{formatKES(p.amount)}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 max-w-[140px]">
                      <p className="line-clamp-2 text-xs">{p.description}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.method === 'M-Pesa' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : p.method === 'Bank Transfer' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit ${cfg.cls}`}>
                        <cfg.icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
          Showing {filtered.length} of {payments.length} transactions
        </div>
      </div>
    </div>
  )
}
