import { queryOptions } from '@tanstack/react-query'
import type { QueryOptions } from '@/types/query-option'
import type { ApiResponse } from '@/lib/api/api'
import type { UserProfile } from '@/lib/api/user'
import { workspaceMemberService } from '@/lib/api/member-workspace'

export const workspaceMemberKeys = {
  all: ['workspace-members'] as const,
  profiles: (workspaceId: string) => [...workspaceMemberKeys.all, 'profiles', workspaceId] as const,
}

export function createWorkspaceMemberProfilesQueryOptions<
  TData = ApiResponse<UserProfile[]>
>(params: { workspaceId: string }, options?: QueryOptions<UserProfile[], TData>) {
  const { workspaceId } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: workspaceMemberKeys.profiles(workspaceId),
    queryFn: () => workspaceMemberService.getWorkspaceMembersProfile(workspaceId),
  })
}
