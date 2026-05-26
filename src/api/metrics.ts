export interface DashboardMetric {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface AdminMetrics {
  metrics: DashboardMetric[]
  recentActivity: { id: string; action: string; user: string; time: string }[]
}

function delay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  await delay()
  return {
    metrics: [
      { label: 'Total Students', value: '2,048', change: '+12', trend: 'up' },
      { label: 'Staff Members', value: '127', change: '+3', trend: 'up' },
      { label: 'Active Classes', value: '86', change: '0', trend: 'neutral' },
      { label: 'Fee Collection', value: '94%', change: '+2%', trend: 'up' },
    ],
    recentActivity: [
      { id: 'a1', action: 'Grade submitted for Form 2 Sapphire', user: 'James Ochieng', time: '2 min ago' },
      { id: 'a2', action: 'Attendance marked for Grade 5 Emerald', user: 'Mercy Wanjiku', time: '15 min ago' },
      { id: 'a3', action: 'New student enrolled: Brian Mutua', user: 'Admin', time: '1 hr ago' },
      { id: 'a4', action: 'Fee payment received — KES 40,000', user: 'System', time: '2 hr ago' },
    ],
  }
}
