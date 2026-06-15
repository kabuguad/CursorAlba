import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contentService } from '../services/contentService'
import { unwrap } from '../services/mockApi'

export function useCmsPages() {
  return useQuery({
    queryKey: ['cms-pages'],
    queryFn: () => contentService.listCmsPages().then(unwrap),
    staleTime: 60_000,
  })
}

export function useCmsBlocks(pageId: string) {
  return useQuery({
    queryKey: ['cms-blocks', pageId],
    queryFn: () => contentService.getCmsBlocks(pageId).then(unwrap),
    staleTime: 30_000,
    enabled: !!pageId,
  })
}

export function useUpdateCmsBlock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      contentService.updateCmsBlock(id, value).then(unwrap),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['cms-blocks', updated.pageId] })
    },
  })
}

export function useCmsVal(pageId: string) {
  const { data: blocks = [] } = useCmsBlocks(pageId)
  return (key: string, fallback = '') => {
    const block = blocks.find((b) => b.key === key)
    return block?.value || fallback
  }
}
