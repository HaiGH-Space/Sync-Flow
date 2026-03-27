import { queryOptions } from '@tanstack/react-query'
import type { QueryOptions } from '@/types/query-option'
import type { ApiResponse } from '@/lib/api/api'
import type { Project } from '@/lib/api/project'
import { projectService } from '@/lib/api/project'

export const projectKeys = {
  all: ['projects'] as const,
  list: (workspaceId: string) => [...projectKeys.all, workspaceId] as const,
}

export function createProjectsQueryOptions<
  TData = ApiResponse<Project[]>
>(params: { workspaceId: string }, options?: QueryOptions<Project[], TData>) {
  const { workspaceId } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: projectKeys.list(workspaceId),
    queryFn: () => projectService.getProjectsByWorkspaceId({ workspaceId }),
  })
}
