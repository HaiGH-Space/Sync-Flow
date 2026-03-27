import { queryOptions } from '@tanstack/react-query'
import type { QueryOptions } from '@/types/query-option'
import type { ApiResponse } from '@/lib/api/api'
import type { Workspace } from '@/lib/api/workspace'
import { workspaceService } from '@/lib/api/workspace'

export const workspaceKeys = {
  all: ['workspaces'] as const,
  list: () => [...workspaceKeys.all, 'me'] as const,
  detail: (workspaceId: string) => [...workspaceKeys.all, workspaceId] as const,
}

export function createMyWorkspacesQueryOptions<
  TData = ApiResponse<Workspace[]>
>(options?: QueryOptions<Workspace[], TData>) {
  return queryOptions({
    staleTime: Infinity,
    ...options,
    queryKey: workspaceKeys.list(),
    queryFn: workspaceService.getMyWorkspace,
  })
}

export function createWorkspaceDetailQueryOptions<
  TData = ApiResponse<Workspace>
>(params: { workspaceId: string }, options?: QueryOptions<Workspace, TData>) {
  const { workspaceId } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspaceService.getWorkspaceById(workspaceId),
  })
}
