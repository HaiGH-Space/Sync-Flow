import { useQuery } from '@tanstack/react-query'
import { workspaceService } from '../services/workspace'
import { useParams } from 'next/navigation'

export const useCurrentWorkspace = () => {
    const params = useParams<{ workspaceId?: string }>()
    const workspaceId = params.workspaceId

    const { data: workspaceList, isPending, error } = useQuery({
        queryKey: ['workspace-list'],
        staleTime: Infinity,
        queryFn: workspaceService.getMyWorkspace
    })
    const activeWorkspace = workspaceList?.data?.find(w => w.id === workspaceId)
    return {
        workspaceList: workspaceList?.data,
        activeWorkspace,
        workspaceId,
        isPending,
        error
    }
}