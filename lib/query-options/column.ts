import { Column, columnService } from '@/lib/api/column';
import { QueryOptions } from '@/types/query-option';
import { queryOptions } from '@tanstack/react-query';


export const columnKeys = {
    all: ['columns'] as const,
    list: (projectId: string) => [...columnKeys.all, projectId] as const,
};

export function createColumnsQueryOptions(params: { projectId: string }, options?: QueryOptions<Column[]>) {
    const { projectId } = params;
    return queryOptions({
        ...options,
        queryKey: columnKeys.list(projectId),
        queryFn: () => columnService.getColumns({ projectId }),
        staleTime: 1000 * 60 * 5,
    });
}