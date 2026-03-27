import { queryOptions } from '@tanstack/react-query'
import type { QueryOptions } from '@/types/query-option'
import type { ApiResponse } from '@/lib/api/api'
import type { Sprint } from '@/lib/api/sprint'
import { sprintService } from '@/lib/api/sprint'

export const sprintKeys = {
  all: ['sprints'] as const,
  list: (projectId: string) => [...sprintKeys.all, projectId] as const,
}

export function createSprintsQueryOptions<
  TData = ApiResponse<Sprint[]>
>(params: { projectId: string }, options?: QueryOptions<Sprint[], TData>) {
  const { projectId } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: sprintKeys.list(projectId),
    queryFn: () => sprintService.getSprint({ projectId }),
  })
}
