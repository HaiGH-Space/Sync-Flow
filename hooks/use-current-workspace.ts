import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { createMyWorkspacesQueryOptions } from '@/queries/workspace'

export const useCurrentWorkspace = () => {
    const params = useParams<{ workspaceId?: string }>()
    const workspaceId = params.workspaceId

    const { data: workspaceList, isPending, error } = useQuery(createMyWorkspacesQueryOptions())
    const activeWorkspace = workspaceList?.data?.find(w => w.id === workspaceId)
    return {
        workspaceList: workspaceList?.data,
        activeWorkspace,
        workspaceId,
        isPending,
        error
    }
}