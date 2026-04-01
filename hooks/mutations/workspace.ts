import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateWorkspace, workspaceService } from '@/lib/api/workspace'
import { workspaceKeys } from '@/queries/workspace'

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkspace) => workspaceService.createWorkspace(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workspaceKeys.list() })
    },
  })
}

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { workspaceId: string }) => workspaceService.deleteWorkspace(payload),
    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({ queryKey: workspaceKeys.list() })
      await queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(variables.workspaceId) })
    },
  })
}
