import { useQuery } from '@tanstack/react-query'
import { fetchAdminMetrics } from '../api/metrics'

export function useAdminMetrics() {
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: fetchAdminMetrics,
    refetchInterval: 1000 * 60,
  })
}
