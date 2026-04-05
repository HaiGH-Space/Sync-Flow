import { useMutation, useQueryClient } from '@tanstack/react-query'

import { sprintService } from '@/lib/api/sprint'
import { sprintKeys } from '@/queries/sprint'

export const useCreateSprint = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sprintService.createSprint,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sprintKeys.list(projectId) })
    },
  })
}
