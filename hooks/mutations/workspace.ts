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
