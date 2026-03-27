import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/lib/api/project'
import { projectKeys } from '@/queries/project'

export const useCreateProject = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
  })
}

export const useDeleteProject = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
  })
}

export const useUpdateProject = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectService.updateProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
  })
}
