import { useQuery } from '@tanstack/react-query'
import { coCurrApi } from '../services/coCurrApi'
import type { CoCurrCategory, CoCurrActivity } from '../services/coCurrApi'

export type { CoCurrCategory, CoCurrActivity }

export function useCoCurrSection(keyword: string) {
  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['cocurr-categories'],
    queryFn: () => coCurrApi.getCategories(),
    staleTime: 60_000,
  })
  const { data: allActivities = [], isLoading: actsLoading } = useQuery({
    queryKey: ['cocurr-activities'],
    queryFn: () => coCurrApi.getActivities(),
    staleTime: 60_000,
  })

  const category = categories.find(c =>
    c.title.toLowerCase().includes(keyword.toLowerCase()) ||
    c.heading.toLowerCase().includes(keyword.toLowerCase()),
  )

  const activities = category
    ? [...allActivities]
        .filter(a => a.cocurrCategoryId === category.id)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : []

  return {
    category,
    activities,
    isLoading: catsLoading || actsLoading,
  }
}
